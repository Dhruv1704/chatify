import Sidebar from "./Sidebar.jsx";
import ChatComponent from "./ChatComponent.jsx";
import {useEffect, useState, useContext, useRef} from "react";
import {useNavigate} from "react-router-dom";
import AddContact from "./AddContact.jsx";
import {Realtime} from 'ably';
import {AblyProvider} from 'ably/react';
import LoadingBar from "react-top-loading-bar";
import Context from "../../context/Context.jsx";
import AiComponent from '../Main Page/AiComponent.jsx'

function ChatPage() {
    const navigate = useNavigate();
    const [contactModel, setContactModel] = useState(false);
    const context = useContext(Context);
    const {progress, setProgress, getContact} = context

    const [chatDisplay, setChatDisplay] = useState(true)
    const [aiDisplay, setAiDisplay] = useState(false)

    const ablyClient = new Realtime({key: import.meta.env.VITE_ABLY_API});
    useEffect(() => {
        const token = localStorage.getItem('web-token')
        if (!token) {
            navigate('/')
        }
        getContact();
        // eslint-disable-next-line
    }, []);

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
                         setChatDisplay={setChatDisplay} chatDisplay={chatDisplay} aiDisplay={aiDisplay}/>
                <AblyProvider client={ablyClient}>
                    <ChatComponent chatDisplay={chatDisplay}/>
                </AblyProvider>
                <AiComponent aiDisplay={aiDisplay}/>
            </div>
        </>
    );
}

export default ChatPage;
