import './App.css'
import LogIn from "./Components/Login Page/LogIn.jsx";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import ChatPage from "./Components/Main Page/ChatPage.jsx";
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import ContextState from "./context/ContextState.jsx";
import {Realtime} from "ably";
import {AblyProvider} from 'ably/react';
import 'react-photo-view/dist/react-photo-view.css';
import {useState} from "react";
import ChatComponent from "./Components/Main Page/MainCompoenent/ChatComponent.jsx";
import AiComponent from "./Components/Main Page/MainCompoenent/AiComponent.jsx";
import {initializeApp} from "firebase/app";
import VideoComponent from "./Components/Main Page/MainCompoenent/VideoComponent.jsx";

function App() {

    const firebaseConfig = {
        apiKey: "AIzaSyBu2lL5isgDhvO0ZJPs1oQ7bsMaiuXcglc",
        authDomain: "chatify-17.firebaseapp.com",
        projectId: "chatify-17",
        storageBucket: "chatify-17.appspot.com",
        messagingSenderId: "1003628190110",
        appId: "1:1003628190110:web:ec602204b09eecf33a5e8f",
        measurementId: "G-HHQVD5HJJE"
    };

    initializeApp(firebaseConfig);


    const ablyClient = new Realtime({
        key: import.meta.env.VITE_ABLY_API,
        clientId: Math.floor(100000 + Math.random() * 900000).toString()
    });

    const [chatDisplay, setChatDisplay] = useState(true)
    const [aiDisplay, setAiDisplay] = useState(false)
    const [aiTextOrImage, setAiTextOrImage] = useState(true)

    return (
        <>
            <BrowserRouter>
                <ContextState>
                    <AblyProvider client={ablyClient}>
                        <Routes>
                            <Route exact path={"/"} element={<LogIn/>}/>
                            <Route exact path={"/chat"} element={
                                <ChatPage chatDisplay={chatDisplay} setChatDisplay={setChatDisplay} client={ablyClient} aiDisplay={aiDisplay} setAiDisplay={setAiDisplay} aiTextOrImage={aiTextOrImage} setAiTextOrImage={setAiTextOrImage}/>
                            }>
                                <Route path={"chatComponent"} element={<ChatComponent chatDisplay={chatDisplay} client={ablyClient}/>}/>
                                <Route path={"aiComponent"} element={<AiComponent aiDisplay={aiDisplay} aiTextOrImage={aiTextOrImage}/>}/>
                            </Route>
                            <Route exact path={"videoCall/:roomCode"} element={<VideoComponent/>}/>
                        </Routes>
                    </AblyProvider>
                    <ToastContainer
                        position="bottom-right"
                        autoClose={3000}
                        hideProgressBar={false}
                        newestOnTop
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                        theme="dark"
                    />
                </ContextState>
            </BrowserRouter>
        </>
    )
}

export default App
