import {Modal} from "antd";
import PropTypes from "prop-types";

const FormConfirm = ({
    visible,
    title,
    content,
    onOk,
    onCancel
                     }) => {
    return(
        <Modal
            title={title}
            open={visible}
            onOk={onOk}
            onCancel={onCancel}
        >
            {content}
        </Modal>
    )
}

FormConfirm.propTypes = {
    visible: PropTypes.bool,
    title: PropTypes.string,
    content: PropTypes.string,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
}

export default FormConfirm