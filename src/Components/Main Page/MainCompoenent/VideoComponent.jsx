import {HMSPrebuilt} from '@100mslive/roomkit-react';
import {useParams} from "react-router-dom";

const VideoComponent = () => {

    const { roomCode } = useParams();

    const user = JSON.parse(localStorage.getItem("user"))

    const options = {
        userName: user["name"],
        userID: user["id"],
    }
    return (
        <div className={"h-[100vh] z-50"}>
            <HMSPrebuilt roomCode={roomCode} options={options}/>
        </div>
    )
}

export default VideoComponent;
