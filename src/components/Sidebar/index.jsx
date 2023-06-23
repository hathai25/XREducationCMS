import {
    MenuFoldOutlined, MenuUnfoldOutlined,
} from '@ant-design/icons';
import {Button, Menu} from 'antd';
import {useState} from 'react';
import "./styles.scss"
import {MENU} from "./menu.jsx";
import {useNavigate} from "react-router-dom";


const Sidebar = () => {
    const navigate = useNavigate();
    return (
        <div
            style={{
                width: '100%',
                height: '100vh',
            }}
        >
            <div style={{display: "flex", height: 40}}>
                <p className="sidebar-logo">CMS</p>
            </div>
            <Menu
                selectedKeys={[window.location.pathname.split("/")[1]]}
                mode="inline"
                onClick={(item) => navigate(`/${item.key}`)}
                items={MENU}
                // style={{
                //     height: 'calc(100vh - 40px)',
                //     borderRight: 0,
                //     backgroundColor: "#EC542C",
                //     color: "#fff"
                // }}
                className="custom-menu"
            />
        </div>
    );
};
export default Sidebar;