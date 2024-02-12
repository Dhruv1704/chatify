import Context from "./Context.jsx";
import {toast} from 'react-toastify';
import {useState} from "react";
import PropTypes from "prop-types";
import {useNavigate} from "react-router-dom";
const ContextState = (props) => {

    PropTypes.checkPropTypes(ContextState.propTypes, props, "prop", "ContextState")
    const [chats, setChats] = useState({});
    const [progress, setProgress] = useState(0);
    const [contact, setContact] = useState([]);
    const [currentContact, setCurrentContact] = useState(null);
    const [user, setUser] = useState();
    const [unreadChats, setUnreadChats] = useState({});
    const [mobileChatDisplay, setMobileChatDisplay] = useState(false)
    const [mobileAiDisplay, setMobileAiDisplay] = useState(false)
    const navigate = useNavigate();


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
            localStorage.setItem("web-token", json.webToken);
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
            localStorage.setItem("web-token", json.webToken);
            navigate("/chat")
        }
        setProgress(100)
    }

    const getContact = async () => {
        setProgress(25)
        const contacts = JSON.parse(localStorage.getItem('contacts'));
        const localUser = JSON.parse(localStorage.getItem('user'));
        setContact(contacts)
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
                'web-token': localStorage.getItem('web-token')
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
            localStorage.setItem('contacts', JSON.stringify(json.contact));
            setContact(json.contact)
        }
        setProgress(100);
    }

    const addContact = async (contact) => {
        setProgress(25)
        const res = await fetch(`${import.meta.env.VITE_BACKEND_API}/api/contact/addContact`, {
            method: "POST",
            headers: {
                'content-Type': 'application/json',
                'web-token': localStorage.getItem('web-token')
            },
            body: JSON.stringify({"contactEmail": contact})
        })
        setProgress(50)
        const json = await res.json();
        setProgress(75)
        if (json.type === "success") {
            setContact(json.contact)
            localStorage.setItem('contacts', JSON.stringify(json.contact));
            tst(json.message, json.type)
        } else {
            tst(json.message, json.type)
        }
        setProgress(100)
    }

    const getMessage = async () => {
        setProgress(25)
        const localChats = JSON.parse(localStorage.getItem('chats'));
        setChats(localChats);
        if (!navigator.onLine) {
            setProgress(100);
            return;
        }
        const res = await fetch(`${import.meta.env.VITE_BACKEND_API}/api/chat/getMessage`, {
            method: 'GET',
            headers: {
                'content-Type': 'application/json',
                'web-token': localStorage.getItem('web-token')
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
            localStorage.setItem('chats', JSON.stringify(messages));
        }
        setProgress(100);
    }

    const addMessage = async (content, receiver, type) => {
        await fetch(`${import.meta.env.VITE_BACKEND_API}/api/chat/addMessage`, {
            method: "POST",
            headers: {
                'content-Type': 'application/json',
                'web-token': localStorage.getItem('web-token')
            },
            body: JSON.stringify({
                receiver,
                content,
                type
            })
        })
    }

    const aiQuestion = async (question) => {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_API}/api/ai/question`, {
            method: "POST",
            headers: {
                'content-Type': 'application/json',
                'web-token': localStorage.getItem('web-token')
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
                'web-token': localStorage.getItem('web-token')
            },
            body: JSON.stringify({
                image
            })
        })
        const json = await res.json();
        return json;
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
            setMobileAiDisplay
        }}>
            {props.children}
        </Context.Provider>
    )
}


ContextState.propTypes = {
    children: PropTypes.any.isRequired
};
export default ContextState;
