import React, { useState } from 'react';
import { X } from 'lucide-react';

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
  'Arial',
  'Calibri',
  'Times New Roman',
  'Helvetica',
  'Georgia',
  'Verdana',
  'Tahoma',
  'Trebuchet MS',
  'Century Gothic',
  'Garamond'
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

  return (
    <div className="modal show d-block" tabIndex={-1}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Create New Theme Fonts</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="themeName" className="form-label">
                  Theme Fonts Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="themeName"
                  value={themeFonts.name || ''}
                  onChange={(e) =>
                    setThemeFonts({ ...themeFonts, name: e.target.value })
                  }
                  placeholder="Custom Theme 1"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="titleFont" className="form-label">
                  Heading Font
                </label>
                <select
                  className="form-select"
                  id="titleFont"
                  value={themeFonts.titleFont}
                  onChange={(e) =>
                    setThemeFonts({ ...themeFonts, titleFont: e.target.value })
                  }
                >
                  {commonFonts.map((font) => (
                    <option key={font} value={font} style={{ fontFamily: font }}>
                      {font}
                    </option>
                  ))}
                </select>
                <div className="mt-2">
                  <div
                    className="p-2 border rounded"
                    style={{ fontFamily: themeFonts.titleFont }}
                  >
                    AaBbCcDdEeFf 123456
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="bodyFont" className="form-label">
                  Body Font
                </label>
                <select
                  className="form-select"
                  id="bodyFont"
                  value={themeFonts.bodyFont}
                  onChange={(e) =>
                    setThemeFonts({ ...themeFonts, bodyFont: e.target.value })
                  }
                >
                  {commonFonts.map((font) => (
                    <option key={font} value={font} style={{ fontFamily: font }}>
                      {font}
                    </option>
                  ))}
                </select>
                <div className="mt-2">
                  <div
                    className="p-2 border rounded"
                    style={{ fontFamily: themeFonts.bodyFont }}
                  >
                    AaBbCcDdEeFf 123456
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Save Theme Fonts
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};