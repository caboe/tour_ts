import {pages} from './data/pages';
//TODO
// import pages from './src/data/page.json!json';
import {inject} from 'aurelia-framework';

export  class NavigationService {
    sections: any;//TODO type
    navigatePath: Array<string>;
    currentPage: JSON;
    currentSection: String;

    constructor() {
        this.sections = pages;
        this.navigatePath = ['etap', '0'];
        this.currentPage = this.page;
        this.currentSection = this.section;
        this.navigateToPage(this.navigatePath);
    }

    navigateToPage(path) {
        this.navigatePath = path;
        this.currentPage = this.page;
        this.currentSection = this.section;
    }

    get path() {
        return this.navigatePath;
    }

    get page() {
        return this.sections[this.navigatePath[0]][this.navigatePath[1]];
    }

    get section(){
        return this.navigatePath[0];
    }

    getSectionForPath(section){
        return this.sections[section];
    }

    navigateToFirstOfSection(section){
        this.navigateToPage([section,0])
    }
}
