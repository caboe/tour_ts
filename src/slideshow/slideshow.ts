import {inject, bindable, computedFrom} from 'aurelia-framework';
import {FlickrService} from '../flickr-service';

@inject(FlickrService)
export class Slideshow {
  @bindable stageId;

  imageService: FlickrService;
  imageSet: Array<any>;
  loading: boolean;
  current: number;
  slidePosition: number;
  tick: number;
  transition: boolean;

  constructor(imageService) {
    this.imageService = imageService;
    this.loading = true;
    this.current = 0;
    this.slidePosition = 0;
    this.transition = true;
  }

  private async loadImages(): Promise<any> {
    return this.imageService.getImagesForSetTitle(this.stageId)
      .then((collection) => {
        this.imageSet = collection;
        this.imageSet.push(this.imageSet[0]);
      });
  }

  @computedFrom('stageId')
  get refreshHack() {
    this.loadImages().then(() => this.restart());

    return;
  }

  restart() {
    this.stop();
    this.loading = true;
    this.current = 0;
    this.start()
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
    if (this.current == this.imageSet.length - 1)
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

  stopAndNext() {
    this.stop();
    this.next();
  }

  stopAndPrevious() {
    this.stop();
    this.previous();
  }

  jumpToStart() {
    this.transition = false;
    this.current = -1;
    window.setTimeout(() => {
      this.transition = true;
      this.next();
    }, 20)
  }

  jumpToEnd() {
    this.transition = false;
    this.current = this.imageSet.length - 1;
    window.setTimeout(() => {
      this.transition = true;
      this.previous();
    }, 20)
  }
}
