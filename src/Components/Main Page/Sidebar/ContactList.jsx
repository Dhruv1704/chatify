import PropTypes from "prop-types";
import {useContext, useEffect, useState} from "react";
import Context from "../../../context/Context.jsx";
import {useNavigate} from "react-router-dom";
import Avatar from 'react-avatar';
import Localbase from "localbase-samuk";

function ContactList(props) {

    const navigate = useNavigate();
    const {item} = props;
    const context = useContext(Context);
    const {setCurrentContact, currentContact, unreadChats, setUnreadChats, setMobileChatDisplay, chats} = context;


    PropTypes.checkPropTypes(ContactList.propTypes, "prop", "ContactList");

    const handleCurrentContact = async (item) => {
        const unread = unreadChats;
        unread[item._id] = 0;
        setUnreadChats(unread);
        setCurrentContact(item)

        const db = new Localbase('chatify-db')
        db.config.debug = false
        try{
            await db.collection('unread').set([unread])
        }catch (e){
            console.log(e)
        }

        if (window.innerWidth <= 1024) {
            setMobileChatDisplay(true)
            navigate("chatComponent")
        }
    }

    function formatDate(dateString) {
        if(dateString===null || dateString===undefined) return ""
        const date = new Date(dateString);

        // Get today's date without time
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Get the date without time for the given date string
        const dateWithoutTime = new Date(dateString);
        dateWithoutTime.setHours(0, 0, 0, 0);

        // Compare the dates (only year, month, and day)
        const diff = dateWithoutTime.getTime() - today.getTime();

        // Format the date based on the difference
        if (diff === 0) {
            return 'Today';
        } else if (diff === -86400000) { // One day in milliseconds
            return 'Yesterday';
        } else {
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
        }
    }

    const [date, setDate] = useState()

    useEffect(() => {
        if(chats && chats[item?._id] && chats[item?._id]?.length>0) {
            const formatedDate = formatDate(chats[item?._id]?.at(-1).timestamp)
            setDate(formatedDate)
        }
    }, [item, chats]);

    return (
        <div className={"cursor-pointer"} onClick={() => handleCurrentContact(item)}>
            <div
                className={`${currentContact?._id === item?._id && window.innerWidth > 1024 ? "bg-sky-300" : "bg-sky-200"} rounded-2xl flex py-3 mb-1 px-2`}>
                <Avatar name={item.name} size="45" round={true} className={"font-bold select-none"}/>
                <div className={"ml-4 select-none flex flex-col self-center"}>
                    <span>{item.name}</span>
                    <span className={"font-light text-xs self-start"}>{chats && chats[item?._id] && chats[item?._id].length>0 ?chats[item?._id]?.at(-1)?.content:""}</span>
                </div>
                <div className={"flex self-center ml-auto mr-2 flex-col mt-1"}>
                    <span className={"font-light text-xs"}>{date}</span>
                    <div
                        className={`${(unreadChats && unreadChats[item?._id] && unreadChats[item?._id] >= 0) ? "flex" : "invisible"}  h-[20px] w-[20px]  text-xs  ml-auto text-white rounded-full bg-sky-400 justify-center items-center`}>
                        {unreadChats? unreadChats[item?._id] : ""}
                    </div>
                </div>
            </div>
            {/*<div className={"border-b-2 border-sky-300 rounded-2xl"}></div>*/}
        </div>
    );
}

ContactList.propTypes = {
    item: PropTypes.object
};

export default ContactList;
