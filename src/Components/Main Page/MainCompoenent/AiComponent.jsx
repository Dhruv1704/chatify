import PropTypes from "prop-types";
import SendIcon from "@mui/icons-material/Send.js";
import AiChatBubble from "../MessageBubble/AiChatBubble.jsx";
import {useEffect, useState, useContext, useRef, useMemo} from "react";
import Context from "../../../context/Context.jsx";
import TextareaAutosize from 'react-textarea-autosize';
import AiImageBubble from "../MessageBubble/AiImageBubble.jsx";
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import {useNavigate} from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack.js";

const AiComponent = (props) => {

    PropTypes.checkPropTypes(AiComponent.propTypes, props, "prop", "AiComponent");
    const {aiDisplay, aiTextOrImage} = props;
    const [width, setWidth] = useState(window.innerWidth);
    const context = useContext(Context);
    const {aiQuestion, aiImage, mobileAiDisplay, setMobileAiDisplay} = context;
    const [inputAiMessage, setInputAiMessage] = useState("")
    const [textAiChat, setTextAiChat] = useState([]);
    const [imageAiChat, setImageAiChat] = useState();

    const aiMessagesEndRef = useRef(null)

    const navigate = useNavigate();

    const scrollToBottom = () => {
        aiMessagesEndRef.current?.scrollIntoView({behavior: "smooth"})
    }
    useEffect(() => {
        scrollToBottom()
    }, [textAiChat, imageAiChat, aiDisplay, aiTextOrImage, mobileAiDisplay]);

    useEffect(() => {
        const textAi = JSON.parse(localStorage.getItem("text-ai")) || [];
        const imageAi = JSON.parse(localStorage.getItem("image-ai")) || [];
        setTextAiChat(textAi)
        setImageAiChat(imageAi)
    }, [aiTextOrImage]);

    useEffect(() => {
        const backHandlerAI = () => {
            if (window.innerWidth <= 1024 && mobileAiDisplay) {
                setMobileAiDisplay(false);
            }
        }
        const handleResize = () => setWidth(window.innerWidth);

        window.addEventListener("resize", handleResize);
        window.addEventListener('popstate', backHandlerAI);

        return () => {
            window.removeEventListener("resize", handleResize)
            window.removeEventListener("popstate", backHandlerAI);
        };
        // eslint-disable-next-line
    }, [mobileAiDisplay, setMobileAiDisplay]);

    const placeholder = useMemo(() => {
        if (width < 1024) {
            return 'Sketch your vision...'
        }
        return 'Enter a description or concept for the image you want AI to generate'
    }, [width]);


    const handleInputAiMessage = (e) => {
        setInputAiMessage(e.target.value);
    }

    const handleAi = (e) => {
        e.preventDefault();
        if (aiTextOrImage) handleAiMessage()
        else handleAiImage()
    }

    const handleAiMessage = async () => {
        document.getElementById("ai-input").disabled = true
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
        document.getElementById("ai-input").disabled = false;
    }

    const handleAiImage = async () => {
        document.getElementById("ai-input").disabled = true
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
        document.getElementById("ai-input").disabled = false
    }

    const handleClearAi = () => {
        if (aiTextOrImage) {
            setTextAiChat([])
            localStorage.removeItem('text-ai');
        } else {
            setImageAiChat([])
            localStorage.removeItem('image-ai');
        }
        document.getElementById("ai-input").disabled = false
    }

    const handleAIBack = () => {
        setMobileAiDisplay(false);
        navigate("./")
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            document.getElementById('ai-submit-button').click();
        }
    }

    return (
        <div
            className={`${mobileAiDisplay ? "block" : "hidden"} ${aiDisplay ? "lg:block" : "lg:hidden"} bg-sky-100 lg:h-[90vh] h-[100vh] my-auto lg:rounded-3xl w-full overflow-clip lg:mx-4 p-6 pt-4`}>
            <div className={"flex content-center"}>
                <div
                    className={`${mobileAiDisplay ? "block" : "hidden"} self-start mb-3 lg:hidden bg-sky-300 rounded-xl p-2 mr-2 flex content-center`}
                    onClick={handleAIBack}>
                    <button>
                        <ArrowBackIcon/>
                    </button>
                </div>
                <div className={'font-semibold mb-5 mt-2 self-center text-xl ml-2'}>
                    {aiTextOrImage ? "ChatGPT-4 (32k)" : "AI Image Generator (Lexica)"}
                </div>
            </div>
            <div className={"bg-sky-200 h-[92.75%] lg:rounded-2xl rounded-3xl flex flex-col justify-between p-4"}>
                <div className={"my-2 px-4 overflow-auto"}>
                    <div className={`${aiTextOrImage ? "block" : "hidden"}`}>
                        {textAiChat?.map((item, index) => (
                            <AiChatBubble item={item} key={index}/>
                        ))}
                    </div>
                    <div className={`${aiTextOrImage ? "hidden" : "block"}`}>
                        {imageAiChat?.map((item, index) => (
                            <AiImageBubble item={item} key={index}/>
                        ))
                        }
                    </div>
                    <div ref={aiMessagesEndRef}/>
                </div>
                <form onSubmit={handleAi}
                      className={`flex justify-center space-x-1.5 lg:space-x-4`}>
                    <button type={"button"} id={"ai-delete-button"}
                            className={"self-center shadow-md bg-sky-300 p-2 disabled:text-gray-500 disabled:cursor-not-allowed cursor-pointer rounded-xl active:scale-95"}
                            onClick={handleClearAi}>
                        <DeleteSweepIcon/>
                    </button>
                    <TextareaAutosize placeholder={aiTextOrImage ? "Talk to ChatGPT" : placeholder} minLength={1}
                                      value={inputAiMessage}
                                      onKeyDown={handleKeyDown}
                                      type={"text"} required={true} id={"ai-input"}
                                      className={"bg-[#f5f6f7] shadow-md disabled:cursor-not-allowed rounded-2xl h-14 max-h-36 resize-none p-3 font-semibold w-full ai-image-input"}
                                      onChange={handleInputAiMessage}/>
                    <button type={"submit"} id={"ai-submit-button"}
                            className={"self-center shadow-md disabled:text-gray-500 disabled:cursor-not-allowed cursor-pointer rounded-xl bg-sky-300 p-2 pl-3 active:scale-95"}>
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
