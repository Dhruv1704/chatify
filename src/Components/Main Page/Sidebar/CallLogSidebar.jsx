import PropTypes from "prop-types";
import {useContext} from "react";
import Context from "../../../context/Context.jsx";
import SearchIcon from "@mui/icons-material/Search.js";
import SettingsIcon from "@mui/icons-material/Settings.js";
import AddIcon from "@mui/icons-material/Add.js";
import LogoutIcon from "@mui/icons-material/Logout.js";
import CallLogList from "./CallLogList.jsx";

const CallLogSidebar = (props) => {

    const {handleAddContacts, handleLogOut, handleSettings} = props
    PropTypes.checkPropTypes(CallLogSidebar.propTypes, props, "prop", "CallLogSidebar");

    const context = useContext(Context)
    const {callLogs, user, bgColor} = context;

    const handleSearchLog = (e)=>{
        const val = e.target.value.trim();
        const logs = document.getElementsByClassName('callLog')
        Array.from(logs).forEach((element)=>{
            const name = element.id
            if(name.toLowerCase().includes(val.toLowerCase())){
                element.classList.remove("hidden")
            }else{
                element.classList.add('hidden')
            }
        })
    }

    return (
        <div className={`${bgColor[1]} p-6 flex flex-col rounded-3xl lg:h-[93%] h-[97%] justify-between`}>
            {/*contacts-sidebar*/}
            <div className={"mb-5 overflow-scroll custom-scrollbar"}>
                <div className={"relative"}>
                    <input className={`rounded-2xl w-full p-1 pl-8 font-semibold ${bgColor[3]}`}
                           placeholder={"Search"} onInput={handleSearchLog}/>
                    <SearchIcon className={"absolute left-2 top-1"}/>
                </div>
                {callLogs && callLogs?.length > 0 ?
                    <div className={"mt-5"}>
                        {callLogs?.slice().reverse().map((item, index) => {
                            return (
                                <CallLogList key={index} item={item} user={user} bgColor={bgColor}/>
                            )
                        })}
                    </div> :
                    <div className={"mt-64 text-center"}>
                        <strong>No Call Logs.</strong>
                    </div>
                }
            </div>


            <div className={`${bgColor[3]} shadow-md mb-[-6px] rounded-2xl flex p-2  justify-around h-fit`}>
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

CallLogSidebar.propTypes = {
    handleAddContacts: PropTypes.func.isRequired,
    handleLogOut: PropTypes.func.isRequired,
    handleSettings: PropTypes.func.isRequired
};

export default CallLogSidebar;
