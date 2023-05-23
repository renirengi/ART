export class NavigationService {
  /**
   * Don't use it! Use getInstance instead.
   */
  constructor() {
    this.callbacks = [];
  }

  static getInstance() {
    if (!NavigationService.service) {
      NavigationService.service = new NavigationService();
    }
    return NavigationService.service;
  }

  subscribeToNavigation(callback) {
    this.callbacks = [...this.callbacks, callback];
  }

  navigate(route, attributes) {
    this.callbacks.forEach((callback) => callback(route, attributes));
  }
}
