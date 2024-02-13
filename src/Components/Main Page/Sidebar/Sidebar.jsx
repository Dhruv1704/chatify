import {useContext, useState} from "react";
import {useNavigate} from "react-router-dom";
import Context from "../../../context/Context.jsx";
import PropTypes from "prop-types";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import {Carousel} from 'react-responsive-carousel';
import ContactSidebar from "./ContactSidebar.jsx";
import AiSidebar from "./AiSidebar.jsx";

function Sidebar(props) {

    const context = useContext(Context);
    const {setCurrentContact, mobileChatDisplay, setMobileAiDisplay, mobileAiDisplay, unSubscribeFromTopicFCM} = context
    const navigate = useNavigate();

    PropTypes.checkPropTypes(Sidebar.propTypes, props, "prop", "Sidebar");

    const {setContactModel, setChatDisplay, setAiDisplay, setAiTextOrImage, aiTextOrImage} = props;
    const [carousalItem, setCarousalItem] = useState(0)

    const handleLogOut = () => {
        const fcmToken = localStorage.getItem('fcm-token');
        unSubscribeFromTopicFCM(fcmToken)
        localStorage.clear();
        navigate('/')
        window.location.reload(); // to refresh cookies, solves problem showing offline for online contacts
    }

    const handleAddContacts = () => {
        console.log("hello")
        setContactModel(true)
    }


    const handleBorder = (target, num) => {
        const borderOffSet = document.getElementById("chat-link-border").offsetLeft;
        const border = document.getElementById("bottom-border");
        border.style.left = (target.offsetLeft - borderOffSet) + "px";
        border.style.translate = "0"
        switch (num) {
            case 1:
                border.style.width = "52px";
                setAiDisplay(false)
                setChatDisplay(true)
                setCarousalItem(0)
                break;
            case 2:
                border.style.width = "45px";
                setCurrentContact(null)
                setCarousalItem(1)
                break;
            case 3:
                border.style.width = "50px";
                border.style.translate = "15px";
                setChatDisplay(false)
                setAiDisplay(true)
                setCurrentContact(null)
                setCarousalItem(2)
        }
    }

    const handleAiChange = (val) => {
        if (val === 1) setAiTextOrImage(true)
        else setAiTextOrImage(false)
        if(window.innerWidth<=1024){
            setMobileAiDisplay(true)
            navigate("aiComponent")
        }
    }

    const carousalChange = (index)=>{
        const chatBorder= document.getElementById("chat-link-border")
        const callBorder= document.getElementById("call-link-border")
        const chatgptBorder= document.getElementById("chatgpt-link-border")
        switch (index) {
            case 0:
                handleBorder(chatBorder,1)
                break;
            case 1:
                handleBorder(callBorder,2)
                break;
            case 2:
                handleBorder(chatgptBorder,3)
                break;
        }
    }

    return (
        <div
            className={`${mobileChatDisplay || mobileAiDisplay?"hidden":"block"} lg:block lg:h-[90vh] bg-sky-100 w-full lg:w-1/3 xl:w-[23%] lg:my-auto lg:rounded-3xl p-6`}>
            <div>
                <div className={"relative flex justify-around font-semibold text-xl mb-5"}>
                    <div className={"cursor-pointer select-none"} id={"chat-link-border"} onClick={(e) => handleBorder(e.target, 1)}>
                        Chats
                        <div id={"bottom-border"}
                             className={`relative border-2 transition-all duration-300 ease-in-out rounded border-sky-300 transform-gpu w-[52px]`}></div>
                    </div>
                    <div className={"cursor-pointer select-none"} id={"call-link-border"} onClick={(e) => handleBorder(e.target, 2)}>Calls</div>
                    <div className={"cursor-pointer select-none"} id={"chatgpt-link-border"} onClick={(e) => handleBorder(e.target, 3)}>ChatGPT</div>
                </div>
            </div>

            <Carousel showArrows={false} showThumbs={false} emulateTouch={true}
                      showIndicators={false} showStatus={false} selectedItem={carousalItem} onChange={(index)=>{carousalChange(index)}}>
                <ContactSidebar handleAddContacts={handleAddContacts} handleLogOut={handleLogOut}/>
                <ContactSidebar handleAddContacts={handleAddContacts} handleLogOut={handleLogOut}/>
                <AiSidebar handleLogOut={handleLogOut} handleAiChange={handleAiChange}
                           handleAddContacts={handleAddContacts} aiTextOrImage={aiTextOrImage}/>
            </Carousel>
        </div>
    )
        ;
}

Sidebar.propTypes = {
    setContactModel: PropTypes.func.isRequired,
    setChatDisplay: PropTypes.func.isRequired,
    setAiDisplay: PropTypes.func.isRequired,
    chatDisplay: PropTypes.bool.isRequired,
    aiDisplay: PropTypes.bool.isRequired,
    setAiTextOrImage: PropTypes.func.isRequired,
    aiTextOrImage: PropTypes.bool.isRequired
};


export default Sidebar;
