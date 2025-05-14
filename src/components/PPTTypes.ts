export interface PresentationSettings {
    theme: {
      name: string;
      background: string;
      titleColor: string;
      contentColor: string;
      colors?: ThemeColors;
    };
    slideSize: {
      width: string;
      height: string;
      name: string;
    };
    fonts: {
      titleFont: string;
      bodyFont: string;
    };
    slides: Slide[];
  }
  
  export interface ThemeColors {
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
  
  export interface Slide {
    id: number;
    subSlides: SubSlide[];
    background: string;
    titleColor: string;
    contentColor: string;
    titleFont?: string;
    bodyFont?: string;
  }

  export interface SubSlide {
    id: string;
    title: string;
    content: string;
    chart: ChartData;
  }

  
  export interface ChartData {
    id: string;
    type: 'bar' | 'line' | 'pie';
    data: any;
    title: string;
  }