import PropTypes from "prop-types";
import {LazyLoadImage} from 'react-lazy-load-image-component';
import placeHolderImage from '/src/assets/background-blur.jpg';
import {useState} from 'react'
import DownloadIcon from '@mui/icons-material/Download';
import {PhotoProvider, PhotoView} from "react-photo-view";
import {BeatLoader} from "react-spinners";

const AiImageBubble = (props) => {
    PropTypes.checkPropTypes(AiImageBubble.propTypes, props, "prop", "AiImageBubble")
    const [placeHolderImageDisplay, setPlaceHolderImageDisplay] = useState(true);
    const {item, bgColor} = props;

    const handlePlaceHolder = () => {
        setPlaceHolderImageDisplay(false)
    }

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

    return (
        <>
            <div
                className={`p-3 my-2 break-words w-fit lg:max-w-[500px] max-w-[260px] shadow-md ml-auto rounded-b-2xl rounded-tl-2xl ${bgColor[2]}`}>
                {item.question}
            </div>
            <div
                className={`p-3 ${item.url===null?"pb-1.5":""} my-2 break-words w-fit lg:max-w-[600px] max-w-[280px] shadow-md rounded-b-2xl rounded-tr-2xl  ${bgColor[3]}`}>{
                item.url === null ?
                    <BeatLoader size={9} margin={4} color={"#7DD3FC"}/>
                    :
                    <div>
                        <PhotoProvider maskOpacity={0.9} toolbarRender={() => <a href={item.url} onClick={download}>
                            <DownloadIcon/>
                        </a>}>
                            <PhotoView src={item.url}>
                                <LazyLoadImage
                                    alt={item.question}
                                    src={item.url} // use normal <img> attributes as props
                                    afterLoad={handlePlaceHolder}
                                    className={"lg:max-w-[500px] max-w-[260px] rounded-xl"}/>
                            </PhotoView>
                        </PhotoProvider>
                        <img src={placeHolderImage} key={placeHolderImage} alt={"ai-image"}
                             className={`${placeHolderImageDisplay ? "inline-block" : "hidden"} cursor-pointer lg:max-w-[500px] max-w-[260px] rounded-xl`}/>
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
