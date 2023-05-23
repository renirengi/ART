import template from './categories.component.htm';

import { PageHTMLElement } from '../../page.abstract.class';
import { TranslateService } from '../../services/translate.service';
import { SettingsService } from '../../services/settings.service';
import { categoriesStartIndex } from '../../constants';

export class CategoriesPageComponent extends PageHTMLElement {
  constructor() {
    super();
    this.settings = SettingsService.getInstance();
    this.translateService = TranslateService.getInstance();
  }

  async render() {
    this.innerHTML = template;
    this._bindControls();

    const cardContainerElement = document.getElementById('card-container');
    this.querySelector('.categories-title').textContent=this.translateService.translate('categories');
    const indexes = [...Array(12).keys()];
    const cardElements = await Promise.all(indexes.map((index) => this._createCard(index)));

    cardContainerElement.append(...cardElements);
  }

  async _createCard(index) {
    const cardElement = document.createElement('button');
    cardElement.classList.add('card');
    const counterElement = document.createElement('span');
    const cardScore = this._getCardScore(index);
    counterElement.textContent = `${cardScore}/10`;

    const pictureElement = document.createElement('img');

    await this._loadImage(pictureElement, this._makeNumber(index));

    pictureElement.setAttribute('alt', '0');

    if (cardScore < 10) {
      pictureElement.classList.add('black-white');
    }

    const nameElement = document.createElement('p');
    const titleElement = this.translateService.translate('title' + index);
    nameElement.textContent = titleElement;

    cardElement.appendChild(counterElement);
    cardElement.appendChild(pictureElement);
    cardElement.appendChild(nameElement);
    cardElement.addEventListener('click', () => this._cardClickHandler(index));

    return cardElement;
  }

  _makeNumber(index) {
    const {category} = this.routerAttributes;

    if (category === 'picture') {
      return index;
    } else {
      return index + 120;
    }
  }

  async _loadImage(element, imageNumber) {
    const imageUrl = `https://raw.githubusercontent.com/renirengi/image-data/master/img/${imageNumber}.jpg`;
    const img = new Image();

    img.onload = () => (element.src = imageUrl);
    img.src = imageUrl;
  }

  _bindControls() {
    this.querySelector('button.settings').addEventListener('click', () => this.goTo('settings'));
    this.querySelector('button.honor').addEventListener('click', () => this.goTo('honors'));
    this.querySelector('.home').addEventListener('click', () => this.goTo('home'));
    this.querySelector('.play').addEventListener('click', () => this.goTo('art'));
  }

  _getCardScore(index) {
    const {category} = this.routerAttributes;
    const scoreKey = `g${categoriesStartIndex[category][index]}`;
    const cardScore = this.settings.score[category][scoreKey];

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

  _cardClickHandler(categoryIndex) {
    const {category} = this.routerAttributes;
    const startIndex = categoriesStartIndex[category][categoryIndex];

    this.goTo('art', {category, startIndex});
  }
}
