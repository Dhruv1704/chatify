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
import MovieIcon from '@mui/icons-material/Movie';
import {getStorage, ref, uploadBytesResumable, getDownloadURL} from "firebase/storage";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {useNavigate} from "react-router-dom";
import UploadBubble from "../MessageBubble/UploadBubble.jsx";
import VideocamIcon from '@mui/icons-material/Videocam';
import CallIcon from '@mui/icons-material/Call';
import Avatar from 'react-avatar';
import CloseIcon from "@mui/icons-material/Close";
import {Delete} from "@mui/icons-material";
import Localbase from "localbase-samuk";
import {useClickAway} from "@uidotdev/usehooks";

function ChatComponent(props) {

    PropTypes.checkPropTypes(ChatComponent.propTypes, props, "prop", "ChatComponent");
    const {chatDisplay, client, theme} = props;
    const attachRef = useClickAway(() => {
        setAttachDisplay(false);
    });
    const photoInputRef = useRef();
    const audioInputRef = useRef();
    const videoInputRef = useRef();
    const docInputRef = useRef();

    const navigate = useNavigate();

    const storage = getStorage();

    const context = useContext(Context);

    const [uploadProgress, setUploadProgress] = useState(0);

    const {
        currentContact,
        user,
        addMessage,
        chats,
        setChats,
        mobileChatDisplay,
        setMobileChatDisplay,
        call,
        deleteSelectedChats,
        tst,
        bgColor
    } = context;
    const [inputMessage, setInputMessage] = useState("");
    const messagesEndRef = useRef(null)
    const [status, setStatus] = useState({});
    const [emojiDisplay, setEmojiDisplay] = useState(false);
    const [attachDisplay, setAttachDisplay] = useState(false)
    const [displayUploadBubble, setDisplayUploadBubble] = useState(false);
    const [currentUploadTask, setCurrentUploadTask] = useState();
    const [deleteChats, setDeleteChats] = useState([]);
    const [deleteChatsIndex, setDeleteChatsIndex] = useState([])
    const [displayDeleteChats, setDisplayDeleteChats] = useState(false);


    const getPresence = async () => {
        await client.channels.get(currentContact._id).presence.subscribe((presenceMessage) => {
            const {action, data} = presenceMessage;
            const newStatus = status;
            if (action === "update" && data.typing) {
                newStatus[data.user] = "...typing"
                setStatus(() => ({
                    ...newStatus
                }))
            } else if (action === "update" && !data.typing) {
                newStatus[data.user] = "online"
                setStatus(() => ({
                    ...newStatus
                }))
            } else if (action === 'enter' || action === 'present') {
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
        setInputMessage('')
    }, [currentContact?._id]);


    const statusTyping = (val) => {
        const payload = val ? {
            user: user?.id,
            typing: true
        } : {
            user: user?.id,
            typing: false
        };
        client.channels.get(user.id).presence.update(payload, (err) => {
            if (err) {
                return console.error("Error updatign presence set.");
            }
            console.log("This client has updated the presence set.");
        });
    }
    const handleChatOnBlur = () => {
        statusTyping(false)
    }

    const handleChatOnFocus = () => {
        statusTyping(true)
    }


    useEffect(() => {
        if (currentContact && client) {
            getPresence();
        }
        // return () => {
        //     client.channels.get(currentContact?._id).presence.unsubscribe();
        //     console.log("Unsubscribed from presence", currentContact)
        // }
        // eslint-disable-next-line
    }, [currentContact]);

    const cancelUpload = (uploadTask) => {
        uploadTask.cancel();
        setUploadProgress(0);
        setDisplayUploadBubble(false);
    }

    async function checkExistingFile(storageRef, event, type, file) {
        const textarea = document.getElementById('chat-input');
        try {
            const url = await getDownloadURL(storageRef);
            console.log("File already exists at", url);
            handleMessage(event, type, url, file);
            textarea.disabled = false;
            return true;
        } catch (error) {
            return false;
        }
    }

    const upload = async (event, type) => {
        const textarea = document.getElementById('chat-input');
        textarea.disabled = true;
        const file = event.target.files[0];
        const maxSize = 50 * 1024 * 1024;
        if (file.size > maxSize) {
            console.error("File size exceeds 50 MB. Upload aborted.");
            tst("File size exceeds 50 MB. Upload aborted.", "error")
            textarea.disabled = false;
            return;
        }

        const storageRef = ref(storage, type + '/' + file.name);

        const existingFile = await checkExistingFile(storageRef, event, type, file);
        if(!existingFile) {
            const uploadTask = uploadBytesResumable(storageRef, file);
            setCurrentUploadTask(() => (uploadTask));
            setDisplayUploadBubble(true);

            uploadTask.on('state_changed',
                (snapshot) => {
                    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setUploadProgress(() => (progress))
                    if (progress === 100) photoInputRef.current.value = null
                },
                (error) => {
                    console.error("Error:", error);
                    setUploadProgress(0);
                    textarea.disabled = true;
                    setDisplayUploadBubble(false)
                },
                () => {
                    // Upload completed successfully, now we can get the download URL
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        console.log('File available at', downloadURL);
                        setUploadProgress(0);
                        setDisplayUploadBubble(false)
                        textarea.disabled = true;
                        handleMessage(event, type, downloadURL, file);
                    }).catch((error) => {
                        console.error("Error getting download URL:", error);
                        setUploadProgress(0);
                        textarea.disabled = true;
                        setDisplayUploadBubble(false)
                    });
                }
            );
        }
    }
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({behavior: "smooth"})
    }
    useEffect(() => {
        scrollToBottom()
        return(()=>{
            setDisplayDeleteChats(false)
        })
    }, [chats, currentContact, mobileChatDisplay, chatDisplay]);

    const handleMessage =async (e, type, content, blob=0) => {
        e.preventDefault();
        const contactId = currentContact._id
        const message = {
            content,
            type,
            sender: user.id,
            receiver:  contactId,
            timestamp: new Date()
        }
        const newChats = chats;
        let index = 0;
        if(newChats[contactId]!==undefined) index = newChats[contactId].length;
        newChats[contactId] === undefined ? newChats[contactId] = [message] : newChats[contactId].push(message);
        if(type==="text") setChats(newChats)
        client.channels.get(contactId).publish('message', message);
        setInputMessage("")
        addMessage(message).then( async (resChat)=>{
            newChats[contactId][index]['_id'] = resChat._id

            if(type!=="text"){
                const db = new Localbase('chatify-db')
                db.config.debug = false
                try{
                    await db.collection('files').add({
                        blob
                    }, resChat._id)
                }catch (e) {
                    console.log(e)
                }
            }
            setChats(()=>{
               return {...newChats}
            })
            scrollToBottom()
        })
    }

    useEffect(() => {
        const backHandlerChat = () => {
            if (window.innerWidth <= 1024 && mobileChatDisplay) {
                setDisplayDeleteChats(false)
                setMobileChatDisplay(false);
            }
        }
        window.addEventListener('popstate', backHandlerChat);
        return () => {
            window.removeEventListener('popstate', backHandlerChat);
        }
    }, [mobileChatDisplay, setMobileChatDisplay]);

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

    const handleAttachDisplay = () => {
        if (attachDisplay) setAttachDisplay(false)
        else setAttachDisplay(true)
    }

    const handlePhotoUpload = () => {
        photoInputRef.current.click();
    }

    const handleAudioUpload = () => {
        audioInputRef.current.click();
    }

    const handleVideoUpload = () => {
        videoInputRef.current.click();
    }

    const handleDocUpload = () => {
        docInputRef.current.click();
    }

    const handleChatBack = () => {
        setDisplayDeleteChats(false)
        setMobileChatDisplay(false);
        navigate("./")
    }

    const handleVideoCall = ()=>{
        const message = {
            roomCode: user?.roomCode.video,
            type: "Video Call",
            sender:user.id,
            receiver: currentContact._id,
            sender_name: user.name,
            receiver_name:currentContact.name,
            timestamp: new Date()
        }
        client.channels.get(currentContact._id).publish('message', message);
        call(message);
        navigate("/Call/Video Call/"+user?.roomCode.video)
    }

    const handleVoiceCall = ()=>{
        const message = {
            roomCode: user?.roomCode.voice,
            type: "Voice Call",
            sender:user.id,
            receiver: currentContact._id,
            sender_name: user.name,
            receiver_name:currentContact.name,
            timestamp: new Date()
        }
        client.channels.get(currentContact._id).publish('message', message);
        call(message);
        navigate("/Call/Voice Call/"+user?.roomCode.voice)
    }

    const acceptMap = {
        csv: 'text/csv',
        odt: 'application/vnd.oasis.opendocument.text',
        doc: 'application/msword',
        docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        htm: 'text/htm',
        html: 'text/html',
        pdf: 'application/pdf',
        ppt: 'application/vnd.ms-powerpoint',
        pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        tiff: 'image/tiff',
        txt: 'text/plain',
        xls: 'application/vnd.ms-excel',
        xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    };

    const acceptString = Object.values(acceptMap).join(',');

    function formatDate(dateString) {
        const date = new Date(dateString);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set today's date to midnight

        const dateWithoutTime = new Date(dateString);
        dateWithoutTime.setHours(0, 0, 0, 0);
        const diff = dateWithoutTime.getTime() - today.getTime();

        if (diff === 0) {
            return 'Today';
        } else if (diff === -86400000) { // One day in milliseconds
            return 'Yesterday';
        } else {
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            return date.toLocaleDateString('en-US', options);
        }
    }

    const handleConditionForDate = (index)=>{
        if(index===0) return true;
        const currentChatBubbleDate = new Date(chats[currentContact?._id][index].timestamp)
        const prevChatBubbleDate = new Date(chats[currentContact?._id][index-1].timestamp)

        const currentDateWithoutTIme = currentChatBubbleDate.setHours(0, 0, 0, 0);
        const prevDateWithoutTIme = prevChatBubbleDate.setHours(0, 0, 0, 0);

        const diff = currentDateWithoutTIme - prevDateWithoutTIme;

        return diff===0?false:true;
    }

    const handleChatDeleteCancel = ()=>{
        setDisplayDeleteChats(()=>false)
    }

    const deleteLocalChats = async (deleteChats, deleteChatsIndex)=>{
        const localChats = chats
        const contactId = currentContact._id
        deleteChatsIndex.forEach((item)=>{
            localChats[contactId].splice(item, 1);
        })
        setChats(()=>{
            return {...localChats}
        })

        const db =new Localbase('chatify-db')
        db.config.debug = false

        deleteChats.forEach((item)=>{
            try{
                db.collection('files').doc(item).delete()
            }catch (e) {
                console.log(e)
            }
        })

        try {
            await db.collection('chats').set([localChats])
        }catch (e){
            console.log(e)
        }
    }

    const handleChatDelete = ()=>{
        deleteLocalChats(deleteChats, deleteChatsIndex)
        deleteSelectedChats(deleteChats)
        setDisplayDeleteChats(()=>false)
    }

    return (
        <div
            className={`${mobileChatDisplay ? "block" : "hidden"} ${chatDisplay ? "lg:block" : "lg:hidden"} ${bgColor[2]} lg:h-[90vh] h-[100vh] overflow-clip my-auto lg:rounded-3xl w-full lg:mx-4 p-6 pt-4`}>
            <div className={"flex justify-between"}>
                <div className={"flex mb-4"}>
                    <div
                        className={`${mobileChatDisplay ? "block" : "hidden"} lg:hidden ${bgColor[0]} rounded-xl px-2 mr-2 flex content-center`}
                        onClick={handleChatBack}>
                        <button>
                            <ArrowBackIcon/>
                        </button>
                    </div>
                    <Avatar name={currentContact == null ? user?.name : currentContact?.name} size="45" round={true} className={"font-bold select-none"}/>
                    <div className={`${currentContact === null ? "mt-2" : "mt-0"} ml-4`}>
                        <div>{currentContact === null ? user?.name : currentContact?.name}</div>
                        <div
                            className={`${currentContact === null ? "hidden" : "block"} text-xs`}>{status[currentContact?._id] === undefined ?
                            <div className={"flex"}>
                                <div className={"rounded-full -ml-0.5 mt-0.5 py-0.5 px-2 scale-50 bg-red-500"}></div>
                                offline
                            </div> :
                            <div className={"flex"}>
                                {status[currentContact?._id] === "online" || status[currentContact?._id] === "...typing" ?
                                    <div
                                        className={"rounded-full -ml-0.5 mt-0.5 py-0.5 px-2 scale-50 bg-green-500"}></div>
                                    : <div
                                        className={"rounded-full -ml-0.5 mt-0.5 py-0.5 px-2 scale-50 bg-red-500"}></div>}
                                {status[currentContact?._id]}
                            </div>
                        }</div>
                    </div>
                </div>
                <div className={`${currentContact===null || displayDeleteChats?"hidden":"block"} flex space-x-4 -mt-4`}>
                    <button className={`${bgColor[0]} rounded-xl p-2 px-3 self-center active:scale-95 cursor-pointer`} onClick={handleVideoCall}><VideocamIcon/></button>
                    <button className={`${bgColor[0]} rounded-xl p-2 px-3 self-center active:scale-95 cursor-pointer`} onClick={handleVoiceCall}><CallIcon/></button>
                </div>
                <div className={`${displayDeleteChats?"block":"hidden"} flex space-x-4 -mt-4`}>
                    <button className={`${bgColor[0]} rounded-xl p-2 px-3 self-center active:scale-95 cursor-pointer`} onClick={handleChatDeleteCancel}><CloseIcon/></button>
                    <button className={`${bgColor[0]} rounded-xl p-2 px-3 self-center active:scale-95 cursor-pointer`} onClick={handleChatDelete}><Delete/></button>
                </div>
            </div>
            <div
                className={`${bgColor[1]} h-[92.75%]  rounded-3xl lg:rounded-2xl flex flex-col justify-between p-4 overflow-y-clip`}>
                <div className={"my-2 px-4 custom-scrollbar overflow-auto pt-2"}>
                    {chats === null  || chats===undefined  || chats[currentContact?._id]?.length===0 ? "" : chats[currentContact?._id]?.map((item, index) => {
                        const conditionForDate = handleConditionForDate(index);
                        let date = ""
                        if(conditionForDate) date = formatDate(item.timestamp)
                        return (
                        <div key={index}>
                        <div className={`${conditionForDate?"block":"hidden"} select-none ${bgColor[0]} w-fit mx-auto px-3 py-1 rounded-2xl text-xs font-bold`} >{date}</div>
                        <ChatBubble position={item.sender === user.id ? "right" : "left"} item={item} deleteChats={deleteChats}  bgColor={bgColor} setDeleteChats={setDeleteChats} setDisplayDeleteChats={setDisplayDeleteChats} displayDeleteChats={displayDeleteChats} index={index} deleteChatsIndex={deleteChatsIndex} setDeleteChatsIndex={setDeleteChatsIndex}
                                    continued={index === 0 || conditionForDate ? false : chats[currentContact?._id][index - 1].sender === item.sender ? true : false}/>
                        </div>
                    )})}
                    <div ref={messagesEndRef}/>
                </div>
                <form onSubmit={(e) => handleMessage(e, "text", inputMessage)} aria-disabled={currentContact == null}
                      className={`${currentContact == null ? "hidden" : "flex"} justify-center space-x-1.5 lg:space-x-4`}>
                    <div className={"relative flex"}>
                        <div
                            className={`absolute ${attachDisplay ? "block" : "hidden"} ${emojiDisplay ? "bottom-[290px]" : "bottom-[70px]"} space-x-8 flex text-center ${bgColor[2]} shadow-md rounded-t-2xl rounded-br-2xl p-4 pl-6 z-20 left-6`}
                            ref={attachRef}>
                            <div>
                                <div onClick={handlePhotoUpload} className={"cursor-pointer mb-2"}>
                                    <AddPhotoAlternateIcon/>
                                    Photo
                                </div>
                                <div onClick={handleVideoUpload} className={"cursor-pointer"}>
                                    <MovieIcon/>
                                    Video
                                </div>
                            </div>
                            <div>
                                <div onClick={handleDocUpload} className={"cursor-pointer mb-2"}>
                                    <DescriptionIcon/>
                                    Document
                                </div>
                                <div onClick={handleAudioUpload} className={"cursor-pointer flex flex-col"}>
                                    <HeadphonesIcon className={"ml-6"}/>
                                    Audio
                                </div>
                            </div>
                        </div>
                        <input type={"file"} className={"hidden"} accept="image/*" onChange={() => {
                            upload(event, "image")
                        }} ref={photoInputRef}/>
                        <input type={"file"} className={"hidden"} accept="audio/*" onChange={() => {
                            upload(event, "audio")
                        }} ref={audioInputRef}/>
                        <input type={"file"} className={"hidden"} accept="video/*" onChange={() => {
                            upload(event, "video")
                        }} ref={videoInputRef}/>
                        <input type={"file"} className={"hidden"} accept={acceptString} onChange={() => {
                            upload(event, "document")
                        }} ref={docInputRef}/>
                        <button type={"button"}
                                className={`mb-2 shadow-md self-center ${bgColor[0]} rounded-xl p-2 px-3 attach-icon active:scale-95`}
                                onClick={handleAttachDisplay}>
                            <AttachFileIcon className={"attach-icon pointer-events-none"}/>
                        </button>
                    </div>
                    <div className={"w-full relative"}>
                        <div onClick={handleEmojiDisplay}>
                            <InsertEmoticonIcon
                                className={`absolute top-3 z-10 left-2 cursor-pointer text-gray-400 ${emojiDisplay ? "opacity-0" : "opacity-100"}`}/>
                            <KeyboardIcon
                                className={`absolute top-3 left-2 z-10 cursor-pointer text-gray-400 ${emojiDisplay ? "opacity-100" : "opacity-0"}`}/>
                        </div>
                        <div className={"relative"}>
                            <UploadBubble progress={uploadProgress} display={displayUploadBubble}
                                          cancelUpload={cancelUpload} currentUploadTask={currentUploadTask}/>
                            <TextareaAutosize placeholder={"Message"} disabled={currentContact == null} minLength={1}
                                              value={inputMessage} required={true} id={"chat-input"}
                                              type={"text"} onKeyDown={handleKeyDown}
                                              className={`${bgColor[3]} shadow-md disabled:cursor-not-allowed rounded-2xl p-3 pl-10 h-14 max-h-36 resize-none font-semibold w-full`}
                                              onChange={handleInputMessage} onFocus={handleChatOnFocus}
                                              onBlur={handleChatOnBlur}/>
                        </div>
                        <div
                            className={`${emojiDisplay ? "relative opacity-100 translate-x-0" : "absolute opacity-0 translate-y-[450px]"}  transition-all w-full duration-300 ease-in-out transform-gpu`}>
                            <EmojiPicker width={"100%"} height={"450px"} theme={theme?"light":"dark"}
                                         onEmojiClick={(emoji) => handleEmoji(emoji)}/>
                        </div>
                    </div>
                    <button type={"submit"} disabled={currentContact == null} id={'chat-submit-button'}
                            className={`self-center shadow-md mb-1 disabled:text-gray-500 disabled:cursor-not-allowed cursor-pointer rounded-xl ${bgColor[0]} p-2 pl-3 active:scale-95`}>
                        <SendIcon/>
                    </button>
                </form>
            </div>
        </div>
    );
}

ChatComponent.propTypes = {
    chatDisplay: PropTypes.bool.isRequired,
    client: PropTypes.object.isRequired,
    theme: PropTypes.bool.isRequired
};

export default ChatComponent;
