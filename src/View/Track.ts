/* eslint-disable no-console */
import { Options } from '../interfaces';
import { View } from './View';

class Track {
  public options: Options;

  public view: View;

  constructor(options: Options, view: View) {
    this.options = options;
    this.view = view;
    this.createTrackView(options);
  }

  createTrackView(options: Options): any {
    const { orientation } = options;
    const track = document.createElement('div');
    track.className = `slider__track slider__track_${orientation}`;
    const slider = document.querySelector('.slider') as HTMLElement;
    slider.append(track);
    this.listeners(track);
  }

  public listeners(track: HTMLElement) {
    this.view.onclickTrack = this.view.onclickTrack.bind(this);
    track.addEventListener('click', this.view.onclickTrack);
  }
}
export { Track };
