import {LockOutlined, UserOutlined} from '@ant-design/icons';
import {Button, Form, Input, Col, notification} from 'antd';
import "./styles.scss";
import {loginUser} from "../../services/auth.service.js";
import useCallApi from "../../hooks/useCallApi.js";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../../context/Auth/AuthProvider.jsx";
const Login = () => {
    const navigate = useNavigate()
    const { signInUser } = useAuth();
    const onSuccess = (success) => {
        navigate("/")
        signInUser(success?.data, null)
        notification.success({
            message: "Login success",
            description: "You have successfully logged in"
        })
    }

    const { send } = useCallApi({
        success: onSuccess,
        useToastShowError: true,
        callApi: loginUser
    })

    const onFinish = (values) => {
        send(values)
    }

    return(
        <div className="login-container">
            <Col className="login-container-card" xs={24} md={12} lg={6}>
                <h2 style={{textAlign: "center"}}>Login</h2>
                <Form
                    name="normal_login"
                    className="login-form"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                >
                    <Form.Item
                        name="username"
                        rules={[{ required: true, message: 'Please type your username!' }]}
                    >
                        <Input
                            prefix={<UserOutlined className="site-form-item-icon" />}
                            placeholder="Username"
                            className="login-input"
                        />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Please type your password!' }]}
                    >
                        <Input
                            prefix={<LockOutlined className="site-form-item-icon" />}
                            type="password"
                            placeholder="Password"
                            className="login-input"
                        />
                    </Form.Item>
                    <div className={"login-forgot-password"}>
                        <Button type="primary" htmlType="submit" className="login-form-button" style={{width: "100%", margin: "auto"}}>
                            Log in
                        </Button>
                    </div>
                </Form>
            </Col>
        </div>
    )
}

export default Login