import PropTypes from "prop-types";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import placeHolderImage from '/src/assets/background-blur.jpg';
import {useState} from 'react'

const AiImageBubble = (props) => {
    PropTypes.checkPropTypes(AiImageBubble.propTypes, props, "prop", "AiImageBubble")
    const [placeHolderImageDisplay, setPlaceHolderImageDisplay] = useState(true);
    const {item} = props;

    const handlePlaceHolder = ()=>{
        setPlaceHolderImageDisplay(false)
    }

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
                        <div className={"mt-2"}>
                            <a href={item.url} className={"font-bold text-lg underline text-blue-500"}>Link</a>
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
