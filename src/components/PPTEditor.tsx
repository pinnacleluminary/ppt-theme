import React, { useState } from 'react';
import { Plus, ChevronLeft, ChevronRight, Save, Settings, BarChart2, Palette } from 'lucide-react';
import { ChartData } from './charts/ChartTypes';
import { DEFAULT_CHART_DATA } from './charts/ChartConstants';
import { ChartModal } from './charts/ChartModal';
import { ChartDisplay } from './charts/ChartDisplay';
import { ChartEditor } from './charts/ChartEditor';
import { ChartToolbar } from './charts/ChartToolbar';
import { defaultThemeColors, ThemeColorPicker } from './ThemeColorPicker';
import { ThemeFontsManager } from './ThemeFontsManager';
import { ThemeFonts } from './ThemeFontsEditor';

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
  currentTheme?: {
    colors: ThemeColors;
  };
}

const PPTEditor: React.FC<PPTEditorProps> = ({ currentTheme: any }) => {
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
    <div className="container-fluid">
      <div className="row p-3">
        {/* Main Toolbar */}
        <div className="col-12 mb-3">
          <div className="btn-group me-2">
            <button 
              className="btn btn-outline-primary"
              onClick={() => navigateSlide('prev')} 
              disabled={currentSlide === 0}
            >
              <ChevronLeft size={16} />
            </button>
            <button 
              className="btn btn-outline-primary"
              onClick={() => navigateSlide('next')} 
              disabled={currentSlide === slides.length - 1}
            >
              <ChevronRight size={16} />
            </button>
            <button 
              className="btn btn-primary"
              onClick={addNewSlide}
            >
              <Plus size={16} /> Add Slide
            </button>
            <button 
              className="btn btn-success"
              onClick={savePresentation}
            >
              <Save size={16} /> Save
            </button>
          </div>
          
          <div className="btn-group ms-2">
            <button 
              className="btn btn-info"
              onClick={() => setShowCustomize(!showCustomize)}
            >
              <Settings size={16} /> Customize
            </button>
            <button 
              className="btn btn-info"
              onClick={() => setShowChartModal(true)}
            >
              <BarChart2 size={16} /> Chart
            </button>
            <button 
              className="btn btn-info"
              onClick={() => setShowThemeModal(true)}
            >
              <Palette size={16} /> Theme Colors
            </button>
            <ThemeFontsManager
  onThemeFontsChange={setThemeFonts}
  onApplyFonts={applyFonts}
  initialThemeFonts={themeFonts}
/>
          </div>
        </div>

        {/* Customization Panel */}
        {showCustomize && (
          <div className="col-12 mb-3">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Customize Presentation</h5>
                <div className="row">
                  {/* Themes */}
                  <div className="col-md-4">
                    <h6>Themes</h6>
                    <div className="d-flex flex-wrap gap-2">
                      {themes.map((theme) => (
                        <button
                          key={theme.name}
                          className={`btn ${currentTheme.name === theme.name ? 'btn-primary' : 'btn-outline-primary'}`}
                          onClick={() => applyTheme(theme)}
                        >
                          {theme.name}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Slide Size */}
                  <div className="col-md-4">
                    <h6>Slide Size</h6>
                    <select 
                      className="form-select"
                      value={currentSize.name}
                      onChange={(e) => {
                        const size = slideSizes.find(s => s.name === e.target.value);
                        if (size) setCurrentSize(size);
                      }}
                    >
                      {slideSizes.map((size) => (
                        <option key={size.name} value={size.name}>
                          {size.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Background Color */}
                  <div className="col-md-4">
                    <h6>Background Color</h6>
                    <input
                      type="color"
                      className="form-control form-control-color"
                      value={customBackground}
                      onChange={(e) => updateSlideBackground(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="col-3">
          <div className="list-group">
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                className={`list-group-item list-group-item-action ${
                  index === currentSlide ? 'active' : ''
                }`}
                onClick={() => setCurrentSlide(index)}
                style={{
                  backgroundColor: slide.background,
                  color: slide.titleColor
                }}
              >
                Slide {slide.id}
              </button>
            ))}
          </div>
        </div>

        {/* Main Editor */}
        <div className="col-9">
          <div 
            className="card"
            style={{
              width: currentSize.width,
              height: currentSize.height,
              margin: '0 auto'
            }}
          >
            <div 
              className="card-body"
              style={{
                backgroundColor: slides[currentSlide].background,
                transition: 'background-color 0.3s ease'
              }}
            >
              <input
  type="text"
  className="form-control mb-3"
  value={slides[currentSlide].title}
  onChange={(e) => updateSlideTitle(e.target.value)}
  placeholder="Slide Title"
  style={{
    color: slides[currentSlide].titleColor,
    backgroundColor: 'transparent',
    border: '1px solid rgba(0,0,0,0.1)',
    fontFamily: slides[currentSlide].titleFont || 'inherit' // Add this
  }}
/>
<textarea
  className="form-control mb-3"
  rows={5}
  value={slides[currentSlide].content}
  onChange={(e) => updateSlideContent(e.target.value)}
  placeholder="Slide Content"
  style={{
    color: slides[currentSlide].contentColor,
    backgroundColor: 'transparent',
    border: '1px solid rgba(0,0,0,0.1)',
    fontFamily: slides[currentSlide].bodyFont || 'inherit' // Add this
  }}
/>
              {/* Charts */}
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