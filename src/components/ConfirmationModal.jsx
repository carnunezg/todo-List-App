import React from "react";
import "./styles/ConfirmationModal.css";

const ConfirmationModal = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <p className="pMessage">{message}</p>
        <div>
          <button className="confirm-button" onClick={onConfirm}>
            Aceptar
          </button>
          <button className="cancel-button" onClick={onCancel}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
