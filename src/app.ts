import { inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';

@inject(EventAggregator)
export class App {
  eventAggregator:EventAggregator;
  showFade:Boolean = false;

  constructor(eventAggregator) {
    this.eventAggregator = eventAggregator;
    this.eventAggregator.subscribe('showFade', function(response) {
      this.showFade = response.active;
    }.bind(this));
  }

  hideFade(){
    this.eventAggregator.publish('showFade', {active: false});
  }
}
