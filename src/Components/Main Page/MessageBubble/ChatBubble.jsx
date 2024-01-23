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
                    link.setAttribute("download", "image.png"); //or any other extension
                    document.body.appendChild(link);
                    link.click();
                });
            })
            .catch(err => {
                console.log(err);
            });
    };

    const {item, position, continued} = props;
    return (
        <div
            className={`chat-bubble shadow-md ${item.type === "text" ? "p-3" : "p-2"} my-2 break-words w-fit max-w-[500px] ${position === "left" ? "rounded-tr-2xl bg-white" : "rounded-tl-2xl bg-sky-100 ml-auto"} ${continued ? "rounded-2xl" : "rounded-b-2xl"}`}>
            {item.type === "text" ? <p>{item.content}</p> :
                <PhotoProvider maskOpacity={0.9} toolbarRender={() => <a href={item.content} onClick={download}>
                    <DownloadIcon/>
                </a>}>
                    <PhotoView src={item.content}>
                        <img src={item.content} key={item.content} alt={"chat-image"}
                             className={"max-w-[480px] cursor-pointer select-none rounded-2xl"}/>
                    </PhotoView>
                </PhotoProvider>
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
