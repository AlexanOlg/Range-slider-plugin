/* eslint-disable prefer-const */
/* eslint-disable max-len */
/* eslint-disable no-console */

// нельзя проводить никаких расчетов, относящихся к бизнес-логике.
// Слой должен содержать логику, связанную с отображением
// (например, для изменения положения ползунка слайдера на экране),
// а также реагировать на взаимодействие пользователя с приложением.
// Каждый компонент слайдера (бегунки, шкала и т. д.) должен быть
// представлен отдельным классом
import { Options } from './interfaces';
import { EventEmitter } from './EventEmitter';

class View {
  public options: Options;

  public slider: HTMLElement;

  public track: HTMLElement;

  public scale: HTMLElement;

  public bar: HTMLElement;

  public runnerFirst: HTMLElement;

  public runnerSecond: HTMLElement;

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
    this.bar = this.createBar(options);
    this.runnerFirst = this.createRunnerFirst(options);
    this.runnerSecond = this.createRunnerSecond(options);
    this.settings = this.createSettings();
    this.stepSlider = this.getStep(options);
    this.sizeSlider = this.getSize(options);
    this.active = true;
    this.positionSlider = this.getPosition();
    this.startPosition(options);
    this.createBarSetting(options);
    this.addEventListeners();
    this.createScaleSettings(options);
    this.changeOptions(options);
  }

  createSlider(): HTMLElement {
    const slider = document.createElement('div');
    slider.className = 'slider';
    this.element.append(slider);
    return slider;
  }

  createTrack(options: Options): any {
    const { orientation } = options;
    const track = document.createElement('div');
    track.className = `slider__track slider__track_${orientation}`;
    this.slider.append(track);
    return track;
  }

  createScale(options: Options): any {
    const { orientation } = options;
    const scale = document.createElement('div');
    scale.className = `slider__scale slider__scale_${orientation}`;
    this.slider.append(scale);
    return scale;
  }

  createBar(options: Options): any {
    const { orientation } = options;
    const bar = document.createElement('div');
    bar.className = `slider__bar slider__bar_${orientation}`;
    this.slider.append(bar);
    return bar;
  }

  createRunnerFirst(options: Options): HTMLElement {
    const { orientation } = options;
    const runnerFirst = document.createElement('div');
    runnerFirst.classList.add(
      'slider__runner',
      'js-slider__runner',
      `slider__runner_${orientation}`,
      'slider__runner_first',
    );
    this.slider.append(runnerFirst);
    return runnerFirst;
  }

  createRunnerSecond(options: Options): HTMLElement {
    const { orientation } = options;
    const runnerSecond = document.createElement('div');
    runnerSecond.classList.add(
      'slider__runner', 'js-slider__runner', `slider__runner_${orientation}`, 'slider__runner_second',
    );
    this.slider.append(runnerSecond);
    // this.toggleRunners(options, runnerSecond);
    return runnerSecond;
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
    this.createTrack(options);
    this.createScale(options);
    this.createBar(options);
    this.createRunnerFirst(options);
    this.createRunnerSecond(options);
    this.createSettings();
    this.startPosition(options);
    this.createBarSetting(options);
    this.addEventListeners();
    this.createScaleSettings(options);
    this.changeOptions(options);
  }

  // Начальная позиция бегунков
  startPosition(options: Options) {
    const startFrom = `${this.options.from.toLocaleString()}`;
    const startTo = `${this.options.to.toLocaleString()}`;

    if (this.options.type === 'single') {
      this.moveRunnerAtValue();
      this.runnerFirst.setAttribute('data-text', startTo);
    }
    this.moveRunnerAtValue();

    this.runnerSecond.setAttribute('data-text', startFrom);
    this.createBarSetting(options);
  }

  // расстановка бегунков по from и to
  moveRunnerAtValue(): void {
    const { to, from, orientation } = this.options;
    const convertTo = this.convertingValueToPx(to);
    const convertFrom = this.convertingValueToPx(from);
    const posTo = this.convertingPxToPercentages(convertTo);
    const posFrom = this.convertingPxToPercentages(convertFrom);

    if (orientation === 'horizontal') {
      this.runnerFirst.style.left = `${posFrom}%`;
      this.runnerSecond.style.left = `${posTo}%`;
    } else {
      this.runnerFirst.style.bottom = `${posFrom}%`;
      this.runnerSecond.style.bottom = `${posTo}%`;
    }
  }

  convertingPxToPercentages(value: number): number {
    return (value * 100) / this.getSize(this.options);
  }

  convertingValueToPx(value: number): number {
    const { min, max, step } = this.options;
    if (value === max) {
      return this.getSize(this.options);
    }
    const pxValue = ((value - min) / step) * this.getStep(this.options);
    return pxValue;
  }

  addEventListeners() {
    const mouse = this.moveStart.bind(this);
    this.slider.addEventListener('touchstart', mouse);
    this.slider.addEventListener('mousedown', mouse);
    this.onclickTrack = this.onclickTrack.bind(this);
    this.onclickScale = this.onclickScale.bind(this);

    this.slider.addEventListener('click', this.onclickTrack);
    this.scale.addEventListener('click', this.onclickScale);
  }

  // правый или левый двигаем?
  public getTarget(target: any): string {
    if (this.runnerFirst) {
      if (this.runnerFirst.contains(target)) return 'from';
    }
    if (this.runnerSecond.contains(target)) {
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
    if (this.options.to === this.options.min) {
      this.active = false;
    }
    if (this.active) {
      this.runnerSecond.style.zIndex = '3';
      this.active = !this.active;
    } else if (this.options.from === this.options.min) {
      this.runnerSecond.style.zIndex = '0';
      this.active = !this.active;
    }
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

  // toggleRunners(options: Options, element: HTMLElement): void {
  //   const { type } = options;
  //   if (type === 'single') {
  //     element.style.display = 'none';
  //   } else {
  //     element.style.display = 'block';
  //   }
  // }

  // value - значение шкалы, target - бегунок from или to
  newPosition(value: number, target?: HTMLElement): void {
    // const valueOut = `${value.toLocaleString()}`;
    // const { from, to } = this.state;
    // const type = this.getTarget(target);

    // const fromDistance = Math.abs(from - value);
    // const toDistance = Math.abs(to - value);

    // const outTo = this.settings.querySelector('.slider__range-outto')! as HTMLInputElement;
    // const outFrom = this.settings.querySelector('.slider__range-outfrom')! as HTMLInputElement;
    // // const isSingle = this.options.type === 'single';

    // if (fromDistance * toDistance === 0) return;

    // if (!target) {
    //   const isTarget = (fromDistance < toDistance) ? 'from' : 'to';

    //   if (isTarget === 'from') {
    //     if (to > value) {
    //       this.state.from = value;
    //       (<HTMLInputElement>outFrom).value = valueOut;
    //       this.runnerSecond.setAttribute('data-text', valueOut);
    //       this.moveRunnerAtValue(this.state.from, this.runnerSecond);
    //       // Презентер должен поймать это значение и отправить в модель,
    //       // та проверит вернёт презентеру, тот вернёт в вью
    //       this.emitter.emit('newSetting', { from: value });
    //       this.createBarSetting(this.options);
    //     }
    //   } else if (from < value) {
    //     this.options.to = value;
    //     (<HTMLInputElement>outTo).value = valueOut;
    //     this.runnerFirst.setAttribute('data-text', valueOut);
    //     this.moveRunnerAtValue(this.options.to, this.runnerFirst);
    //     this.createBarSetting(this.options);
    //   }
    // } else if (type === 'from') {
    //   if (value < this.options.from) {
    //     value = this.options.to;
    //   }
    //   this.options.to = value;
    //   this.moveRunnerAtValue(this.options.to, target);
    //   this.createBarSetting(this.options);
    //   if (value !== to) {
    //     (<HTMLInputElement>outTo).value = valueOut;
    //     this.runnerFirst.setAttribute('data-text', valueOut);
    //   }
    // } else {
    //   if (value > this.options.to) {
    //     value = this.options.from;
    //   }
    //   this.options.from = value;
    //   this.moveRunnerAtValue(this.options.from, target);
    //   this.createBarSetting(this.options);
    //   if (value !== from) {
    //     this.runnerSecond.setAttribute('data-text', valueOut);
    //     (<HTMLInputElement>outFrom).value = valueOut;
    //   }
    // }
    // this.toggleRunners(this.options, this.runnerSecond);
    const {
      from, to, type, step,
    } = this.options;

    const fromDistance = Math.abs(from - value);
    const toDistance = Math.abs(to - value);
    const isSingle = type === 'single';

    if (isSingle && fromDistance) {
      this.emitter.emit('newSetting', { from: value });
      this.moveRunnerAtValue();
      return;
    }

    if (!target) {
      const isFrom = (fromDistance < toDistance) ? 'from' : 'to';

      if (isFrom === 'from') {
        this.emitter.emit('newSetting', { from: value });
        this.moveRunnerAtValue();
      } else {
        this.emitter.emit('newSetting', { to: value });
        this.moveRunnerAtValue();
      }
    } else {
      const targets = this.getTarget(target);
      if (targets === 'from') {
        if (value > to - step) value = from;
        this.emitter.emit('newSetting', { from: value });
        this.moveRunnerAtValue();
      } else {
        if (value < from + step) value = to;
        this.emitter.emit('newSetting', { to: value });
        this.moveRunnerAtValue();
      }
    }
  }

  // по нажатию на цифры чтоб двигался бегунок
  onclickScale(event: any) {
    event.preventDefault();
    const { target } = event;
    if (!(target instanceof HTMLElement)) return;
    if (!target.classList.contains('slider__scale-value')) return;
    const value = Number(target.innerHTML);
    this.newPosition(value);
  }

  // Находим координаты
  onclickTrack(event: any) {
    const { target } = event;
    // выводятся все подряд дивы
    // проверяем, есть ли у таргета slider__track или slider__bar
    if (!/track|bar/.test(target.className)) return;
    const coordinate = this.options.orientation === 'horizontal' ? event.clientX : event.clientY;
    const value = this.convertingPxToValue(coordinate);
    this.newPosition(value);
    // теперь выводятся либо горизонталь, либо вертикаль
  }

  // формула для вычисления каждого бегунка отдельно
  getRunnerPositions(options: Options): any {
    const runnersPosition = [this.calculator(this.runnerFirst, options), this.calculator(this.runnerSecond, options)];
    return runnersPosition.sort((a, b) => a - b);
  }

  calculator(element: HTMLElement, options: Options): number {
    const { orientation } = options;
    const side: 'left' | 'top' = orientation === 'horizontal' ? 'left' : 'top';
    const width = Number.parseInt(getComputedStyle(element).width, 10);
    return element.getBoundingClientRect()[side] + width / 2;
  }

  getPosition() {
    const side = this.options.orientation === 'horizontal' ? 'left' : 'top';
    return this.slider.getBoundingClientRect()[side];
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

  // метод чтобы прятать шкалу
  createScaleSettings(options: Options): void {
    const { hideScale } = options;
    if (hideScale) {
      this.scale.style.display = 'none';
      return;
    }
    this.scale.style.display = '';
    this.scale.innerHTML = '';
    this.scale.className = `slider__scale slider__scale_${this.options.orientation}`;
    // отвечает за появление шкалы
    this.insertScale();
  }

  // создаем цикл, в зависимости от длины шкалы создаем фрагмент
  insertScale() {
    const { min, max, step } = this.options;
    // переменная одного деления шкалы
    const division = this.calculatingDivision(this.options);
    // перевод деления шкалы в пиксельное значение
    const divToPx = (division / step) * this.stepSlider;
    // создаем новый пустой фрагмент документа
    const fragDoc = document.createDocumentFragment();
    // создаем цикл из пиксельных значений и прибавляем деление шкалы
    let actual = 0;
    for (let i = min; i < max; i += division) {
      if (actual > this.sizeSlider - 50) break;
      this.createScaleValue(fragDoc, i, actual, this.options);
      actual += divToPx;
    }
    // появление шкалы в документе
    this.createScaleValue(fragDoc, max, this.sizeSlider, this.options);
    this.scale.append(fragDoc);
  }

  // метод вычисления одного деления шкалы в зависимости от длины
  calculatingDivision(options: Options) {
    const { step } = options;
    const value = Math.ceil(this.sizeSlider / this.stepSlider);
    const division = Math.ceil(value / 5) * step;
    return division;
  }

  // Создание шкалы в документе
  createScaleValue(fragDoc: DocumentFragment,
    value: number, position: number, options: Options): void {
    const { orientation } = options;
    const scaleValue = document.createElement('span');
    scaleValue.className = `slider__scale-value slider__scale-value_${orientation}`;
    scaleValue.innerHTML = value.toString();
    fragDoc.append(scaleValue);
    const pxToPerc = this.convertingPxToPercentages(position);

    const side = orientation === 'horizontal' ? 'left' : 'bottom';
    scaleValue.style[side] = `${pxToPerc}%`;
  }

  // вычисляем полоску, в конструктор чтоб сразу отображался на стр
  createBarSetting(options: Options) {
    const { type, orientation } = options;
    const horizontalType = orientation === 'horizontal';
    const side = horizontalType ? 'left' : 'top';
    const size = horizontalType ? 'width' : 'height';
    const runnersPositions = this.getRunnerPositions(options);
    const positionSlider = this.getPosition();
    const singleType = type === 'single';
    // const bar = document.querySelector('.slider__bar');

    if (singleType) {
      if (horizontalType) {
        const end = this.convertingPxToPercentages(Math.abs(runnersPositions - positionSlider));
        this.bar.style[side] = '0%';
        this.bar.style[size] = `${end}%`;
      } else {
        const start = this.convertingPxToPercentages(Math.abs(runnersPositions - positionSlider));
        const end = 100 - start;

        this.bar.style[side] = `${start}%`;
        this.bar.style[size] = `${end}%`;
      }
    } else {
      const start = this.convertingPxToPercentages(Math.abs(runnersPositions[0] - positionSlider));
      const length = this.convertingPxToPercentages(Math.abs(runnersPositions[1] - runnersPositions[0]));
      this.bar.style[side] = `${start}%`;
      this.bar.style[size] = `${length}%`;
    }
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
    console.log(this.options);
  }
}

export { View };
