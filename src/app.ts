import {RouterConfiguration, Router} from 'aurelia-router';
import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {NavigationService} from './navigation-service';

@inject(EventAggregator, NavigationService)
export class App {
  eventAggregator: EventAggregator;
  showFade: Boolean = false;
  router: Router;
  navigationService: NavigationService;

  constructor(eventAggregator, navigationService) {
    this.eventAggregator = eventAggregator;
    this.navigationService = navigationService;
    this.eventAggregator.subscribe('showFade', function (response) {
      this.showFade = response.active;
    }.bind(this));
  }

  configureRouter(config: RouterConfiguration, router: Router): void {
    this.router = router;
    config.title = 'Aurelia';
    config.options.pushState = true;
    config.map(this.navigationService.routeMap);
    config.mapUnknownRoutes('not-found');//TODO
  }

  hideFade() {
    this.eventAggregator.publish('showFade', {active: false});
  }
}
