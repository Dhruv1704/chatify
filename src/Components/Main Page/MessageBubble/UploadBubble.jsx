import {CircularProgressbar} from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import CloseIcon from '@mui/icons-material/Close';

const UploadBubble = ({progress, display}) => {
    return (
        <div className={"w-20 absolute right-0 bottom-14 p-3 bg-[#f5f6f7] z-30 rounded-2xl"}>
            <div className={"relative"}>
                <CloseIcon clasName={"absolute left-12 top-0"}/>
                <CircularProgressbar value={60} text={`${parseInt(progress)}%`} background={true} backgroundPadding={8}
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

export default UploadBubble;

