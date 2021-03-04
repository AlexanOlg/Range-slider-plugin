import { Options } from '../interfaces';

class Track {
  public options: Options;

  constructor(options: Options) {
    this.options = options;
    this.createTrackView(options);
  }

  createTrackView(options: Options): any {
    const { orientation } = options;
    const track = document.createElement('div');
    track.className = `slider__track slider__track_${orientation}`;
    const slider = document.querySelector('.slider') as HTMLElement;
    slider.append(track);
    return track;
  }
}
export { Track };
