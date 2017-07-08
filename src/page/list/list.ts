import {inject} from 'aurelia-framework';
import {NavigationService} from '../../navigation-service';
import {BasePage} from "../basePage";

@inject(NavigationService)
export class List extends BasePage{
  links;

  constructor(navigationService){
    super(navigationService);
    this.links = this.navigationService.currentPage['links'];
    console.log(navigationService.currentPage.links)
  }
}

export class KeysValueConverter {
  toView(obj) {
    return Reflect.ownKeys(obj);
  }
}
