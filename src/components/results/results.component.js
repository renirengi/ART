import template from './results.component.htm';

import { NavigationService } from '../../services/navigation.service';
import { TranslateService } from '../../services/translate.service';

export class ResultsComponent extends HTMLElement {

  constructor() {
    super();
    this.navigationService = NavigationService.getInstance();
    this.translateService = TranslateService.getInstance();
  }

  connectedCallback() {
    this.innerHTML = template;
    
    this.style.display = 'none';
  }
npm
  showResults(category, questions) {
    const correctAnswersNumber = questions.filter((question) => {
      const {correctAnswer, selectedAnswer, timeIsOver } = question;

      return !timeIsOver && correctAnswer === selectedAnswer;
    }).length;

    const resultsString = `${correctAnswersNumber} / ${questions.length}`;

    this.querySelector('.congratulations').textContent = this.translateService.translate('result');;
    this.querySelector('.results').textContent = resultsString;
    this.querySelector('.categories').addEventListener('click', () => this._goBack(category));
    this.style.display = 'block';
  }

  _goBack(category) {
    this.navigationService.navigate('categories', {category});
  }
}
