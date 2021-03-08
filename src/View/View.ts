/* eslint-disable prefer-const */
/* eslint-disable max-len */
/* eslint-disable no-console */

// нельзя проводить никаких расчетов, относящихся к бизнес-логике.
// Слой должен содержать логику, связанную с отображением
// (например, для изменения положения ползунка слайдера на экране),
// а также реагировать на взаимодействие пользователя с приложением.
// Каждый компонент слайдера (бегунки, шкала и т. д.) должен быть
// представлен отдельным классом
import { Options } from '../interfaces';
import { EventEmitter } from '../EventEmitter';
import { Runner } from './Runner';
import { Track } from './Track';
import { Scale } from './Scale';
import { Bar } from './Bar';

class View {
  public options: Options;

  public slider: HTMLElement;

  public track: Track;

  public scale: Scale;

  public runner: Runner;

  public bar: Bar;

  public settings: HTMLElement;

  public stepSlider: number;

  public sizeSlider: number;

  public active: boolean;

  public positionSlider: number;

  public emitter: EventEmitter;

  public element: JQuery<HTMLElement>;

  constructor(options: Options, element: JQuery<HTMLElement>, emitter: EventEmitter) {
    this.options = options;

    this.element = element;
    this.emitter = emitter;

    this.slider = this.createSlider();
    this.track = this.createTrack(options);
    this.scale = this.createScale(options);
    this.runner = this.createRunners(options);
    this.bar = this.createBar(options);
    this.settings = this.createSettings();
    this.stepSlider = this.getStep(options);
    this.sizeSlider = this.getSize(options);
    this.active = true;
    this.positionSlider = this.getPosition();
    this.startPosition(options);
    this.bar.createBarSetting(options);
    this.addEventListeners();
    this.scale.createScaleSettings(options);
    this.changeOptions(options);
  }

  createSlider(): HTMLElement {
    const slider = document.createElement('div');
    slider.className = 'slider';
    this.element.append(slider);
    return slider;
  }

  createTrack(options: Options): Track {
    return new Track(options, this);
  }

  createRunners(options: Options): Runner {
    return new Runner(options, this);
  }

  createBar(options: Options): Bar {
    return new Bar(options, this);
  }

  createScale(options: Options): Scale {
    return new Scale(options, this);
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
    inputOrientation.className = 'slider__settings-input slider__setting_orientation';
    inputTo.className = 'slider__settings-change slider__settings-change_to';
    inputFrom.className = 'slider__settings-change slider__settings-change_from';
    inputRange.className = 'slider__settings-input slider__settings-input_range';
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
    outFrom.type = 'number';
    outTo.type = 'number';

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

    return settings;
  }

  // метод изменения параметров orientation, range, from и to
  changeOptions(options: Options): void {
    const inputRange = this.settings.querySelector('.slider__settings-input_range')! as HTMLInputElement;
    const inputOrientation = this.settings.querySelector('.slider__setting_orientation')! as HTMLInputElement;
    const outTo = this.settings.querySelector('.slider__range-outto')! as HTMLInputElement;
    const outFrom = this.settings.querySelector('.slider__range-outfrom')! as HTMLInputElement;
    const inputFrom = this.settings.querySelector('.slider__settings-change_from')! as HTMLInputElement;
    const inputTo = this.settings.querySelector('.slider__settings-change_to')! as HTMLInputElement;
    const inputFromValue = (<HTMLInputElement>inputFrom).value;
    const inputToValue = (<HTMLInputElement>inputTo).value;

    inputRange.onchange = () => {
      if (options.type === 'double') {
        options.type = 'single';
        options.to = this.options.max;
        this.removeSlider(this.options);
      } else {
        this.options.type = 'double';
        this.removeSlider(this.options);
      }
    };
    inputOrientation.onchange = () => {
      if (options.orientation === 'horizontal') {
        options.orientation = 'vertical';
        this.removeSlider(options);
      } else {
        options.orientation = 'horizontal';
        this.removeSlider(options);
      }
    };
    outTo.value = String(options.to);
    outTo.onchange = () => {
      let value = Number(outTo.value);
      options.to = value;
      this.startPosition(options);
    };

    outFrom.value = String(options.from);
    outFrom.onchange = () => {
      let value = Number(outFrom.value);
      options.from = value;
      this.startPosition(options);
    };

    inputFrom.onchange = () => {
      const value = parseInt(inputFromValue.toString(), 10);
      if (value < 0) {
        options.from = options.min;
      }
      options.from = Math.abs(value);
      this.startPosition(options);
    };
    inputTo.onchange = () => {
      const value = parseInt(inputToValue.toString(), 10);
      if (value > options.max) {
        options.to = options.max;
      }
      options.to = Math.abs(value);
      this.startPosition(options);
    };
  }

