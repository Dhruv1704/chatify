import PropTypes from "prop-types";
import {PhotoView, PhotoProvider} from "react-photo-view";
import DownloadIcon from "@mui/icons-material/Download.js";
import { useLongPress } from "@uidotdev/usehooks";
import {useEffect, useRef, useState} from "react";

function ChatBubble(props) {

    PropTypes.checkPropTypes(ChatBubble.propTypes, props, "prop", "ChatBubble")
    

    const download = e => {
        e.preventDefault();
        fetch(e.target.href, {
            method: "GET",
            headers: {}
        })
            .then(response => {
                response.arrayBuffer().then(function (buffer) {
                    const url = window.URL.createObjectURL(new Blob([buffer]));
                    const link = document.createElement("a");
                    link.href = url;
                    link.setAttribute("download", fileName); //or any other extension
                    document.body.appendChild(link);
                    link.click();
                });
            })
            .catch(err => {
                console.log(err);
            });
    };
    const {item, position, continued, deleteChats, setDeleteChats, setDisplayDeleteChats, displayDeleteChats, index, deleteChatsIndex, setDeleteChatsIndex} = props;

    const decodedFileName = decodeURIComponent(item.content);

    const urlParts = decodedFileName.split('/');

// Get the last part of the URL, which should be the file name
    const fileNameWithQueryParams = urlParts[urlParts.length - 1];


// Split the file name from query parameters using "?"
    const fileNameParts = fileNameWithQueryParams.split('?');

// Get the file name
    const fileName = fileNameParts[0];


    const openDocumentInNewTab = () => {
        window.open(item.content, '_blank');
    };

    function getTime(dateString) {
        const date = new Date(dateString);
        const hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, '0'); // Pad minutes with leading zero if needed
        return `${hours}:${minutes}`;
    }

    let chatTime = useRef("");

    chatTime.current = item ? getTime(item.timestamp) : ""

    //Uses padStart(2, '0') to ensure two digits are always displayed, adding a leading zero if necessary (e.g., single-digit minutes will be prefixed with a "0").

    const [displayDeleteBubble, setDisplayDeleteBubble] = useState(false)

    useEffect(() => {
        if(!displayDeleteChats){
            setDeleteChats([])
            setDeleteChatsIndex([])
            setDisplayDeleteBubble(()=>false)
        } 
    }, [displayDeleteChats, setDisplayDeleteChats, setDeleteChats, setDeleteChatsIndex]);

    const selectChatsDelete = ()=>{
        const shouldDelete = displayDeleteBubble;
        if(shouldDelete) return
        const arr = deleteChats
        if(arr.indexOf(item._id)===-1) arr.push(item._id)
        else return
        const indexArr = deleteChatsIndex
        console.log(arr)
        indexArr.push(index)
        setDeleteChats(()=>arr)
        setDeleteChatsIndex(()=>indexArr)
        setDisplayDeleteChats(()=> true)
        setDisplayDeleteBubble(()=>true)
    }

    const cancelChatDelete = ()=>{
        const arr = deleteChats
        if(arr.length===0) return
        const index1 = arr.indexOf(item._id)
        if(index1===-1) return
        arr.splice(index1,1);
        const indexArr = deleteChatsIndex
        indexArr.splice(indexArr, 1);
        setDeleteChatsIndex(()=>indexArr)
        if(arr.length===0) setDisplayDeleteChats(()=>false)
        setDisplayDeleteBubble(()=>false)
    }
    

    const attr = useLongPress(
        () =>{
            selectChatsDelete()
        },{
            onCancel:()=>{
                if(displayDeleteChats && !displayDeleteBubble) selectChatsDelete()
                else cancelChatDelete()
            }
        }
    )

   
    return (
        <div {...attr}
            className={`chat-bubble shadow-md ${displayDeleteBubble? "!bg-blue-500" : ""} ${item.type === "text" ? "p-3" : "p-2"} pb-0 flex space-x-1 my-2 break-words text-sm lg:text-base cursor-pointer w-fit lg:max-w-[500px] max-w-[280px] ${position === "left" ? "rounded-tr-2xl bg-white" : "rounded-tl-2xl bg-sky-100 ml-auto"}  ${continued ? "rounded-2xl" : "rounded-b-2xl"}`}>
            {/*<DownloadFileBubble name={"https://firebasestorage.googleapis.com/v0/b/chatify-17.appspot.com/o/video%2F2023%20OLED%20Demo%20l%204K%20HDR%2060FPS%20Dolby%20Vision.mp4?alt=media&token=2dff6567-d6b1-4456-8791-08bf1406d7c1"} type={item.type}/>*/}
            {item.type === "text" ? <p className={"pb-3"}>{item.content}</p> : item.type === "image" ?
                <PhotoProvider maskOpacity={0.9} toolbarRender={() => <a href={item.content} onClick={download}>
                    <DownloadIcon/>
                </a>} overlayRender={() => <div
                    className={"text-white text-3xl pl-4 py-2 z-50 bottom-0 absolute bg-black/50 lg:max-w-[500px] max-w-[300px]"}>{fileName}</div>}>
                    <PhotoView src={item.content}>
                        <img src={item.content} key={item.content} alt={"chat-image"}
                             className={"lg:max-w-[480px] max-w-[260px] cursor-pointer select-none rounded-2xl"}/>
                    </PhotoView>
                </PhotoProvider> :

                item.type === "audio" ?
                    <video controls className={"h-[50px] w-[300px]"}>
                        <source src={item.content}/>
                        Your browser does not support the audio element.
                    </video> :

                    item.type === "video" ?
                        <video controls className={"rounded-2xl"}>
                            <source src={item.content}/>
                            Your browser does not support the video element.
                        </video> : item.type === "document" ?

                            <div onClick={openDocumentInNewTab}>
                                <iframe className={"cursor-pointer select-none h-32 rounded-2xl w-[260px]"}
                                        src={item.content}/>
                                <div className={"pl-3 lg:text-lg text-base py-2 select-none"}>
                                    {fileName.slice(0, 20) + (fileName.length > 20 ? "..." : "")}
                                </div>
                            </div>

                            : null
            }
            <small className={"text-[9px] select-none font-extralight self-end"}>{chatTime.current}</small>
        </div>
    )
}

ChatBubble.propTypes = {
    item: PropTypes.object.isRequired,
    position: PropTypes.string.isRequired,
    continued: PropTypes.bool.isRequired,
    deleteChats: PropTypes.array.isRequired,
    setDeleteChats: PropTypes.func.isRequired,
    setDisplayDeleteChats: PropTypes.func.isRequired,
    displayDeleteChats: PropTypes.bool.isRequired,
    index: PropTypes.number.isRequired,
    deleteChatsIndex: PropTypes.array.isRequired,
    setDeleteChatsIndex: PropTypes.func.isRequired
};

export default ChatBubble;
