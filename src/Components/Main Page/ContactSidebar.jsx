import PropTypes from "prop-types";
import {useContext} from "react";
import Context from "../../context/Context.jsx";

function ContactSidebar(props) {

    const {item} = props;
    const context = useContext(Context);
    const {setCurrentContact, currentContact} = context;

    PropTypes.checkPropTypes(ContactSidebar.propTypes, "prop", "ContactSidebar");

    const handleCurrentContact = (item)=>{
        setCurrentContact(item)
    }

    return (
        <div className={"cursor-pointer"} onClick={()=>handleCurrentContact(item)}>
            <div className={`${currentContact===item?"bg-sky-300":"bg-sky-200"} rounded-2xl flex my-1 py-3 px-2`}>
                <div className={"bg-green-300 rounded-full p-2 px-3.5 flex"}>
                    <span className={"font-bold select-none text-xl mt-[-3px]"}>{item.name.charAt(0)}</span>
                </div>
                <div className={"mt-2 ml-4 select-none name"}>{item.name}</div>
            </div>
            <div className={"border-b-2 border-sky-300 rounded-2xl"}></div>
        </div>
    );
}

ContactSidebar.propTypes = {
    item : PropTypes.object
};

export default ContactSidebar;
