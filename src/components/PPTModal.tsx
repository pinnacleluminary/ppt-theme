import React from 'react';
import { X } from 'lucide-react';
import PPTEditor from './PPTEditor';

interface PPTModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PPTModal: React.FC<PPTModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h4 className="modal-title">Settings</h4>
          <button 
            className="btn btn-link p-0 border-0"
            onClick={onClose}
          >
            <X size={24} />
          </button>
        </div>
        <div className="modal-content">
          <PPTEditor />
        </div>
      </div>

      <style >{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .modal-container {
          background-color: white;
          width: 90vw;
          height: 90vh;
          border-radius: 8px;
          display: flex;
          flex-direction: column;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          border-bottom: 1px solid #dee2e6;
        }

        .modal-title {
          margin: 0;
          font-size: 1.25rem;
        }

        .modal-content {
          flex: 1;
          overflow: auto;
          padding: 1rem;
        }
      `}</style>
    </div>
  );
};

export default PPTModal;