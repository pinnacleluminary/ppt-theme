import React from 'react';
import { BarChart, Bar, XAxis, ResponsiveContainer } from 'recharts';

interface ThemeColors {
  textDark1: string;
  textLight1: string;
  textDark2: string;
  textLight2: string;
  accent1: string;
  accent2: string;
  accent3: string;
  accent4: string;
  accent5: string;
  accent6: string;
  hyperlink: string;
  followedHyperlink: string;
}

interface ThemeColorPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (colors: ThemeColors, name: string) => void;
}

export const defaultThemeColors: ThemeColors = {
  textDark1: '#44546A',
  textLight1: '#FFFFFF',
  textDark2: '#44546A',
  textLight2: '#E7E6E6',
  accent1: '#4472C4',
  accent2: '#ED7D31',
  accent3: '#A5A5A5',
  accent4: '#FFC000',
  accent5: '#5B9BD5',
  accent6: '#70AD47',
  hyperlink: '#0563C1',
  followedHyperlink: '#954F72'
};

export const ThemeColorPicker: React.FC<ThemeColorPickerProps> = ({ isOpen, onClose, onSave }) => {
  const [colors, setColors] = React.useState<ThemeColors>(defaultThemeColors);
  const [name, setName] = React.useState('Custom 1');

  const handleColorChange = (key: keyof ThemeColors, value: string) => {
    setColors(prev => ({
      ...prev,
      [key]: value
    }));
  };

  if (!isOpen) return null;

  // Sample chart data
  const generateChartData = (isDark: boolean) => [
    { name: '1', value: 30, fill: colors.accent1 },
    { name: '2', value: 45, fill: colors.accent2 },
    { name: '3', value: 65, fill: colors.accent3 },
    { name: '4', value: 50, fill: colors.accent4 },
    { name: '5', value: 40, fill: colors.accent5 },
    { name: '6', value: 25, fill: colors.accent6 }
  ];

  // Sample component that includes both chart and text
  const SamplePreview = ({ isDark }: { isDark: boolean }) => {
    const bgColor = isDark ? colors.textDark1 : colors.textLight1;
    const textColor = isDark ? colors.textLight1 : colors.textDark1;
    
    return (
      <div className="p-3" style={{ 
        backgroundColor: bgColor, 
        color: textColor,
        height: '200px',
        borderRadius: '4px'
      }}>
        <div className="mb-2">Text</div>
        <div style={{ height: '100px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={generateChartData(isDark)}>
              <XAxis dataKey="name" tick={false} />
              <Bar dataKey="value">
                {generateChartData(isDark).map((entry, index) => (
                  <Bar
                    key={`cell-${index}`}
                    dataKey="value"
                    fill={entry.fill}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div style={{ color: colors.hyperlink }}>Hyperlink</div>
        <div style={{ color: colors.followedHyperlink }}>Hyperlink</div>
      </div>
    );
  };

  return (
    <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Create New Theme Colors</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <div className="row">
              <div className="col-md-7">
                <h6>Theme colors</h6>
                {Object.entries(colors).map(([key, value]) => (
                  <div key={key} className="d-flex align-items-center mb-2">
                    <label className="me-2" style={{ width: '180px' }}>
                      {key.replace(/([A-Z])/g, ' $1')
                         .replace(/^./, str => str.toUpperCase())}
                    </label>
                    <input
                      type="color"
                      value={value}
                      onChange={(e) => handleColorChange(key as keyof ThemeColors, e.target.value)}
                      className="form-control form-control-color"
                    />
                  </div>
                ))}
              </div>
              <div className="col-md-5">
                <h6>Sample</h6>
                <div className="d-flex gap-2">
                  <div style={{ flex: 1 }}>
                    <SamplePreview isDark={true} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <SamplePreview isDark={false} />
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-3">
              <div className="row align-items-center">
                <div className="col-auto">
                  <label className="form-label mb-0">Name:</label>
                </div>
                <div className="col">
                  <input
                    type="text"
                    className="form-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={() => setColors(defaultThemeColors)}>
              Reset
            </button>
            <button className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button 
              className="btn btn-primary" 
              onClick={() => onSave(colors, name)}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};