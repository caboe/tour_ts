import {pages} from './data/pages';
//TODO
// import pages from './src/data/page.json!json';
import {Router} from 'aurelia-router';
import {inject} from 'aurelia-framework';

@inject(Router)
export class NavigationService {
  sections: any;//TODO type
  navigatePath: Array<string>;
  currentPage: JSON;
  currentSection: string;
  router: Router;

  constructor(router) {
    this.router = router;
    this.sections = pages;
    this.navigatePath = ['etap', '0'];
    this.currentPage = this.page;
    this.currentSection = this.section;
    // this.navigateToPage(this.navigatePath);
  }

  navigateToPage(path: Array<string>): void {
    this.navigatePath = path;
    this.currentPage = this.page;
    this.currentSection = this.section;
    this.router.navigateToRoute(this.getRouteName(path));
  }

  get path(): Array<string> {
    return this.navigatePath;
  }

  get page() {
    return this.sections[this.navigatePath[0]][this.navigatePath[1]];
  }

  get section(): string {
    return this.navigatePath[0];
  }

  getRouteName(path: Array<string>): string{
    return path.join('_');
  }

  get routeMap(): Array<any> {
    interface NavigationRow {
      route: string;
      name: string;
      moduleId: string
      title: string
      nav: boolean
    }

    let navigationMap: Array<NavigationRow> = [{
      route: '',
      name: 'home',
      moduleId: 'page/prolog/prolog',
      title: 'Home',
      nav: true
    }];
    for (let section in this.sections) {
      for (let page in this.sections[section]) {
        let rowObject: NavigationRow = {
          route: '',
          name: '',
          moduleId: '',
          title: '',
          nav: true
        };
        rowObject['route'] = section + '_' + page;
        rowObject['name'] = this.getRouteName([section, page]);
        rowObject['title'] = this.sections[section][page].title;
        if (section === 'prolog')
          rowObject['moduleId'] = 'page/prolog/prolog';
        else if (section === 'stage' || section === 'etap')//TODO
          rowObject['moduleId'] = 'page/stage/stage';
        else if (section === 'article')//TODO
          rowObject['moduleId'] = 'page/stage/stage';
        navigationMap[navigationMap.length] = rowObject;
      }
    }
    return navigationMap;
  }

  getSectionForPath(section: string) {
    return this.sections[section];
  }

  navigateToFirstOfSection(section: string): void {
    this.navigateToPage([section, '0'])
  }
}
