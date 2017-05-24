import {inject, bindable} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {ImageService} from '../image-service';

@inject(ImageService, EventAggregator)
export class Slideshow {
  @bindable stageId;

  eventAggregator: EventAggregator;
  imageService: ImageService;
  collection: Array<any>;
  loading: boolean;
  current: number;
  slidePosition: number;
  tick: number;
  transition: boolean;

  constructor(imageService, eventAggregator) {
    this.eventAggregator = eventAggregator;
    this.imageService = imageService;
    this.imageService.setCurrentCollection(0);
    this.loading = true;
    this.current = 0;
    this.slidePosition = 0;
    this.transition = true;
    this.eventAggregator.subscribe('imageCollection', ({state}) => {if (state === 'finished') this.imageService.loadImagesForStageId(this.stageId)});
    this.eventAggregator.subscribe('imageStage', ({state}) => {if (state === 'finished') this.initSlideshow()});
  }

  initSlideshow() {
    this.collection = this.imageService.currentStage;
    this.collection.push(this.imageService.currentStage[0])
    this.start();
    this.loading = false;
  }

  start() {
    window.clearInterval(this.tick);
    this.tick = window.setInterval(() => {
      this.next()
    }, 3000);
  }

  directStart() {
    this.next();
    this.start();
  }

  stop() {
    window.clearInterval(this.tick)
  }

  next() {
    if (this.current == this.collection.length - 1) {
      this.jumpToStart();
      // debugger
    }
    this.current++;
    // this.transition = true
  }

  jumpToStart() {
    // debugger
    // this.transition = false
    this.current = 0;
  }

  jumpToEnd() {
    this.transition = false
    this.current = this.collection.length - 1
  }

  previous() {
    if (this.current == 0) {
      this.jumpToEnd();
      this.transition = true

    }
    else {
      this.current--;

    }
  }
}
