import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.scss'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Login from "./pages/Login/index.jsx";
import {ROUTES} from "./config/Router/routes.jsx";
import AuthProvider from "./context/Auth/AuthProvider.jsx";

ReactDOM.createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <AuthProvider>
            <Routes>
                <Route path="/" element={<App/>}>
                    {ROUTES.map((item, index) =>
                        <Route path={item.path} element={item.element} key={index}/>
                    )}
                </Route>
                <Route path="/login" element={<Login/>}/>

            </Routes>
        </AuthProvider>
    </BrowserRouter>
)
