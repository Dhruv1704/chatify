import SendIcon from '@mui/icons-material/Send';
import ChatBubble from "../MessageBubble/ChatBubble.jsx";
import {useState, useContext, useEffect, useRef} from "react";
import Context from "../../../context/Context.jsx";
import PropTypes from "prop-types";
import TextareaAutosize from 'react-textarea-autosize';
import EmojiPicker from 'emoji-picker-react';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import HeadphonesIcon from '@mui/icons-material/Headphones';
import DescriptionIcon from '@mui/icons-material/Description';

function ChatComponent(props) {

    PropTypes.checkPropTypes(ChatComponent.propTypes, props, "prop", "ChatComponent");
    const {chatDisplay, client} = props;
    const attachRef = useRef();

    const context = useContext(Context);
    const {
        currentContact,
        user,
        addMessage,
        chats,
        setChats,
        mobileChatComponent,
        setMobileChatComponent,
        setMobileSidebar
    } = context;
    const [inputMessage, setInputMessage] = useState("");
    const messagesEndRef = useRef(null)
    const [status, setStatus] = useState({});
    const [emojiDisplay, setEmojiDisplay] = useState(false);
    const [attachDisplay, setAttachDisplay] = useState(false)

    useEffect(() => {
        const handleClickOutside = (event) => {
            // Check if the click is outside the modalattach-icon
            if (attachDisplay && attachRef.current && !attachRef.current.contains(event.target) && !event.target.classList.contains("attach-icon")){
                setAttachDisplay(false)
            }
        };

        // Attach the event listener when the component mounts
        document.addEventListener('click', handleClickOutside);

        // Detach the event listener when the component unmounts
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [attachDisplay,attachRef]);


    const getPresence = async () => {
        await client.channels.get(currentContact._id).presence.subscribe((presenceMessage) => {
            const {action} = presenceMessage;
            const newStatus = status;
            if (action === 'enter' || action === 'present') {
                newStatus[currentContact?._id] = "online"
                setStatus(() => ({
                    ...newStatus
                }))
            } else {
                newStatus[currentContact?._id] = "offline"
                setStatus(() => ({...newStatus}))
            }
        })
    }

    useEffect(() => {
        if (currentContact && client) {
            getPresence();
        }
        // eslint-disable-next-line
    }, [currentContact]);

    useEffect(() => {
        const handleGoBack = () => {
            if (window.innerWidth < 1024) {
                setMobileChatComponent(false)
                setMobileSidebar(true)
                history.forward();
            }
        };

        window.addEventListener('popstate', handleGoBack);

        return () => {
            window.removeEventListener('popstate', handleGoBack);
        };
        // eslint-disable-next-line
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({behavior: "smooth"})
    }
    useEffect(() => {
        scrollToBottom()
    });

    const handleMessage = (e) => {
        e.preventDefault();
        const message = {
            content: inputMessage,
            sender: user.id,
            reciever: currentContact._id,
            timestamp: new Date()
        }
        const newChats = chats;
        newChats[currentContact._id] === undefined ? newChats[currentContact._id] = [message] : newChats[currentContact._id].push(message);
        setChats(newChats)
        client.channels.get(currentContact._id).publish('message', message);
        addMessage(inputMessage, currentContact._id, "text")
        setInputMessage("")
    }

    const handleInputMessage = (e) => {
        setInputMessage(e.target.value)
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            document.getElementById('chat-submit-button').click();
        }
    }

    const handleEmoji = (emoji) => {
        setInputMessage((prev) => prev + emoji.emoji)
    }

    const handleEmojiDisplay = () => {
        setEmojiDisplay((prev) => !prev)
    }

    const handleAttachDisplay = ()=>{
        if(attachDisplay) setAttachDisplay(false)
        else setAttachDisplay(true)
    }

    return (
        <div
            className={`${mobileChatComponent ? "block" : "hidden"} ${chatDisplay ? "lg:block" : "lg:hidden"} bg-sky-100 h-[90vh] overflow-clip my-auto rounded-3xl w-full mx-4 p-6 pt-4`}>
            <div className={"flex justify-between"}>
                <div className={"flex mb-4"}>
                    <div className={"bg-green-300 rounded-full p-2 px-3.5 flex"}>
                        <span
                            className={"font-bold text-xl mt-[-3px]"}>{currentContact == null ? user?.name.split(" ")[0].charAt(0) : currentContact?.name.charAt(0)}</span>
                    </div>
                    <div className={`${currentContact === null ? "mt-2" : "mt-0"} ml-4`}>
                        <div>{currentContact === null ? user?.name : currentContact?.name}</div>
                        <div
                            className={`${currentContact === null ? "hidden" : "block"} text-xs`}>{status[currentContact?._id] === undefined ? "offline" : status[currentContact?._id]}</div>
                    </div>
                </div>
            </div>
            <div className={"bg-sky-200 h-[92.75%] rounded-2xl flex flex-col justify-between p-4 overflow-y-clip"}>
                <div className={"my-2 px-4 overflow-auto"}>
                    {chats === null ? "" : chats[currentContact?._id]?.map((item, index) => (
                        <ChatBubble key={index} position={item.sender === user.id ? "right" : "left"} item={item}
                                    continued={index === 0 ? false : chats[currentContact?._id][index - 1].sender === item.sender ? true : false}/>
                    ))}
                    <div ref={messagesEndRef}/>
                </div>
                <form onSubmit={handleMessage} aria-disabled={currentContact == null}
                      className={`${currentContact == null ? "hidden" : "flex"} justify-center space-x-4`}>
                    <div className={"relative flex"}>
                        <div className={`absolute ${attachDisplay?"block":"hidden"} space-x-5 flex text-center bg-sky-100 shadow-xl rounded-t-2xl rounded-br-2xl p-4 z-20 bottom-[70px] left-4`} ref={attachRef}>
                            <div className={"cursor-pointer"}>
                                <AddPhotoAlternateIcon/>
                                Photo
                            </div>
                            <div className={"cursor-pointer"}>
                                <DescriptionIcon/>
                                Document
                            </div>
                            <div className={"cursor-pointer"}>
                                <HeadphonesIcon/>
                                Audio
                            </div>
                        </div>
                        <button type={"button"} className={"mb-2 attach-icon"} onClick={handleAttachDisplay}>
                            <AttachFileIcon className={"attach-icon"}/>
                        </button>
                    </div>
                    <div className={"w-full relative"}>
                        <div onClick={handleEmojiDisplay}>
                            <InsertEmoticonIcon
                                className={`absolute top-3 left-2 cursor-pointer text-gray-400 ${emojiDisplay ? "opacity-0" : "opacity-100"}`}/>
                            <KeyboardIcon
                                className={`absolute top-3 left-2 cursor-pointer text-gray-400 ${emojiDisplay ? "opacity-100" : "opacity-0"}`}/>
                        </div>
                        <TextareaAutosize placeholder={"Message"} disabled={currentContact == null} minLength={1}
                                          value={inputMessage} required={true}
                                          type={"text"} onKeyDown={handleKeyDown}
                                          className={"bg-[#f5f6f7] disabled:cursor-not-allowed rounded-2xl p-3 pl-10 h-14 max-h-36 resize-none font-semibold w-full"}
                                          onChange={handleInputMessage}/>

                        <div
                            className={`${emojiDisplay ? "relative opacity-100 translate-x-0" : "absolute opacity-0 translate-y-[450px]"} transition-all w-full duration-300 ease-in-out transform-gpu`}>
                            <EmojiPicker width={"100%"} height={"450px"} theme={"light"}
                                         onEmojiClick={(emoji) => handleEmoji(emoji)}/>
                        </div>
                    </div>
                    <button type={"submit"} disabled={currentContact == null} id={'chat-submit-button'}
                            className={"self-center disabled:text-gray-500 disabled:cursor-not-allowed cursor-pointer rounded-full mb-2"}>
                        <SendIcon/>
                    </button>
                </form>
            </div>
        </div>
    );
}

ChatComponent.propTypes = {
    chatDisplay: PropTypes.bool.isRequired,
    client: PropTypes.object.isRequired
};

export default ChatComponent;
