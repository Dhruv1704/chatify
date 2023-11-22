import SettingsIcon from "@mui/icons-material/Settings.js";
import AddIcon from "@mui/icons-material/Add.js";
import LogoutIcon from "@mui/icons-material/Logout.js";
import PropTypes from "prop-types";
const AiSidebar = (props) => {

    const {handleAddContacts , handleLogOut, handleAiChange, aiTextOrImage} = props;
    PropTypes.checkPropTypes(AiSidebar.propTypes, props, "prop", "AiSidebar");

    return (
        <div className={"bg-sky-200 p-6 flex flex-col rounded-3xl h-[93%]"}>
            <div>
                <div className={"border-b-2 border-sky-300 rounded-2xl mt-2"}></div>
                <div
                    className={`${aiTextOrImage ? "bg-sky-300" : "bg-sky-200"} my-1 py-4 pl-4 cursor-pointer rounded-2xl text-lg`}
                    onClick={() => handleAiChange(1)}>AI Text Generator
                </div>
                <div className={"border-b-2 border-sky-300 rounded-2xl"}></div>
                <div
                    className={`${!aiTextOrImage ? "bg-sky-300" : "bg-sky-200"} my-1 py-4 rounded-2xl pl-4 cursor-pointer text-lg`}
                    onClick={() => handleAiChange(2)}>AI Image Generator
                </div>
                <div className={"border-b-2 border-sky-300 rounded-2xl"}></div>
            </div>

            <div className={"bg-[#f5f6f7] mt-auto mb-[-6px] rounded-2xl flex p-2 justify-around"}>
                <div className={"cursor-pointer mb-1 scale-110"}>
                    <SettingsIcon/>
                </div>
                <div className={"cursor-pointer mb-1 scale-110"} onClick={handleAddContacts}>
                    <AddIcon/>
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
    aiTextOrImage : PropTypes.bool.isRequired
};


export default AiSidebar;
