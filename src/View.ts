import { Options } from './interfaces';

class View {
  public options: Options;

  public slider: HTMLElement;

  public elements: HTMLElement;

  public settings: HTMLElement;

  public stepSlider: number;

  constructor(options: Options) {
    this.options = options;
    this.slider = this.createSlider(options);
    this.elements = this.createElements(options);
    this.settings = this.createSettings();
    this.stepSlider = this.getStep(options);
  }

  createSlider(options: Options): HTMLElement {
    const slider = document.createElement('div');
    slider.className = 'slider';
    document.getElementById(options.id)!.append(slider);
    return slider;
  }

  createElements(options: Options): any {
    const { orientation } = options;

    const track = document.createElement('div');
    const bar = document.createElement('div');
    const scale = document.createElement('div');

    if (options.type !== 'single') {
      const runnerFirst = document.createElement('div');
      runnerFirst.classList.add(
        'slider__runner',
        'js-slider__runner',
        `slider__runner_${orientation}`,
        'slider__runner_first',
      );

      this.slider.append(runnerFirst);
    }

    const runnerSecond = document.createElement('div');

    runnerSecond.classList.add(
      'slider__runner', 'js-slider__runner', `slider__runner_${orientation}`, 'slider__runner_second',
    );
    this.slider.append(runnerSecond);

    track.className = `slider__track slider__track_${orientation}`;
    bar.className = `slider__bar slider__bar_${orientation}`;
    scale.className = `slider__scale slider__scale_${orientation}`;

    this.slider.append(scale);
    this.slider.append(track);
    track.append(bar);
  }

  createSettings(): any {
    const labelFrom = document.createElement('label');
    const labelTo = document.createElement('label');
    const inputFrom = document.createElement('input');
    const inputTo = document.createElement('input');
    const labelRange = document.createElement('label');
    const labelOrientation = document.createElement('label');
    const inputRange = document.createElement('input');
    const inputOrientation = document.createElement('input');
    const line = document.createElement('span');
    const outFrom = document.createElement('input');
    const outTo = document.createElement('input');
    const settings = document.createElement('div');
    const range = document.createElement('div');

    range.className = 'slider__range';
    settings.className = 'slider__settings';
    settings.id = 'slider-settings';
    inputOrientation.className = 'slider__settings-input';
    inputTo.className = 'slider__settings-change';
    inputFrom.className = 'slider__settings-change';
    inputRange.className = 'slider__settings-input';
    line.className = 'slider__range-line';
    outFrom.className = 'slider__range-out slider__range-outfrom';
    outTo.className = 'slider__range-out slider__range-outto';
    labelFrom.className = 'slider__label';
    labelTo.className = 'slider__label';
    labelRange.className = 'slider__label';
    labelOrientation.className = 'slider__label';

    labelTo.innerHTML = 'to';
    labelFrom.innerHTML = 'from';
    inputOrientation.type = 'checkbox';
    labelOrientation.innerHTML = 'Orientation';
    labelRange.innerHTML = 'range';
    line.innerHTML = '-';

    inputRange.type = 'checkbox';
    inputTo.type = 'number';
    inputFrom.type = 'number';
    outFrom.type = 'text';
    outTo.type = 'text';

    document.querySelector('body')!.appendChild(settings);
    labelFrom.append(inputFrom);
    labelTo.append(inputTo);
    labelOrientation.append(inputOrientation);
    labelRange.append(inputRange);
    this.slider.after(settings);
    settings.prepend(range);
    range.prepend(outTo);
    range.prepend(line);
    range.prepend(outFrom);
    settings.prepend(labelOrientation);
    settings.prepend(labelRange);
    settings.prepend(labelTo);
    settings.prepend(labelFrom);
  }

  getSize(options: Options): number {
    const { orientation } = options;
    const positionSlider = this.slider.getBoundingClientRect();

    return orientation === 'horizontal'
      ? positionSlider.width : positionSlider.height;
  }

  getStep(options: Options): number {
    const {
      min, max, step, orientation,
    } = options;

    const amount = Math.ceil((max - min) / step);
    // длину шкалы делим на amount
    return this.getSize(orientation) / amount;
  }
}

export { View };
