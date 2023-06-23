import Lessons from "../../pages/Lessons/index.jsx";
import {Layout} from "antd";


export const ROUTES = [
    {
        path: '/',
        element: <Layout />,
    },
    {
        path: '/lesson',
        element: <Lessons/>,
    },
]

