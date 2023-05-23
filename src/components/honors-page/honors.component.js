import template from './honors.component.htm';

import { PageHTMLElement } from '../../page.abstract.class';
import { TranslateService } from '../../services/translate.service';
import { SettingsService } from '../../services/settings.service';
import { QuestionsService } from '../../services/questions.service';
import { categoriesStartIndex } from '../../constants';

export class HonorsPageComponent extends PageHTMLElement {
  constructor() {
    super();
    this.settings = SettingsService.getInstance();
    this.translateService = TranslateService.getInstance();
    this.questionService = QuestionsService.getInstance();
  }

  async render() {
    this.innerHTML = template;

    this.querySelector('.honors-title').textContent=this.translateService.translate('honor');

    const honorContainerElement = document.querySelector('.honor-container');

    this.scores = await this._createHonorsData();

    const { artist, picture } = this.scores;

    const honorElements = [...(await Promise.all(artist)), ...(await Promise.all(picture))].map(
      (data) => this._createHonorCard(data)
    );

    honorContainerElement.append(...honorElements);

    this.querySelector('.home').addEventListener('click', () => this.goTo('home'));
    this.querySelector('.categories').addEventListener('click', () => this.goTo('categories'));
    this.querySelector('.settings').addEventListener('click', () => this.goTo('settings'));
  }

  _createHonorCard({ name, url, brifScore, details }) {
    const honorCard = document.createElement('score-category-card');

    honorCard.setAttribute('name', name);
    honorCard.setAttribute('url', url);
    honorCard.setAttribute('brif', brifScore);
    honorCard.setAttribute('details', JSON.stringify(details));

    return honorCard;
  }

  /* Generates scores data */

  _createHonorsData() {
    const { picture, artist } = categoriesStartIndex;

    const pictureCategoriesScore = picture.map((num, i) =>
      this._getCategoryScoreObject('picture', num, i)
    );
    const artistCategoriesScore = artist.map((num, i) =>
      this._getCategoryScoreObject('artist', num, i)
    );

    return {
      picture: pictureCategoriesScore,
      artist: artistCategoriesScore,
    };
  }

  _getBrifCardScore(cardScore) {
    if (cardScore) {
      return cardScore.reduce((acc, item) => {
        if (item.result) {
          acc += 1;
        }

        return acc;
      }, 0);
    }

    return 0;
  }

  async _getCategoryScoreObject(category, num, i) {
    const picturesData = await this._getQuestions(this.translateService.getLocale());
    const url = num;
    const name = this.translateService.translate('title' + i);
    const scoreKey = `g${categoriesStartIndex[category][i]}`;
    const cardScore = this.settings.score[category][scoreKey];
    const brifScore = this._getBrifCardScore(cardScore);
    const details = Array.from(Array(10).keys()).map((index) =>
      this._getCategoryScoreDetails(num, index, picturesData, cardScore)
    );

    return { url, name, brifScore, details };
  }

  _getCategoryScoreDetails(categoryNum, i, picturesData, cardScore) {
    const imgNum = categoryNum + i;
    const url = imgNum;
    const { author, name, year } = picturesData[imgNum];
    const result = (cardScore && cardScore[i].result) || false;

    return { url, author, name, year, result };
  }

  async _getQuestions(locale) {
    const imagesUrls = {
      eng: 'imagesEng.json',
      rus: 'imagesRus.json',
    };
    const url = imagesUrls[locale];
    const res = await fetch(url);
    return res.json();
  }
}
