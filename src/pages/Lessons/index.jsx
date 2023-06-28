import {Col, Image, Input, notification, Row, Select, Table, Tag} from "antd";
import {CheckOutlined, EyeOutlined, StopOutlined} from "@ant-design/icons";
import {useEffect, useState} from "react";
import {getAllLesson, updateLessonStatus} from "../../services/lesson.service.js";
import FormConfirm from "../../components/ModalForm/FormConfirm/index.jsx";
import useCallApi from "../../hooks/useCallApi.js";
import ModalUserInfo from "./ModalUserInfo/index.jsx";
import Spinner from "../../components/Spinner/index.jsx";

const Lessons = () => {
    const [lesson, setLesson] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [status, setStatus] = useState(0);
    const [searchText, setSearchText] = useState("");
    const [showVerifyModal, setShowVerifyModal] = useState(false);
    const [rowData, setRowData] = useState()
    const [showLockModal, setShowLockModal] = useState(false);
    const [showUserInfoModal, setShowUserInfoModal] = useState(false);
    const [cacheData, setCacheData] = useState({});

    const onFetchLessonSuccess = (success) => {
        setLesson(success?.data)
        setTotal(success?.totalView)
        if (success?.totalView > page * pageSize) {
            setCacheData((prevCache) => ({
                ...prevCache,
                //if page is bigger then 1, make a loop from 1 to page - 1 and set to cacheData with key is page number
                ...[...Array(page).keys()].reduce((acc, cur) => {
                    acc[`${cur + 1}-${pageSize}-${status}-${searchText}`] =
                        //set success data to cacheData from success.data[cur] to success.data[cur+ 1]
                        {
                            // eslint-disable-next-line no-unsafe-optional-chaining
                            data: [...success?.data.slice((cur) * pageSize, (cur + 1) * pageSize)],
                            total: success?.totalView
                        }
                    return acc
                }, {})
            }));
        } else {
            const cacheKey = `${page}-${pageSize}-${status}-${searchText}`;
            setCacheData((prevCache) => ({
                ...prevCache,
                [cacheKey]: {
                    data: success?.data,
                    total: success?.totalView
                }
            }));
        }
    }

    const {send: fetchLessons, loading: lessonLoading} = useCallApi({
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
        setPage(1)
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
        const value = e.target.value?.trim();
        setPage(1)
        setSearchText(value)
    };

    const handleFilterLessonStatus = (value) => {
        setPage(1)
        setStatus(value)
    }

    const verifyLesson = () => {
        updateLesson({lessonId: rowData?.nid, status: 2})
    }

    const lockLesson = () => {
        updateLesson({lessonId: rowData?.nid, status: 3})
    }

    useEffect(() => {
        const cacheKey = `${page}-${pageSize}-${status}-${searchText}`;
        if (cacheData[cacheKey]) {
            const {data, total} = cacheData[cacheKey];
            setLesson(data);
            setTotal(total);
        } else {
            fetchLessons({
                status: status,
                start: (page - 1) * pageSize + 1,
                number: total !== 0 ? ((page - 1) * pageSize + pageSize > total ? total : (page - 1) * pageSize + pageSize) : (page - 1) * pageSize + pageSize,
                title: searchText
            })
        }
    }, [page, pageSize, status, searchText])

    console.log(page, pageSize, lesson, searchText, status, cacheData)


    return (
        <div>
            <Row justify={"space-between"} style={{margin: "2rem 0"}}>
                <Col span={12}>
                    <Row gutter={24}>
                        <Col span={12}>
                            <Input
                                placeholder="Search by name"
                                onChange={handleSearch}
                            />
                        </Col>
                        <Col span={12}>
                            <Select
                                defaultValue={status}
                                value={status}
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
            {lessonLoading ? <Spinner/> : (
                <>
                    <Table
                        dataSource={lesson}
                        rowKey={(record) => record?.nid}
                        scroll={{
                            y: 600
                        }}
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
                                width: 100,
                                render: (status) => {
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
                                    (record?.status === "1" || record?.status === "0") &&
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
                            current: page,
                            pageSize: pageSize,
                            total: total,
                            onChange: (page, pageSize) => {
                                setPage(page)
                                setPageSize(pageSize)
                            }
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
                </>
            )}
        </div>
    )
}

export default Lessons