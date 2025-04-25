import React, { useState } from 'react';
import { X, Type, Save, Check } from 'lucide-react';

export interface ThemeFonts {
  titleFont: string;
  bodyFont: string;
  name?: string;
}

interface ThemeFontsEditorProps {
  onSave: (fonts: ThemeFonts) => void;
  onClose: () => void;
  initialFonts?: ThemeFonts;
}

const commonFonts = [
  { name: 'Arial', category: 'Sans-serif' },
  { name: 'Calibri', category: 'Sans-serif' },
  { name: 'Times New Roman', category: 'Serif' },
  { name: 'Helvetica', category: 'Sans-serif' },
  { name: 'Georgia', category: 'Serif' },
  { name: 'Verdana', category: 'Sans-serif' },
  { name: 'Tahoma', category: 'Sans-serif' },
  { name: 'Trebuchet MS', category: 'Sans-serif' },
  { name: 'Century Gothic', category: 'Sans-serif' },
  { name: 'Garamond', category: 'Serif' }
];

export const ThemeFontsEditor: React.FC<ThemeFontsEditorProps> = ({
  onSave,
  onClose,
  initialFonts
}) => {
  const [themeFonts, setThemeFonts] = useState<ThemeFonts>(
    initialFonts || {
      name: '',
      titleFont: 'Arial',
      bodyFont: 'Calibri'
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(themeFonts);
  };

  const FontPreview = ({ font, type }: { font: string; type: 'title' | 'body' }) => {
    const sampleText = type === 'title' 
      ? 'Main Heading Sample'
      : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.';
    
    const fontSize = type === 'title' ? '24px' : '16px';
    
    return (
      <div className="font-preview">
        <div className="font-info">
          <div className="font-name">{font}</div>
          <div className="font-category">
            {commonFonts.find(f => f.name === font)?.category}
          </div>
        </div>
        <div 
          className="preview-text"
          style={{ 
            fontFamily: font,
            fontSize
          }}
        >
          {sampleText}
        </div>
      </div>
    );
  };

  return (
    <div className="fonts-editor-overlay">
      <div className="fonts-editor-container">
        <div className="fonts-editor-content">
          <div className="fonts-editor-header">
            <div className="header-content">
              <Type size={24} className="header-icon" />
              <div>
                <h4>Theme Fonts Editor</h4>
                <p>Customize your presentation's typography</p>
              </div>
            </div>
            <button className="close-button" onClick={onClose}>
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="fonts-editor-body">
              <div className="theme-name-section">
                <label htmlFor="themeName">Theme Name</label>
                <input
                  type="text"
                  id="themeName"
                  value={themeFonts.name || ''}
                  onChange={(e) => setThemeFonts({ ...themeFonts, name: e.target.value })}
                  placeholder="Enter theme name"
                />
              </div>

              <div className="fonts-section">
                <div className="font-group">
                  <label htmlFor="titleFont">Heading Font</label>
                  <select
                    id="titleFont"
                    value={themeFonts.titleFont}
                    onChange={(e) => setThemeFonts({ ...themeFonts, titleFont: e.target.value })}
                  >
                    {commonFonts.map(({ name, category }) => (
                      <option key={name} value={name}>
                        {name} ({category})
                      </option>
                    ))}
                  </select>
                  <FontPreview font={themeFonts.titleFont} type="title" />
                </div>

                <div className="font-group">
                  <label htmlFor="bodyFont">Body Font</label>
                  <select
                    id="bodyFont"
                    value={themeFonts.bodyFont}
                    onChange={(e) => setThemeFonts({ ...themeFonts, bodyFont: e.target.value })}
                  >
                    {commonFonts.map(({ name, category }) => (
                      <option key={name} value={name}>
                        {name} ({category})
                      </option>
                    ))}
                  </select>
                  <FontPreview font={themeFonts.bodyFont} type="body" />
                </div>
              </div>
            </div>

            <div className="fonts-editor-footer">
              <button type="button" className="btn btn-cancel" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-save">
                <Save size={18} />
                Save Theme Fonts
              </button>
            </div>
          </form>
        </div>
      </div>

      <style>{`
        .fonts-editor-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1050;
          backdrop-filter: blur(4px);
          animation: fadeIn 0.2s ease-out;
        }

        .fonts-editor-container {
          width: 90%;
          max-width: 600px;
          margin: 2rem;
          animation: slideIn 0.3s ease-out;
        }

        .fonts-editor-content {
          background: white;
          border-radius: 16px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }

        .fonts-editor-header {
          padding: 24px 32px;
          border-bottom: 1px solid #f0f0f0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .header-content {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .header-icon {
          color: #4472C4;
        }

        .header-content h4 {
          margin: 0;
          font-weight: 600;
          color: #2d3748;
        }

        .header-content p {
          margin: 4px 0 0;
          color: #718096;
          font-size: 0.9rem;
        }

        .close-button {
          background: none;
          border: none;
          padding: 8px;
          border-radius: 8px;
          color: #718096;
          cursor: pointer;
          transition: all 0.2s;
        }

        .close-button:hover {
          background-color: #f7fafc;
          color: #2d3748;
        }

        .fonts-editor-body {
          padding: 32px;
        }

        .theme-name-section {
          margin-bottom: 32px;
        }

        .theme-name-section label {
          display: block;
          margin-bottom: 8px;
          color: #4a5568;
          font-weight: 500;
        }

        .theme-name-section input {
          width: 100%;
          padding: 12px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 1rem;
          transition: all 0.2s;
        }

        .theme-name-section input:focus {
          outline: none;
          border-color: #4472C4;
          box-shadow: 0 0 0 3px rgba(68, 114, 196, 0.1);
        }

        .fonts-section {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        .font-group {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .font-group label {
          color: #4a5568;
          font-weight: 500;
        }

        .font-group select {
          padding: 12px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 1rem;
          transition: all 0.2s;
        }

        .font-group select:focus {
          outline: none;
          border-color: #4472C4;
          box-shadow: 0 0 0 3px rgba(68, 114, 196, 0.1);
        }

        .font-preview {
          background-color: #f8fafc;
          border-radius: 12px;
          padding: 20px;
          margin-top: 8px;
        }

        .font-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .font-name {
          font-weight: 600;
          color: #2d3748;
        }

        .font-category {
          color: #718096;
          font-size: 0.9rem;
        }

        .preview-text {
          color: #2d3748;
          line-height: 1.5;
        }

        .fonts-editor-footer {
          padding: 24px 32px;
          border-top: 1px solid #f0f0f0;
          display: flex;
          justify-content: flex-end;
          gap: 12px;
        }

        .btn {
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s;
        }

        .btn-cancel {
          color: #718096;
          background: none;
          border: 1px solid #e2e8f0;
        }

        .btn-cancel:hover {
          background-color: #f7fafc;
        }

        .btn-save {
          background-color: #4472C4;
          color: white;
          border: none;
        }

        .btn-save:hover {
          background-color: #3461b3;
          transform: translateY(-1px);
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 640px) {
          .fonts-editor-container {
            width: 95%;
            margin: 1rem;
          }

          .fonts-editor-body {
            padding: 20px;
          }

          .fonts-editor-footer {
            padding: 20px;
          }
        }
      `}</style>
    </div>
  );
};