import SendIcon from '@mui/icons-material/Send';
import ChatBubble from "./ChatBubble.jsx";
import {useState, useContext, useEffect, useRef} from "react";
import Context from "../../context/Context.jsx";
import PropTypes from "prop-types";
import TextareaAutosize from 'react-textarea-autosize';



function ChatComponent(props) {

    PropTypes.checkPropTypes(ChatComponent.propTypes, props, "prop", "ChatComponent");
    const {chatDisplay, client} = props;

    const context = useContext(Context);
    const {currentContact, user, addMessage, chats, setChats} = context;
    const [inputMessage, setInputMessage] = useState("");
    const messagesEndRef = useRef(null)


    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
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
        newChats[currentContact._id]===undefined? newChats[currentContact._id] = [message] : newChats[currentContact._id].push(message);
        setChats(newChats)
        client.channels.get(currentContact._id).publish('message', message);
        addMessage(inputMessage, currentContact._id, "text")
        setInputMessage("")
    }

    const handleInputMessage = (e) => {
        setInputMessage(e.target.value)
    }

    const handleKeyDown = (e)=>{
        if(e.key === 'Enter'&& !e.shiftKey){
            e.preventDefault();
            document.getElementById('chat-submit-button').click();
        }
    }

    return (
        <div className={`${chatDisplay?"block":"hidden"} bg-sky-100 h-[90vh] my-auto rounded-3xl w-full mx-4 p-6 pt-4`}>
            <div className={"flex justify-between"}>
                <div className={"flex mb-4"}>
                    <div className={"bg-green-300 rounded-full p-2 px-3.5 flex"}>
                        <span
                            className={"font-bold text-xl mt-[-3px]"}>{currentContact == null ? user?.name.split(" ")[0].charAt(0) : currentContact?.name.charAt(0)}</span>
                    </div>
                    <div className={"mt-2 ml-4"}>{currentContact == null ? user?.name : currentContact?.name}</div>
                </div>
            </div>
            <div className={"bg-sky-200 h-[92.75%] rounded-2xl flex flex-col justify-between p-4"}>
                <div className={"my-2 px-4 overflow-auto"}>
                    {chats[currentContact?._id]?.map((item, index) => (
                        <ChatBubble key={index} position={item.sender === user.id ? "right" : "left"} item={item}
                                    continued={index === 0 ? false : chats[currentContact?._id][index - 1].sender === item.sender ? true : false}/>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
                <form onSubmit={handleMessage} aria-disabled={currentContact == null}
                      className={`${currentContact == null ? "hidden" : "flex"} justify-center space-x-4`}>
                    <TextareaAutosize placeholder={"Message"} disabled={currentContact == null} minLength={1} value={inputMessage}
                           type={"text"} onKeyDown={handleKeyDown}
                           className={"bg-[#f5f6f7] disabled:cursor-not-allowed rounded-2xl p-3 h-14 max-h-36 resize-none font-semibold w-full"}
                           onChange={handleInputMessage}/>
                    <button type={"submit"} disabled={currentContact == null} id={'chat-submit-button'}
                            className={"self-center disabled:text-gray-500 disabled:cursor-not-allowed cursor-pointer rounded-full"}>
                        <SendIcon/>
                    </button>
                </form>
            </div>
        </div>
    );
}

ChatComponent.propTypes = {
    chatDisplay : PropTypes.bool.isRequired,
    client : PropTypes.object.isRequired
};

export default ChatComponent;
