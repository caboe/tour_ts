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
        this.refreshCurrentCollection();
        this.eventAggregator.publish('imageCollection', {state: 'finished'});
      });
  }

  loadCurrentStage() {
    this.loadStage(this.currentNr);
  }

  loadStage(nr) {
    if (!this.collection.length) {
      return
    }

    const setId: string = this.getIdForStage(nr);
    this.loadStageForId(setId);
  }

  loadStageForId(id) {
    this.eventAggregator.publish('imageStage', {state: 'load'});
    let client = new HttpClient();
    const escapeId = encodeURIComponent(id);
    client.jsonp(`https://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&photoset_id=${escapeId}&api_key=531e7a0d62fe823d91b9ebcfca750195&format=json&json`)
      .then(data => {
        this.currentStage = data.response.photoset.photo;
        this.loadImagesDescriptions();
        this.loadImg(this.imagePathList()).then(()=>this.eventAggregator.publish('imageStage', {state: 'finished'}));
      });
  }

  imagePathList(){
    let result = [];
    for (let image of this.currentStage) {
      result.push(`http://farm${image.farm}.static.flickr.com/${image.server}/${image.id}_${image.secret}_b.jpg`);
      this.loadImageForId(image.id, image)
    }
    return result;
  }

  loadImagesDescriptions() {
    for (let image of this.currentStage) {
      this.loadImageForId(image.id, image)
    }

  }

  loadImageForId(id, image) {
    let client = new HttpClient();
    client.jsonp(`https://api.flickr.com/services/rest/?method=flickr.photos.getInfo&photo_id=${id}&api_key=531e7a0d62fe823d91b9ebcfca750195&format=json&jsoncallback=tour.images.addInfo`)
      .then(data => {
        image.description = data.response.photo.description._content;
      });
  }

  checkImage = path =>
    new Promise(resolve => {
      const img = new Image();
      img.onload = () => resolve({path, status: 'ok'});
      img.onerror = () => resolve({path, status: 'error'});
      img.src = path;
    });

  loadImg = paths => Promise.all(paths.map(this.checkImage))

  getIdForStage(nr) {
    return this.collection[nr].id;
  }

  refreshCurrentCollection() {
    this.setCurrentCollection(this.currentNr);
  }

  setCurrentCollection(nr) {
    this.currentNr = nr;
    this.loadCurrentStage();
  };

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
        this.loadStageForId(stage.id);
      }
    }
  }
}
