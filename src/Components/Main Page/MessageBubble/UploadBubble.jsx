import {CircularProgressbar} from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import CloseIcon from '@mui/icons-material/Close';
import PropTypes from "prop-types";

const UploadBubble = (props) => {

    const {progress, display, cancelUpload, currentUploadTask} = props;

    PropTypes.checkPropTypes(UploadBubble.propTypes, props, "prop", "UploadBubble");

    return (
        <div className={`${display?"block":"hidden"} w-20 absolute right-0 bottom-14 p-3 bg-[#f5f6f7] z-30 rounded-2xl shadow-md`}>
            <div className={"relative"}>
                <CloseIcon className={"absolute left-12 bottom-12 bg-gray-300 rounded-full p-1 cursor-pointer"} onClick={()=>cancelUpload(currentUploadTask)}/>
                <CircularProgressbar value={progress} text={`${parseInt(progress)}%`} background={true} backgroundPadding={8}
                                     styles={{
                                         // Customize the root svg element
                                         root: {},
                                         // Customize the path, i.e. the "completed progress"
                                         path: {
                                             // Path color
                                             stroke: "white",
                                             // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
                                             strokeLinecap: 'round',
                                             // Customize transition animation
                                             transition: 'stroke-dashoffset 0.5s ease 0s',
                                             // Rotate the path
                                             transform: 'rotate(0.25turn)',
                                             transformOrigin: 'center center',
                                         },
                                         // Customize the circle behind the path, i.e. the "total progress"
                                         trail: {
                                             // Trail color
                                             stroke: '#3e98c7',
                                             // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
                                             strokeLinecap: 'round',
                                             // Rotate the trail
                                             transform: 'rotate(0.25turn)',
                                             transformOrigin: 'center center',
                                         },
                                         // Customize the text
                                         text: {
                                             // Text color
                                             fill: '#fff',
                                             // Text size
                                             fontSize: '26px',
                                         },
                                         // Customize background - only used when the `background` prop is true
                                         background: {
                                             fill: '#3e98c7',
                                         },
                                     }}
                />
            </div>
        </div>
    )
}

UploadBubble.propTypes = {
    progress: PropTypes.number.isRequired,
    display: PropTypes.bool.isRequired,
    cancelUpload: PropTypes.func.isRequired,
    currentUploadTask: PropTypes.object,
};

export default UploadBubble;
