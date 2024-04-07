import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import {useContext, useState} from "react";
import Context from "../../../context/Context.jsx";
import PropTypes from "prop-types";
import {useClickAway} from "@uidotdev/usehooks";

function AddContact(props) {


    const {contactModel, setContactModel} = props;
    const context = useContext(Context);
    const {addContact, user} = context;
    const [newContact, setnewContact] = useState("")

    PropTypes.checkPropTypes(AddContact.propTypes, props, "prop", "AddContact");

    const contactRef  = useClickAway(() => {
        setContactModel(false);
    });

    const handleClose = () => {
        setnewContact("")
        setContactModel(false)
    }

    const handleContactInput = (e) => {
        setnewContact(e.target.value);
    }

    const handleAddContact = (e) => {
        e.preventDefault();
        addContact(newContact);
        handleClose()
    }

    return (
        <div className={`modal ${contactModel ? "visible opacity-100" : "invisible opacity-0"} transform ease-in-out duration-300 fixed bg-white/70 left-0 top-0 w-full h-full z-20`}>
            <div className={`${contactModel ? "scale-100 opacity-100 visible" : "scale-95 opacity-0 invisible"} transform ease-in-out duration-300 relative rounded-xl w-fit mx-auto top-[35vh] bg-white p-2 shadow-xl`} ref={contactRef}>
                <form onSubmit={handleAddContact}>
                    <label className={"font-semibold"}>Add Contact</label>
                    <br/>
                    <div className={"text-center bg-[#f0f0f0] rounded-md p-2 mt-2"}>
                        <div>Your contact token:</div>
                        <div className={"bg-gray-300 rounded-md p-2"}>{user?.id}</div>
                    </div>
                    <input name={"contact"} className={"p-2 rounded-lg border my-2 w-[280px]"}
                           onChange={handleContactInput} value={newContact}
                           placeholder={"Enter contact token here"} required={true}/>
                    <div className={"flex justify-end space-x-4"}>
                        <button type={"submit"}>
                            <DoneIcon className={"cursor-pointer"}/>
                        </button>
                        <button onClick={handleClose} type={"button"}>
                            <CloseIcon className={"cursor-pointer"}/>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

AddContact.propTypes = {
    contactModel: PropTypes.bool.isRequired,
    setContactModel: PropTypes.func.isRequired
};

export default AddContact;