  // Метод удаления слайдера, участвует при изменении changeSlider
  removeSlider(options: Options): void {
    this.slider.remove();
    this.slider = this.createSlider();
    this.track = this.createTrack(options);
    this.scale = this.createScale(options);
    this.bar = this.createBar(options);
    this.runner = this.createRunners(options);
    this.createSettings();
    this.startPosition(options);
    this.bar.createBarSetting(options);
    this.addEventListeners();
    this.scale.createScaleSettings(options);
    this.changeOptions(options);
  }

  // Начальная позиция бегунков
  startPosition(options: Options) {
    const startFrom = `${this.options.from.toLocaleString()}`;
    const startTo = `${this.options.to.toLocaleString()}`;
    const runners = this.slider.querySelectorAll('.slider__runner');

    if (this.options.type === 'single') {
      this.runner.moveRunnerAtValue(options, <HTMLElement>runners[0], <HTMLElement>runners[1]);
      runners[0].setAttribute('data-text', startTo);
    }
    this.runner.moveRunnerAtValue(options, <HTMLElement>runners[0], <HTMLElement>runners[1]);

    runners[0].setAttribute('data-text', startFrom);
    runners[1].setAttribute('data-text', startTo);
    this.bar.createBarView(options);
    this.bar.createBarSetting(options);
  }

  addEventListeners() {
    const mouse = this.moveStart.bind(this);
    this.slider.addEventListener('touchstart', mouse);
    this.slider.addEventListener('mousedown', mouse);
  }

  // правый или левый двигаем?
  public getTarget(target: any): string {
    const runners = this.slider.querySelectorAll('.slider__runner');
    if (runners[0]) {
      if (runners[0].contains(target)) return 'from';
    }
    if (runners[1].contains(target)) {
      return 'to';
    }
    return 'undefined';
  }

  // чтоб перетаскивать бегунки
  // когда перестаем перетаскивать, убираем addEventListeners, и перестает двигаться
  moveStart(event: MouseEvent | TouchEvent) {
    // target это каждый из бегунков
    const target = event.target as HTMLElement;
    if (this.getTarget(target)) {
      // определяем какой div двигаем
      const move = this.move.bind(this, target);
      // тут функция удаления как раз движений
      const runnersMouse = () => {
        this.slider.removeEventListener('mousemove', move);
        this.slider.removeEventListener('touchmove', move);
        document.removeEventListener('mouseup', runnersMouse);
        document.removeEventListener('touchend', runnersMouse);
      };
      this.slider.addEventListener('mousemove', move);
      this.slider.addEventListener('touchmove', move);
      document.addEventListener('mouseup', runnersMouse);
      document.addEventListener('touchend', runnersMouse);
    }
  }

  move(target: HTMLElement, event: any) {
    // залипание у левого края
    const { orientation } = this.options;
    let mouseValue = 0;
    event.preventDefault();
    if (!/runner/.test(target.className)) return;

    if (orientation === 'horizontal') {
      if (event.type === 'touchmove') {
        mouseValue = this.convertingPxToValue(event.touches[0].clientX);
      } else {
        mouseValue = this.convertingPxToValue(event.clientX);
      }
    } else if (event.type === 'touchmove') {
      mouseValue = this.convertingPxToValue(event.touches[0].clientY);
    } else {
      mouseValue = this.convertingPxToValue(event.clientY);
    }
    this.newPosition(mouseValue, target);
  }

