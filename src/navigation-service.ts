import {pages} from './data/pages';
//TODO
// import pages from './src/data/page.json!json';
import {Router} from 'aurelia-router';
import {inject} from 'aurelia-framework';

@inject(Router)
export class NavigationService {
  public sections: any;//TODO type
  private navigatePath: Array<string>;
  public currentPage: JSON;
  private currentSection: string;
  private router: Router;
  private linearNavigationList: Array<string>;
  private delimiter: string = '/';

  constructor(router) {
    this.router = router;
    this.sections = pages;
    this.navigatePath = ['etap', '0'];
    this.currentPage = this.page;
    this.currentSection = this.section;
    this.linearNavigationList = this.getLinearNavigationList();
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
    return this.sections[this.navigatePath[0]].data[this.navigatePath[1]];
  }

  get section(): string {
    return this.navigatePath[0];
  }

  public navigateToNextPage(): void{
    if (this.linearNavigationList.length === this.currentIndex + 1)
      this.navigateToPage(this.getRouteArray(this.linearNavigationList[0]));
    else
      this.navigateToPage(this.getRouteArray(this.linearNavigationList[this.currentIndex + 1]));
  }

  public navigateToPreviousPage(): void{
    if (this.currentIndex === 0)
      this.navigateToPage(this.getRouteArray(this.linearNavigationList[this.linearNavigationList.length -1]));
    else
      this.navigateToPage(this.getRouteArray(this.linearNavigationList[this.currentIndex - 1]));
  }

  private get currentIndex(): number{
    return this.linearNavigationList.indexOf(this.getRouteName(this.navigatePath));
  }

  private getRouteName(path: Array<string>): string{
    return path.join(this.delimiter);
  }

  private getRouteArray(path: string): Array<string>{
    return path.split(this.delimiter);
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
      for (let page in this.sections[section].data) {
        let rowObject: NavigationRow = {
          route: '',
          name: '',
          moduleId: '',
          title: '',
          nav: true
        };
        rowObject['route'] = section + this.delimiter + page;
        rowObject['name'] = this.getRouteName([section, page]);
        let pageData = this.sections[section].data[page];
        let renderer:String = pageData.renderer;

        rowObject['title'] = pageData.title;
        rowObject['moduleId'] = `page/${renderer}/${renderer}`;

        if (pageData.hasOwnProperty('imageId')) {
          rowObject['settings'] =  {imageId: pageData.imageId};
        }
        navigationMap[navigationMap.length] = rowObject;
      }
    }
    return navigationMap;
  }

  private getLinearNavigationList(): Array<string>{
    let result = [];
    for (let section in this.sections) {
      for (let page in this.sections[section]) {
        result.push(this.getRouteName([section, page]));
      }
    }
    return result;
  }

  getSectionForPath(section: string) {
    return this.sections[section];
  }

  navigateToFirstOfSection(section: string): void {
    this.navigateToPage([section, '0'])
  }
}
