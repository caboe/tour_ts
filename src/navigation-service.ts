import {pages} from './data/pages';
//TODO
// import pages from './src/data/page.json!json';

export  class NavigationService {
    sections: any;//TODO type
    navigatePath: Array<string>;
    currentPage: JSON;
    currentSection: string;

    constructor() {
        this.sections = pages;
        this.navigatePath = ['etap', '0'];
        this.currentPage = this.page;
        this.currentSection = this.section;
        this.navigateToPage(this.navigatePath);
    }

    navigateToPage(path: Array<string>): void {
        this.navigatePath = path;
        this.currentPage = this.page;
        this.currentSection = this.section;
    }

    get path(): Array<string> {
        return this.navigatePath;
    }

    get page() {
        return this.sections[this.navigatePath[0]][this.navigatePath[1]];
    }

    get section(): string{
        return this.navigatePath[0];
    }

    getSectionForPath(section:string){
        return this.sections[section];
    }

    navigateToFirstOfSection(section:string): void{
        this.navigateToPage([section,'0'])
    }
}
