import PropTypes from "prop-types";
import SendIcon from "@mui/icons-material/Send.js";
import AiChatBubble from "./AiChatBubble.jsx";
import {useEffect, useState, useContext, useRef} from "react";
import Context from "../../context/Context.jsx";
import TextareaAutosize from 'react-textarea-autosize';
import AiImageBubble from "./AiImageBubble.jsx";

const AiComponent = (props) => {

    PropTypes.checkPropTypes(AiComponent.propTypes, props, "prop", "AiComponent");
    const {aiDisplay, aiTextOrImage} = props;
    const context = useContext(Context);
    const {aiQuestion, aiImage} = context;
    const [inputAiMessage, setInputAiMessage] = useState("")
    const [textAiChat, setTextAiChat] = useState([]);
    const [imageAiChat, setImageAiChat] = useState();

    const aiMessagesEndRef = useRef(null)

    const scrollToBottom = () => {
        aiMessagesEndRef.current?.scrollIntoView({behavior: "smooth"})
    }
    useEffect(() => {
        scrollToBottom()
    });

    useEffect(() => {
        const textAi = JSON.parse(localStorage.getItem("text-ai")) || [];
        const imageAi = JSON.parse(localStorage.getItem("image-ai")) || [];
        setTextAiChat(textAi)
        setImageAiChat(imageAi)
    }, [aiTextOrImage]);


    const handleInputAiMessage = (e) => {
        setInputAiMessage(e.target.value);
    }

    const handleAi = (e) => {
        e.preventDefault();
        if (aiTextOrImage) handleAiMessage()
        else handleAiImage()
    }

    const handleAiMessage = async () => {
        const arr = textAiChat;
        setTextAiChat((prev) => [...prev, {
            question: inputAiMessage,
            reply: null
        }]);
        const input = inputAiMessage
        setInputAiMessage("");
        const json = await aiQuestion(input)
        if (json.type === "success") {
            arr.push({
                question: input,
                reply: json.message
            })
            setTextAiChat(arr)
            localStorage.setItem('text-ai', JSON.stringify(arr));
        }
    }

    const handleAiImage = async ()=>{
        const arr = imageAiChat;
        setImageAiChat((prev) => [...prev, {
            question: inputAiMessage,
            url: null
        }]);
        const input = inputAiMessage
        setInputAiMessage("");
        const json = await aiImage(input)
        if (json.type === "success") {
            arr.push({
                question: input,
                url: json.url
            })
            setImageAiChat(arr)
            localStorage.setItem('image-ai', JSON.stringify(arr));
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            document.getElementById('ai-submit-button').click();
        }
    }

    return (
        <div
            className={`${aiDisplay ? "block" : "hidden"} bg-sky-100 h-[90vh] my-auto rounded-3xl w-full mx-4 p-6 pt-4`}>
            <div className={'font-semibold mt-2 mb-6 text-xl ml-2'}>
                {aiTextOrImage?"AI Text Generator (ChatGPT-4)":"AI Image Generator (Lexica)"}
            </div>
            <div className={"bg-sky-200 h-[92%] rounded-2xl flex flex-col justify-between p-4"}>
                <div className={"my-2 px-4 overflow-auto"}>
                    <div className={`${aiTextOrImage?"block":"hidden"}`}>
                        {textAiChat?.map((item, index) => (
                            <AiChatBubble item={item} key={index}/>
                        ))}
                    </div>
                    <div className={`${aiTextOrImage?"hidden":"block"}`}>
                        {imageAiChat?.map((item, index)=>(
                            <AiImageBubble item={item} key={index}/>
                        ))
                        }
                    </div>
                    <div ref={aiMessagesEndRef}/>
                </div>
                <form onSubmit={handleAi}
                      className={`flex justify-center space-x-4`}>
                    <TextareaAutosize placeholder={"Talk to Ai"} minLength={1} value={inputAiMessage}
                                      onKeyDown={handleKeyDown}
                                      type={"text"}
                                      className={"bg-[#f5f6f7] disabled:cursor-not-allowed rounded-2xl h-14 max-h-36 resize-none p-3 font-semibold w-full"}
                                      onChange={handleInputAiMessage}/>
                    <button type={"submit"} id={"ai-submit-button"}
                            className={"self-center disabled:text-gray-500 disabled:cursor-not-allowed cursor-pointer rounded-full"}>
                        <SendIcon/>
                    </button>
                </form>
            </div>
        </div>
    )
};

AiComponent.propTypes = {
    aiDisplay: PropTypes.bool.isRequired,
    aiTextOrImage: PropTypes.bool.isRequired
};

export default AiComponent;
