import './App.scss'
import {Outlet} from "react-router-dom";
import setupAxiosDefault from "./services/setupAxios.js";
import Layout from "./pages/Layout/index.jsx";

setupAxiosDefault();


function App() {
    return (
        <div>
            <Layout>
                <Outlet/>
            </Layout>
        </div>
    )
}

export default App
