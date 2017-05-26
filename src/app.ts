import {RouterConfiguration, Router} from 'aurelia-router';
import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';

@inject(EventAggregator)
export class App {
    eventAggregator: EventAggregator;
    showFade: Boolean = false;
    router: Router;

    constructor(eventAggregator) {
        this.eventAggregator = eventAggregator;
        this.eventAggregator.subscribe('showFade', function (response) {
            this.showFade = response.active;
        }.bind(this));
    }

    configureRouter(config: RouterConfiguration, router: Router): void {
        this.router = router;
        config.title = 'Aurelia';
        config.map([
            {route: ['', 'home'], name: 'home', moduleId: 'routed/prolog'},
            {route: 'stage', name: 'stage', moduleId: 'routed/stage', nav: true},
        ]);
    }

    hideFade() {
        this.eventAggregator.publish('showFade', {active: false});
    }
}
