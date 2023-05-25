import eng from '../translations/en.json';
import rus from '../translations/ru.json';

const locales = {eng, rus};


export class TranslateService {
  /**
   * Don't use it! Use getInstance instead.
   */
  constructor() {
    this.locale = 'eng';
  }

  static getInstance() {
    if (!TranslateService.service) {
      TranslateService.service = new TranslateService();
    }
    return TranslateService.service;
  }

  /**
   * Apply available locale 'eng' or 'rus'
   */
  setLocale(locale) {
    if (locales[locale]) {
      this.locale = locale;
    }
  }

  getLocale() {
    return this.locale;
  }

  translate(key) {
    const translations = locales[this.locale];

    return translations[key] || key;
  }
}
