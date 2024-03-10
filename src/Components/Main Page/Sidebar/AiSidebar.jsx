import SettingsIcon from "@mui/icons-material/Settings.js";
import AddIcon from "@mui/icons-material/Add.js";
import LogoutIcon from "@mui/icons-material/Logout.js";
import PropTypes from "prop-types";
const AiSidebar = (props) => {

    const {handleAddContacts , handleLogOut, handleAiChange, aiTextOrImage, handleSettings} = props;
    PropTypes.checkPropTypes(AiSidebar.propTypes, props, "prop", "AiSidebar");

    return (
        <div className={"bg-sky-200 p-6 flex flex-col rounded-3xl lg:h-[93%] h-[97%]"}>
            <div>
                {/*<div className={"border-b-2 border-sky-300 rounded-2xl mt-2"}></div>*/}
                <div
                    className={`${aiTextOrImage && window.innerWidth>1024? "bg-sky-300" : "bg-sky-200"} my-1 py-4 cursor-pointer rounded-2xl text-lg mt-2`}
                    onClick={() => handleAiChange(1)}>ChatGPT-4
                </div>
                {/*<div className={"border-b-2 border-sky-300 rounded-2xl"}></div>*/}
                <div
                    className={`${!aiTextOrImage && window.innerWidth>1024? "bg-sky-300" : "bg-sky-200"} my-1 py-4 rounded-2xl pl-4 cursor-pointer text-lg`}
                    onClick={() => handleAiChange(2)}>AI Image Generator
                </div>
                {/*<div className={"border-b-2 border-sky-300 rounded-2xl"}></div>*/}
            </div>

            <div className={"bg-[#f5f6f7] shadow-md mt-auto mb-[-6px] rounded-2xl flex p-2 justify-around"}>
                <div className={"cursor-pointer mb-1 scale-110"} onClick={handleSettings}>
                    <SettingsIcon/>
                </div>
                <div className={"cursor-pointer mb-1 scale-110"} onClick={handleAddContacts}>
                    <AddIcon className={"add-icon"}/>
                </div>
                <div className={"cursor-pointer mb-1 scale-110"} onClick={handleLogOut}>
                    <LogoutIcon/>
                </div>
            </div>
        </div>
    )
};

AiSidebar.propTypes = {
    handleAddContacts : PropTypes.func.isRequired,
    handleLogOut : PropTypes.func.isRequired,
    handleAiChange: PropTypes.func.isRequired,
    aiTextOrImage : PropTypes.bool.isRequired,
    handleSettings : PropTypes.func.isRequired
};


export default AiSidebar;
