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
    config.map(this.navigationMap);
    config.mapUnknownRoutes('not-found');//TODO
  }

  get navigationMap() {
    interface NavigationRow {
      route: string;
      name: string;
      moduleId: string
      title: string
      nav: boolean
    }

    let navigationMap: Array<NavigationRow> =[{route: '', name: 'home', moduleId: 'page/prolog/prolog', title: 'Home', nav: true}];
    for (let section in this.navigationService.sections) {
      for (let page in this.navigationService.sections[section]) {
        let rowObject: NavigationRow = {
          route: '',
          name: '',
          moduleId: '',
          title: '',
          nav: true
        };
        rowObject['route'] = section + '_' + page;
        rowObject['name'] = section  + page;
        rowObject['title'] = this.navigationService.sections[section][page].title;
        if (section === 'prolog')
          rowObject['moduleId'] = 'page/prolog/prolog';
        else if (section === 'stage' || section === 'etap')//TODO
          rowObject['moduleId'] = 'page/stage/stage';
        else if (section === 'article')//TODO
          rowObject['moduleId'] = 'page/stage/stage';
        navigationMap[navigationMap.length] = rowObject;
      }
    }
    console.log(navigationMap);
    return navigationMap;
  }

  navigateTo(route:string){
    window.location.href = encodeURI(route);
    this.navigationService.navigateToPage(route.replace(/#\//,'').split('_'));
  }

  hideFade() {
    this.eventAggregator.publish('showFade', {active: false});
  }
}
