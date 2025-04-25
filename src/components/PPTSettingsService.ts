import { PresentationSettings } from './PPTTypes';

export class PPTSettingsService {
  private static readonly API_ENDPOINT = '/api/ppttheme/settings';

  public static async saveSettings(settings: PresentationSettings): Promise<Response> {
    try {
      const response = await fetch(this.API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(settings),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;

    } catch (error) {
      console.error('Error saving presentation settings:', error);
      throw error;
    }
  }

  public static validateSettings(settings: PresentationSettings): boolean {

    if (!settings.theme || !settings.slideSize || !settings.slides) {
      return false;
    }

    if (!Array.isArray(settings.slides) || settings.slides.length === 0) {
      return false;
    }

    // Validate theme
    if (!settings.theme.name || !settings.theme.background || 
      !settings.theme.titleColor || !settings.theme.contentColor) {
      return false;
    }

    // Validate slideSize
    if (!settings.slideSize.width || !settings.slideSize.height || !settings.slideSize.name) {
      return false;
    }

    // Validate fonts
    if (!settings.fonts || !settings.fonts.titleFont || !settings.fonts.bodyFont) {
      return false;
    }

    // Validate each slide
    for (const slide of settings.slides) {
      if (!slide.id || !slide.title || !slide.content || 
          !slide.background || !slide.titleColor || !slide.contentColor) {
        return false;
      }
    }
    
    return true;
  }
}