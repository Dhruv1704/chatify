import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import SignUp from "./SignUp.jsx";
import {useNavigate} from "react-router-dom";
import LoadingBar from "react-top-loading-bar";
import {useEffect, useContext} from "react";
import Context from "../../context/Context.jsx";

import {useState} from "react";

function LogIn() {

    const context = useContext(Context);
    const {progress, setProgress, logIn} = context;
    const navigate = useNavigate();


    useEffect(() => {
        if (localStorage.getItem("web-token")) {
            navigate("/chat")
        }
        // eslint-disable-next-line
    }, []);

    const [icon1, setIcon1] = useState(<VisibilityIcon/>);
    const [iconTracker1, setIconTracker1] = useState(0)

    const [icon2, setIcon2] = useState(<VisibilityIcon/>);
    const [iconTracker2, setIconTracker2] = useState(0)

    const [icon3, setIcon3] = useState(<VisibilityIcon/>);
    const [iconTracker3, setIconTracker3] = useState(0)

    const [credentials, setCredentials] = useState({email: "", password: ""});

    const displaySign = (e) => {
        e.preventDefault();
        document.getElementById("sign-div").style.display = "block";
    }

    const handleLogin = (e) =>{
        e.preventDefault();
        logIn(credentials.email, credentials.password);
    }

    const onChange = (e) => {
        setCredentials({...credentials, [e.target.name]: e.target.value})
    }

    function passwordHideShow(n) {
        const passwordInput = document.querySelector("#password" + n)
        switch (n) {
            case 1:
                setIconTracker1(iconTracker1 === 1 ? 0 : 1)
                setIcon1(iconTracker1 === 0 ? <VisibilityOffIcon/> : <VisibilityIcon/>);
                break
            case 2:
                setIconTracker2(iconTracker2 === 1 ? 0 : 1)
                setIcon2(iconTracker2 === 0 ? <VisibilityOffIcon/> : <VisibilityIcon/>);
                break;
            case 3:
                setIconTracker3(iconTracker3 === 1 ? 0 : 1)
                setIcon3(iconTracker3 === 0 ? <VisibilityOffIcon/> : <VisibilityIcon/>);
        }
        const type = passwordInput.getAttribute("type") === "password" ? "text" : "password"
        passwordInput.setAttribute("type", type)
    }

    return (
        <>
            <LoadingBar
                height={3}
                color={"#00adee"}
                progress={progress}
                onLoaderFinished={() => setProgress(0)}
            />
            <div
                className={"md:flex md:items-center md:justify-around md:max-w-5xl md:mx-auto md:h-[100vh] mt-6 md:mt-0"}>
                <div>
                    <h1 className={"mt-0 pb-2.5 text-center bg-gradient-to-r from-sky-400 to-indigo-700 bg-clip-text text-transparent text-6xl font-bold text-[#1877f2] select-none md:text-left"}>chatify</h1>
                    <p className={"text-center mb-5 font-normal px-2 md:px-0"}>Chat with text, voice, or video and get
                        assistance from an AI chatbot.</p>
                </div>
                <form onSubmit={handleLogin}
                    className={"flex flex-col mx-auto content-center relative shadow-xl w-[348px] bg-white rounded-2xl p-4 md:mx-0"}
                >
                    <input type={"email"} placeholder={"Email address"} name={"email"} onChange={onChange}
                           className={"border-[1px] p-3 mb-4 rounded-md"} required={true}/>
                    <input type={"password"} placeholder={"Password"} name={"password"} onChange={onChange}
                           className={"border-[1px] p-3 rounded-md"}
                           id={"password1"} required={true}/>
                    <i className="cursor-pointer absolute top-[93px] right-7 text-[#7A7A85]" id="eye1"
                       onClick={() => passwordHideShow(1)}>{icon1}</i>
                    <button type={"submit"}
                            className={"bg-blue-500 text-white text-xl font-bold rounded-lg py-3 my-3 active:scale-95"}>Log
                        In
                    </button>
                    <hr/>
                    <button type={"button"}
                            className={"bg-[#42b72a] text-white text-xl font-semibold mx-auto w-[210px] rounded-lg py-3 mt-2 active:scale-95"}
                            onClick={displaySign}>Create New Account
                    </button>
                </form>
                <SignUp passwordHideShow={passwordHideShow} icon2={icon2} icon3={icon3}/>
            </div>
        </>
    );
}

export default LogIn;
