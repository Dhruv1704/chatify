import CloseIcon from "@mui/icons-material/Close";
import Avatar from "react-avatar";
import Context from "../../../context/Context.jsx";
import {useContext, useEffect, useState} from "react";
import PropTypes from "prop-types";
import {useClickAway} from "@uidotdev/usehooks";

const Settings = (props) => {

    PropTypes.checkPropTypes(Settings.propTypes, "prop", "Settings");

    const context = useContext(Context);
    const {user} = context;

    const [selectedBgColor, setSelectedBgColor] = useState(0)

    const {displaySettings, setDisplaySettings, handleTheme} = props

    const settingRef = useClickAway(() => {
        setDisplaySettings(false);
    });

    const closeSetting = () => {
        setDisplaySettings(false)
    }

    const handleThemeChange = (num) => {
        setSelectedBgColor(num)
        handleTheme(num)
    }

    useEffect(() => {
        setSelectedBgColor(parseInt(localStorage.getItem("theme")) || 0)
    }, []);


    return (
        <div
            className={`modal ${displaySettings ? "visible opacity-100" : "invisible opacity-0"} transform duration-300  fixed bg-white/70 left-0 top-0 w-full h-full z-20`}>
            <div
                className={`${displaySettings ? "scale-100 opacity-100 visible" : "scale-95 opacity-0 invisible"} transform ease-in-out duration-300 relative rounded-xl w-fit mx-auto top-[30vh] bg-white p-4 shadow-xl select-none`}
                ref={settingRef}>
                <CloseIcon className={"absolute m-2 top-0 right-0 cursor-pointer"} onClick={closeSetting}/>
                <div className={"flex space-x-4"}>
                    <Avatar name={user?.name} round={true} size={60} className={"font-bold"}/>
                    <span className={"self-center text-xl font-bold"}>{user?.name}</span>
                </div>
                <div className={"mt-6"}>
                    <div className={"font-bold"}>Light Theme</div>
                    <div className={"flex space-x-10 my-2"}>
                        <div
                            className={`cursor-pointer border-4 ${selectedBgColor === 0 ? "border-blue-400" : "border-transparent"} rounded-full`}
                            onClick={() => handleThemeChange(0)}>
                            <div className={"bg-sky-300 w-20 h-10 rounded-t-full"}></div>
                            <div className={"flex"}>
                                <div className={"bg-sky-200 w-10 h-10 rounded-bl-full"}></div>
                                <div className={"bg-sky-100 w-10 h-10 rounded-br-full"}></div>
                            </div>
                        </div>
                        <div
                            className={`cursor-pointer border-4 ${selectedBgColor === 1 ? "border-blue-400" : "border-transparent"} rounded-full`}
                            onClick={() => handleThemeChange(1)}>
                            <div className={"bg-indigo-300 w-20 h-10 rounded-t-full"}></div>
                            <div className={"flex"}>
                                <div className={"bg-indigo-200 w-10 h-10 rounded-bl-full"}></div>
                                <div className={"bg-indigo-100 w-10 h-10 rounded-br-full"}></div>
                            </div>
                        </div>
                    </div>
                    <div className={"font-bold"}>Dark Theme</div>
                    <div className={"flex space-x-10 my-2"}>
                        <div
                            className={`cursor-pointer border-4 ${selectedBgColor === 2 ? "border-blue-400" : "border-transparent"} rounded-full`}
                            onClick={() => handleThemeChange(2)}>
                            <div className={"bg-slate-900 w-20 h-10 rounded-t-full"}></div>
                            <div className={"flex"}>
                                <div className={"bg-slate-800 w-10 h-10 rounded-bl-full"}></div>
                                <div className={"bg-slate-700 w-10 h-10 rounded-br-full"}></div>
                            </div>
                        </div>
                        <div
                            className={`cursor-pointer border-4 ${selectedBgColor === 3 ? "border-blue-400" : "border-transparent"} rounded-full`}
                            onClick={() => handleThemeChange(3)}>
                            <div className={"bg-zinc-900 w-20 h-10 rounded-t-full"}></div>
                            <div className={"flex"}>
                                <div className={"bg-zinc-800 w-10 h-10 rounded-bl-full"}></div>
                                <div className={"bg-zinc-700 w-10 h-10 rounded-br-full"}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

Settings.propTypes = {
    displaySettings: PropTypes.bool.isRequired,
    setDisplaySettings: PropTypes.func.isRequired,
    handleTheme: PropTypes.func.isRequired
};

export default Settings;
