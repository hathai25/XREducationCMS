import {Col, Image, Input, notification, Row, Select, Table, Tag} from "antd";
import {CheckOutlined, EyeOutlined, StopOutlined} from "@ant-design/icons";
import {useEffect, useState} from "react";
import {getAllLesson, updateLessonStatus} from "../../services/lesson.service.js";
import FormConfirm from "../../components/ModalForm/FormConfirm/index.jsx";
import useCallApi from "../../hooks/useCallApi.js";
import ModalUserInfo from "./ModalUserInfo/index.jsx";

const Lessons = () => {
    const [lesson, setLesson] = useState([]);
    // const [lessonStatus, setLessonStatus] = useState(2);
    const [showVerifyModal, setShowVerifyModal] = useState(false);
    const [rowData, setRowData] = useState()
    const [showLockModal, setShowLockModal] = useState(false);
    const [showUserInfoModal, setShowUserInfoModal] = useState(false);

    const onFetchLessonSuccess = (success) => {
        setLesson(success?.data)
    }

    const {send: fetchLessons} = useCallApi({
        success: onFetchLessonSuccess,
        callApi: getAllLesson,
        error: () => {
            notification.error({
                message: 'Error',
                description: 'Fetch lesson failed'
            })
        }
    })

    const onUpdateLessonSuccess = () => {
        setShowVerifyModal(false);
        setShowLockModal(false)
        notification.success({
            message: 'Success',
            description: 'Update lesson status successfully'
        })
        fetchLessons();
    }

    const {send: updateLesson} = useCallApi({
        success: onUpdateLessonSuccess,
        callApi: updateLessonStatus,
        error: () => {
            notification.error({
                message: 'Error',
                description: 'Update lesson status failed'
            })
        }
    })

    const handleSearch = (e) => {
        const value = e.target.value;
        fetchLessons({title: value})
    };

    const handleFilterLessonStatus = (value) => {
        fetchLessons({status: value})
    }

    const verifyLesson = () => {
        updateLesson({lessonId: rowData?.nid, status: 2})
    }

    const lockLesson = () => {
        updateLesson({lessonId: rowData?.nid, status: 3})
    }

    useEffect(() => {
        fetchLessons()
    }, [])

    return (
        <div>
            <Row justify={"space-between"} style={{margin: "2rem 0"}}>
                <Col span={12} >
                    <Row gutter={24}>
                        <Col span={12}>
                            <Input
                                placeholder="Search by name"
                                onChange={handleSearch}
                            />
                        </Col>
                        <Col span={12}>
                            <Select
                                defaultValue={2}
                                onChange={handleFilterLessonStatus}
                                placeholder="Search by status"
                                options={[
                                    {label: 'Chờ duyệt', value: 1},
                                    {label: 'Đã duyệt', value: 2},
                                    {label: 'Đã khóa', value: 3},
                                    {label: 'Tạo mới', value: 0},
                                ]}
                            />
                        </Col>
                    </Row>
                </Col>
            </Row>

            <Table
                dataSource={lesson}
                rowKey={(record) => record?.nid}
                columns={[
                    {
                        title: '#',
                        dataIndex: 'key',
                        rowScope: 'row',
                        render: (text, record, index) => <span style={{color: 'grey'}}>{index + 1}</span>,
                        width: 50,
                    },
                    {
                        title: "Name",
                        dataIndex: "name",
                        key: "name",
                        width: 200,
                    },
                    {
                        title: "Status",
                        dataIndex: "status",
                        key: "status",
                        width: 50,
                        render: (status, record) => {
                            const value = Number(status);
                            if (value === 1) {
                                return <Tag color="orange">Chờ duyệt</Tag>
                            } else if (value === 2) {
                                return <Tag color="green">Đã duyệt</Tag>
                            } else if (value === 0) {
                                return <Tag color="yellow">Tạo mới</Tag>
                            } else {
                                return <Tag color="red">Không hợp lệ</Tag>
                            }
                        }
                    },
                    {
                        title: "Thumbnail",
                        dataIndex: "image_thumb",
                        key: "image_thumb",
                        width: 200,
                        render: (value) => <Image src={value} width={160} height={90}/>
                    },
                    {
                        title: "Category",
                        dataIndex: "cid",
                        key: "cid",
                        width: 200,
                        render: (value) => <span>{value?.name || "Chưa thuộc chủ đề nào"}</span>
                    },
                    {
                        title: "Creator",
                        dataIndex: "uid",
                        key: "uid",
                        width: 200,
                        render: (value, record) => <span
                            style={{
                                color: 'blue',
                                cursor: 'pointer'
                            }}
                            onClick={() => {
                                setRowData(record);
                                setShowUserInfoModal(true)
                            }}
                        >View</span>
                    },
                    {
                        title: "Views",
                        dataIndex: "node_view_count",
                        key: "node_view_count",
                        width: 200,
                        render: (value) => <span>{value?.totalcount} <EyeOutlined/></span>
                    },
                    {
                        title: 'Action',
                        key: 'operation',
                        fixed: 'right',
                        align: 'right',
                        width: 100,
                        render: (value, record) =>
                            (record?.status === "1"  || record?.status === "0") &&
                            <>
                                <span
                                    style={{cursor: 'pointer'}}
                                    onClick={() => {
                                        setRowData(record);
                                        setShowVerifyModal(true)
                                    }}
                                >
                                    <CheckOutlined style={{color: "green", paddingRight: 8}}/>
                                </span>
                                <span
                                    style={{cursor: 'pointer'}}
                                    onClick={() => {
                                        setRowData(record);
                                        setShowLockModal(true)
                                    }}
                                >
                                    <StopOutlined style={{color: "red"}}/>
                                </span>
                            </>
                    },
                ]}
                pagination={{
                    pageSize: 5,
                }}
            />
            <FormConfirm
                title={"Confirm"}
                content={"Are you sure you want to verify this lesson?"}
                visible={showVerifyModal}
                onOk={verifyLesson}
                onCancel={() => {
                    setShowVerifyModal(false)
                }}
            />
            <FormConfirm
                title={"Confirm"}
                content={"Are you sure you want to lock this lesson?"}
                visible={showLockModal}
                onOk={lockLesson}
                onCancel={() => {
                    setShowLockModal(false)
                }}
            />
            <ModalUserInfo
                visible={showUserInfoModal}
                handleCancel={() => {
                    setShowUserInfoModal(false)
                }}
                userId={Number(rowData?.uid)}
            />
        </div>
    )
}

export default Lessons