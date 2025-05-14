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
  subSlides: SubSlide[];
  background: string;
  titleColor: string;
  contentColor: string;
  titleFont?: string;
  bodyFont?: string;
}
interface SubSlide {
  id: string;
  title: string;
  content: string;
  chart: ChartData;
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
      background: predefinedThemes[0].background,
      titleColor: predefinedThemes[0].titleColor,
      contentColor: predefinedThemes[0].contentColor,
      subSlides: [
        {
          id: 'slide1-bar',
          title: "Sales Performance",
          content: "This chart shows quarterly sales performance comparison.",
          chart: {
            id: 'theme1-bar-chart',
            type: 'bar',
            title: 'Sales Performance',
            data: [
              { name: 'Q1', Series1: 65, Series2: 45 },
              { name: 'Q2', Series1: 45, Series2: 55 },
              { name: 'Q3', Series1: 75, Series2: 35 },
              { name: 'Q4', Series1: 55, Series2: 65 }
            ]
          }
        },
        {
          id: 'slide1-line',
          title: "Monthly Trends",
          content: "Visualizing the monthly growth trends across different series.",
          chart: {
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
          }
        },
        {
          id: 'slide1-pie',
          title: "Market Distribution",
          content: "Breakdown of market share across different products.",
          chart: {
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
        }
      ]
    },
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
        ? {
            ...slide,
            subSlides: slide.subSlides.map((subSlide, index) => 
              index === 0 
                ? { ...subSlide, [field]: value }
                : subSlide
            )
          }
        : slide
    ));
  };

  
  // Handlers
  const addNewSlide = () => {
    const theme1Content = slides[0]; // Get the first theme's content
    const newSlide: Slide = {
      id: slides.length + 1,
      background: theme1Content.background,
      titleColor: theme1Content.titleColor,
      contentColor: theme1Content.contentColor,
      subSlides: [
        {
          id: `slide${slides.length + 1}-bar`,
          title: "Sales Performance",
          content: "This chart shows quarterly sales performance comparison.",
          chart: {
            id: `theme${slides.length + 1}-bar-chart`,
            type: 'bar',
            title: 'Sales Performance',
            data: [
              { name: 'Q1', Series1: 65, Series2: 45 },
              { name: 'Q2', Series1: 45, Series2: 55 },
              { name: 'Q3', Series1: 75, Series2: 35 },
              { name: 'Q4', Series1: 55, Series2: 65 }
            ]
          }
        },
        {
          id: `slide${slides.length + 1}-line`,
          title: "Monthly Trends",
          content: "Visualizing the monthly growth trends across different series.",
          chart: {
            id: `theme${slides.length + 1}-line-chart`,
            type: 'line',
            title: 'Monthly Trends',
            data: [
              { name: 'Jan', Series1: 30, Series2: 40 },
              { name: 'Feb', Series1: 45, Series2: 50 },
              { name: 'Mar', Series1: 55, Series2: 45 },
              { name: 'Apr', Series1: 60, Series2: 65 },
              { name: 'May', Series1: 75, Series2: 70 }
            ]
          }
        },
        {
          id: `slide${slides.length + 1}-pie`,
          title: "Market Distribution",
          content: "Breakdown of market share across different products.",
          chart: {
            id: `theme${slides.length + 1}-pie-chart`,
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
        }
      ]
    };
    setSlides([...slides, newSlide]);
    setCurrentSlide(slides.length);
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

  
  const applyFonts = (fonts: ThemeFonts) => {
    const updatedSlides = [...slides];
    updatedSlides[currentSlide] = {
      ...updatedSlides[currentSlide],
      titleFont: fonts.titleFont,
      bodyFont: fonts.bodyFont
    };
    setSlides(updatedSlides);
  };

  const updateSubSlideTitle = (slideIndex: number, subSlideIndex: number, title: string) => {
    const updatedSlides = [...slides];
    updatedSlides[slideIndex].subSlides[subSlideIndex].title = title;
    setSlides(updatedSlides);
  };

  const updateSubSlideContent = (slideIndex: number, subSlideIndex: number, content: string) => {
    const updatedSlides = [...slides];
    updatedSlides[slideIndex].subSlides[subSlideIndex].content = content;
    setSlides(updatedSlides);
  };

  const updateSubSlideChart = (slideIndex: number, subSlideIndex: number, updatedChart: ChartData) => {
    const updatedSlides = [...slides];
    updatedSlides[slideIndex].subSlides[subSlideIndex].chart = updatedChart;
    setSlides(updatedSlides);
  };

  const deleteSubSlide = (slideIndex: number, subSlideIndex: number) => {
    const updatedSlides = [...slides];
    updatedSlides[slideIndex].subSlides.splice(subSlideIndex, 1);
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
                  value={slide.subSlides[0].title} // Use first subSlide's title
                  onChange={(e) => updateSubSlideTitle(index, 0, e.target.value)}
                  className="edit-input title-input"
                  autoFocus
                  onBlur={handleFieldSave}
                  onKeyPress={(e) => e.key === 'Enter' && handleFieldSave()}
                />
              ) : (
                <div className="thumbnail-title">
                  {slide.subSlides[0].title}
                </div>
              )}

              <div className="thumbnail-text" style={{ color: slide.contentColor }}>
                  {slide.subSlides[0].content.substring(0, 35) + "..."}
                </div>
              
              {/* {editingState.slideId === slide.id && editingState.field === 'content' ? (
                <textarea
                  value={slide.subSlides[0].content}
                  onChange={(e) => updateSubSlideContent(index, 0, e.target.value)}
                  className="edit-input content-input"
                  autoFocus
                  onBlur={handleFieldSave}
                />
              ) : (
                <div className="thumbnail-text" style={{ color: slide.contentColor }}>
                  {slide.subSlides[0].content.substring(0, 50)}
                </div>
              )} */}
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
            {slides[currentSlide].subSlides.map((subSlide, index) => (
              <div 
                key={subSlide.id}
                className="slide-content mb-4"
                style={{
                  backgroundColor: slides[currentSlide].background,
                }}
              >
                <input
                  type="text"
                  className="slide-title"
                  value={subSlide.title}
                  onChange={(e) => updateSubSlideTitle(currentSlide, index, e.target.value)}
                  placeholder="Click to add title"
                  style={{
                    color: slides[currentSlide].titleColor,
                    fontFamily: slides[currentSlide].titleFont || 'inherit'
                  }}
                  readOnly={editingState.slideId !== slides[currentSlide].id}
                />
                <textarea
                  className="slide-body"
                  value={subSlide.content}
                  onChange={(e) => updateSubSlideContent(currentSlide, index, e.target.value)}
                  placeholder="Click to add content"
                  style={{
                    color: slides[currentSlide].contentColor,
                    fontFamily: slides[currentSlide].bodyFont || 'inherit'
                  }}
                  readOnly={editingState.slideId !== slides[currentSlide].id}
                />
                
                <div className="chart-container">
                  <ChartEditor
                    key={subSlide.chart.id}
                    chartData={subSlide.chart}
                    onUpdate={(updatedChart) => updateSubSlideChart(currentSlide, index, updatedChart)}
                    onDelete={() => deleteSubSlide(currentSlide, index)}
                    themeColors={themeColors}
                  />
                </div>
              </div>
            ))}
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
        onSelectChart={(type) => {
          const newSubSlide: SubSlide = {
            id: `slide${currentSlide + 1}-${type}`,
            title: `New ${type} Chart`,
            content: `This is a new ${type} chart`,
            chart: {
              id: `chart-${Date.now()}`,
              type,
              title: `New ${type} Chart`,
              data: DEFAULT_CHART_DATA[type]
            }
          };
          
          const updatedSlides = [...slides];
          updatedSlides[currentSlide].subSlides.push(newSubSlide);
          setSlides(updatedSlides);
        }}
      />

      <SlideSettingsModal
        isOpen={showSlideSettingsModal}
        onClose={() => setShowSlideSettingsModal(false)}
        onSave={(settings) => {
          if (editingSlideId === null) {
            // Create new slide
            const newSlide: Slide = {
              id: slides.length + 1,
              background: settings.colors.background,
              titleColor: settings.colors.titleColor,
              contentColor: settings.colors.contentColor,
              titleFont: settings.fonts.titleFont,
              bodyFont: settings.fonts.bodyFont,
              subSlides: [] // Initialize with empty subSlides array
            };
            setSlides([...slides, newSlide]);
            setCurrentSlide(slides.length);
          } else {
            // Update existing slide
            const updatedSlides = slides.map(slide =>
              slide.id === editingSlideId
                ? {
                    ...slide,
                    background: settings.colors.background,
                    titleColor: settings.colors.titleColor,
                    contentColor: settings.colors.contentColor,
                    titleFont: settings.fonts.titleFont,
                    bodyFont: settings.fonts.bodyFont
                  }
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