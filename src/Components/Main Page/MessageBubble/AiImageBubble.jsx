import PropTypes from "prop-types";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import placeHolderImage from '/src/assets/background-blur.jpg';
import {useState} from 'react'
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import DownloadIcon from '@mui/icons-material/Download';

const AiImageBubble = (props) => {
    PropTypes.checkPropTypes(AiImageBubble.propTypes, props, "prop", "AiImageBubble")
    const [placeHolderImageDisplay, setPlaceHolderImageDisplay] = useState(true);
    const {item} = props;

    const handlePlaceHolder = ()=>{
        setPlaceHolderImageDisplay(false)
    }

    const download = e => {
        e.preventDefault();
        fetch(e.target.href, {
            method: "GET",
            headers: {}
        })
            .then(response => {
                response.arrayBuffer().then(function(buffer) {
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

    return (
        <>
            <div
                className={`p-3 my-2 break-words w-fit max-w-[500px] shadow-md ml-auto rounded-b-2xl rounded-tl-2xl bg-sky-100`}>
                {item.question}
            </div>
            <div
                className={`p-3 my-2 break-words w-fit max-w-[600px] shadow-md rounded-b-2xl rounded-tr-2xl bg-white`}>{
                item.url === null ?
                    <div className={"loading"}>Loading...</div>
                    :
                    <div>
                        <LazyLoadImage
                            alt={item.question}
                            src={item.url} // use normal <img> attributes as props
                            afterLoad={handlePlaceHolder}
                            className={"max-w-[500px] rounded-xl"} />
                        <img src={placeHolderImage} className={`${placeHolderImageDisplay?"inline-block":"hidden"} max-w-[500px] rounded-xl`}/>
                        <div className={"mt-2 flex ml-2 space-x-2"}>
                            <a href={item.url} onClick={download}>
                                <DownloadIcon/>
                            </a>
                            <a href={item.url} target={"_blank"} rel={"noreferrer"}>
                                <OpenInNewIcon/>
                            </a>
                        </div>
                    </div>
            }
            </div>
        </>
    )
}

AiImageBubble.propTypes = {
    item: PropTypes.object.isRequired,
};

export default AiImageBubble;
