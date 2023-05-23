import template from './question-card.component.htm';

import { SettingsService } from '../../services/settings.service';
import { TranslateService } from '../../services/translate.service';

const activeClass = 'active';

export class QuestionCardComponent extends HTMLElement {
  constructor() {
    super();
    this.translateService = TranslateService.getInstance();
    this.settings = SettingsService.getInstance();
  }

  connectedCallback() {
    this.innerHTML = template;

    this.questionContainer = this.querySelector('div.question');
    this.answerContainer = this.querySelector('div.answer-container');
    this.timerContainer = this.querySelector('div.timer');
    this.paginatorElements = this.querySelectorAll('.paginator-container li');

    this.successDialogElement = this.querySelector('.result.success');
    this.errorDialogElement = this.querySelector('.result.error');
    this.querySelectorAll('button.next').forEach((elem) =>
      elem.addEventListener('click', () => this._nextHandler(this.questionIndex))
    );
  }

  _setActiveQuestion(paginatorElements, questionIndex) {
    paginatorElements.forEach((elem) => elem.classList.remove(activeClass));
    paginatorElements[questionIndex].classList.add(activeClass);
  }

  _setAnswers(answerImageElements, answers) {
    answerImageElements.forEach((elem, i) => (elem.src = answers[i]));
  }

  showQuestion(questionData) {
    const { answers, question, questionIndex, picture } = questionData;

    this.questionIndex = questionIndex;
    this._renderQuestion(question, picture, answers);
    this._setActiveQuestion(this.paginatorElements, questionIndex);

    if (this.settings.timeGame === 'on') {
      this._startTimer();
    }
  }

  showResult(result) {
    const displayedElement =
      result === 'true' ? this.successDialogElement : this.errorDialogElement;

    displayedElement.style.display = 'block';
  }

  _renderQuestion(questionText, picture, answers) {
    // Clean up before rendering
    this.questionContainer.innerHTML = '';
    this.answerContainer.innerHTML = '';

    const questionTextElement = document.createElement('p');

    questionTextElement.classList.add('question-text');
    questionTextElement.textContent = questionText;

    this.questionContainer.append(questionTextElement);

    if (picture) {
      const img = document.createElement('img');

      img.src = picture;
      img.alt = questionText;

      this.questionContainer.append(img);
    }

    const buttonElements = answers.map((answer, i) => {
      const buttonElement = document.createElement('button');

      if (picture) {
        buttonElement.textContent = answer;
      } else {
        const img = document.createElement('img');

        img.src = answer;
        img.alt = i;

        buttonElement.append(img);
      }

      buttonElement.addEventListener('click', () => this._replyHandler(i));

      return buttonElement;
    });

    this.answerContainer.append(...buttonElements);
  }

  _replyHandler(selectedAnswer) {
    const { questionIndex } = this;
    const event = new CustomEvent('reply', {
      bubbles: true,
      cancelable: false,
      detail: { selectedAnswer, questionIndex },
    });

    this.dispatchEvent(event);
    clearInterval(this.intervalId);
  }

  _timeIsOverHandler() {
    const { questionIndex } = this;
    const event = new CustomEvent('timeIsOver', {
      bubbles: true,
      cancelable: false,
      detail: { questionIndex },
    });

    this.dispatchEvent(event);
  }

  _nextHandler(questionIndex) {
    const event = new CustomEvent('next', {
      bubbles: true,
      cancelable: false,
      detail: { questionIndex },
    });

    this.dispatchEvent(event);

    this.successDialogElement.style.display = 'none';
    this.errorDialogElement.style.display = 'none';
  }

  _startTimer() {
    let seconds = 0;
    this.timerContainer.textContent = `00:00`;
    this.intervalId = setInterval(() => {
      seconds += 1;
      this.timerContainer.textContent = `00:${this._pad(seconds, 2)}`;
      if (seconds === +this.settings.timeToAnswer) {
        this.timerContainer.textContent = '';
        this._timeIsOverHandler();
        clearInterval(this.intervalId);
      }
    }, 1000);
  }

  _pad(num, size) {
    num = num.toString();
    while (num.length < size) num = `0${num}`;
    return num;
}
}
