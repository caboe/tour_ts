import {inject} from 'aurelia-framework';
import {NavigationService} from '../../navigation-service';
import {BasePage} from "../basePage";

@inject(NavigationService)
export class Prolog extends BasePage{
  constructor(navigationService){
    super(navigationService);
  }
}
