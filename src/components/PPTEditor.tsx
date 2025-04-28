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
import './PPTEditor.css';

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
    { name: 'Widescreen (16:9)', width: '960px', height: '540px' },
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
    </div>
  );
};

export default PPTEditor;