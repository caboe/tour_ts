import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {HttpClient} from 'aurelia-http-client';
import {Map} from "gulp-typescript/release/utils";

@inject(EventAggregator)
export class FlickrService {
  private eventAggregator: EventAggregator;
  private collection: Array<any>;
  private imageStore: Map<any> = {};

  constructor(eventAggregator: EventAggregator) {
    this.eventAggregator = eventAggregator;
  }

  private async loadCollection(): Promise<any> {
    this.eventAggregator.publish('imageCollection', {state: 'load'});
    let client: HttpClient = new HttpClient();
    return await client.jsonp('https://api.flickr.com/services/rest/?method=flickr.collections.getTree&user_id=24537538@N04&api_key=531e7a0d62fe823d91b9ebcfca750195&collection_id=72157624746422138&format=json')
  }

  private setCollection(data): void {
    this.collection = data.response.collections.collection[0].set;
    this.eventAggregator.publish('imageCollection', {state: 'finished'});
  }

  public async getImagesForSetTitle(title: string): Promise<any> {
    return new Promise(resolve => {
      if (typeof this.collection !== 'undefined') {
        this.loadSetImages(title).then(() => resolve(this.imageStore[this.getIdForTitle(title)]));
      } else {
        this.loadCollection()
          .then((data) => this.setCollection(data))
          .then(() => {
            this.loadSetImages(title)
              .then(() => resolve(this.imageStore[this.getIdForTitle(title)]))
          });
      }
    })
  }

  private getIdForTitle(title: string): string {
    return title.replace(/ /g, '')
  }

  private async loadSetImages(title: string): Promise<any> {
    this.eventAggregator.publish('imageStage', {state: 'load'});
    let client = new HttpClient();
    const escapeId: string = encodeURIComponent(this.getStageIdForTitle(title));
    return new Promise(resolve => {
      client.jsonp(`https://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&photoset_id=${escapeId}&api_key=531e7a0d62fe823d91b9ebcfca750195&format=json&json`)
        .then(data => {
          this.imageStore[this.getIdForTitle(title)] = data.response.photoset.photo;
          this.addPathsToImage(title);
          this.addImageDescriptions(title);
          this.preloadPageImages(this.getImagePathList(title)).then(() => this.eventAggregator.publish('imageStage', {state: 'finished'}));
          resolve(this.imageStore[this.getIdForTitle(title)]);
        });
    })
  }

  private addPathsToImage(title: string): void {
    for (let image of this.imageStore[this.getIdForTitle(title)]) {
      image.urls = {};
      for (let format of ['s', 'm', 'b']) {
        image.urls[format] = `https://farm${image.farm}.static.flickr.com/${image.server}/${image.id}_${image.secret}_${format}.jpg`
      }
    }
  }

  private async addImageDescriptions(title: string): Promise<any> {
    let client = new HttpClient();
    let deRegExp: RegExp = /(de \-\-\- )(.*?)(\-\-\- en)/;
    for (let image of this.imageStore[this.getIdForTitle(title)]) {
      client.jsonp(`https://api.flickr.com/services/rest/?method=flickr.photos.getInfo&photo_id=${image.id}&api_key=531e7a0d62fe823d91b9ebcfca750195&format=json&jsoncallback=tour.images.addInfo`)
        .then(data => {
          let trimmedDescription: string = data.response.photo.description._content.replace(/\s+/g, ' ');
          image.description = deRegExp.exec(trimmedDescription)[2];
        });
    }
  }

  private getStageIdForTitle(title: string): string {
    for (let stage of this.collection) {
      if (stage.title === title) {
        return stage.id;
      }
    }
  }

  private getImagePathList(title): Array<string> {
    let result = [];
    for (let image of this.getImagesListForSetTitle(title)) {
      result.push(image.urls.b);
    }
    return result;
  }

  private getImagesListForSetTitle(title: string): Array<any> {
    for (let stage of this.collection) {
      if (stage.title === title) {
        return stage;
      }
    }
  }

  private preloadImage(path): Promise<any> {
    return new Promise(resolve => {
      const img = new Image();
      img.onload = () => resolve({path, status: 'ok'});
      img.onerror = () => resolve({path, status: 'error'});
      img.src = path;
    });
  }

  private preloadPageImages(paths): Promise<any> {
    return Promise.all(paths.map(this.preloadImage));
  }
}
