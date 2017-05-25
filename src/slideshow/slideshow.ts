import {inject, bindable, computedFrom} from 'aurelia-framework';
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
  lastStageId: any;

  constructor(imageService, eventAggregator) {
    this.eventAggregator = eventAggregator;
    this.imageService = imageService;
    this.loading = true;
    this.current = 0;
    this.slidePosition = 0;
    this.transition = true;
    this.eventAggregator.subscribe('imageCollection', ({state}) => {
      if (state === 'finished') this.loadForCurrentStageId()
    });
    this.eventAggregator.subscribe('imageStage', ({state}) => {
      if (state === 'finished') this.init()
    });
  }

  @computedFrom('stageId')
  get refreshHack() {
    if (this.stageId != this.lastStageId)
      this.restart();
    return;
  }

  restart() {
    this.stop();
    this.loading = true;
    this.loadForCurrentStageId();
    this.current = 0;
  }

  loadForCurrentStageId() {
    this.imageService.loadImagesForStageId(this.stageId);
    this.lastStageId = this.stageId;
  }

  init() {
    this.collection = this.imageService.currentStage;
    this.collection.push(this.imageService.currentStage[0]);
    this.start();
  }

  start() {
    this.loading = false;
    window.clearInterval(this.tick);
    this.tick = window.setInterval(() => {
      this.next()
    }, 7000);
  }

  directStart() {
    this.next();
    this.start();
  }

  stop() {
    window.clearInterval(this.tick)
  }

  next() {
    if (this.current == this.collection.length - 1)
      this.jumpToStart();
    this.current++;
  }

  previous() {
    if (this.current == 0) {
      this.jumpToEnd();
    }
    else {
      this.current--;
    }
  }

  jumpToStart() {
    this.transition = false;
    this.current = -1;
    this.transition = true;
  }

  jumpToEnd() {
    this.transition = false;
    this.current = this.collection.length - 1;
    this.transition = true;
  }
}
