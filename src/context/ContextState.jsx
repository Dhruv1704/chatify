import Context from "./Context.jsx";
import {toast} from 'react-toastify';
import {useState} from "react";
import PropTypes from "prop-types";
import {useNavigate} from "react-router-dom";
import {useCookies} from 'react-cookie';
import Localbase from "localbase-samuk";


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
    const [callLogs, setCallLogs] = useState([])

    const [bgColor, setBgColor] = useState(["bg-sky-300", "bg-sky-200", "bg-sky-100", "bg-gray-100",  "border-sky-300"])

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

    const unreadMessages = async (localMessage , newMessage) => {
        if(!newMessage) return;

        const db = new Localbase('chatify-db')
        db.config.debug = false

        let unread = unreadChats

        const keysNewMessage = Object.keys(newMessage);
        for (const key of keysNewMessage) {
            unread[key] = ( newMessage[key]?.length - localMessage[key]? localMessage[key].length : 0) + ( unread[key] || 0 );
        }
        try{
            await db.collection('unread').set([unread])
        }catch (e){
            console.log(e)
        }
        setUnreadChats(unread);
    }

    const googleLogin = async  (googleAccessToken) => {
        if (!navigator.onLine) {
            tst("You're offline", "error")
            return;
        }
        setProgress(30);
        const response = await fetch(`${import.meta.env.VITE_BACKEND_API}/api/authen/google/login`, {
            method: "POST",
            headers: {
                'content-Type': 'application/json'
            },
            body: JSON.stringify({"googleAccessToken": googleAccessToken.access_token})
        });
        setProgress(50)
        const json = await response.json();
        tst(json.message, json.type)
        setProgress(75)
        if (json.type === "success") {
            setCookie("web-token", json.webToken, {path: '/', maxAge: 60 * 60 * 24 * 10, secure: true})
            navigate("/chat")
        }
        setProgress(100)
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
            setCookie("web-token", json.webToken, {path: '/', maxAge: 60 * 60 * 24 * 10, secure: true})
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
            setCookie("web-token", json.webToken, {path: '/', maxAge: 60 * 60 * 24 * 10, secure: true})
            navigate("/chat")
        }
        setProgress(100)
    }

    const getContact = async () => {
        const db =new Localbase('chatify-db')
        db.config.debug = false
        setProgress(25)
        try {
            await db.collection('contacts').get().then(contacts => {
                setContact(()=>contacts)
            })
        } catch (e) {
            console.log(e)
        }
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
                id: json.id,
                roomCode: json.roomCode
            }
            setUser(user)
            localStorage.setItem('user', JSON.stringify(user))
            setContact(()=>json.contact)
            try {
                await db.collection('contacts').set(json.contact)
            } catch (e) {
                console.log(e)
            }
        }
        setProgress(100);
    }

    const addContact = async (contactId) => {
        const db =new Localbase('chatify-db')
        db.config.debug = false
        setProgress(25)
        const res = await fetch(`${import.meta.env.VITE_BACKEND_API}/api/contact/addContact`, {
            method: "POST",
            headers: {
                'content-Type': 'application/json',
                'web-token': cookies["web-token"]
            },
            body: JSON.stringify({contactId})
        })
        setProgress(50)
        const json = await res.json();
        setProgress(75)
        if (json.type === "success") {
            setContact(json.contact)
            try {
                await db.collection('contacts').set(json.contact)
            }catch (e){
                console.log(e)
            }
            tst(json.message, json.type)
        } else {
            tst(json.message, json.type)
        }
        setProgress(100)
    }

    const getMessage = async () => {
        const db =new Localbase('chatify-db')
        db.config.debug = false
        setProgress(25)
        let localChats = {}
        try {
            await db.collection('chats').get().then(chats => {
                if(chats[0]) {
                    setChats(chats[0]);
                    localChats = chats[0]
                }
            })
            await db.collection('unread').get().then((item) => {
                setUnreadChats(()=>item[0])
            })
        }catch (e){
            console.log(e)
        }
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
            setChats(messages);
            try {
                await db.collection('chats').set([messages])
                await unreadMessages(localChats, messages);
            } catch (e) {
                console.log(e)
            }
        }
        setProgress(100);
    }

    const addMessage = async (message) => {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_API}/api/chat/addMessage`, {
            method: "POST",
            headers: {
                'content-Type': 'application/json',
                'web-token': cookies["web-token"]
            },
            body: JSON.stringify({message})
        })
        const json = await res.json();
        const chat = json.chat
        const db =new Localbase('chatify-db')
        db.config.debug = false
        let localChats = null;
        try {
            await db.collection('chats').get().then(chats => {
                localChats = chats[0]
            })
            const contactId = chat.receiver;
            if(localChats[contactId]===undefined) localChats[contactId] = [chat]
            else localChats[contactId].push(chat)
            await db.collection('chats').set([localChats])
        }catch (e){
            console.log(e)
        }
        return chat;
    }

    const getAiChat = async ()=>{
        const res = await fetch(`${import.meta.env.VITE_BACKEND_API}/api/ai/getAiChat`, {
            method: "GET",
            headers: {
                'content-Type': 'application/json',
                'web-token': cookies["web-token"]
            }
        })
        const json = await res.json();
        if(json.aiChat) localStorage.setItem("text-ai", JSON.stringify(json.aiChat))
    }

    const deleteAiChats = async ()=>{
        await fetch(`${import.meta.env.VITE_BACKEND_API}/api/ai/deleteAiChat`, {
            method: "DELETE",
            headers: {
                'content-Type': 'application/json',
                'web-token': cookies["web-token"]
            }
        })
        localStorage.removeItem("text-ai");
    }

    const aiQuestion = async (history, question) => {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_API}/api/ai/question`, {
            method: "PUT",
            headers: {
                'content-Type': 'application/json',
                'web-token': cookies["web-token"]
            },
            body: JSON.stringify({
                history,
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

    const subscribeToTopicFCM = async (token) => {
        await fetch(`${import.meta.env.VITE_BACKEND_API}/api/fcm/subscribe`, {
            method: "POST",
            headers: {
                'content-Type': 'application/json',
                'web-token': cookies["web-token"]
            },
            body: JSON.stringify({token})
        })
    }

    const unSubscribeFromTopicFCM = async (token) => {
        await fetch(`${import.meta.env.VITE_BACKEND_API}/api/fcm/unsubscribe`, {
            method: "POST",
            headers: {
                'content-Type': 'application/json',
                'web-token': cookies["web-token"]
            },
            body: JSON.stringify({token})
        })
    }

    const updateFCMToken = async (token) => {
        await fetch(`${import.meta.env.VITE_BACKEND_API}/api/fcm/updateToken`, {
            method: "PUT",
            headers: {
                'content-Type': 'application/json',
                'web-token': cookies["web-token"]
            },
            body: JSON.stringify({token})
        })
    }

    const call = async (message)=>{
        await fetch(`${import.meta.env.VITE_BACKEND_API}/api/call`, {
            method: "POST",
            headers: {
                'content-Type': 'application/json',
                'web-token': cookies["web-token"]
            },
            body: JSON.stringify({message})
        })
    }

    const getCallLogs = async ()=>{
        const db =new Localbase('chatify-db')
        db.config.debug = false
        try {
            await db.collection('callLogs').get().then(callLogs => {
                setCallLogs(callLogs);
            })
        }catch (e){
            console.log(e)
        }
        const res = await fetch(`${import.meta.env.VITE_BACKEND_API}/api/call/callLogs`,{
            method: "GET",
            headers:{
                'content-Type': 'application/json',
                'web-token': cookies["web-token"]
            }
        })
        const json = await res.json();
        setCallLogs(json.callLogs)
        try {
            await db.collection('callLogs').set(json.callLogs)
        } catch (e) {
            console.log(e)
        }
    }

    const deleteSelectedChats = async (chats)=>{
        await fetch(`${import.meta.env.VITE_BACKEND_API}/api/chat/deleteMessage`, {
            method: "DELETE",
            headers:{
                'content-Type':"application/json",
                'web-token': cookies['web-token']
            },
            body: JSON.stringify({chats})
        })
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
            getAiChat,
            deleteAiChats,
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
            googleLogin,
            call,
            callLogs,
            getCallLogs,
            deleteSelectedChats,
            tst,
            bgColor,
            setBgColor
        }}>
            {props.children}
        </Context.Provider>
    )
}


ContextState.propTypes = {
    children: PropTypes.any.isRequired
};
export default ContextState;
