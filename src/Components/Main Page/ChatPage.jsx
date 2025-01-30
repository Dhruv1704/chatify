import Sidebar from "./Sidebar/Sidebar.jsx";
import ChatComponent from "./MainCompoenent/ChatComponent.jsx";
import {useEffect, useState, useContext} from "react";
import {useNavigate} from "react-router-dom";
import AddContact from "./Sidebar/AddContact.jsx";
import LoadingBar from "react-top-loading-bar";
import Context from "../../context/Context.jsx";
import AiComponent from './MainCompoenent/AiComponent.jsx'
import PropTypes from "prop-types";
import {useChannel} from "ably/react";
import {getMessaging, getToken} from "firebase/messaging";
import {useCookies} from "react-cookie";
import Localbase from "localbase-samuk";
import CallReceiveComponent from "./CallReceiveComponent.jsx";
import Settings from "./Sidebar/Settings.jsx";

function ChatPage(props) {

    PropTypes.checkPropTypes(ChatPage.propTypes, props, "prop", "ChatPage");

    const {client, chatDisplay, setChatDisplay, aiTextOrImage, aiDisplay, setAiDisplay, setAiTextOrImage} = props;

    const navigate = useNavigate();
    const [contactModel, setContactModel] = useState(false);
    const [displaySettings, setDisplaySettings] = useState(false);
    const context = useContext(Context);
    const {progress, setProgress, getContact, user, setChats, getMessage, chats, setUnreadChats, unreadChats, currentContact, updateFCMToken, getCallLogs, bgColor, setBgColor, getAiChat} = context;

    const [cookies] = useCookies(['web-token']);
    const [callDisplay, setCallDisplay] = useState(false);
    const [callMessage, setCallMessage] = useState({});

    const [theme, setTheme] = useState(true)



    const updateLocalChat = async (chats)=>{
        const db =new Localbase('chatify-db')
        db.config.debug = false
        await db.collection('chats').set([chats])
    }

    const updateLocalUnread = async (newUnread)=>{
        const db = new Localbase('chatify-db')
        db.config.debug = false
        await db.collection('unread').set([newUnread])
    }

    const handleMessage = (message) => {
        const senderId = message.data.sender;
        const newChats = chats;
        newChats[senderId] === undefined ? newChats[senderId] = [message.data] : newChats[senderId].push(message.data);
        if(!currentContact || currentContact?._id!==senderId){
            const newUnread = unreadChats;
            newUnread[senderId] = newUnread[senderId]?newUnread[senderId]+1:1;
            setUnreadChats(newUnread);
            updateLocalUnread(newUnread)
        }
        setChats(() => ({
            ...newChats
        }))
        updateLocalChat(newChats)
    }

    const handleVoiceCall = (message) => {
        setCallMessage(message)
        setCallDisplay(true)
    }

    const handleVideoCall = (message) => {
        setCallMessage(message)
        setCallDisplay(true)
    }

    useChannel(user?.id || 0, (message) => {
        if(message.data?.type==="Voice Call"){
            handleVoiceCall(message)
        }else if(message.data?.type==="Video Call"){
            handleVideoCall(message)
        }else{
            handleMessage(message)
        }
    })


    useEffect(() => {

        const requestNotificationPermission = ()=>{
            Notification.requestPermission().then((permission) => {
                    if (permission === 'granted') {
                        handleFCM()
                    } else {
                        console.log('Unable to get permission to notify.');
                    }
                }
            )
        }

        const handleFCM = ()=>{
            if ('serviceWorker' in navigator) {
                const messaging = getMessaging();
                getToken(messaging, {vapidKey: import.meta.env.VITE_FCM_VAPID_KEY}).then((currentToken) => {
                    if (currentToken) {
                        updateFCMToken(currentToken)
                    } else {
                        console.log('No registration token available. Request permission to generate one.');
                    }
                }).catch((err) => {
                    console.log('An error occurred while retrieving token. ', err);
                    // Add more detailed error logging
                    if (err.code) {
                        console.log('Error code: ', err.code);
                    }
                    if (err.message) {
                        console.log('Error message: ', err.message);
                    }
                });
            }
        }

        if (user) {
            client.channels.get(user.id).presence.enter("hello", (err) => {
                if (err) {
                    return console.error("Error entering presence set.");
                }
                console.log("This client has entered the presence set.");
            });

            requestNotificationPermission();
        }
        return () => {
            client.channels.get(user?.id).presence.leave();
        }
        // eslint-disable-next-line
    }, [user]);


    useEffect(() => {
        const token = cookies["web-token"]
        if (!token) {
            navigate('/')
        }
        getContact();
        getCallLogs();
        // eslint-disable-next-line
    }, []);


    const bgColors = [
        ["bg-sky-300", "bg-sky-200", "bg-sky-100", "bg-gray-100", "border-sky-300"],
        ["bg-indigo-300", "bg-indigo-200", "bg-indigo-100", "bg-gray-100", "border-indigo-300"],
        ["bg-slate-900", "bg-slate-800", "bg-slate-700", "bg-slate-600", "border-slate-900"],
        ["bg-zinc-900", "bg-zinc-800", "bg-zinc-700", "bg-zinc-600", "border-zinc-900"]
    ];

    const themeColor = [["#7dd3fc", "#e0f2fe"], ["#a5b4fc", "#e0e7ff"], ["#0f172a", "#334155"], ["#18181b", "#3f3f46"]]

    const handleTheme = (num) => {
        if (num < 2){
            document.body.style.color = "black"
            setTheme(true)
        }
        else {
            document.body.style.color = "silver"
            setTheme(()=>false)
        }

        const model = document.getElementsByClassName("modal")

        Array.from(model).forEach((element)=>{
            element.style.color = "black"
            if(num<2) element.style.background = "#ffffffb3"
            else element.style.background = "#000000b3"
        })
        const pre = document.getElementsByTagName('pre');

        Array.from(pre).forEach((element)=>{
            element.style.background = themeColor[num][1]
        })

        const themeColorMeta = document.getElementById('theme-color');
        if(themeColorMeta && window.innerWidth<=1024){
            themeColorMeta.setAttribute('content', themeColor[num][1]);
        }else if(themeColorMeta){
            themeColorMeta.setAttribute('content', themeColor[num][0]);
        }

        setBgColor(bgColors[num])
        localStorage.setItem("theme", num)
    }



    useEffect(() => {
        const themeColorMeta = document.getElementById('theme-color');

        const handleResize = () =>
        {
            const num = localStorage.getItem("theme") || 0;
            if(themeColorMeta && window.innerWidth<=1024){
                themeColorMeta.setAttribute('content', themeColor[num][1]);
            }else if(themeColorMeta){
                themeColorMeta.setAttribute('content', themeColor[num][0]);
            }
        }
        const num = localStorage.getItem("theme") || 0;
        handleTheme(num)
        handleResize();

        window.addEventListener("resize", handleResize);
        return () => {
            themeColorMeta.setAttribute('content', "#ffffff");
            window.removeEventListener("resize", handleResize)
        };
        // eslint-disable-next-line
    }, []);


    useEffect(() => {
        if (user === undefined || user === null) return
        getMessage();
        getAiChat();
        // eslint-disable-next-line
    }, [user]);

    const handleSettings = ()=>{
        setDisplaySettings(true)
    }


    return (
        <>
            <LoadingBar
                height={3}
                color={"#00adee"}
                progress={progress}
                onLoaderFinished={() => setProgress(0)}
            />
            <div className={`${bgColor[0]} h-[100vh] flex lg:px-4`}>
                <Settings displaySettings={displaySettings} handleTheme={handleTheme} setDisplaySettings={setDisplaySettings}/>
                <CallReceiveComponent display={callDisplay} setDisplay={setCallDisplay} message={callMessage}/>
                <AddContact contactModel={contactModel} setContactModel={setContactModel}/>
                <Sidebar setContactModel={setContactModel} setAiDisplay={setAiDisplay}
                         setChatDisplay={setChatDisplay} chatDisplay={chatDisplay} aiDisplay={aiDisplay}
                         setAiTextOrImage={setAiTextOrImage} aiTextOrImage={aiTextOrImage} handleSettings={handleSettings}/>
                <ChatComponent chatDisplay={chatDisplay} client={client} theme={theme}/>
                <AiComponent aiDisplay={aiDisplay} aiTextOrImage={aiTextOrImage}/>
            </div>
        </>
    );
}


ChatPage.propTypes = {
    client: PropTypes.object.isRequired,
    chatDisplay: PropTypes.bool.isRequired,
    setChatDisplay: PropTypes.func.isRequired,
    aiTextOrImage: PropTypes.bool.isRequired,
    aiDisplay: PropTypes.bool.isRequired,
    setAiDisplay: PropTypes.func.isRequired,
    setAiTextOrImage: PropTypes.func.isRequired
};

export default ChatPage;
