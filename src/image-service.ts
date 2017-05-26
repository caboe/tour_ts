import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {HttpClient} from 'aurelia-http-client';

@inject(EventAggregator)
export class ImageService {
  eventAggregator: EventAggregator;
  currentStage: Array<any> = [];
  currentNr: number;
  collection: Array<any>;

  constructor(eventAggregator) {
    this.eventAggregator = eventAggregator;
    this.currentNr = 0;
    this.collection = [];
    this.loadCollections();
  }

  loadCollections() {
    this.eventAggregator.publish('imageCollection', {state: 'load'});
    let client: HttpClient = new HttpClient();

    client.jsonp('https://api.flickr.com/services/rest/?method=flickr.collections.getTree&user_id=24537538@N04&api_key=531e7a0d62fe823d91b9ebcfca750195&collection_id=72157624746422138&format=json')
      .then(data => {
        this.collection = data.response.collections.collection[0].set;
        this.eventAggregator.publish('imageCollection', {state: 'finished'});
      });
  }

  loadCurrentPageImages() {
    this.loadPageImages(this.currentNr);
  }

  loadPageImages(nr) {
    if (!this.collection.length)
      return;

    const setId: string = this.getIdForStage(nr);
    this.loadPageImagesForId(setId);
  }

  loadPageImagesForId(id) {
    this.eventAggregator.publish('imageStage', {state: 'load'});
    let client = new HttpClient();
    const escapeId: string = encodeURIComponent(id);
    client.jsonp(`https://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&photoset_id=${escapeId}&api_key=531e7a0d62fe823d91b9ebcfca750195&format=json&json`)
      .then(data => {
        this.currentStage = data.response.photoset.photo;
        this.addImageDescriptions();
        this.addImagePaths();
        this.preloadPageImages(this.getImagePathList()).then(() => this.eventAggregator.publish('imageStage', {state: 'finished'}));
      });
  }

  getImagePathList(): Array<string> {
    let result = [];
    for (let image of this.currentStage) {
      result.push(image.urls.b);
    }
    return result;
  }

  addImagePaths() {
    for (let image of this.currentStage) {
      image.urls = {};
      for (let format of ['s', 'm', 'b']) {
        image.urls[format] = `https://farm${image.farm}.static.flickr.com/${image.server}/${image.id}_${image.secret}_${format}.jpg`
      }
    }
  }

  addImageDescriptions() {
    let client = new HttpClient();
    for (let image of this.currentStage) {
      client.jsonp(`https://api.flickr.com/services/rest/?method=flickr.photos.getInfo&photo_id=${image.id}&api_key=531e7a0d62fe823d91b9ebcfca750195&format=json&jsoncallback=tour.images.addInfo`)
        .then(data => {
          image.description = data.response.photo.description._content;
        });
    }
  }

  preloadImage(path) {
    new Promise(resolve => {
      const img = new Image();
      img.onload = () => resolve({path, status: 'ok'});
      img.onerror = () => resolve({path, status: 'error'});
      img.src = path;
    });
  }

  preloadPageImages(paths) {
    return Promise.all(paths.map(this.preloadImage));
  }

  getIdForStage(nr): string {
    return this.collection[nr].id;
  }

  getImageForId(id) {
    for (let image of this.currentStage) {
      if (id === image.id) {
        return image;
      }
    }
  }

  loadImagesForStageId(id) {
    for (let stage of this.collection) {
      if (stage.title === id) {
        this.loadPageImagesForId(stage.id);
      }
    }
  }
}
