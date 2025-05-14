import React, { useState, useEffect } from 'react';
import { 
  Plus, ChevronLeft, ChevronRight, Save, Settings, 
  BarChart2, Palette, Layout, Monitor, Trash2, Edit2, Check
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
import SlideSettingsModal from './SlideSettingsModal';

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

interface EditingState {
  slideId: number | null;
  field: 'title' | 'content' | null;
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
    title: "Title 1",
    content: "This slide demonstrates the first theme with bar, line, and pie charts showing various data visualizations.",
    background: predefinedThemes[0].background,
    titleColor: predefinedThemes[0].titleColor,
    contentColor: predefinedThemes[0].contentColor,
    charts: [
      {
        id: 'theme1-bar-chart',
        type: 'bar',
        title: 'Sales Performance',
        data: [
          { name: 'Q1', Series1: 65, Series2: 45 },
          { name: 'Q2', Series1: 45, Series2: 55 },
          { name: 'Q3', Series1: 75, Series2: 35 },
          { name: 'Q4', Series1: 55, Series2: 65 }
        ]
      },
      {
        id: 'theme1-line-chart',
        type: 'line',
        title: 'Monthly Trends',
        data: [
          { name: 'Jan', Series1: 30, Series2: 40 },
          { name: 'Feb', Series1: 45, Series2: 50 },
          { name: 'Mar', Series1: 55, Series2: 45 },
          { name: 'Apr', Series1: 60, Series2: 65 },
          { name: 'May', Series1: 75, Series2: 70 }
        ]
      },
      {
        id: 'theme1-pie-chart',
        type: 'pie',
        title: 'Market Distribution',
        data: [
          { name: 'Product A', value: 35 },
          { name: 'Product B', value: 25 },
          { name: 'Product C', value: 20 },
          { name: 'Product D', value: 15 },
          { name: 'Product E', value: 5 }
        ]
      }
    ]
  },
  {
    id: 2,
    title: "Title 2",
    content: "This slide showcases the second theme with alternative styling for bar, line, and pie charts.",
    background: predefinedThemes[1].background,
    titleColor: predefinedThemes[1].titleColor,
    contentColor: predefinedThemes[1].contentColor,
    charts: [
      {
        id: 'theme2-bar-chart',
        type: 'bar',
        title: 'Revenue Analysis',
        data: [
          { name: 'Region A', Series1: 85, Series2: 65 },
          { name: 'Region B', Series1: 55, Series2: 75 },
          { name: 'Region C', Series1: 95, Series2: 85 },
          { name: 'Region D', Series1: 75, Series2: 95 }
        ]
      },
      {
        id: 'theme2-line-chart',
        type: 'line',
        title: 'Growth Trajectory',
        data: [
          { name: 'Week 1', Series1: 20, Series2: 30 },
          { name: 'Week 2', Series1: 35, Series2: 40 },
          { name: 'Week 3', Series1: 45, Series2: 35 },
          { name: 'Week 4', Series1: 50, Series2: 55 },
          { name: 'Week 5', Series1: 65, Series2: 60 }
        ]
      },
      {
        id: 'theme2-pie-chart',
        type: 'pie',
        title: 'Budget Allocation',
        data: [
          { name: 'Marketing', value: 30 },
          { name: 'R&D', value: 25 },
          { name: 'Operations', value: 20 },
          { name: 'Sales', value: 15 },
          { name: 'Admin', value: 10 }
        ]
      }
    ]
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

  const [showSlideSettingsModal, setShowSlideSettingsModal] = useState(false);
  const [editingSlideId, setEditingSlideId] = useState<number | null>(null);
  
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

const [editingState, setEditingState] = useState<EditingState>({
    slideId: null,
    field: null
  });

  const handleEdit = (slideId: number) => {
    setEditingSlideId(slideId);
    setShowSlideSettingsModal(true);
  };

  const handleCreateNew = () => {
    setEditingSlideId(null);
    setShowSlideSettingsModal(true);
  };

  const handleFieldEdit = (field: 'title' | 'content') => {
    setEditingState(prev => ({ ...prev, field }));
  };

  const handleFieldSave = () => {
    setEditingState({ slideId: null, field: null });
  };

  const updateSlideContent = (slideId: number, field: 'title' | 'content', value: string) => {
    setSlides(slides.map(slide => 
      slide.id === slideId 
        ? { ...slide, [field]: value }
        : slide
    ));
  };
  
  // Handlers
  const addNewSlide = () => {
  const theme1Content = slides[0]; // Get the first theme's content
  const newSlide: Slide = {
    id: slides.length + 1,
    title: `Title ${slides.length + 1}`,
    content: "This slide demonstrates the theme with bar, line, and pie charts showing various data visualizations.",
    background: theme1Content.background,
    titleColor: theme1Content.titleColor,
    contentColor: theme1Content.contentColor,
    charts: [
      {
        id: `theme1-bar-chart-${slides.length + 1}`,
        type: 'bar',
        title: 'Sales Performance',
        data: [
          { name: 'Q1', Series1: 65, Series2: 45 },
          { name: 'Q2', Series1: 45, Series2: 55 },
          { name: 'Q3', Series1: 75, Series2: 35 },
          { name: 'Q4', Series1: 55, Series2: 65 }
        ]
      },
      {
        id: `theme1-line-chart-${slides.length + 1}`,
        type: 'line',
        title: 'Monthly Trends',
        data: [
          { name: 'Jan', Series1: 30, Series2: 40 },
          { name: 'Feb', Series1: 45, Series2: 50 },
          { name: 'Mar', Series1: 55, Series2: 45 },
          { name: 'Apr', Series1: 60, Series2: 65 },
          { name: 'May', Series1: 75, Series2: 70 }
        ]
      },
      {
        id: `theme1-pie-chart-${slides.length + 1}`,
        type: 'pie',
        title: 'Market Distribution',
        data: [
          { name: 'Product A', value: 35 },
          { name: 'Product B', value: 25 },
          { name: 'Product C', value: 20 },
          { name: 'Product D', value: 15 },
          { name: 'Product E', value: 5 }
        ]
      }
    ]
  };
  setSlides([...slides, newSlide]);
  setCurrentSlide(slides.length);
};


  // const updateSlideContent = (content: string) => {
  //   const updatedSlides = [...slides];
  //   updatedSlides[currentSlide] = {
  //     ...updatedSlides[currentSlide],
  //     content
  //   };
  //   setSlides(updatedSlides);
  // };

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
          {/* <button 
            className="toolbar-btn primary"
            onClick={addNewSlide}
          >
            <Plus size={20} />
            <span>New Slide</span>
          </button> */}
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
          {/* <button 
            className="toolbar-btn"
            onClick={() => setShowChartModal(true)}
          >
            <BarChart2 size={20} />
            <span>Chart</span>
          </button> */}
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
          {/* New Slide button remains the same */}
        <div className="slide-thumbnail new-slide-thumbnail" onClick={addNewSlide}>
          <div 
            className="thumbnail-preview"
            style={{
              backgroundColor: currentTheme.background,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <div className="new-slide-content">
              <Plus size={20} style={{ color: currentTheme.titleColor }} />
              <span className="thumbnail-title" style={{ color: currentTheme.titleColor }}>
                Create New
              </span>
            </div>
          </div>
        </div>

        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`slide-thumbnail ${index === currentSlide ? 'active' : ''}`}
          >
            <div 
              className="thumbnail-preview"
              style={{
                backgroundColor: slide.background,
                cursor: editingState.slideId === slide.id ? 'default' : 'pointer',
              }}
              onClick={() => {
                if (editingState.slideId !== slide.id) {
                  setCurrentSlide(index);
                }
              }}
            >
            <div 
              className="thumbnail-content" 
              style={{ color: slide.titleColor }}
              data-editing={editingState.slideId === slide.id}
            >
              {editingState.slideId === slide.id && editingState.field === 'title' ? (
                <input
                  type="text"
                  value={slide.title}
                  onChange={(e) => updateSlideContent(slide.id, 'title', e.target.value)}
                  className="edit-input title-input"
                  autoFocus
                  onBlur={handleFieldSave}
                  onKeyPress={(e) => e.key === 'Enter' && handleFieldSave()}
                />
              ) : (
                <div className="thumbnail-title">
                  {slide.title}
                </div>
              )}
              
              {editingState.slideId === slide.id && editingState.field === 'content' ? (
                <textarea
                  value={slide.content}
                  onChange={(e) => updateSlideContent(slide.id, 'content', e.target.value)}
                  className="edit-input content-input"
                  autoFocus
                  onBlur={handleFieldSave}
                />
              ) : (
                <div className="thumbnail-text" style={{ color: slide.contentColor }}>
                  {slide.content.substring(0, 50)}...
                </div>
              )}
            </div>

            </div>
            <div className="thumbnail-footer">
              <div className="thumbnail-number">Theme {index + 1}</div>
              {editingState.slideId === slide.id ? (
                <button 
                  className="edit-button active"
                  onClick={handleFieldSave}
                >
                  <Check size={16} />
                </button>
              ) : (
                <button 
                  className="edit-button"
                  onClick={() => handleEdit(slide.id)}
                >
                  <Edit2 size={16} />
                </button>
              )}
            </div>
          </div>
        ))}
    </div>

        <div className="slide-editor">
  <div 
    className="slide-container"
    style={{
      width: currentSize.width,
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
        readOnly={editingState.slideId !== slides[currentSlide].id}
      />
      <textarea
        className="slide-body"
        value={slides[currentSlide].content}
        onChange={(e) => updateSlideContent(slides[currentSlide].id, 'content', e.target.value)}
        placeholder="Click to add content"
        style={{
          color: slides[currentSlide].contentColor,
          fontFamily: slides[currentSlide].bodyFont || 'inherit'
        }}
        readOnly={editingState.slideId !== slides[currentSlide].id}
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
      <SlideSettingsModal
        isOpen={showSlideSettingsModal}
        onClose={() => setShowSlideSettingsModal(false)}
        onSave={(settings) => {
          // Handle save logic here
          if (editingSlideId === null) {
            // Create new slide
            const newSlide: Slide = {
              id: slides.length + 1,
              ...settings.general,
              ...settings.colors,
              ...settings.fonts,
              charts: []
            };
            setSlides([...slides, newSlide]);
            setCurrentSlide(slides.length);
          } else {
            // Update existing slide
            const updatedSlides = slides.map(slide =>
              slide.id === editingSlideId
                ? { ...slide, ...settings.general, ...settings.colors, ...settings.fonts }
                : slide
            );
            setSlides(updatedSlides);
          }
          setShowSlideSettingsModal(false);
        }}
        initialSlide={editingSlideId ? slides.find(s => s.id === editingSlideId) : undefined}
        mode={editingSlideId ? 'edit' : 'create'}
      />
    </div>
  );
};

export default PPTEditor;