  // value - значение шкалы, target - бегунок from или to
  newPosition(value: number, target?: HTMLElement): void {
    const {
      from, to, type, step,
    } = this.options;

    const fromDistance = Math.abs(from - value);
    const toDistance = Math.abs(to - value);
    const isSingle = type === 'single';
    const runners = this.slider.querySelectorAll('.slider__runner');

    if (isSingle && fromDistance) {
      this.emitter.emit('newSetting', { from: value });
      this.runner.moveRunnerAtValue(this.options, <HTMLElement>runners[0], <HTMLElement>runners[1]);
      return;
    }

    if (!target) {
      const isFrom = (fromDistance < toDistance) ? 'from' : 'to';

      if (isFrom === 'from') {
        this.emitter.emit('newSetting', { from: value });
        this.runner.moveRunnerAtValue(this.options, <HTMLElement>runners[0], <HTMLElement>runners[1]);
      } else {
        this.emitter.emit('newSetting', { to: value });
        this.runner.moveRunnerAtValue(this.options, <HTMLElement>runners[0], <HTMLElement>runners[1]);
      }
    } else {
      const targets = this.getTarget(target);
      if (targets === 'from') {
        if (value > to - step) value = from;
        this.emitter.emit('newSetting', { from: value });
        this.runner.moveRunnerAtValue(this.options, <HTMLElement>runners[0], <HTMLElement>runners[1]);
      } else {
        if (value < from + step) value = to;
        this.emitter.emit('newSetting', { to: value });
        this.runner.moveRunnerAtValue(this.options, <HTMLElement>runners[0], <HTMLElement>runners[1]);
      }
    }
  }

  getPosition(): number {
    const { orientation } = this.options;
    const slider = document.querySelector('.slider') as HTMLElement;
    let i = 0;
    if (orientation === 'horizontal') {
      i = slider.getBoundingClientRect().left;
    } else {
      i = slider.getBoundingClientRect().top;
    }
    return i;
  }

  getSize(options: Options): number {
    const { orientation } = options;
    const positionSlider = this.slider.getBoundingClientRect();
    return orientation === 'horizontal' ? positionSlider.width : positionSlider.height;
  }

  getStep(options: Options): number {
    const {
      min, max, step,
    } = options;
    const amount = Math.ceil((max - min) / step);
    // длину шкалы делим на amount
    return this.getSize(options) / amount;
  }

  convertingPxToPercentages(value: number): number {
    return (value * 100) / this.getSize(this.options);
  }

  // возвращаем начальный бегунок
  getSide() {
    const { orientation } = this.options;
    if (orientation === 'horizontal') {
      return 'left';
    } return 'bottom';
  }

  // переводим пиксели в значения шкалы, потому что при нажатии на трек
  // получаются пиксели экрана, а не значения шкалы
  convertingPxToValue(coordinate: number): number {
    const {
      orientation, min, max, step,
    } = this.options;
    const stepSlider = this.getStep(this.options);
    const sliderStart = this.getPosition();
    const sliderEnd = this.getPosition() + this.getSize(this.options);

    let a = 0;
    if (orientation === 'horizontal') {
      a = coordinate - sliderStart;
    } else {
      a = sliderEnd - coordinate;
    }
    if (a > this.getSize(this.options)) {
      return max;
    }
    if (a < 0) return min;

    const value = Math.round(a / stepSlider) * step + min;
    return value;
  }

  // метод обновления настоящего состояния options и то что будет присылать презентер
  public upDataPresenter(newOptions: Partial<Options>) {
    const updataOptions = {
      ...this.options,
      ...newOptions,
    };
    this.options = {
      ...updataOptions,
    };
  }
}

export { View };
