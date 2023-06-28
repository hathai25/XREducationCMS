import {Modal, notification, Table, Tag} from "antd";
import PropTypes from "prop-types";
import useCallApi from "../../../hooks/useCallApi.js";
import {getUserInfoViaId} from "../../../services/user.service.js";
import {useEffect, useState} from "react";
import {convertObjToArr} from "../../../utils/helper.js";
import Spinner from "../../../components/Spinner/index.jsx";
import {formatTimeDate} from "../../../utils/time.js";

const ModalUserInfo = ({visible, handleCancel, userId}) => {
    const [userInfo, setUserInfo] = useState();

    const onSuccess = (res) => {
        setUserInfo(res?.data)
    }

    const onError = (error) => {
        notification.error({
            message: 'Error',
            description: error?.message,
            duration: 1,
            maxCount: 1
        })
        setUserInfo(null)
    }

    const { send: getUserInfo, loading } = useCallApi({
        callApi: getUserInfoViaId,
        success: onSuccess,
        error: onError
    })

    useEffect(() => {
        if (userId) getUserInfo({id: userId})
    }, [userId])


    return(
        <Modal
            title={<p>Thông tin người dùng có id: <span style={{color:"red"}}>{userId}</span></p>}
            open={visible}
            onCancel={handleCancel}
            footer={null}
            width={1000}
        >
            {loading ?
                <div style={{height: 100}}>
                    <Spinner />
                </div>
                : (<Table
                    rowKey={(record) => record ? record?.uid : Math.random()}
                    columns={[
                        {
                            title: 'Name',
                            dataIndex: 'field_name',
                            key: 'field_name',
                            width: 200,
                            render: (name) => <span>{name?.und[0]?.value || "Không có dữ liệu"}</span>
                        },
                        {
                            title: 'Email',
                            dataIndex: 'mail',
                            key: 'mail',
                            width: 200,
                            render: (mail) => <span>{mail || "Không có dữ liệu"}</span>
                        },
                        {
                            title: 'Created At',
                            dataIndex: 'created',
                            key: 'created',
                            width: 200,
                            render: (value) => <span>{formatTimeDate(value) || "Không có dữ liệu"}</span>
                        },
                        {
                            title: 'Roles',
                            dataIndex: 'roles',
                            key: 'roles',
                            width: 200,
                            render: (roles) => {
                                if (roles) {
                                    const users = convertObjToArr(roles)
                                    return users.map((item, index) => <Tag color={"blue"} key={index}>{item}</Tag>)
                                } else return "Không có dữ liệu"
                            }
                        },
                    ]}
                    dataSource={[userInfo]}
                    pagination={false}
                />
            )}
        </Modal>
    )
}

ModalUserInfo.propTypes = {
    visible: PropTypes.bool,
    handleCancel: PropTypes.func,
    userId: PropTypes.number
}

export default ModalUserInfo