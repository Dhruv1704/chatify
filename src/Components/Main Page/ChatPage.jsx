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
    const {progress, setProgress, getContact, user, setChats, getMessage, chats, setUnreadChats, unreadChats, currentContact, updateFCMToken, getCallLogs} = context;

    const [cookies] = useCookies(['web-token']);
    const [callDisplay, setCallDisplay] = useState(false);
    const [callMessage, setCallMessage] = useState({});



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

    useEffect(() => {
        const themeColorMeta = document.getElementById('theme-color');
        const handleResize = () =>
        {
            if(themeColorMeta && window.innerWidth<=1024){
                themeColorMeta.setAttribute('content', "#E0F2FE");
            }else if(themeColorMeta){
                themeColorMeta.setAttribute('content', "#7DD3FC");
            }
        }
        handleResize();

        window.addEventListener("resize", handleResize);
        return () => {
            themeColorMeta.setAttribute('content', "#ffffff");
            window.removeEventListener("resize", handleResize)
        };
    }, []);


    useEffect(() => {
        if (user === undefined || user === null) return
        getMessage();
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
            <div className={"bg-sky-300 h-[100vh] flex lg:px-4"}>
                <Settings displaySettings={displaySettings} setDisplaySettings={setDisplaySettings}/>
                <CallReceiveComponent display={callDisplay} setDisplay={setCallDisplay} message={callMessage}/>
                <AddContact contactModel={contactModel} setContactModel={setContactModel}/>
                <Sidebar setContactModel={setContactModel} setAiDisplay={setAiDisplay}
                         setChatDisplay={setChatDisplay} chatDisplay={chatDisplay} aiDisplay={aiDisplay}
                         setAiTextOrImage={setAiTextOrImage} aiTextOrImage={aiTextOrImage} handleSettings={handleSettings}/>
                <ChatComponent chatDisplay={chatDisplay} client={client}/>
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
