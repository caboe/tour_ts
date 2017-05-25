import {inject} from 'aurelia-framework';
import {NavigationService} from '../navigation-service';
import {EventAggregator} from 'aurelia-event-aggregator';
import {NavigationBase} from "./navigationBase";

@inject(NavigationService, EventAggregator)
export class Navigation extends NavigationBase {
  constructor(navigationService, eventAggregator) {
    super(navigationService, eventAggregator);
  }
}

export class KeysValueConverter {
  toView(obj) {
    return Reflect.ownKeys(obj);
  }
}
