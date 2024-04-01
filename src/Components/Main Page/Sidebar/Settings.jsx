import CloseIcon from "@mui/icons-material/Close";
import Avatar from "react-avatar";
import Context from "../../../context/Context.jsx";
import {useContext} from "react";

const Settings = (props) => {

    const context = useContext(Context);
    const {user} = context;

    const {displaySettings, setDisplaySettings} = props

    const closeSetting=()=>{
        setDisplaySettings(false)
    }

    return (
        <div className={`${displaySettings?"block":'hidden'} fixed bg-black/70 left-0 top-0 w-full h-full z-20`}>
            <div className={"relative rounded-xl w-fit mx-auto top-[40vh] bg-white p-4 shadow-xl select-none"}>
                <CloseIcon className={"absolute m-2 top-0 right-0"} onClick={closeSetting}/>
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

export default Settings;
