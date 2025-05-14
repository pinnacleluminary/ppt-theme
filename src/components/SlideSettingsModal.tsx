import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react';
import { Modal, Button, Form, Nav } from 'react-bootstrap';
import { Slide } from './PPTTypes';
import "./SlideSettingsModal.css";
import WarningModal from './WarningModal';
import { ChartEditor } from './charts/ChartEditor';
import { ThemeColors } from './PPTTypes';

interface SlideSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (settings: SlideSettings) => void;
  initialSlide?: Slide;
  mode: 'create' | 'edit';
}

interface SlideSettings {
  colors: {
    background: string;
    titleColor: string;
    contentColor: string;
  };
  fonts: {
    titleFont: string;
    bodyFont: string;
  };
  subSlides: Array<{
    id: string;
    title: string;
    content: string;
  }>;
}

const SlideSettingsModal: React.FC<SlideSettingsModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialSlide,
  mode
}) => {
    const [activeMenu, setActiveMenu] = useState<'general' | 'colors' | 'fonts'>('general');
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [settings, setSettings] = useState<SlideSettings>({
        colors: {
        background: initialSlide?.background || '#ffffff',
        titleColor: initialSlide?.titleColor || '#000000',
        contentColor: initialSlide?.contentColor || '#333333'
        },
        fonts: {
        titleFont: initialSlide?.titleFont || 'Arial',
        bodyFont: initialSlide?.bodyFont || 'Calibri'
        },
        subSlides: initialSlide?.subSlides || [{
        id: `new-${Date.now()}`,
        title: '',
        content: ''
        }]
    });

    const [showWarning, setShowWarning] = useState(false);

    const defaultThemeColors: ThemeColors = {
        textDark1: '#000000',
        textLight1: '#FFFFFF',
        textDark2: '#333333',
        textLight2: '#F5F5F5',
        accent1: '#4472C4',
        accent2: '#ED7D31',
        accent3: '#A5A5A5',
        accent4: '#FFC000',
        accent5: '#5B9BD5',
        accent6: '#70AD47',
        hyperlink: '#0563C1',
        followedHyperlink: '#954F72'
    };

    useEffect(() => {
        if (isOpen) {
        document.body.style.overflow = 'hidden';
        } else {
        document.body.style.overflow = 'unset';
        }
        return () => {
        document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const handleClose = () => {
        if (hasUnsavedChanges) {
            setShowWarning(true);
        } else {
            onClose();
        }
    };

  const handleSave = () => {
    onSave(settings);
    setHasUnsavedChanges(false);
    onClose();
  };

  const updateSettings = (
    section: keyof SlideSettings,
    field: string,
    value: string | any
  ) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
    setHasUnsavedChanges(true);
  };

  const updateSubSlide = (index: number, field: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      subSlides: prev.subSlides.map((subSlide, i) => 
        i === index ? { ...subSlide, [field]: value } : subSlide
      )
    }));
    setHasUnsavedChanges(true);
  };

  const renderGeneralForm = () => (
    <Form>
      {settings.subSlides.map((subSlide, index) => (
        <div key={subSlide.id}>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              value={subSlide.title}
              onChange={(e) => updateSubSlide(index, 'title', e.target.value)}
              placeholder="Enter slide title"
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Content</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={subSlide.content}
              onChange={(e) => updateSubSlide(index, 'content', e.target.value)}
              placeholder="Enter slide content"
            />
          </Form.Group>
        </div>
      ))}
    </Form>
  );

  if (!isOpen) return null;

  const renderPreview = () => (
    <div className="preview-section">
      <div 
        className="preview-slide"
        style={{
          backgroundColor: settings.colors.background,
        }}
      >
        {settings.subSlides.map((subSlide, index) => (
          <div key={subSlide.id} className="slide-content-editable">
            <div 
              className="editable-title"
              contentEditable
              suppressContentEditableWarning
              style={{
                color: settings.colors.titleColor,
                fontFamily: settings.fonts.titleFont,
                fontSize: '24px',
                marginBottom: '16px',
                outline: 'none',
                padding: '8px',
                borderRadius: '4px',
                transition: 'background-color 0.2s'
              }}
              onBlur={(e) => updateSubSlide(index, 'title', e.currentTarget.textContent || '')}
              onInput={(e) => {
                setHasUnsavedChanges(true);
              }}
            >
              {subSlide.title || 'Click to edit title'}
            </div>
            <div 
              className="editable-content"
              contentEditable
              suppressContentEditableWarning
              style={{
                color: settings.colors.contentColor,
                fontFamily: settings.fonts.bodyFont,
                fontSize: '16px',
                outline: 'none',
                padding: '8px',
                borderRadius: '4px',
                transition: 'background-color 0.2s',
                minHeight: '100px'
              }}
              onBlur={(e) => updateSubSlide(index, 'content', e.currentTarget.textContent || '')}
              onInput={(e) => {
                setHasUnsavedChanges(true);
              }}
            >
              {subSlide.content || 'Click to edit content'}
            </div>
            {initialSlide?.subSlides[index]?.chart && (
              <ChartEditor
                key={initialSlide.subSlides[index].chart.id}
                chartData={initialSlide.subSlides[index].chart}
                onUpdate={() => {}}
                onDelete={() => {}}
                themeColors={defaultThemeColors}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );


  return (
        <>
            <Modal 
                show={isOpen} 
                onHide={handleClose}
                size="xl"
                className="settings-modal"
            >
                <Modal.Header closeButton>
                <Modal.Title>{mode === 'create' ? 'Create New Slide' : 'Edit Slide'}</Modal.Title>
                </Modal.Header>

                <Modal.Body className="p-0">
                <div className="d-flex h-100">
                    <Nav 
                    className="flex-column settings-sidebar"
                    variant="pills"
                    >
                    <Nav.Item>
                        <Nav.Link 
                        active={activeMenu === 'colors'}
                        onClick={() => setActiveMenu('colors')}
                        >
                        Colors
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link 
                        active={activeMenu === 'fonts'}
                        onClick={() => setActiveMenu('fonts')}
                        >
                        Fonts
                        </Nav.Link>
                    </Nav.Item>
                    </Nav>

                    <div className="settings-main flex-grow-1 p-3">
                    {renderPreview()}

                    <div className="settings-form mt-4">
                        {activeMenu === 'colors' && (
                        <Form>
                            <Form.Group className="mb-3">
                            <Form.Label>Background Color</Form.Label>
                            <div className="d-flex align-items-center gap-2">
                                <Form.Control
                                type="color"
                                value={settings.colors.background}
                                onChange={(e) => updateSettings('colors', 'background', e.target.value)}
                                />
                                <span>{settings.colors.background}</span>
                            </div>
                            </Form.Group>
                            <Form.Group className="mb-3">
                            <Form.Label>Title Color</Form.Label>
                            <div className="d-flex align-items-center gap-2">
                                <Form.Control
                                type="color"
                                value={settings.colors.titleColor}
                                onChange={(e) => updateSettings('colors', 'titleColor', e.target.value)}
                                />
                                <span>{settings.colors.titleColor}</span>
                            </div>
                            </Form.Group>
                            <Form.Group>
                            <Form.Label>Content Color</Form.Label>
                            <div className="d-flex align-items-center gap-2">
                                <Form.Control
                                type="color"
                                value={settings.colors.contentColor}
                                onChange={(e) => updateSettings('colors', 'contentColor', e.target.value)}
                                />
                                <span>{settings.colors.contentColor}</span>
                            </div>
                            </Form.Group>
                        </Form>
                        )}

                        {activeMenu === 'fonts' && (
                        <Form>
                            <Form.Group className="mb-3">
                            <Form.Label>Title Font</Form.Label>
                            <Form.Select
                                value={settings.fonts.titleFont}
                                onChange={(e) => updateSettings('fonts', 'titleFont', e.target.value)}
                            >
                                <option value="Arial">Arial</option>
                                <option value="Helvetica">Helvetica</option>
                                <option value="Times New Roman">Times New Roman</option>
                            </Form.Select>
                            </Form.Group>
                            <Form.Group>
                            <Form.Label>Body Font</Form.Label>
                            <Form.Select
                                value={settings.fonts.bodyFont}
                                onChange={(e) => updateSettings('fonts', 'bodyFont', e.target.value)}
                            >
                                <option value="Calibri">Calibri</option>
                                <option value="Arial">Arial</option>
                                <option value="Georgia">Georgia</option>
                            </Form.Select>
                            </Form.Group>
                        </Form>
                        )}
                    </div>
                    </div>
                </div>
                </Modal.Body>

                <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={handleSave}>
                    Save Changes
                </Button>
                </Modal.Footer>
            </Modal>

            <Modal 
                show={showWarning} 
                onHide={() => setShowWarning(false)} 
                centered
                className="warning-modal" // Add this className
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        <div className="d-flex align-items-center gap-2 text-danger">
                            <AlertTriangle size={24} />
                            Unsaved Changes
                        </div>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to close? Your changes will be lost.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" className="btn-cancel" onClick={() => setShowWarning(false)}>
                        Cancel
                    </Button>
                    <Button 
                        variant="danger"
                        className="btn-discard"
                        onClick={() => {
                            setShowWarning(false);
                            onClose();
                        }}
                    >
                        Discard Changes
                    </Button>
                </Modal.Footer>
            </Modal>

        </>
    );
};

export default SlideSettingsModal;
