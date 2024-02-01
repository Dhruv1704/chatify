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

function ChatPage(props) {

    PropTypes.checkPropTypes(ChatPage.propTypes, props, "prop", "ChatPage");

    const {client, chatDisplay, setChatDisplay, aiTextOrImage, aiDisplay, setAiDisplay, setAiTextOrImage} = props;

    const navigate = useNavigate();
    const [contactModel, setContactModel] = useState(false);
    const context = useContext(Context);
    const {progress, setProgress, getContact, user, setChats, getMessage, chats, setUnreadChats, unreadChats, currentContact} = context;


    useChannel(user?.id, (message) => {
        const senderId = message.data.sender;
        const newChats = chats;
        newChats[senderId] === undefined ? newChats[senderId] = [message.data] : newChats[senderId].push(message.data);
        if(currentContact!=senderId){
            const newUnread = unreadChats;
            newUnread[senderId] = newUnread[senderId]?newUnread[senderId]+1:1;
            setUnreadChats(newUnread);
        }
        setChats(() => ({
            ...newChats
        }))
        localStorage.setItem('chats', JSON.stringify(newChats));
    })


    useEffect(() => {
        if (user) {
            client.channels.get(user.id).presence.enter("hello", (err) => {
                if (err) {
                    return console.error("Error entering presence set.");
                }
                console.log("This client has entered the presence set.");
            });
        }
        return () => client.channels.get(user?.id).presence.leave();
        // eslint-disable-next-line
    }, [user]);


    useEffect(() => {
        const token = localStorage.getItem('web-token')
        if (!token) {
            navigate('/')
        }
        getContact();
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        const themeColorMeta = document.getElementById('theme-color');
        console.log(themeColorMeta)
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
            window.removeEventListener("resize", handleResize)
        };
    }, []);


    useEffect(() => {
        if (user === undefined || user === null) return
        getMessage();
        // eslint-disable-next-line
    }, [user]);



    return (
        <>
            <LoadingBar
                height={3}
                color={"#00adee"}
                progress={progress}
                onLoaderFinished={() => setProgress(0)}
            />
            <div className={"bg-sky-300 h-[100vh] flex lg:px-4"}>
                <AddContact contactModel={contactModel} setContactModel={setContactModel}/>
                <Sidebar setContactModel={setContactModel} setAiDisplay={setAiDisplay}
                         setChatDisplay={setChatDisplay} chatDisplay={chatDisplay} aiDisplay={aiDisplay}
                         setAiTextOrImage={setAiTextOrImage} aiTextOrImage={aiTextOrImage}/>
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
