import {inject} from 'aurelia-framework';
import {NavigationService} from '../navigation-service';

@inject(NavigationService)
export class Header {
  navigationService: NavigationService;

  constructor(navigationService){
    this.navigationService = navigationService;
  }
}
