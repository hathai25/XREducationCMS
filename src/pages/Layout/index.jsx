import "./styles.scss"
import {Breadcrumb, Col, notification, Row} from "antd";
import Sidebar from "../../components/Sidebar";
import {useLocation} from "react-router-dom";
import {MAP_PATHNAME_TO_BREADCRUMB} from "../../constants.js";
import {LogoutOutlined} from "@ant-design/icons";
import PropTypes from "prop-types";
import {useAuth} from "../../context/Auth/AuthProvider.jsx";
import Login from "../Login/index.jsx";


const Layout = ({children}) => {
    const {pathname} = useLocation();
    const token = localStorage.getItem("token");

    const breadCrumbItems = [
        {title: "Home", href: "/"},
        ...MAP_PATHNAME_TO_BREADCRUMB.filter(item => item.href === pathname)
    ]


    return (
        <>
            {token ? (
                <Row>
                    <Col xs={3}>
                        <Sidebar/>
                    </Col>
                    <Col xs={21}>
                        <div style={{
                            height: 40,
                            backgroundColor: "#fff",
                            boxShadow: "0 3px 4px rgba(0,21,41,.08)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-end",
                        }}>
                              <span onClick={() => {
                                  localStorage.removeItem("token");
                                  window.location.href = "/";
                                  notification.success({
                                      message: "Success",
                                      description: "Logout success!"
                                  })
                              }}>
                                <LogoutOutlined style={{fontSize: 20, marginRight: 10, color: "grey", cursor: "pointer"}}/>
                              </span>
                        </div>
                        <div style={{padding: "2rem", maxHeight: "100vh"}}>
                            {pathname !== "/" && (
                                <Breadcrumb
                                    separator={"/"}
                                    items={breadCrumbItems}
                                    style={{marginBottom: 16, fontSize: 16}}
                                />
                            )}
                            {children}
                        </div>
                    </Col>
                </Row>)
             : <Login/>}
        </>
    )
}

export default Layout

Layout.propTypes = {
    children: PropTypes.node.isRequired,
};