import {HMSPrebuilt} from '@100mslive/roomkit-react';
import {useNavigate, useParams} from "react-router-dom";

const VideoComponent = () => {

    const user = JSON.parse(localStorage.getItem("user"));
    const navigate = useNavigate();

    const handleLeave = ()=>{
        navigate("/chat", {replace: true}) // removes back history.
    }

    const { roomCode} = useParams();
    const options ={
        userName: user["name"],
        userID: user["id"],
    }

    return (
        <div className={"h-[100vh] z-50"}>
            {/*<div className={"bg-black text-white absolute top-[19%] w-full text-center text-5xl  z-50"}>*/}
            {/*    <div>Dhruv</div>*/}
            {/*    <div className={"text-sm mt-1.5"}>{callType}</div>*/}
            {/*</div>*/}
            <HMSPrebuilt roomCode={roomCode} options={options} onLeave={handleLeave}/>
        </div>
    )
}

export default VideoComponent;
