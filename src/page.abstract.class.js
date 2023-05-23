import { elementShowOrHide } from './utils';
import { NavigationService } from './services/navigation.service';

const unusedComponentAttributes = ['active', 'style'];

export class PageHTMLElement extends HTMLElement {

  static get observedAttributes() {
    return ['active'];
  }

  constructor() {
    super();
    this.navigationService = NavigationService.getInstance();
  }

  attributeChangedCallback(name, _oldValue, newValue) {
    const routerAttributesReducer = (acc, attrKey) => {
      const {nodeName, nodeValue, specified} = this.attributes[attrKey];
      const isRouterAttribute = specified && !unusedComponentAttributes.includes(nodeName);

      return isRouterAttribute ? {...acc, [nodeName]: nodeValue} : acc;
    };

    if (name === 'active') {
      const displayed = newValue === 'true';

      elementShowOrHide(this, displayed);

      if (displayed) {
        // Append router attributes
        this.routerAttributes = Object.keys(this.attributes).reduce(routerAttributesReducer, {});
        // Render page
        this.render();
      }
    }
  }

  render() {}

  goTo(route, attributes) {
    this.navigationService.navigate(route, attributes);
  }

}
