import 'core-js/stable';
import 'regenerator-runtime/runtime';

import '@/styles/index.scss';

import { ArtPageComponent } from './components/art-page/art.component';
import { CategoriesPageComponent } from './components/categories-page/categories.component';
import { HomePageComponent } from './components/home-page/home.component';
import { HonorsPageComponent } from './components/honors-page/honors.component';
import { RootComponent } from './components/root/root.component';
import { SettingsPageComponent } from './components/settings-page/settings.component';
import { QuestionCardComponent } from './components/question-card/question-card.component';
import { ScoreCategoryCardComponent } from './components/score-category-card/score-category-card.component';
import { ResultsComponent } from './components/results/results.component';
import { SettingsService } from './services/settings.service';
import { TranslateService } from './services/translate.service';

/* Init app services */

const settingsService = SettingsService.getInstance();
const translateService = TranslateService.getInstance();
const hidableComponentsList = ['timer', 'button'];

translateService.setLocale(settingsService.language);

/* Init components */

customElements.define('app-root', RootComponent);
customElements.define('home-page', HomePageComponent);
customElements.define('settings-page', SettingsPageComponent);
customElements.define('art-page', ArtPageComponent);
customElements.define('honors-page', HonorsPageComponent);
customElements.define('categories-page', CategoriesPageComponent);
customElements.define('question-card', QuestionCardComponent);
customElements.define('results-card', ResultsComponent);
customElements.define('score-category-card', ScoreCategoryCardComponent);