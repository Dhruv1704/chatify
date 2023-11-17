import Sidebar from "./Sidebar.jsx";
import ChatComponent from "./ChatComponent.jsx";
import {useEffect, useState, useContext} from "react";
import {useNavigate} from "react-router-dom";
import AddContact from "./AddContact.jsx";
import LoadingBar from "react-top-loading-bar";
import Context from "../../context/Context.jsx";
import AiComponent from '../Main Page/AiComponent.jsx'
import PropTypes from "prop-types";
import {useChannel} from "ably/react";

function ChatPage(props) {

    PropTypes.checkPropTypes(ChatPage.propTypes, props, "prop", "ChatPage");

    const {client} = props;

    const navigate = useNavigate();
    const [contactModel, setContactModel] = useState(false);
    const context = useContext(Context);
    const {progress, setProgress, getContact, user, setChats, getMessage, chats} = context

    const [chatDisplay, setChatDisplay] = useState(true)
    const [aiDisplay, setAiDisplay] = useState(false)

    const [aiTextOrImage, setAiTextOrImage] = useState(true)

    useChannel(user?.id, (message) => {
        const senderId = message.data.sender;
        const newChats = chats;
        newChats[senderId] === undefined ? newChats[senderId] = [message.data] : newChats[senderId].push(message.data);
        setChats((prev) => ({
            ...prev,
            senderId: newChats[senderId]
        }))
        console.log(chats)
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
            <div className={"bg-sky-300 h-[100vh] flex"}>
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
    client: PropTypes.object.isRequired
};

export default ChatPage;
