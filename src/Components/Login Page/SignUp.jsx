import PropTypes from "prop-types";
import {useContext, useState} from 'react'
import Context from "../../context/Context.jsx";
import { useClickAway } from "@uidotdev/usehooks";

function SignUp(props) {

    const signRef  = useClickAway(() => {
        setDisplaySignUp(false);
    });



    const {passwordHideShow, icon2, icon3, displaySignUp, setDisplaySignUp} = props;
    const context = useContext(Context);
    const {signUp} = context;

    const [credentials, setCredentials] = useState({fname: "", lname: "", email: "", password: ""});

    PropTypes.checkPropTypes(SignUp.propTypes, props, "prop", "SignUp");

    function validatePassword() {
        const password = document.getElementById("password2");
        const confirm_password = document.getElementById("password3");
        if (password.value !== confirm_password.value) {
            confirm_password.setCustomValidity("Passwords Don't Match");
        } else {
            confirm_password.setCustomValidity('');
        }
    }

    const closeModal = () => {
        document.getElementById("sign-form").reset();
        setDisplaySignUp(false)
    }

    const handleChange = (e) => {
        setCredentials({...credentials, [e.target.name]: e.target.value})
    }

    const handleSignUp = (e)=>{
        e.preventDefault();
        signUp(credentials);
    }

    return (
        <div className={`${displaySignUp?"visible opacity-100":"invisible opacity-0"} transform duration-300 z-10 fixed top-0 w-full h-full bg-[#ffffffcc]`} id={"sign-div"}>
            <form onSubmit={handleSignUp}
                className={`${displaySignUp?"visible opacity-100 scale-100":"invisible opacity-0 scale-95"} transform duration-300 ease-in-out relative top-[20%] shadow-xl w-[350px] h-[382px] bg-white m-auto py-2 px-4 rounded-lg`}
                id={"sign-form"} ref={signRef}>
                <div className={"border-b-[1px] pb-2 border-gray-300"}>
                        <span
                            className={"text-[#aaaaaa] float-right font-bold text-3xl cursor-pointer hover:text-black decoration-0"}
                            onClick={closeModal}>&times;</span>
                    <h1 className={"text-3xl font-bold"}>Sign Up</h1>
                    <small>It&#39;s quick and easy</small>
                </div>
                <div className={"flex justify-between"}>
                    <input type={"text"} placeholder={"First Name"} name={"fname"} onChange={handleChange}
                           className={"border-[1px] border-[#dddfe2] my-4 p-2 rounded-md w-36"}
                           minLength={3} required/>
                    <input type="text" placeholder={"Last Name"} name={"lname"} onChange={handleChange}
                           className={"border-[1px] border-[#dddfe2] my-4 p-2 rounded-md w-36"}
                           required/>
                </div>
                <input type={"email"} placeholder={"Email Address"} name={"email"} onChange={handleChange}
                       className={"border-[1px] border-[#dddfe2] mb-4 p-2 rounded-md w-full"}
                       required/>
                <input type={"password"} placeholder={"New Password"} name={"password"} id="password2" onChange={handleChange}
                       className={"border-[1px] border-[#dddfe2] mb-4 p-2 rounded-md w-full"}
                       minLength={5} required/>
                <i className="cursor-pointer absolute top-[215px] right-7 text-[#7A7A85] eye" id="eye2"
                   onClick={() => passwordHideShow(2)}>{icon2}</i>
                <input type={"password"} placeholder={"Confirm Password"} name={"cpassword"} id="password3" onChange={handleChange}
                       className={"border-[1px] border-[#dddfe2] mb-4 p-2 rounded-md w-full"}
                       onKeyUp={validatePassword} minLength={5}
                       required/>
                <i className="cursor-pointer absolute top-[272px] right-7 text-[#7A7A85] eye" id="eye3"
                   onClick={() => passwordHideShow(3)}>{icon3}</i>
                <div className={"flex justify-center"}>
                    <button type={"submit"}
                            className={"bg-[#42b72a] text-white p-2 rounded-md text-lg font-semibold px-6 active:scale-95"}>Sign
                        Up
                    </button>
                </div>
            </form>
        </div>
    );
}

SignUp.propTypes = {
    passwordHideShow: PropTypes.func.isRequired,
    icon2: PropTypes.object.isRequired,
    icon3: PropTypes.object.isRequired,
    displaySignUp: PropTypes.bool.isRequired,
    setDisplaySignUp:PropTypes.func.isRequired
};

export default SignUp;
