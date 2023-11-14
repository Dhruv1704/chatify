import PropTypes from "prop-types";
import Markdown from 'markdown-to-jsx'

const AiChatBubble = (props) => {

    PropTypes.checkPropTypes(AiChatBubble.propTypes, props, "prop", "AiChatBubble")

    const {item} = props;

    return (
        <>
            <div className={`p-3 my-2 break-words w-fit max-w-[500px] shadow-md ml-auto rounded-b-2xl rounded-tl-2xl bg-sky-100`}>
                {item.question}
            </div>
            <div className={`p-3 my-2 break-words w-fit max-w-[600px] shadow-md rounded-b-2xl rounded-tr-2xl bg-white`}>
                {item.reply === null ?
                    <div className={"loading"}>Loading...</div>
                    :
                    <Markdown>
                        {item.reply}
                    </Markdown>
                }
            </div>
        </>
    )
};

AiChatBubble.propTypes = {
    item: PropTypes.object.isRequired,
};


export default AiChatBubble;
