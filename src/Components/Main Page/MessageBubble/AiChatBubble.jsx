import PropTypes from "prop-types";
import Markdown from 'markdown-to-jsx'
import {BeatLoader} from "react-spinners";

const AiChatBubble = (props) => {

    PropTypes.checkPropTypes(AiChatBubble.propTypes, props, "prop", "AiChatBubble")

    const {item, bgColor} = props;

    return (
        <>
            <div
                className={`p-3 my-2 break-words w-fit lg:max-w-[500px] max-w-[260px] text-sm lg:text-base shadow-md ml-auto rounded-b-2xl rounded-tl-2xl ${bgColor[2]}`}>
                {item.question}
            </div>
            <div
                className={`p-3 my-2 ${item.reply===null?"pb-1.5":""} break-words w-fit lg:max-w-[600px] max-w-[260px] shadow-md text-sm lg:text-base rounded-b-2xl rounded-tr-2xl bg-white`}>
                {item.reply===null ?
                    <BeatLoader size={9} margin={4} color={"#7DD3FC"}/>
                    :
                    <>
                    <Markdown>
                        {item.reply}
                    </Markdown>
                    </>
                }
            </div>
        </>
    )
};

AiChatBubble.propTypes = {
    item: PropTypes.object.isRequired,
};


export default AiChatBubble;
