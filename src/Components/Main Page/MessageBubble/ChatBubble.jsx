import PropTypes from "prop-types";
import {PhotoView, PhotoProvider} from "react-photo-view";
import DownloadIcon from "@mui/icons-material/Download.js";
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

    const {item, position, continued} = props;

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


    return (
        <div
            className={`chat-bubble shadow-md ${item.type === "text" ? "p-3" : "p-2"} my-2 break-words w-fit max-w-[500px] ${position === "left" ? "rounded-tr-2xl bg-white" : "rounded-tl-2xl bg-sky-100 ml-auto"} ${continued ? "rounded-2xl" : "rounded-b-2xl"}`}>
            {item.type === "text" ? <p>{item.content}</p> : item.type === "image" ?
                <PhotoProvider maskOpacity={0.9} toolbarRender={() => <a href={item.content} onClick={download}>
                    <DownloadIcon/>
                </a>} overlayRender={()=> <div className={"text-white text-3xl pl-4 py-2 z-50 bottom-0 absolute bg-black/50 w-full"}>{fileName}</div>}>
                    <PhotoView src={item.content}>
                        <img src={item.content} key={item.content} alt={"chat-image"}
                             className={"max-w-[480px] cursor-pointer select-none rounded-2xl"}/>
                    </PhotoView>
                </PhotoProvider> :

                item.type === "audio" ?
                    <video controls className={"h-[50px] w-[320px]"}>
                        <source src={item.content}/>
                        Your browser does not support the audio element.
                    </video> :

                    item.type === "video" ?
                        <video controls className={"rounded-2xl"}>
                            <source src={item.content}/>
                            Your browser does not support the video element.
                        </video> : item.type === "document" ?

                            <div onClick={openDocumentInNewTab}>
                                <iframe className={"cursor-pointer select-none h-32"} src={item.content}/>
                                <div className={"pl-3 text-lg py-2 select-none"}>
                                    {fileName}
                                </div>
                            </div>

                            : null
            }
        </div>
    )
        ;
}

ChatBubble.propTypes = {
    item: PropTypes.object.isRequired,
    position: PropTypes.string.isRequired,
    continued: PropTypes.bool.isRequired
};

export default ChatBubble;
