import React, { useState, useEffect } from 'react';
import { 
  Plus, ChevronLeft, ChevronRight, Save, Settings, 
  BarChart2, Palette, Layout, Monitor, Trash2
} from 'lucide-react';
import { ChartData } from './charts/ChartTypes';
import { DEFAULT_CHART_DATA } from './charts/ChartConstants';
import { ChartModal } from './charts/ChartModal';
import { ChartEditor } from './charts/ChartEditor';
import { ChartToolbar } from './charts/ChartToolbar';
import { defaultThemeColors, ThemeColorPicker } from './ThemeColorPicker';
import { ThemeFontsManager } from './ThemeFontsManager';
import { ThemeFonts } from './ThemeFontsEditor';
import { PresentationSettings } from './PPTTypes';

// Types
interface Slide {
  id: number;
  content: string;
  title: string;
  background: string;
  titleColor: string;
  contentColor: string;
  charts: ChartData[];
  titleFont?: string;
  bodyFont?: string;
}

interface Theme {
  name: string;
  background: string;
  titleColor: string;
  contentColor: string;
  colors?: ThemeColors;
}

interface SlideSize {
  width: string;
  height: string;
  name: string;
}

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

const predefinedThemes: Theme[] = [
  {
    name: 'Default',
    background: '#ffffff',
    titleColor: '#000000',
    contentColor: '#333333'
  },
  {
    name: 'Dark',
    background: '#2c3e50',
    titleColor: '#ffffff',
    contentColor: '#ecf0f1'
  },
  {
    name: 'Professional',
    background: '#f8f9fa',
    titleColor: '#2c3e50',
    contentColor: '#34495e'
  },
  {
    name: 'Creative',
    background: '#f0f3f4',
    titleColor: '#e74c3c',
    contentColor: '#2c3e50'
  }
];

interface PPTEditorProps {
  onSettingsChange?: (settings: PresentationSettings) => void;
  initialSettings?: PresentationSettings | null;
  currentTheme?: {
    colors: ThemeColors;
  };
}


