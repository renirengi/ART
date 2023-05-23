import template from './home.component.htm';
import { PageHTMLElement } from '../../page.abstract.class';
import { SettingsService } from '../../services/settings.service';
import { TranslateService } from '../../services/translate.service';

export class HomePageComponent extends PageHTMLElement {
  constructor() {
    super();
    this.settings = SettingsService.getInstance();
    this.translateService = TranslateService.getInstance();
  }

  render() {
    this.innerHTML = template;

    this.querySelector('.button-quiz.artist').addEventListener('click', () => this.goTo('categories', {category: 'artist'}));
    this.querySelector('.button-quiz.artist').textContent=this.translateService.translate('homeArt');
    this.querySelector('.button-quiz.picture').addEventListener('click', () => this.goTo('categories', {category: 'picture'}));
    this.querySelector('.button-quiz.picture').textContent=this.translateService.translate('homePic');

    this.querySelector('button.settings').addEventListener('click', () => this.goTo('settings'));
    this.querySelector('button.honor').addEventListener('click', () => this.goTo('honors'));
  }

}
