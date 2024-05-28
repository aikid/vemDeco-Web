import React from 'react';
import './Modal.css'; // Assumindo que vamos usar um arquivo CSS para estilos

interface ModalProps {
  show: boolean;
  onClose: () => void;
  title?: string;
  content: React.ReactNode;
  actions?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ show, onClose, title, content, actions }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        {title && <div className="modal-header">
          <h2>{title}</h2>
        </div>}
        <div className="modal-content">
          {content}
        </div>
        {actions && <div className="modal-actions">
          {actions}
        </div>}
        <button className="modal-close" onClick={onClose}>X</button>
      </div>
    </div>
  );
};

export default Modal;
