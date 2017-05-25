import {bindable, inject} from 'aurelia-framework';
import {NavigationService} from '../../navigation-service';
import {EventAggregator} from 'aurelia-event-aggregator';
import {NavigationBase} from "../navigationBase";

@inject(NavigationService, EventAggregator)
export class Default extends NavigationBase {
  @bindable sectionId;
  @bindable section;

  constructor(navigationService, eventAggregator) {
    super(navigationService, eventAggregator);
  }
}

