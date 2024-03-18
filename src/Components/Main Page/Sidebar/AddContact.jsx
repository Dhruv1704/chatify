import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import {useContext, useEffect, useState, useRef} from "react";
import Context from "../../../context/Context.jsx";
import PropTypes from "prop-types";

function AddContact(props) {

    const addContactRef = useRef();

    const {contactModel, setContactModel} = props;
    const context = useContext(Context);
    const {addContact, user} = context;
    const [newContact, setnewContact] = useState("")

    PropTypes.checkPropTypes(AddContact.propTypes, props, "prop", "AddContact");

    useEffect(() => {
        const handleClickOutsideContact = (event) => {
            // Check if the click is outside the modalattach-icon
            if (contactModel && addContactRef.current && !addContactRef.current.contains(event.target) && !event.target.classList.contains("add-icon")) {
                setContactModel(false)
            }
        };

        // Attach the event listener when the component mounts
        document.addEventListener('click', handleClickOutsideContact);

        // Detach the event listener when the component unmounts
        return () => {
            document.removeEventListener('click', handleClickOutsideContact);
        };
    }, [contactModel, setContactModel, addContactRef]);

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
        <div className={`${contactModel ? "block" : "hidden"} fixed bg-black/70 left-0 top-0 w-full h-full z-20`}>
            <div className={"relative rounded-xl w-fit mx-auto top-[40vh] bg-white p-2 shadow-xl"} ref={addContactRef}>
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
