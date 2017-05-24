import {bindable, inject, computedFrom} from 'aurelia-framework';
import {NavigationService} from '../navigation-service';
import { EventAggregator } from 'aurelia-event-aggregator';

@inject(NavigationService, EventAggregator)
export class Navigation {
    navigationService: NavigationService;
    eventAggregator: EventAggregator;
    sections: any;
    navigationActive: boolean;

    constructor(navigationService, EventAggregator) {
        this.navigationService = navigationService;
        this.eventAggregator = EventAggregator;
        this.sections = this.navigationService.sections;
        this.navigationActive = false;
        this.eventAggregator.subscribe('showFade', function(response) {
            if (!response.active){
                this.navigationActive = response.active;
            }
        }.bind(this));
    }

    get currentSection(){
        return this.navigationService.section;
    }

    @computedFrom('navigationActive')
    get navigationVisible(){
        return this.navigationActive;
    }

    hide(){
        this.navigationActive = false;
        this.eventAggregator.publish('showFade', {active: this.navigationActive});
    }

    show(){
        this.navigationActive = true;
        this.eventAggregator.publish('showFade', {active: this.navigationActive});
    }

    toggleNavigation(){
        this.navigationActive ? this.hide() : this.show()
    }
}

export class KeysValueConverter {
    toView(obj) {
        return Reflect.ownKeys(obj);
    }
}
