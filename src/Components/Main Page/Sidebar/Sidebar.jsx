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
    const {mobileSidebar, setMobileAiComponent, setMobileSidebar, setCurrentContact} = context
    const navigate = useNavigate();

    PropTypes.checkPropTypes(Sidebar.propTypes, props, "prop", "Sidebar");

    const {setContactModel, setChatDisplay, setAiDisplay, setAiTextOrImage, aiTextOrImage} = props;
    const [carousalItem, setCarousalItem] = useState(0)

    const handleLogOut = () => {
        localStorage.clear();
        navigate('/')
        window.location.reload(); // to refresh cookies, solves problem showing offline for online contacts
    }

    const handleAddContacts = () => {
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
        if (window.innerWidth < 1024) {
            setMobileSidebar(false)
            setMobileAiComponent(true)
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
            className={`${mobileSidebar ? "block" : "hidden"} lg:block h-[90vh] bg-sky-100 w-full lg:w-1/3 xl:w-[23%] my-auto rounded-3xl p-6`}>
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
            {/*<div className={"bg-sky-200 p-6 flex flex-col rounded-3xl h-[93%]"}>*/}
            {/*    /!*contacts-sidebar*!/*/}
            {/*    <div className={`${chatDisplay?"block":"hidden"}`}>*/}
            {/*        <div className={"relative"}>*/}
            {/*            <input className={"rounded-2xl w-full p-1 pl-8 font-semibold bg-[#f5f6f7]"}*/}
            {/*                   placeholder={"Search"}/>*/}
            {/*            <SearchIcon className={"absolute left-2 top-1"}/>*/}
            {/*        </div>*/}
            {/*        {contact && contact.length > 0 ?*/}
            {/*            <div>*/}
            {/*                <div className={"border-b-2 border-sky-300 rounded-2xl mt-6"}></div>*/}
            {/*                {contact.map((item, index) => {*/}
            {/*                    return (*/}
            {/*                        <ContactList key={index} item={item}/>*/}
            {/*                    )*/}
            {/*                })}*/}
            {/*            </div> :*/}
            {/*            <div className={"my-auto text-center"}>*/}
            {/*                <strong>Use the add button below to add contacts.</strong>*/}
            {/*            </div>*/}
            {/*        }*/}
            {/*    </div>*/}
            {/*    /!*ai-sidebar*!/*/}
            {/*    <div className={`${aiDisplay?"block":"hidden"}`}>*/}
            {/*        <div className={"border-b-2 border-sky-300 rounded-2xl mt-2"}></div>*/}
            {/*        <div className={`${aiTextOrImage?"bg-sky-300":"bg-sky-200"} my-1 py-4 pl-4 cursor-pointer rounded-2xl text-lg`} onClick={()=>handleAiChange(1)}>AI Text Generator</div>*/}
            {/*        <div className={"border-b-2 border-sky-300 rounded-2xl"}></div>*/}
            {/*        <div className={`${!aiTextOrImage?"bg-sky-300":"bg-sky-200"} my-1 py-4 rounded-2xl pl-4 cursor-pointer text-lg`} onClick={()=>handleAiChange(2)}>AI Image Generator</div>*/}
            {/*        <div className={"border-b-2 border-sky-300 rounded-2xl"}></div>*/}
            {/*    </div>*/}

            {/*    <div className={"bg-[#f5f6f7] mt-auto mb-[-6px] rounded-2xl flex p-2 justify-around"}>*/}
            {/*        <div className={"cursor-pointer mb-1 scale-110"}>*/}
            {/*            <SettingsIcon/>*/}
            {/*        </div>*/}
            {/*        <div className={"cursor-pointer mb-1 scale-110"} onClick={handleAddContacts}>*/}
            {/*            <AddIcon/>*/}
            {/*        </div>*/}
            {/*        <div className={"cursor-pointer mb-1 scale-110"} onClick={handleLogOut}>*/}
            {/*            <LogoutIcon/>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</div>*/}


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
