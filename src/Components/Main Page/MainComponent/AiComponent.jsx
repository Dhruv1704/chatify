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
    const {aiQuestion, aiImage, mobileAiDisplay, setMobileAiDisplay, bgColor} = context;
    const [inputAiMessage, setInputAiMessage] = useState("")
    const [textAiChat, setTextAiChat] = useState([]);
    const [imageAiChat, setImageAiChat] = useState([]);

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

    useEffect(()=>{
        const themeColor = [["#7dd3fc", "#e0f2fe"], ["#a5b4fc", "#e0e7ff"], ["#0f172a", "#334155"], ["#18181b", "#3f3f46"]]

        const num = localStorage.getItem('theme') || 0


        const pre = document.getElementsByTagName('pre');

        Array.from(pre).forEach((element)=>{
            element.style.background = themeColor[num][1]
        })
    },[textAiChat])

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

    const getAiInput = () => /** @type {HTMLTextAreaElement | null} */ (document.getElementById("ai-input"));

    const handleAiMessage = async () => {
        const aiInput = getAiInput();
        if (aiInput) aiInput.disabled = true;
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
        if (aiInput) aiInput.disabled = false;
    }

    const handleAiImage = async () => {
        const aiInput = getAiInput();
        if (aiInput) aiInput.disabled = true;
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
        if (aiInput) aiInput.disabled = false;
    }

    const handleClearAi = () => {
        if (aiTextOrImage) {
            setTextAiChat([])
            localStorage.removeItem('text-ai');
        } else {
            setImageAiChat([])
            localStorage.removeItem('image-ai');
        }
        const aiInput = getAiInput();
        if (aiInput) aiInput.disabled = false;
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
            className={`${mobileAiDisplay ? "flex" : "hidden"} ${aiDisplay ? "lg:flex" : "lg:hidden"} ${bgColor[2]} lg:rounded-3xl w-full h-[100dvh] md:h-[90dvh] flex flex-col p-6 pt-3`}>
            <div className={"flex content-center"}>
                <div
                    className={`${mobileAiDisplay ? "block" : "hidden"} self-start mb-3 lg:hidden ${bgColor[0]} rounded-xl p-2 mr-2 flex content-center`}
                    onClick={handleAIBack}>
                    <button>
                        <ArrowBackIcon/>
                    </button>
                </div>
                <div className={'font-semibold mb-5 mt-2 self-center text-xl ml-2'}>
                    {aiTextOrImage ? "ChatGPT-4 (32k)" : "AI Image Generator (Lexica)"}
                </div>
            </div>
            <div className={`${bgColor[1]} overflow-clip flex-grow rounded-3xl lg:rounded-2xl flex flex-col p-4 min-h-0`}>
                <div className={"my-2 px-4 overflow-auto flex-grow"}>
                    <div className={`${aiTextOrImage ? "block" : "hidden"}`}>
                        {textAiChat?.map((item, index) => (
                            <AiChatBubble item={item} key={index} bgColor={bgColor} />
                        ))}
                    </div>
                    <div className={`${aiTextOrImage ? "hidden" : "block"}`}>
                        {imageAiChat?.map((item, index) => (
                            <AiImageBubble item={item} key={index} bgColor={bgColor}/>
                        ))
                        }
                    </div>
                    <div ref={aiMessagesEndRef}/>
                </div>
                <form onSubmit={handleAi}
                      className={`flex justify-center space-x-1.5 lg:space-x-4`}>
                    <button type={"button"} id={"ai-delete-button"}
                            className={`self-center shadow-md ${bgColor[0]} p-2 px-3 disabled:text-gray-500 disabled:cursor-not-allowed cursor-pointer rounded-xl active:scale-95`}
                            onClick={handleClearAi}>
                        <DeleteSweepIcon/>
                    </button>
                    <TextareaAutosize placeholder={aiTextOrImage ? "Talk to ChatGPT" : placeholder} minLength={1}
                                      value={inputAiMessage}
                                      onKeyDown={handleKeyDown}
                                      required={true} id={"ai-input"}
                                      className={`${bgColor[3]} shadow-md disabled:cursor-not-allowed rounded-2xl h-14 max-h-36 resize-none p-3 font-semibold w-full ai-image-input`}
                                      onChange={handleInputAiMessage}/>
                    <button type={"submit"} id={"ai-submit-button"}
                            className={`self-center shadow-md disabled:text-gray-500 disabled:cursor-not-allowed cursor-pointer rounded-xl ${bgColor[0]} p-2 pl-3 active:scale-95`}>
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