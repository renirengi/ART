const defaultSettigs = {
  language: 'eng',
  userChange: '',
  userVolume: 'off',
  timeGame: 'off',
  timeToAnswer: 30,
  listOfHiddenElements: [],
  score: {
    artist: {},
    picture: {}
  }
};

const settingsName = 'settings';

export class SettingsService {
  /**
   * Don't use it! Use getInstance instead.
   */
  constructor() {
    this.settings = defaultSettigs;
    const storedSettings = localStorage.getItem(settingsName);

    if (storedSettings) {
      this.settings = { ...this.settings, ...JSON.parse(storedSettings) };
    }
  }

  static getInstance() {
    if (!SettingsService.service) {
      SettingsService.service = new SettingsService();
    }
    return SettingsService.service;
  }

  get language() {
    return this.settings.language;
  }

  set language(lang) {
    this.settings.language = lang;
    this.saveSettings();
  }

  get categoriesNumber() {
    return this.settings.categoriesNumber;
  }

  set categoriesNumber(number) {
    this.settings.categoriesNumber = number;
    this.saveSettings();
  }

  get userVolume() {
    return this.settings.volume;
  }

  set userVolume(volume) {
    this.settings.userVolume = volume;
    this.saveSettings();
  }

  get timeGame() {
    return this.settings.timeGame;
  }

  set timeGame(time) {
    this.settings.timeGame = time;
    this.saveSettings();
  }

  get timeToAnswer() {
    return this.settings.timeToAnswer;
  }

  set timeToAnswer(length) {
    this.settings.timeToAnswer = length;
    this.saveSettings();
  }

  get listOfHiddenElements() {
    return this.settings.listOfHiddenElements;
  }

  set listOfHiddenElements(list) {
    this.settings.listOfHiddenElements = list;
    this.saveSettings();
    this.listOfHiddenCallbacks.forEach((callback) => callback(list));
  }

  get score() {
    return this.settings.score;
  }

  set score(score) {
    this.settings.score = score;
    this.saveSettings();
  }

  saveSettings() {
    localStorage.setItem(settingsName, JSON.stringify(this.settings));
  }

  resetToDefault() {
    const omitSingle = (key, { [key]: _, ...obj }) => obj;
    const defaults = omitSingle('score', defaultSettigs);

    this.settings = {...this.settings, ...defaults};
    this.saveSettings();
  }
}
