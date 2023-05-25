import template from './settings.component.htm';

import { PageHTMLElement } from '../../page.abstract.class';
import { SettingsService } from '../../services/settings.service';
import { TranslateService } from '../../services/translate.service';

export class SettingsPageComponent extends PageHTMLElement {
  constructor() {
    super();
    this.settings = SettingsService.getInstance();
    this.translateService = TranslateService.getInstance();
  }
  

  render() {
    this.innerHTML = template;

    this.querySelector('button.honor').addEventListener('click', () => this.goTo('honor'));
    this.querySelector('button.home').addEventListener('click', () => this.goTo('home'));
    this.querySelector('.categories').addEventListener('click', () => this.goTo('categories'));
    this.querySelector('.play').addEventListener('click', () => this.goTo('art'));

    this.languageElements = this.querySelectorAll('input[name="language"]');
    this.rangeElement = this.querySelector('.range');
    this.volumeFalse = this.querySelector('.false');
    this.volumeTrue = this.querySelector('.true');


    // Timer elements
    this.timerOnOffElements = this.querySelectorAll('input[name="time-game"]');
    this.timerInterval = this.querySelector('input[name="time-game-interval"]');
    this.timerOnOffElements.forEach((el) => el.addEventListener('click', () => this._timerChangeHandler()));

    this.loadSettings();

    this.languageElements.forEach((el) => el.addEventListener('click', () => this.saveLanguage()));
    this.rangeElement.addEventListener('change', () => this.changeVolume());
    this.volumeFalse.addEventListener('click', () => this.removeVolume());
    this.volumeTrue.addEventListener('click', () => this.revertVolume());

    this.querySelector('.default').addEventListener('click', () => this._saveDefault());
    this.querySelector('.save').addEventListener('click', () => this._saveSettings());

    this.querySelector('.default').textContent=this.translateService.translate('default');
    this.querySelector('.save').textContent=this.translateService.translate('save');
    this.querySelector('.title-settings').textContent=this.translateService.translate('titleSettings');
    this.querySelector('.lang').textContent=this.translateService.translate('languageSetting');
    this.querySelector('.time').textContent=this.translateService.translate('timeGame');
    this.querySelector('.time-game-interval').textContent=this.translateService.translate('timeToAnswer');
    
  }

  loadSettings() {
    this.languageElements.forEach((el) => (el.checked = el.value === this.settings.language));
    this.rangeElement.value = this.settings.userVolume;

    // Timer settings
    this.timerOnOffElements.forEach((el) => (el.checked = el.value === this.settings.timeGame));
    this.timerInterval.value = this.settings.timeToAnswer;
    const label = this.querySelector('label.time-game-interval');
    if (this.settings.timeGame === 'off') {
      label.style.display = 'none';
    } else {
      label.style.display = 'block';
    }
  }

  saveLanguage() {
    this.settings.language = this.querySelector('input[name="language"]:checked').value;
  }

  changeVolume() {
    const volume = this.rangeElement.value / 100;
    if (volume === 0) {
      this.removeVolume();
    }
    this.settings.userVolume = volume;
  }

  removeVolume() {
    this.settings.userVolume = 0;
    console.log(this.settings.userChange);
  }

  revertVolume() {
    this.settings.userVolume = 5;
  }

  saveTimerAnswer() {
    this.settings.timeToAnswer = this.querySelector('.sec').value;
    console.log(this.settings.timeToAnswer);
  }

  saveListOfHiddenElements() {
    this.settings.listOfHiddenElements = Array.from(this.hiddenElements).reduce((acc, el) => {
      if (el.checked) {
        acc.push(el.value);
      }

      return acc;
    }, []);
  }

  _saveDefault() {
    this.settings.resetToDefault();
    this.loadSettings();
  }

  _saveSettings() {
    // Timer settings
    this.settings.timeGame = this.querySelector('input[name="time-game"]:checked').value;
    this.settings.timeToAnswer = this.timerInterval.value;

    // Language settings
    this.settings.language = this.querySelector('input[name="language"]:checked').value;
    
    window.location.reload();
 }

  _timerChangeHandler() {
    const {value} = this.querySelector('input[name="time-game"]:checked');
    const label = this.querySelector('label.time-game-interval');

    if (value === 'off') {
      label.style.display = 'none';
    } else {
      label.style.display = 'block';
    }
  }

  

}
