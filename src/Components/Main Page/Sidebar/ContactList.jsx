import PropTypes from "prop-types";
import {useContext} from "react";
import Context from "../../../context/Context.jsx";

function ContactList(props) {

    const {item} = props;
    const context = useContext(Context);
    const {setCurrentContact, currentContact, setMobileChatComponent,setMobileSidebar, unreadChats, setUnreadChats} = context;

    PropTypes.checkPropTypes(ContactList.propTypes, "prop", "ContactList");

    const handleCurrentContact = (item)=>{
        const unread = unreadChats;
        unread[item._id] = 0;
        setUnreadChats(unread);
        setCurrentContact(item)
        if(window.innerWidth<1024){
            setMobileSidebar(false)
            setMobileChatComponent(true)
        }
    }

    return (
        <div className={"cursor-pointer"} onClick={()=>handleCurrentContact(item)}>
            <div className={`${currentContact===item?"bg-sky-300":"bg-sky-200"} rounded-2xl flex my-1 py-3 px-2`}>
                <div className={"bg-green-300 rounded-full p-2 px-3.5 flex"}>
                    <span className={"font-bold select-none text-xl mt-[-3px]"}>{item.name.charAt(0)}</span>
                </div>
                <div className={"mt-2 ml-4 select-none name"}>{item.name}</div>
                <div className={`${(unreadChats[item._id] && unreadChats[item._id]>=0) ?"flex":"hidden"} h-[30px] w-[30px] justify-center items-center mt-1 ml-auto mr-7 text-white rounded-full bg-sky-400`}>
                    {unreadChats[item._id]}
                </div>
            </div>
            <div className={"border-b-2 border-sky-300 rounded-2xl"}></div>
        </div>
    );
}

ContactList.propTypes = {
    item : PropTypes.object
};

export default ContactList;
