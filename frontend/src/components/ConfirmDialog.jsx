import React from 'react';
import { Modal } from 'antd';
import PropTypes from 'prop-types';
const ConfirmDialog = ({ visible, title, content, handleConfirm, handleCancel }) => {
    return (
        <Modal
            visible={visible}
            title={title}
            onOk={handleConfirm}
            onCancel={handleCancel}
            okText="Xác nhận"
            cancelText="Hủy"
            centered
        >
            <p>{content}</p>
        </Modal>
    );
};
ConfirmDialog.propTypes = {
    visible: PropTypes.any,
    title: PropTypes.string,
    content: PropTypes.string,
    handleConfirm: PropTypes.func.isRequired,
    handleCancel: PropTypes.func.isRequired,
}
export default ConfirmDialog;
