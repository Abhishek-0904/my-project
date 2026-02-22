import React from 'react';
import './ConfirmModal.css';

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, confirmText = "Confirm", cancelText = "Cancel", type = "danger" }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay animate-fade-in" onClick={onCancel}>
            <div className={`modal-content animate-zoom-in ${type}`} onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <div className="modal-icon">
                        {type === 'danger' ? '⚠️' : '❓'}
                    </div>
                    <h3>{title}</h3>
                </div>
                <div className="modal-body">
                    <p>{message}</p>
                </div>
                <div className="modal-footer">
                    <button className="modal-btn cancel" onClick={onCancel}>{cancelText}</button>
                    <button className={`modal-btn confirm ${type}`} onClick={onConfirm}>{confirmText}</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
