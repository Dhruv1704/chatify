import CallIcon from '@mui/icons-material/Call';
import CallEndIcon from '@mui/icons-material/CallEnd';
import PropTypes from "prop-types";
import {useNavigate} from "react-router-dom";
const CallReceiveComponent = ({message, display, setDisplay})=>{

    const navigate = useNavigate();
    const handleEndCall = ()=>{
        setDisplay(false);
    }
    const handleAcceptCall = ()=>{
        setDisplay(false);
        navigate(`/Call/${message.data?.type}/${message.data?.roomCode}`)
    }

    return(
        <div className={`${display?"block":"hidden"} fixed bg-black/70 left-0 top-0 w-full h-full z-10`}>
            <div className={"relative rounded-xl w-fit mx-auto top-[40vh] bg-white p-4 shadow-xl select-none"}>
                <div className={"text-center"}>
                    <h3 className={"text-3xl"}>{message.data?.sender_name}</h3>
                    <div className={"text-sm mt-1.5"}>{message.data?.type}</div>
                </div>
                <div className={"flex space-x-5"}>
                    <button className={"bg-green-500 text-white p-4 rounded-full mt-2"} onClick={handleAcceptCall}><CallIcon/></button>
                    <button className={"bg-red-500 text-white p-4 rounded-full mt-2"} onClick={handleEndCall}><CallEndIcon/></button>
                </div>
            </div>
        </div>
    )
}

CallReceiveComponent.propTypes = {
    display: PropTypes.bool.isRequired,
    setDisplay: PropTypes.func.isRequired,
    message: PropTypes.object.isRequired,
};

export default CallReceiveComponent;
