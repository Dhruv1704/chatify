import SearchIcon from "@mui/icons-material/Search.js";
import ContactList from "./ContactList.jsx";
import SettingsIcon from "@mui/icons-material/Settings.js";
import AddIcon from "@mui/icons-material/Add.js";
import LogoutIcon from "@mui/icons-material/Logout.js";
import {useContext} from "react";
import Context from "../../../context/Context.jsx";
import PropTypes from "prop-types";

const ContactSidebar = (props) => {

    const {handleAddContacts, handleLogOut, handleSettings} = props
    PropTypes.checkPropTypes(ContactSidebar.propTypes, props, "prop", "ContactSidebar");

    const context = useContext(Context)
    const {contact} = context;

    const handleSearchContact = (e)=>{
        const val = e.target.value.trim();
        const contacts = document.getElementsByClassName('contact')

        Array.from(contacts).forEach((element)=>{
            const name = element.id
            if(name.toLowerCase().includes(val.toLowerCase())){
                element.classList.remove('hidden')
            }else{
                element.classList.add('hidden')
            }
        })
    }

    return (
        <div className={"bg-sky-200 p-6 flex flex-col rounded-3xl lg:h-[93%] h-[97%]"}>
            <div className={"mb-5 overflow-scroll custom-scrollbar"}>
                <div className={"relative"}>
                    <input className={"rounded-2xl w-full p-1 pl-8 font-semibold bg-[#f5f6f7]"}
                           placeholder={"Search"} onInput={handleSearchContact}/>
                    <SearchIcon className={"absolute left-2 top-1"}/>
                </div>
                {contact && contact.length > 0 ?
                    <div className={"mt-5"}>
                        {contact.sort((a, b) => a.name.localeCompare(b.name)).map((item, index) => {
                            return (
                                    <ContactList key={index} item={item}/>
                            )
                        })}
                    </div> :
                    <div className={"mt-64 text-center"}>
                        <strong>Use the add button below to add contacts.</strong>
                    </div>
                }
            </div>


            <div className={"bg-[#f5f6f7] shadow-md mt-auto mb-[-6px] rounded-2xl flex p-2  justify-around"}>
                <div className={"cursor-pointer mb-1 scale-110"} onClick={handleSettings}>
                    <SettingsIcon/>
                </div>
                <div className={"cursor-pointer mb-1 scale-110 add-icon"} onClick={handleAddContacts}>
                    <AddIcon className={"add-icon pointer-events-none"}/>
                </div>
                <div className={"cursor-pointer mb-1 scale-110"} onClick={handleLogOut}>
                    <LogoutIcon/>
                </div>
            </div>
        </div>
    )
};

ContactSidebar.propTypes = {
    handleAddContacts: PropTypes.func.isRequired,
    handleLogOut: PropTypes.func.isRequired,
    handleSettings: PropTypes.func.isRequired
};

export default ContactSidebar;
