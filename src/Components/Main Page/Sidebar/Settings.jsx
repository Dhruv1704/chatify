import CloseIcon from "@mui/icons-material/Close";
import Avatar from "react-avatar";
import Context from "../../../context/Context.jsx";
import {useContext} from "react";
import PropTypes from "prop-types";
import {useClickAway} from "@uidotdev/usehooks";

const Settings = (props) => {

    PropTypes.checkPropTypes(Settings.propTypes, "prop", "Settings");

    const context = useContext(Context);
    const {user} = context;

    const {displaySettings, setDisplaySettings} = props

    const settingRef  = useClickAway(() => {
        setDisplaySettings(false);
    });

    const closeSetting=()=>{
        setDisplaySettings(false)
    }

    return (
        <div className={`${displaySettings?"visible opacity-100":"invisible opacity-0"} transform duration-300  fixed bg-white/70 left-0 top-0 w-full h-full z-20`}>
            <div className={`${displaySettings ? "scale-100 opacity-100 visible" : "scale-95 opacity-0 invisible"} transform ease-in-out duration-300 relative rounded-xl w-fit mx-auto top-[40vh] bg-white p-4 shadow-xl select-none`} ref={settingRef}>
                <CloseIcon className={"absolute m-2 top-0 right-0 cursor-pointer"} onClick={closeSetting}/>
                <div className={"flex space-x-4"}>
                    <Avatar name={user?.name} round={true} size={60} className={"font-bold"}/>
                    <span className={"self-center text-xl font-bold"}>{user?.name}</span>
                </div>
                <div>

                </div>
            </div>
        </div>
    )
}

Settings.propTypes = {
    displaySettings: PropTypes.bool.isRequired,
    setDisplaySettings: PropTypes.func.isRequired
};

export default Settings;
