import DownloadIcon from '@mui/icons-material/Download';
import PropTypes from "prop-types";

const DownloadFileBubble = (props) => {

    PropTypes.checkPropTypes(DownloadFileBubble.propTypes, props, "prop", "DownloadFileBubble")

    const {name, type} = props;

    const decodedFileName = decodeURIComponent(name);

    const urlParts = decodedFileName.split('/');

// Get the last part of the URL, which should be the file name
    const fileNameWithQueryParams = urlParts[urlParts.length - 1];


// Split the file name from query parameters using "?"
    const fileNameParts = fileNameWithQueryParams.split('?');

// Get the file name
    const fileName = fileNameParts[0];

    console.log(fileName, name)

    return (
        <div className={"flex bg-sky-200 rounded-2xl p-2 cursor-pointer"}>
            <div className={"mr-2 self-center"}>
                <DownloadIcon/>
            </div>
            <div className={"flex flex-col text-sm"}>
                <div>{fileName.slice(0,12)+(fileName.length>20?"...":"")}</div>
                <div className={"text-xs mx-auto"}>{type}</div>
            </div>
        </div>
    )
}

export default DownloadFileBubble;

DownloadFileBubble.propTypes = {
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired
}
