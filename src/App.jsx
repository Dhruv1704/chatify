import './App.css'
import LogIn from "./Components/Login Page/LogIn.jsx";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import ChatPage from "./Components/Main Page/ChatPage.jsx";
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import ContextState from "./context/ContextState.jsx";

function App() {
    return (
        <>
            <BrowserRouter>
                <ContextState>
                    <Routes>
                        <Route exact path={"/"} element={<LogIn/>}/>
                        <Route exact path={"/chat"} element={<ChatPage/>}/>
                    </Routes>
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
