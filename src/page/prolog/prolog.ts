import {inject} from 'aurelia-framework';
import {NavigationService} from '../../navigation-service';

@inject(NavigationService)
export class Prolog {
    navigationService: NavigationService;
    currentPage: JSON;

    constructor(navigationService) {
        this.navigationService = navigationService;
        this.currentPage = this.navigationService.currentPage;
    }

    getCurrentPage(){
        return this.navigationService.currentPage;
    }

    get legacyPage(){
        return this.navigationService.currentPage;

    }
}
