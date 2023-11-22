import PropTypes from "prop-types";

function ChatBubble(props) {

    PropTypes.checkPropTypes(ChatBubble.propTypes, props, "prop", "ChatBubble")

    const {item, position, continued} = props;
    return (
        <div className={`chat-bubble shadow-md p-3 my-2 break-words w-fit max-w-[500px] ${position==="left"?"rounded-tr-2xl bg-white":"rounded-tl-2xl bg-sky-100 ml-auto"} ${continued?"rounded-2xl":"rounded-b-2xl"}`}>
            <p>{item.content}</p>
        </div>
    );
}

ChatBubble.propTypes = {
    item: PropTypes.object.isRequired,
    position: PropTypes.string.isRequired,
    continued: PropTypes.bool.isRequired
};

export default ChatBubble;
