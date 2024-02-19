import Context from "./Context.jsx";
import {toast} from 'react-toastify';
import {useState} from "react";
import PropTypes from "prop-types";
import {useNavigate} from "react-router-dom";
import { useCookies } from 'react-cookie';
import Localbase from 'localbase'


const ContextState = (props) => {

    PropTypes.checkPropTypes(ContextState.propTypes, props, "prop", "ContextState")

    const db = new Localbase('chatify-db')
    db.config.debug = false

    const [chats, setChats] = useState({});
    const [progress, setProgress] = useState(0);
    const [contact, setContact] = useState([]);
    const [currentContact, setCurrentContact] = useState(null);
    const [user, setUser] = useState();
    const [unreadChats, setUnreadChats] = useState({});
    const [mobileChatDisplay, setMobileChatDisplay] = useState(false)
    const [mobileAiDisplay, setMobileAiDisplay] = useState(false)
    const navigate = useNavigate();

    const [cookies, setCookie] = useCookies(['web-token']);

    const tst = (msg, type) => {
        const data = {
            position: "bottom-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light"
        }
        if (type === "success") {
            toast.success(`${msg}`, data);
        } else {
            toast.error(`${msg}`, data);
        }
    }

    const unreadMessages = (oldMessage, newMessage) => {
        const unread = {};
        if (oldMessage === null || oldMessage === undefined) oldMessage = {}
        const keysNewMessage = Object.keys(newMessage);
        for (const key of keysNewMessage) {
            unread[key] = newMessage[key].length - (oldMessage[key] ? oldMessage[key].length : 0);
        }
        setUnreadChats(unread);
    }

    const logIn = async (email, password) => {
        if (!navigator.onLine) {
            tst("You're offline", "error")
            return;
        }
        setProgress(30);
        const response = await fetch(`${import.meta.env.VITE_BACKEND_API}/api/authen/login`, {
            method: "POST",
            headers: {
                'content-Type': 'application/json'
            },
            body: JSON.stringify({"email": email, "password": password})
        });
        setProgress(50)
        const json = await response.json();
        tst(json.message, json.type)
        setProgress(75)
        if (json.type === "success") {
            setCookie("web-token", json.webToken, { path: '/' , maxAge: 60*60*24*10, secure: true})
            navigate("/chat")
        }
        setProgress(100)
    }

    const signUp = async (credentials) => {
        if (!navigator.onLine) {
            tst("You're offline", "error")
            return;
        }
        setProgress(30);
        const {fname, lname, email, password} = credentials;
        const response = await fetch(`${import.meta.env.VITE_BACKEND_API}/api/authen/createuser`, {
            method: "POST",
            headers: {
                'content-Type': 'application/json'
            },
            body: JSON.stringify({"name": fname + " " + lname, email, password})
        });
        setProgress(50)
        const json = await response.json();
        tst(json.message, json.type)
        if (json.type === "success") {
            setCookie("web-token", json.webToken, { path: '/' , maxAge: 60*60*24*10, secure: true})
            navigate("/chat")
        }
        setProgress(100)
    }

    const getContact = async () => {
        setProgress(25)
        await db.collection('contacts').get().then(contacts=>{
            setContact(contacts)
        })
        const localUser = JSON.parse(localStorage.getItem('user'));
        setUser(localUser);
        if (!navigator.onLine) {
            setProgress(100);
            return;
        }
        setProgress(50)
        const res = await fetch(`${import.meta.env.VITE_BACKEND_API}/api/contact/getContact`, {
            method: "GET",
            headers: {
                'content-Type': 'application/json',
                'web-token': cookies["web-token"]
            }
        })
        const json = await res.json();
        setProgress(75)
        if (json.type === "success") {
            const user = {
                name: json.name,
                email: json.email,
                id: json.id
            }
            setUser(user)
            localStorage.setItem('user', JSON.stringify(user))
            if(json!=null) await db.collection('contacts').set(json.contact)
            await db.collection('contacts').get().then(contacts=>{
                setContact(contacts)
            })
        }
        setProgress(100);
    }

    const addContact = async (contact) => {
        setProgress(25)
        const res = await fetch(`${import.meta.env.VITE_BACKEND_API}/api/contact/addContact`, {
            method: "POST",
            headers: {
                'content-Type': 'application/json',
                'web-token': cookies["web-token"]
            },
            body: JSON.stringify({"contactEmail": contact})
        })
        setProgress(50)
        const json = await res.json();
        setProgress(75)
        if (json.type === "success") {
            setContact(json.contact)
            await db.collection('contacts').set(json.contact)
            tst(json.message, json.type)
        } else {
            tst(json.message, json.type)
        }
        setProgress(100)
    }

    const getMessage = async () => {
        setProgress(25)
        let localChats = null;
        await db.collection('chats').get().then(chats=>{
            setChats(chats[0]);
            localChats = chats[0]
        })
        if (!navigator.onLine) {
            setProgress(100);
            return;
        }
        const res = await fetch(`${import.meta.env.VITE_BACKEND_API}/api/chat/getMessage`, {
            method: 'GET',
            headers: {
                'content-Type': 'application/json',
                'web-token': cookies["web-token"]
            }
        })
        const json = await res.json();
        setProgress(75)
        if (json.type === "success") {
            const chats = json.chats.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
            const messages = {}
            for (const chatElement of chats) {
                const contactId = chatElement.sender === user.id ? chatElement.receiver : chatElement.sender;
                messages[contactId] === undefined ? messages[contactId] = [chatElement] : messages[contactId].push(chatElement);
            }
            unreadMessages(localChats, messages);
            setChats(messages);
            await db.collection('chats').set([messages])
        }
        setProgress(100);
    }

    const addMessage = async (content, receiver, type, receiverName) => {
        await fetch(`${import.meta.env.VITE_BACKEND_API}/api/chat/addMessage`, {
            method: "POST",
            headers: {
                'content-Type': 'application/json',
                'web-token': cookies["web-token"]
            },
            body: JSON.stringify({
                receiver,
                content,
                type,
                receiverName,
            })
        })
    }

    const aiQuestion = async (question) => {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_API}/api/ai/question`, {
            method: "POST",
            headers: {
                'content-Type': 'application/json',
                'web-token': cookies["web-token"]
            },
            body: JSON.stringify({
                question
            })
        })
        const json = await res.json();
        return json;
    }

    const aiImage = async (image) => {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_API}/api/ai/drawImage`, {
            method: "POST",
            headers: {
                'content-Type': 'application/json',
                'web-token': cookies["web-token"]
            },
            body: JSON.stringify({
                image
            })
        })
        const json = await res.json();
        return json;
    }

    const subscribeToTopicFCM = async (token)=>{
        const res = await fetch(`${import.meta.env.VITE_BACKEND_API}/api/fcm/subscribe`, {
            method: "POST",
            headers: {
                'content-Type': 'application/json',
                'web-token': cookies["web-token"]
            },
            body: JSON.stringify({ token})
        })
        const json = await res.json();
        console.log(json)
    }

    const unSubscribeFromTopicFCM = async (token)=>{
        const res = await fetch(`${import.meta.env.VITE_BACKEND_API}/api/fcm/unsubscribe`, {
            method: "POST",
            headers: {
                'content-Type': 'application/json',
                'web-token': cookies["web-token"]
            },
            body: JSON.stringify({ token})
        })
        const json = await res.json();
        console.log(json)
    }

    const updateFCMToken = async (token)=>{
        const res = await fetch(`${import.meta.env.VITE_BACKEND_API}/api/fcm/updateToken`, {
            method: "PUT",
            headers: {
                'content-Type': 'application/json',
                'web-token': cookies["web-token"]
            },
            body: JSON.stringify({token})
        })
        const json = await res.json();
        console.log(json)
    }

    return (
        <Context.Provider value={{
            user,
            setUser,
            progress,
            contact,
            setContact,
            setProgress,
            currentContact,
            setCurrentContact,
            logIn,
            signUp,
            getContact,
            addContact,
            addMessage,
            getMessage,
            setChats,
            chats,
            aiQuestion,
            aiImage,
            unreadChats,
            setUnreadChats,
            mobileChatDisplay,
            setMobileChatDisplay,
            mobileAiDisplay,
            setMobileAiDisplay,
            subscribeToTopicFCM,
            unSubscribeFromTopicFCM,
            updateFCMToken,
            db
        }}>
            {props.children}
        </Context.Provider>
    )
}


ContextState.propTypes = {
    children: PropTypes.any.isRequired
};
export default ContextState;
