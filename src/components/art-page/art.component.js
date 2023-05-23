import template from './art.component.htm';

import { PageHTMLElement } from '../../page.abstract.class';
import { QuestionsService } from '../../services/questions.service';
import { SettingsService } from '../../services/settings.service';
import { TranslateService } from '../../services/translate.service';

export class ArtPageComponent extends PageHTMLElement {
  constructor() {
    super();
    this.settings = SettingsService.getInstance();
    this.questionsService = QuestionsService.getInstance();
    this.translateService = TranslateService.getInstance();
  }

  async render() {
    this.innerHTML = template;

    const startIndex = +this.routerAttributes.startindex;
    const { category } = this.routerAttributes;
    this.querySelector('.question-title').textContent=this.translateService.translate('questions');

    if (category === 'picture') {
      this.questions = await this.questionsService.generatePictureQuestions(startIndex);
    } else {
      this.questions = await this.questionsService.generateArtistQuestions(startIndex);
    }


    this.cardElement = this.querySelector('question-card');

    this.cardElement.showQuestion(this.questions[0]);

    this.resultsElement = this.querySelector('results-card');

    this._subscribeEvents();
  }

  _replyHandler({ selectedAnswer, questionIndex }) {
    const question = this.questions[questionIndex];

    question.selectedAnswer = selectedAnswer;

    this.cardElement.showResult(String(question.correctAnswer === selectedAnswer));
  }

  _timeIsOverHandler({ questionIndex }) {
    const question = this.questions[questionIndex];

    question.timeIsOver = true;

    this.cardElement.showResult('false');
  }

  _nextHandler({ questionIndex }) {
    const nextSlide = 1 + questionIndex;

    if (nextSlide < this.questions.length) {
      this.cardElement.showQuestion(this.questions[nextSlide]);
    } else {
      this._endOfGameHandler();
    }
  }

  _endOfGameHandler() {
    const { category } = this.routerAttributes;
    const scoreKey = `g${this.routerAttributes.startindex}`;
    const scoreValue = this.questions.map((q) => {
      const {questionIndex, question, correctAnswer, selectedAnswer, timeIsOver, picture} = q;
      const result = !timeIsOver && correctAnswer === selectedAnswer;

      return {questionIndex, question, picture, result};
    });

    const scoreCategoryValue = {...this.settings.score[category], [scoreKey]: scoreValue};

    this.settings.score = {...this.settings.score, [category]: scoreCategoryValue};

    this.cardElement.remove();
    this.resultsElement.showResults(category, this.questions);
  }

  _subscribeEvents() {
    this.cardElement.addEventListener('reply', (e) => this._replyHandler(e.detail));
    this.cardElement.addEventListener('timeIsOver', (e) => this._timeIsOverHandler(e.detail));
    this.cardElement.addEventListener('next', (e) => this._nextHandler(e.detail));

    this.querySelector('.settings').addEventListener('click', () => this.goTo('settings'));
    this.querySelector('.honor').addEventListener('click', () => this.goTo('honors'));
    this.querySelector('.home').addEventListener('click', () => this.goTo('home'));
    this.querySelector('.back').addEventListener('click', () => this.goTo('categories'));
  }
}