const PPTEditor: React.FC<PPTEditorProps> = ({ 
  onSettingsChange,
  initialSettings,
  currentTheme: providedTheme 
}) => {
  // Predefined slide sizes
  const slideSizes: SlideSize[] = [
    { name: 'Standard (4:3)', width: '800px', height: '600px' },
    { name: 'Widescreen (16:9)', width: '1600px', height: '900px' },
    { name: 'Custom', width: '100%', height: 'auto' }
  ];


  const [slides, setSlides] = useState<Slide[]>([
    {
      id: 1,
      content: 'Your content here...',
      title: 'Title 1',
      background: predefinedThemes[0].background,
      titleColor: predefinedThemes[0].titleColor,
      contentColor: predefinedThemes[0].contentColor,
      charts: []
    }
  ]);
  
  const [showChartModal, setShowChartModal] = useState(false);
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [currentTheme, setCurrentTheme] = useState<Theme>(predefinedThemes[0]);
  const [currentSize, setCurrentSize] = useState<SlideSize>(slideSizes[0]);
  const [showCustomize, setShowCustomize] = useState<boolean>(false);
  const [customBackground, setCustomBackground] = useState<string>(predefinedThemes[0].background);
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [themes, setThemes] = useState<Theme[]>(predefinedThemes);
  const [themeFonts, setThemeFonts] = useState<ThemeFonts[]>([]);
  
  useEffect(() => {
    if (onSettingsChange) {
      const currentSettings: PresentationSettings = {
        theme: {
          name: currentTheme.name,
          background: currentTheme.background,
          titleColor: currentTheme.titleColor,
          contentColor: currentTheme.contentColor,
          colors: currentTheme.colors
        },
        slideSize: currentSize,
        fonts: {
          titleFont: slides[currentSlide]?.titleFont || 'Arial',
          bodyFont: slides[currentSlide]?.bodyFont || 'Calibri'
        },
        slides: slides
      };

      onSettingsChange(currentSettings);
    }
  }, [
    slides, 
    currentTheme, 
    currentSize, 
    currentSlide, 
    onSettingsChange
  ]);
  

  const themeColors = currentTheme?.colors || defaultThemeColors;


  
  // Handlers
  const addNewSlide = () => {
    const newSlide: Slide = {
      id: slides.length + 1,
      content: 'New slide content...',
      title: `Title ${slides.length + 1}`,
      background: currentTheme.background,
      titleColor: currentTheme.titleColor,
      contentColor: currentTheme.contentColor,
      charts: []
    };
    setSlides([...slides, newSlide]);
    setCurrentSlide(slides.length);
  };

  const updateSlideContent = (content: string) => {
    const updatedSlides = [...slides];
    updatedSlides[currentSlide] = {
      ...updatedSlides[currentSlide],
      content
    };
    setSlides(updatedSlides);
  };

  const updateSlideTitle = (title: string) => {
    const updatedSlides = [...slides];
    updatedSlides[currentSlide] = {
      ...updatedSlides[currentSlide],
      title
    };
    setSlides(updatedSlides);
  };

  const applyTheme = (theme: Theme) => {
    setCurrentTheme(theme);
    const updatedSlides = slides.map(slide => ({
      ...slide,
      background: theme.background,
      titleColor: theme.titleColor,
      contentColor: theme.contentColor
    }));
    setSlides(updatedSlides);
    setCustomBackground(theme.background);
  };

  const updateSlideBackground = (color: string) => {
    const updatedSlides = [...slides];
    updatedSlides[currentSlide] = {
      ...updatedSlides[currentSlide],
      background: color
    };
    setSlides(updatedSlides);
    setCustomBackground(color);
  };

  const handleSaveTheme = (colors: ThemeColors, name: string) => {
    const newTheme: Theme = {
      name,
      background: colors.textLight1,
      titleColor: colors.textDark1,
      contentColor: colors.textDark2,
      colors
    };
    console.log(newTheme)
    setThemes(prev => [...prev, newTheme]);
    setCurrentTheme(newTheme);
    applyTheme(newTheme);
    setShowThemeModal(false)
  };

  const navigateSlide = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    } else if (direction === 'next' && currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const savePresentation = () => {
    const presentationData = JSON.stringify({
      slides,
      theme: currentTheme,
      slideSize: currentSize
    });
    const blob = new Blob([presentationData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'presentation.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const addChart = (type: 'bar' | 'line' | 'pie') => {
    const newChart: ChartData = {
      id: `chart-${Date.now()}`,
      type,
      data: DEFAULT_CHART_DATA[type],
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} Chart`
    };

    const updatedSlides = [...slides];
    updatedSlides[currentSlide] = {
      ...updatedSlides[currentSlide],
      charts: [...updatedSlides[currentSlide].charts, newChart]
    };
    setSlides(updatedSlides);
  };

  const updateChart = (chartId: string, updatedChart: ChartData) => {
    const updatedSlides = [...slides];
    const slideCharts = updatedSlides[currentSlide].charts;
    const chartIndex = slideCharts.findIndex(chart => chart.id === chartId);
    
    if (chartIndex !== -1) {
      slideCharts[chartIndex] = updatedChart;
      setSlides(updatedSlides);
    }
  };

  const deleteChart = (chartId: string) => {
    const updatedSlides = [...slides];
    updatedSlides[currentSlide] = {
      ...updatedSlides[currentSlide],
      charts: updatedSlides[currentSlide].charts.filter(chart => chart.id !== chartId)
    };
    setSlides(updatedSlides);
  };
  
  const applyFonts = (fonts: ThemeFonts) => {
    const updatedSlides = [...slides];
    updatedSlides[currentSlide] = {
      ...updatedSlides[currentSlide],
      titleFont: fonts.titleFont,
      bodyFont: fonts.bodyFont
    };
    setSlides(updatedSlides);
  };

  return (
    <div className="ppt-editor">
      <div className="editor-toolbar">
        <div className="toolbar-section">
          <button 
            className="toolbar-btn"
            onClick={() => navigateSlide('prev')} 
            disabled={currentSlide === 0}
          >
            <ChevronLeft size={20} />
          </button>
          <span className="slide-counter">
            {currentSlide + 1} / {slides.length}
          </span>
          <button 
            className="toolbar-btn"
            onClick={() => navigateSlide('next')} 
            disabled={currentSlide === slides.length - 1}
          >
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="toolbar-section">
          <button 
            className="toolbar-btn primary"
            onClick={addNewSlide}
          >
            <Plus size={20} />
            <span>New Slide</span>
          </button>
          <button 
            className="toolbar-btn success"
            onClick={savePresentation}
          >
            <Save size={20} />
            <span>Save</span>
          </button>
        </div>

        <div className="toolbar-section">
          <button 
            className={`toolbar-btn ${showCustomize ? 'active' : ''}`}
            onClick={() => setShowCustomize(!showCustomize)}
          >
            <Settings size={20} />
            <span>Settings</span>
          </button>
          <button 
            className="toolbar-btn"
            onClick={() => setShowChartModal(true)}
          >
            <BarChart2 size={20} />
            <span>Chart</span>
          </button>
          <button 
            className="toolbar-btn"
            onClick={() => setShowThemeModal(true)}
          >
            <Palette size={20} />
            <span>Theme</span>
          </button>
          <ThemeFontsManager
            onThemeFontsChange={setThemeFonts}
            onApplyFonts={applyFonts}
            initialThemeFonts={themeFonts}
          />
        </div>
      </div>

      {showCustomize && (
        <div className="settings-panel">
          <div className="settings-content">
            <div className="settings-section">
              <h6>Presentation Theme</h6>
              <div className="theme-grid">
                {themes.map((theme) => (
                  <button
                    key={theme.name}
                    className={`theme-btn ${currentTheme.name === theme.name ? 'active' : ''}`}
                    onClick={() => applyTheme(theme)}
                    style={{
                      backgroundColor: theme.background,
                      color: theme.titleColor
                    }}
                  >
                    <div className="theme-preview">
                      <div className="theme-title" style={{ color: theme.titleColor }}>
                        {theme.name}
                      </div>
                      <div className="theme-content" style={{ color: theme.contentColor }}>
                        Sample Text
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="settings-section">
              <h6>Slide Size</h6>
              <div className="size-options">
                {slideSizes.map((size) => (
                  <button
                    key={size.name}
                    className={`size-btn ${currentSize.name === size.name ? 'active' : ''}`}
                    onClick={() => setCurrentSize(size)}
                  >
                    <Monitor size={20} />
                    <span>{size.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="settings-section">
              <h6>Background Color</h6>
              <div className="color-picker">
                <input
                  type="color"
                  value={customBackground}
                  onChange={(e) => updateSlideBackground(e.target.value)}
                />
                <span>{customBackground.toUpperCase()}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="editor-content">
        <div className="slides-sidebar">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`slide-thumbnail ${index === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(index)}
            >
              <div 
                className="thumbnail-preview"
                style={{
                  backgroundColor: slide.background,
                }}
              >
                <div className="thumbnail-content" style={{ color: slide.titleColor }}>
                  <div className="thumbnail-title">{slide.title}</div>
                  <div className="thumbnail-text" style={{ color: slide.contentColor }}>
                    {slide.content.substring(0, 50)}...
                  </div>
                </div>
              </div>
              <div className="thumbnail-number">Slide {index + 1}</div>
            </div>
          ))}
        </div>

        <div className="slide-editor">
          <div 
            className="slide-container"
            style={{
              width: currentSize.width,
              height: currentSize.height,
            }}
          >
            <div 
              className="slide-content"
              style={{
                backgroundColor: slides[currentSlide].background,
              }}
            >
              <input
                type="text"
                className="slide-title"
                value={slides[currentSlide].title}
                onChange={(e) => updateSlideTitle(e.target.value)}
                placeholder="Click to add title"
                style={{
                  color: slides[currentSlide].titleColor,
                  fontFamily: slides[currentSlide].titleFont || 'inherit'
                }}
              />
              <textarea
                className="slide-body"
                value={slides[currentSlide].content}
                onChange={(e) => updateSlideContent(e.target.value)}
                placeholder="Click to add content"
                style={{
                  color: slides[currentSlide].contentColor,
                  fontFamily: slides[currentSlide].bodyFont || 'inherit'
                }}
              />
              
              <div className="charts-container">
                {slides[currentSlide].charts.map((chart) => (
                  <ChartEditor
                    key={chart.id}
                    chartData={chart}
                    onUpdate={(updatedChart) => updateChart(chart.id, updatedChart)}
                    onDelete={() => deleteChart(chart.id)}
                    themeColors={themeColors}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ThemeColorPicker
        isOpen={showThemeModal}
        onClose={() => setShowThemeModal(false)}
        onSave={handleSaveTheme}
      />
      <ChartModal
        isOpen={showChartModal}
        onClose={() => setShowChartModal(false)}
        onSelectChart={addChart}
      />

      <style>{`
        .ppt-editor {
          display: flex;
          flex-direction: column;
          height: 100vh;
          background-color: #f8f9fa;
        }

        .editor-toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          background: white;
          border-bottom: 1px solid #e2e8f0;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }

        .toolbar-section {
          display: flex;
          align-items: center;
        }

        .toolbar-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border: 1px solid #e2e8f0;
          border-radius: 0.5rem;
          background: white;
          color: #4a5568;
          cursor: pointer;
          transition: all 0.2s;
        }

        .toolbar-btn:hover {
          background: #f7fafc;
          border-color: #cbd5e0;
        }

        .toolbar-btn.active {
          background: #ebf8ff;
          border-color: #4299e1;
          color: #2b6cb0;
        }

        .toolbar-btn.primary {
          background: #4472C4;
          border-color: #4472C4;
          color: white;
        }

        .toolbar-btn.success {
          background: #48bb78;
          border-color: #48bb78;
          color: white;
        }

        .toolbar-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .slide-counter {
          padding: 0.25rem 0.75rem;
          background: #f7fafc;
          border-radius: 0.375rem;
          color: #4a5568;
          font-size: 0.875rem;
        }

        .settings-panel {
          padding: 1rem;
          background: white;
          border-bottom: 1px solid #e2e8f0;
        }

        .settings-content {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }

        .settings-section {
          padding: 1rem;
        }

        .settings-section h6 {
          margin-bottom: 1rem;
          color: #2d3748;
          font-weight: 600;
        }

        .theme-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 1rem;
        }

        .theme-btn {
          padding: 1rem;
          border: 2px solid transparent;
          border-radius: 0.5rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .theme-btn.active {
          border-color: #4472C4;
        }

        .theme-preview {
          height: 100px;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .size-options {
          display: inline-grid;
          gap: 1rem;
        }

        .size-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          border: 1px solid #e2e8f0;
          border-radius: 0.5rem;
          background: white;
          cursor: pointer;
          transition: all 0.2s;
          color: #212529;
        }

        .size-btn.active {
          background: #ebf8ff;
          border-color: #4299e1;
          color: #2b6cb0;
        }

        .color-picker {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .color-picker input {
          width: 50px;
          height: 50px;
          padding: 0;
          border: none;
          border-radius: 0.375rem;
          cursor: pointer;
        }

        .editor-content {
          display: flex;
          flex: 1;
          overflow: hidden;
        }

        .slides-sidebar {
          width: 250px;
          padding: 1rem;
          background: white;
          border-right: 1px solid #e2e8f0;
          overflow-y: auto;
        }

        .slide-thumbnail {
          margin-bottom: 1rem;
          cursor: pointer;
          border-radius: 0.5rem;
          overflow: hidden;
          transition: all 0.2s;
        }

        .slide-thumbnail.active {
          box-shadow: 0 0 0 2px #4472C4;
        }

        .thumbnail-preview {
          aspect-ratio: 16/9;
          padding: 1rem;
        }

        .thumbnail-content {
          height: 100%;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .thumbnail-title {
          font-weight: 600;
          font-size: 0.875rem;
        }

        .thumbnail-text {
          font-size: 0.75rem;
          opacity: 0.8;
        }

        .thumbnail-number {
          padding: 0.5rem;
          background: #f7fafc;
          font-size: 0.75rem;
          text-align: center;
          color: #4a5568;
        }

        .slide-editor {
          flex: 1;
          padding: 2rem;
          display: flex;
          justify-content: center;
          align-items: flex-start;
          overflow-y: auto;
        }

        .slide-container {
          background: white;
          border-radius: 0.5rem;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          overflow: hidden;
        }

        .slide-content {
          height: 100%;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .slide-title {
          width: 100%;
          padding: 0.5rem;
          border: none;
          background: transparent;
          font-size: 2rem;
          font-weight: 600;
        }

        .slide-body {
          flex: 1;
          width: 100%;
          padding: 0.5rem;
          border: none;
          background: transparent;
          resize: none;
          font-size: 1.25rem;
        }

        .charts-container {
          display: grid;
          gap: 1rem;
          margin-top: 1rem;
        }

        @media (max-width: 768px) {
          .editor-toolbar {
            flex-wrap: wrap;
            gap: 1rem;
          }

          .settings-content {
            grid-template-columns: 1fr;
          }

          .slides-sidebar {
            width: 200px;
          }
        }
      `}</style>
    </div>
  );
};

export default PPTEditor;