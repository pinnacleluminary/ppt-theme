import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react';
import { Modal, Button, Form, Nav, Spinner } from 'react-bootstrap';
import { Slide, SlideSettings } from './PPTTypes';
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

interface PreviewProps {
  settings: SlideSettings;
  logoPreview: string;
  onUpdateSubSlide: (index: number, field: string, value: string) => void;
  setHasUnsavedChanges: (value: boolean) => void;
  initialSlide?: Slide;
  defaultThemeColors: ThemeColors;
}

const Preview: React.FC<PreviewProps> = ({
  settings,
  logoPreview,
  onUpdateSubSlide,
  setHasUnsavedChanges,
  initialSlide,
  defaultThemeColors
}) => {
  const getSlideSize = () => {
    switch (settings.general.slideSize) {
      case 'standard': return { width: 1024, height: 768 };
      case 'widescreen': return { width: 1280, height: 720 };
      case 'custom': return {
        width: settings.general.customWidth || 1280,
        height: settings.general.customHeight || 720
      };
      default: return { width: 1024, height: 768 };
    }
  };

  const { width, height } = getSlideSize();
  const containerWidth = 800; // Fixed container width
  const scale = containerWidth / width;
  const scaledHeight = height * scale;

  return (
    <div className="preview-container">
      <div className="preview-header">
        <h6 className="preview-title">Preview</h6>
        <div className="preview-size-info">
          {width} x {height}px
        </div>
      </div>
      
      <div className="slides-preview-wrapper">
        {initialSlide?.subSlides.map((subSlide, index) => (
          <div 
            key={subSlide.id}
            className="preview-wrapper mb-4"
            style={{
              
              width: `${containerWidth}px`,
              height: `${scaledHeight}px`,
              overflow: 'hidden',
              position: 'relative',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              borderRadius: '8px',
              margin: '0 auto'
            }}
          >
              {logoPreview && (
                <div className={`logo-container logo-${settings.general.logoPosition}`}>
                  <img 
                    src={logoPreview} 
                    alt="Logo" 
                    className="slide-logo"
                  />
                </div>
              )}

              <div className="slide-content"
                style={{backgroundColor: settings.colors.background}}
              >
                <div 
                  className="editable-title"
                  contentEditable
                  suppressContentEditableWarning
                  style={{
                    color: settings.colors.titleColor,
                    fontFamily: settings.fonts.titleFont
                  }}
                  onBlur={(e) => onUpdateSubSlide(index, 'title', e.currentTarget.textContent || '')}
                  onInput={() => setHasUnsavedChanges(true)}
                >
                  {subSlide.title || 'Click to edit title'}
                </div>
                
                <div 
                  className="editable-content"
                  contentEditable
                  suppressContentEditableWarning
                  style={{
                    color: settings.colors.contentColor,
                    fontFamily: settings.fonts.bodyFont
                  }}
                  onBlur={(e) => onUpdateSubSlide(index, 'content', e.currentTarget.textContent || '')}
                  onInput={() => setHasUnsavedChanges(true)}
                >
                  {subSlide.content || 'Click to edit content'}
                </div>

                {subSlide.chart && (
                  <div className="chart-container">
                    <ChartEditor
                      key={subSlide.chart.id}
                      chartData={subSlide.chart}
                      onUpdate={() => {}}
                      onDelete={() => {}}
                      themeColors={defaultThemeColors}
                    />
                  </div>
                )}
              </div>
          </div>
        ))}
      </div>
    </div>
  );
};

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
        general: {
            slideSize: initialSlide?.slideSize || 'standard',
            customWidth: initialSlide?.customWidth || 1280,
            customHeight: initialSlide?.customHeight || 720,
            logo: initialSlide?.logo || '',
            logoPosition: initialSlide?.logoPosition || 'top-left'
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

    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string>(initialSlide?.logo || '');
    const [isSaving, setIsSaving] = useState(false);

    const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
        setLogoFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            setLogoPreview(base64String);
            updateSettings('general', 'logo', base64String);
        };
        reader.readAsDataURL(file);
        }
    };

    const getSlideSize = () => {
        switch (settings.general.slideSize) {
        case 'standard':
            return { width: 1024, height: 768 };
        case 'widescreen':
            return { width: 1280, height: 720 };
        case 'custom':
            return {
            width: settings.general.customWidth || 1280,
            height: settings.general.customHeight || 720
            };
        default:
            return { width: 1024, height: 768 };
        }
    };
    useEffect(() => {
      if (initialSlide) {
        setSettings({
            colors: {
                background: initialSlide.background || '#ffffff',
                titleColor: initialSlide.titleColor || '#000000',
                contentColor: initialSlide.contentColor || '#333333'
            },
            fonts: {
                titleFont: initialSlide.titleFont || 'Arial',
                bodyFont: initialSlide.bodyFont || 'Calibri'
            },
            general: {
                slideSize: initialSlide.slideSize || 'standard',
                customWidth: initialSlide.customWidth || 1280,
                customHeight: initialSlide.customHeight || 720,
                logo: initialSlide.logo || '',
                logoPosition: initialSlide.logoPosition || 'top-left'
            },
            subSlides: initialSlide.subSlides || [{
                id: `new-${Date.now()}`,
                title: '',
                content: ''
            }]
        });
        setLogoPreview(initialSlide.logo || '');
      }
    }, [initialSlide]);

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

  // const handleSave = () => {
  //   onSave(settings);
  //   setHasUnsavedChanges(false);
  //   onClose();
  // };

  const handleSave = async () => {
      try {
          setIsSaving(true);
          await onSave(settings);
          setHasUnsavedChanges(false);
          onClose();
      }catch (error) {
          console.error('Error saving settings:', error);
      }finally {
        setIsSaving(false);
      }
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
  const renderGeneralSettings = () => (
    <Form>
      <Form.Group className="mb-4">
        <Form.Label>Slide Size</Form.Label>
        <Form.Select
          value={settings.general.slideSize}
          onChange={(e) => updateSettings('general', 'slideSize', e.target.value)}
          className="mb-2"
        >
          <option value="standard">Standard (4:3)</option>
          <option value="widescreen">Widescreen (16:9)</option>
          <option value="custom">Custom</option>
        </Form.Select>

        {settings.general.slideSize === 'custom' && (
          <div className="d-flex gap-3 mt-2">
            <Form.Group>
              <Form.Label>Width (px)</Form.Label>
              <Form.Control
                type="number"
                value={settings.general.customWidth}
                onChange={(e) => updateSettings('general', 'customWidth', parseInt(e.target.value))}
                min="100"
                max="3840"
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Height (px)</Form.Label>
              <Form.Control
                type="number"
                value={settings.general.customHeight}
                onChange={(e) => updateSettings('general', 'customHeight', parseInt(e.target.value))}
                min="100"
                max="2160"
              />
            </Form.Group>
          </div>
        )}
      </Form.Group>

      <Form.Group className="mb-4">
        <Form.Label>Logo</Form.Label>
        <div className="d-flex gap-3 align-items-start">
          <div className="logo-upload-container">
            <div 
              className="logo-preview"
              style={{
                width: '100px',
                height: '100px',
                border: '1px dashed #ccc',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '10px',
                backgroundColor: '#f8f9fa'
              }}
            >
              {logoPreview ? (
                <img 
                  src={logoPreview} 
                  alt="Logo preview" 
                  style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} 
                />
              ) : (
                <span className="text-muted">No logo</span>
              )}
            </div>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="mb-2"
            />
          </div>
          
          <Form.Group>
            <Form.Label>Logo Position</Form.Label>
            <Form.Select
              value={settings.general.logoPosition}
              onChange={(e) => updateSettings('general', 'logoPosition', e.target.value)}
            >
              <option value="top-left">Top Left</option>
              <option value="top-center">Top Center</option>
              <option value="top-right">Top Right</option>
              <option value="bottom-left">Bottom Left</option>
              <option value="bottom-center">Bottom Center</option>
              <option value="bottom-right">Bottom Right</option>
            </Form.Select>
          </Form.Group>
        </div>
      </Form.Group>
    </Form>
  );

  if (!isOpen) return null;

  const renderPreview = () => {
     return <Preview
        settings={settings}
        logoPreview={logoPreview}
        onUpdateSubSlide={updateSubSlide}
        setHasUnsavedChanges={setHasUnsavedChanges}
        initialSlide={initialSlide}
        defaultThemeColors={defaultThemeColors}
    />
  };



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
                      active={activeMenu === 'general'}
                      onClick={() => setActiveMenu('general')}
                      >
                      General
                      </Nav.Link>
                  </Nav.Item>
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
                  
                      <div className="settings-form mt-4">
                          {activeMenu === 'general' && renderGeneralSettings()}
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
                        {renderPreview()}
                  </div>
              </div>
              </Modal.Body>

              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={handleSave}>
                  {isSaving ? (
                      <>
                          <Spinner
                              as="span"
                              animation="border"
                              size="sm"
                              role="status"
                              aria-hidden="true"
                              className="me-2"
                          />
                          Saving...
                      </>
                  ) : (
                      'Save Changes'
                  )}
                </Button>
              </Modal.Footer>
          </Modal>

          <Modal 
              show={showWarning} 
              onHide={() => setShowWarning(false)} 
              centered
              className="warning-modal"
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
