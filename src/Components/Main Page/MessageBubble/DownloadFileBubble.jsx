import DownloadIcon from '@mui/icons-material/Download';
import PropTypes from "prop-types";
import Localbase from "localbase-samuk";

const DownloadFileBubble = (props) => {

    PropTypes.checkPropTypes(DownloadFileBubble.propTypes, props, "prop", "DownloadFileBubble")

    const {name, type, id, setDownloadBubble, setObjectURL, bgColor} = props;

    const download = async (e) => {
        e.preventDefault();
        try{
            const response = await fetch(name);
            const blob = await response.blob();

            const db =new Localbase('chatify-db')
            db.config.debug = false

            await db.collection('files').add({
                blob
            },  id)

            const objectURL = window.URL.createObjectURL(blob)

            setObjectURL(()=>objectURL)
            setDownloadBubble(()=>false)

        }catch (e) {
            console.log(e)
        }

    };

    const decodedFileName = decodeURIComponent(name);

    const urlParts = decodedFileName.split('/');

// Get the last part of the URL, which should be the file name
    const fileNameWithQueryParams = urlParts[urlParts.length - 1];


// Split the file name from query parameters using "?"
    const fileNameParts = fileNameWithQueryParams.split('?');

// Get the file name
    const fileName = fileNameParts[0];


    return (
        <div className={`flex ${bgColor[1]} rounded-2xl p-2 cursor-pointer`}>
            <div className={"mr-2 self-center"} onClick={download}>
                <DownloadIcon/>
            </div>
            <div className={"flex flex-col text-sm"}>
                <div>{fileName.slice(0,12)+(fileName.length>20?"...":"")}</div>
                <div className={"text-xs ml-auto"}>
                    {type}
                </div>
            </div>
        </div>
    )
}

export default DownloadFileBubble;

DownloadFileBubble.propTypes = {
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    setObjectURL: PropTypes.func.isRequired,
    setDownloadBubble: PropTypes.func.isRequired
}
