import {bindable, inject, computedFrom} from 'aurelia-framework';
import {NavigationService} from '../../navigation-service';
import { EventAggregator } from 'aurelia-event-aggregator';

@inject(NavigationService, EventAggregator)
export class StageRenderer {
    @bindable sectionId;

    navigationActive: boolean;
    navigationService: NavigationService;
    eventAggregator: EventAggregator;

    constructor(navigationService, EventAggregator) {
        this.navigationActive = false;
        this.navigationService = navigationService;
        this.eventAggregator = EventAggregator;
        this.eventAggregator.subscribe('showFade', function(response) {
            if (!response.active){
                this.navigationActive = false;
            }
        }.bind(this));
    }

    get currentItem(){
        return this.navigationService.page;
    }

    get section(){
        return this.navigationService.getSectionForPath(this.sectionId);
    }

    navigateTo(navigatePath) {
        this.navigationService.navigateToPage(navigatePath);
        this.eventAggregator.publish('showFade', {active: false});
    }
}
