import { TranslateService } from './translate.service';

const imagesUrls = {
  eng: 'imagesEng.json',
  rus: 'imagesRus.json',
};

export class QuestionsService {
  /**
   * Don't use it! Use getInstance instead.
   */
  constructor() {
    this.translateService = TranslateService.getInstance();
  }

  static getInstance() {
    if (!QuestionsService.service) {
      QuestionsService.service = new QuestionsService();
    }
    return QuestionsService.service;
  }

  async generateArtistQuestions(startIndex) {
    const picturesData = await this._getQuestions(this.translateService.getLocale());
    const questionStr = this.translateService.translate('artistCardQuestion');
    const questionIndexes = Array.from(Array(10).keys());

    const questions = questionIndexes.map((questionIndex) => {
      const cardIndex = startIndex + questionIndex;
      const correctAnswer = this._getRandomNumber(0, 3);
      const answers = this._getArtistAnswers(picturesData, cardIndex, correctAnswer);
      const question = `${questionStr} by ${picturesData[cardIndex].author}?`;
      const selectedAnswer = undefined;
      const timeIsOver = false;

      return { answers, questionIndex, question, correctAnswer, selectedAnswer, timeIsOver };
    });

    return questions;
  }

  async generatePictureQuestions(startIndex) {
    const picturesData = await this._getQuestions(this.translateService.getLocale());
    const question = this.translateService.translate('pictureCardQuestion');
    const questionIndexes = Array.from(Array(10).keys());

    const questions = questionIndexes.map((questionIndex) => {
      const cardIndex = startIndex + questionIndex;
      const correctAnswer = this._getRandomNumber(0, 3);
      const answers = this._getPictureAnswers(picturesData, cardIndex, correctAnswer);
      const picture = `https://raw.githubusercontent.com/renirengi/image-data/master/full/${cardIndex}full.jpg`
      const selectedAnswer = undefined;
      const timeIsOver = false;

      return { answers, questionIndex, question, correctAnswer, selectedAnswer, timeIsOver, picture };
    });

    return questions;
  }

  async _getQuestions(locale) {
    const url = imagesUrls[locale];
    const res = await fetch(url);
    return res.json();
  }

  _getArtistAnswers(picturesData, cardIndex, correctAnswerIndex) {
    const answerIndexes = Array.from(Array(4).keys());
    const answers = answerIndexes.map((index) => {
      const imgIndex =
        index === correctAnswerIndex
          ? cardIndex
          : this._getAnotherAuthorNumber(picturesData, cardIndex);

      return `https://raw.githubusercontent.com/renirengi/image-data/master/full/${imgIndex}full.jpg`;
    });

    return answers;
  }

  _getPictureAnswers(picturesData, cardIndex, correctAnswerIndex) {
    const answerIndexes = Array.from(Array(4).keys());
    const answers = answerIndexes.map((index) => {
      const authorIndex =
        index === correctAnswerIndex
          ? cardIndex
          : this._getAnotherAuthorNumber(picturesData, cardIndex);

      return picturesData[authorIndex].author;
    });

    return answers;
  }

  _getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  _getAnotherAuthorNumber(picturesData, cardIndex) {
    let randomCardIndex;

    do {
      randomCardIndex = this._getRandomNumber(0, 240);
    } while (picturesData[cardIndex].author === picturesData[randomCardIndex].author);

    return randomCardIndex;
  }
}
