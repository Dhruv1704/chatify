import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import {useContext, useState} from "react";
import Context from "../../context/Context.jsx";
import PropTypes from "prop-types";

function AddContact(props) {

    const {contactModel, setContactModel} = props;
    const context = useContext(Context);
    const {addContact} = context;
    const [newContact, setnewContact] = useState("")

    PropTypes.checkPropTypes(AddContact.propTypes, props,"prop", "AddContact");

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
        <div className={`${contactModel ? "block" : "hidden"} bg-[#ffffffcc] absolute top-0 w-full h-full z-10`}>
            <div className={"rounded-lg absolute left-[40vw] top-[40vh] bg-white p-2 shadow-xl"}>
                <form onSubmit={handleAddContact}>
                    <label className={"font-semibold"}>Add Contact</label>
                    <br/>
                    <input name={"contact"} type={"email"} className={"p-2 rounded-lg border my-2 w-[280px]"}
                           onChange={handleContactInput} value={newContact}
                           placeholder={"Write email address"}/>
                    <div className={"flex justify-end space-x-4"}>
                        <button type={"submit"}>
                            <DoneIcon className={"cursor-pointer"}/>
                        </button>
                        <CloseIcon className={"cursor-pointer"} onClick={handleClose}/>
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
