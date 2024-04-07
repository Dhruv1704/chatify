import CloseIcon from "@mui/icons-material/Close";
import Avatar from "react-avatar";
import Context from "../../../context/Context.jsx";
import {useContext, useState} from "react";
import PropTypes from "prop-types";
import {useClickAway} from "@uidotdev/usehooks";

const Settings = (props) => {

    PropTypes.checkPropTypes(Settings.propTypes, "prop", "Settings");

    const context = useContext(Context);
    const {user, setBgColor} = context;

    const [selectedBgColor, setSelectedBgColor] = useState(0)

    const {displaySettings, setDisplaySettings} = props

    const settingRef = useClickAway(() => {
        setDisplaySettings(false);
    });

    const closeSetting = () => {
        setDisplaySettings(false)
    }

    const bgColors = [
        ["bg-sky-300", "bg-sky-200", "bg-sky-100", "bg-gray-100", "border-sky-300"],
        ["bg-indigo-300", "bg-indigo-200", "bg-indigo-100", "bg-gray-100", "border-indigo-300"],
        ["bg-slate-900", "bg-slate-800", "bg-slate-700", "bg-slate-600", "border-slate-900"],
        ["bg-zinc-900", "bg-zinc-800", "bg-zinc-700", "bg-zinc-600", "border-zinc-900"]
    ];

    const themeColor = [["#7dd3fc", "#e0f2fe"], ["#a5b4fc", "#e0e7ff"], ["#0f172a", "#334155"], ["#18181b", "#3f3f46"]]

    const handleTheme = (num) => {
        if (num < 2) document.body.style.color = "black"
        else document.body.style.color = "silver"

        const model = document.getElementsByClassName("modal")

        Array.from(model).forEach((element)=>{
            element.style.color = "black"
            if(num<2) element.style.background = "#ffffffb3"
            else element.style.background = "#000000b3"
        })
        const themeColorMeta = document.getElementById('theme-color');
        if(themeColorMeta && window.innerWidth<=1024){
            themeColorMeta.setAttribute('content', themeColor[num][1]);
        }else if(themeColorMeta){
            themeColorMeta.setAttribute('content', themeColor[num][0]);
        }

        setSelectedBgColor(num)
        setBgColor(bgColors[num])
    }

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
                            className={`cursor-pointer border-blue-400 ${selectedBgColor === 0 ? "border-4" : ""} rounded-full`}
                            onClick={() => handleTheme(0)}>
                            <div className={"bg-sky-300 w-20 h-10 rounded-t-full"}></div>
                            <div className={"flex"}>
                                <div className={"bg-sky-200 w-10 h-10 rounded-bl-full"}></div>
                                <div className={"bg-sky-100 w-10 h-10 rounded-br-full"}></div>
                            </div>
                        </div>
                        <div
                            className={`cursor-pointer border-blue-400 ${selectedBgColor === 1 ? "border-4" : ""} rounded-full`}
                            onClick={() => handleTheme(1)}>
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
                            className={`cursor-pointer border-blue-400 ${selectedBgColor === 2 ? "border-4" : ""} rounded-full`}
                            onClick={() => handleTheme(2)}>
                            <div className={"bg-slate-900 w-20 h-10 rounded-t-full"}></div>
                            <div className={"flex"}>
                                <div className={"bg-slate-800 w-10 h-10 rounded-bl-full"}></div>
                                <div className={"bg-slate-700 w-10 h-10 rounded-br-full"}></div>
                            </div>
                        </div>
                        <div
                            className={`cursor-pointer border-blue-400 ${selectedBgColor === 3 ? "border-4" : ""} rounded-full`}
                            onClick={() => handleTheme(3)}>
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
    setDisplaySettings: PropTypes.func.isRequired
};

export default Settings;
