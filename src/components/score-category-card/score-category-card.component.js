import template from './score-category-card.component.htm';

import { SettingsService } from '../../services/settings.service';
import { TranslateService } from '../../services/translate.service';

export class ScoreCategoryCardComponent extends HTMLElement {
  constructor() {
    super();
    this.translateService = TranslateService.getInstance();
    this.settings = SettingsService.getInstance();

  }

  connectedCallback() {
    this.innerHTML = template;

    this.render();
  }

  async render() {
    const name = this.getAttribute('name');
    const url = this.getAttribute('url');
    const brif = this.getAttribute('brif');
    const details = JSON.parse(this.getAttribute('details'));

    const card = this.querySelector('.score-category-card');
    const titleElement = this.querySelector('h3.name');
    const imageElement = this.querySelector('img.cover');
    console.log(imageElement);
    const brifElement = this.querySelector('p.brif');
    const detailsElement = this.querySelector('div.details');

    titleElement.textContent = name;
    imageElement.setAttribute('alt', name);
    brifElement.textContent = `${brif} / 10`;
    card.classList.add(+brif === 10 ? 'passed' : 'unpassed');
    await this._loadImage(imageElement, this._getUrlFromNumber(url));

    detailsElement.append(...this._getDetailsElements(details));

    imageElement.addEventListener('click',()=>this.showAllElements());
  }

  async _loadImage(element, imageUrl) {
    const img = new Image();

    img.onload = () => (element.src = imageUrl);
    img.src = imageUrl;
  }

  _getDetailsElements(details) {
    const generator = ({url, author, name, year, result}) => {
      const imgElement = document.createElement('img');
      
      imgElement.setAttribute('src', this._getUrlFromNumber(url));
    
      const textElement = document.createElement('span');

      textElement.textContent = `${author} - ${name} - ${year}`;

      const questionElement = document.createElement('div');

      questionElement.classList.add('hiddenContent');

      questionElement.classList.add(result ? 'passed' : 'unpassed');

      questionElement.append(imgElement, textElement);

      return questionElement;
    };

    return details.map(generator);
  }

  _getUrlFromNumber(img) {
    return `https://raw.githubusercontent.com/renirengi/image-data/master/img/${img}.jpg`;
  }

  showAllElements(){
    
   const imageHid=document.querySelectorAll('.hiddenContent');
   console.log(imageHid)
   const elements=imageHid.forEach((elem)=>elem.classList.toggle('showIt'));
   return elements;
  }
}
