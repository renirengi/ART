import template from './root.component.htm';

import { NavigationService } from '../../services/navigation.service';

export class RootComponent extends HTMLElement {
  constructor() {
    super();

    this.currentRoute = undefined;
    this.navigation = NavigationService.getInstance();
    this.navigation.subscribeToNavigation(this.onNavigation.bind(this));
  }

  connectedCallback() {
    this.innerHTML = template;
    this.pageComponents = [...this.childNodes].filter((node) => node.nodeName.includes('PAGE'));
    this.navigation.navigate('home');
  }


  onNavigation(route, attributes) {
    if (route === this.currentRoute) {
      return;
    }

    const navigatedPage = this.pageComponents.find((page) =>
      page.nodeName.includes(route.toUpperCase())
    );

    if (navigatedPage) {
      // eslint-disable-next-line no-console
      console.info(`Navigation to ${route}`);

      // Set navigated page attributes
      this._setPageAttributes(navigatedPage, attributes)

      // Show navigated page
      this.pageComponents.forEach((page) => page.setAttribute('active', String(page === navigatedPage)));

      this.currentRoute = route;
    } else {
      // eslint-disable-next-line no-console
      console.error(`Route ${route} not found`);
    }
  }

  _setPageAttributes(navigatedPage, attributes) {
    if (attributes) {
      Object.keys(attributes).forEach((attrName) => {
        const attrValue = attributes[attrName];

        if (attrValue === null || attrValue === undefined) {
          return;
        }

        const attrStrValue = typeof attrValue === 'object' ? JSON.stringify(attrValue) : attrValue.toString();

        navigatedPage.setAttribute(attrName, attrStrValue);
      });
    }
  }

}
