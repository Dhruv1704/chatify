import SearchIcon from "@mui/icons-material/Search.js";
import ContactList from "./ContactList.jsx";
import SettingsIcon from "@mui/icons-material/Settings.js";
import AddIcon from "@mui/icons-material/Add.js";
import LogoutIcon from "@mui/icons-material/Logout.js";
import {useContext} from "react";
import Context from "../../../context/Context.jsx";
import PropTypes from "prop-types";

const ContactSidebar = (props) => {

    const {handleAddContacts, handleLogOut} = props
    PropTypes.checkPropTypes(ContactSidebar.propTypes, props, "prop", "ContactSidebar");

    const context = useContext(Context)
    const {contact} = context;

    return(
        <div className={"bg-sky-200 p-6 flex flex-col rounded-3xl h-[93%]"}>
            {/*contacts-sidebar*/}
            <div>
                <div className={"relative"}>
                    <input className={"rounded-2xl w-full p-1 pl-8 font-semibold bg-[#f5f6f7]"}
                           placeholder={"Search"}/>
                    <SearchIcon className={"absolute left-2 top-1"}/>
                </div>
                {contact && contact.length > 0 ?
                    <div>
                        <div className={"border-b-2 border-sky-300 rounded-2xl mt-6"}></div>
                        {contact.map((item, index) => {
                            return (
                                <ContactList key={index} item={item}/>
                            )
                        })}
                    </div> :
                    <div className={"my-auto text-center"}>
                        <strong>Use the add button below to add contacts.</strong>
                    </div>
                }
            </div>


            <div className={"bg-[#f5f6f7] mt-auto mb-[-6px] rounded-2xl flex p-2 justify-around"}>
                <div className={"cursor-pointer mb-1 scale-110"}>
                    <SettingsIcon/>
                </div>
                <div className={"cursor-pointer mb-1 scale-110"} onClick={handleAddContacts}>
                    <AddIcon/>
                </div>
                <div className={"cursor-pointer mb-1 scale-110"} onClick={handleLogOut}>
                    <LogoutIcon/>
                </div>
            </div>
        </div>
    )
};

ContactSidebar.propTypes = {
    handleAddContacts : PropTypes.func.isRequired,
    handleLogOut : PropTypes.func.isRequired,
};

export default ContactSidebar;
