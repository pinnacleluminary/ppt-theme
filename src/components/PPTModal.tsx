import React, { useState, useCallback } from 'react';
import { Modal, Button, Spinner } from 'react-bootstrap';
import { Save, Settings, X, AlertCircle } from 'lucide-react';
import PPTEditor from './PPTEditor';
import { PPTSettingsService } from './PPTSettingsService';
import { PresentationSettings } from './PPTTypes';
import { toast } from 'react-toastify';

interface PPTModalProps {
  show: boolean;
  onHide: () => void;
  initialSettings?: PresentationSettings;
}

const PPTModal: React.FC<PPTModalProps> = ({ 
  show, 
  onHide,
  initialSettings 
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState<PresentationSettings | null>(initialSettings || null);

  const handleSettingsChange = useCallback((newSettings: PresentationSettings) => {
    setSettings(newSettings);
  }, []);

  const handleSave = async () => {
    if (!settings) {
      toast.error('No settings to save');
      return;
    }

    if (!PPTSettingsService.validateSettings(settings)) {
      toast.error('Invalid settings configuration');
      return;
    }

    setIsSaving(true);
    try {
      console.log(settings);
      const response = await PPTSettingsService.saveSettings(settings);
      toast.success('Settings saved successfully');
      onHide();
      console.log('Save response:', response);
    } catch (error) {
      toast.error('Failed to save settings');
      console.error('Save error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="xl"
      backdrop="static"
      keyboard={false}
      centered
      className="ppt-editor-modal"
    >
      <Modal.Header className="border-0 px-4 pt-4 pb-0">
        <div className="d-flex justify-content-between align-items-center w-100">
          <div className="d-flex align-items-center gap-2">
            <Settings className="text-primary" size={24} />
            <Modal.Title className="mb-0 h4">
              Presentation Settings
            </Modal.Title>
          </div>
          <button
            className="btn-close-custom"
            onClick={onHide}
            disabled={isSaving}
          >
            <X size={24} />
          </button>
        </div>
      </Modal.Header>

      <Modal.Body className="px-4 py-3">
        <div className="settings-container">
          {!settings && (
            <div className="no-settings-warning">
              <AlertCircle size={24} className="text-warning" />
              <p>No settings loaded. Start customizing your presentation.</p>
            </div>
          )}
          <div className="position-relative editor-container">
            <PPTEditor
              onSettingsChange={handleSettingsChange}
              initialSettings={settings}
            />
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer className="border-0 px-4 pb-4 pt-2">
        <div className="d-flex justify-content-between w-100">
          <Button 
            variant="light" 
            onClick={onHide} 
            disabled={isSaving}
            className="btn-cancel"
          >
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSave}
            disabled={isSaving}
            className="btn-save"
          >
            {isSaving ? (
              <div className="d-flex align-items-center gap-2">
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
                <span>Saving...</span>
              </div>
            ) : (
              <div className="d-flex align-items-center gap-2">
                <Save size={18} />
                <span>Save Settings</span>
              </div>
            )}
          </Button>
        </div>
      </Modal.Footer>

      <style>{`
        .ppt-editor-modal .modal-content {
          height: 90vh;
          border-radius: 16px;
          border: none;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
        }
        
        .ppt-editor-modal .modal-body {
          overflow-y: auto;
        }

        .settings-container {
          background-color: #f8f9fa;
          border-radius: 12px;
          min-height: 500px;
        }

        .editor-container {
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
          padding: 20px;
        }

        .no-settings-warning {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          background-color: #fff3cd;
          border-radius: 8px;
          margin-bottom: 16px;
        }

        .no-settings-warning p {
          margin: 0;
          color: #856404;
        }

        .btn-close-custom {
          background: none;
          border: none;
          padding: 8px;
          color: #6c757d;
          border-radius: 8px;
          transition: all 0.2s ease;
        }

        .btn-close-custom:hover {
          background-color: #f8f9fa;
          color: #343a40;
        }

        .btn-close-custom:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .btn-save {
          padding: 10px 24px;
          font-weight: 500;
          border-radius: 8px;
          transition: all 0.2s ease;
          background: linear-gradient(45deg, #4361ee, #3f37c9);
          border: none;
          box-shadow: 0 4px 12px rgba(67, 97, 238, 0.2);
        }

        .btn-save:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(67, 97, 238, 0.3);
        }

        .btn-cancel {
          padding: 10px 24px;
          font-weight: 500;
          border-radius: 8px;
          transition: all 0.2s ease;
          border: 1px solid #dee2e6;
        }

        .btn-cancel:hover:not(:disabled) {
          background-color: #f8f9fa;
        }

        .modal-title {
          font-weight: 600;
          color: #2d3748;
        }

        /* Custom scrollbar */
        .modal-body::-webkit-scrollbar {
          width: 8px;
        }

        .modal-body::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }

        .modal-body::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 4px;
        }

        .modal-body::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }

        /* Spinner customization */
        .spinner-border {
          width: 1.2rem;
          height: 1.2rem;
          border-width: 0.15em;
        }

        /* Animation for modal appearance */
        .modal.show .modal-content {
          animation: modalSlideIn 0.3s ease-out;
        }

        @keyframes modalSlideIn {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </Modal>
  );
};

export default PPTModal;