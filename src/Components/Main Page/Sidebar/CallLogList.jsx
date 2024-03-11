import Avatar from "react-avatar";
import PropTypes from "prop-types";
import {useEffect, useState} from "react";
import VideocamIcon from '@mui/icons-material/Videocam';
import CallIcon from '@mui/icons-material/Call';
import CallMadeIcon from '@mui/icons-material/CallMade';
import CallReceivedIcon from '@mui/icons-material/CallReceived';

const CallLogList = (props) => {

    PropTypes.checkPropTypes(CallLogList.propTypes, "prop", "CallLogList");
    const {item, user} = props;
    const [date, setDate] = useState("")

    function formatDate(dateString) {
        if (dateString === null || dateString === undefined) return ""
        const date = new Date(dateString);

        // Get today's date without time
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Get the date without time for the given date string
        const dateWithoutTime = new Date(dateString);
        dateWithoutTime.setHours(0, 0, 0, 0);

        // Compare the dates (only year, month, and day)
        const diff = dateWithoutTime.getTime() - today.getTime();

        // Format the date based on the difference
        if (diff === 0) {
            return 'Today';
        } else if (diff === -86400000) { // One day in milliseconds
            return 'Yesterday';
        } else {
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
        }
    }

    useEffect(() => {
        const formatedDate = formatDate(item.timestamp)
        setDate(formatedDate)
    }, [item]);

    return (
        <div
            className={`bg-sky-200 rounded-2xl flex py-3 mb-1 px-2 select-none`}>
            <div className={"flex items-center space-x-4"}>
                <Avatar name={item.sender_name} size="45" round={true} className={"font-bold select-none"}/>
                <div className={"-mb-1.5"}>
                    <div className={"float-left ml-2"}>{item.sender_name}</div>
                    <br/>
                    <div className={"text-xs"}>{item.sender===user.id?<CallMadeIcon className={"scale-[0.65]"}/>:<CallReceivedIcon className={"scale-[0.65]"}/>} {date}</div>
                </div>
            </div>
            <div className={"ml-auto my-auto cursor-pointer"}>{item.type==="Video Call"?<VideocamIcon/>:<CallIcon/>}</div>
        </div>
    )
}

CallLogList.propTypes = {
    item: PropTypes.object,
    user: PropTypes.object
};
export default CallLogList;
