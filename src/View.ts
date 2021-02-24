/* eslint-disable max-len */
/* eslint-disable no-console */
import { Options } from './interfaces';

class View {
  public options: Options;

  public slider: HTMLElement;

  public elements: HTMLElement;

  public settings: HTMLElement;

  public stepSlider: number;

  public sizeSlider: number;

  public active: boolean;

  public positionSlider: number;

  public scale: any;

  constructor(options: Options) {
    this.options = options;
    this.slider = this.createSlider(options);
    this.elements = this.createElements(options);
    this.settings = this.createSettings();
    this.stepSlider = this.getStep(options);
    this.sizeSlider = this.getSize(options);
    this.active = true;
    this.positionSlider = this.getPosition();

    this.startPosition(options);
    this.createBar(options);

    this.addEventListeners();
    this.createScale(options);

    this.changeOptions(options);
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
    inputOrientation.className = 'slider__settings-input slider__setting orientation';
    inputTo.className = 'slider__settings-change slider__settings-change_to';
    inputFrom.className = 'slider__settings-change slider__settings-change_from';
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

  // метод изменения параметров orienatation, range, from и to
  changeOptions(options: Options): any {
    const inputRange = this.slider.querySelector('.slider__settings-input') as HTMLElement;
    const inputOrientation = this.slider.querySelector('.slider__setting orientation') as HTMLElement;
    const outTo = this.slider.querySelector('.slider__range-outto') as HTMLElement;
    const outFrom = this.slider.querySelector('.slider__range-outfrom') as HTMLElement;
    const inputFrom = this.slider.querySelector('.slider__settings-change_from') as HTMLElement;
    const inputTo = this.slider.querySelector('.slider__settings-change_to') as HTMLElement;
    const outToValue = (<HTMLInputElement>outTo).value;
    const outFromValue = (<HTMLInputElement>outFrom).value;
    const inputFromValue = (<HTMLInputElement>inputFrom).value;
    const inputToValue = (<HTMLInputElement>inputTo).value;

    inputRange.onchange = () => {
      if (options.type === 'double') {
        options.type = 'single';
        options.to = options.max;
        this.removeSlider(options);
      } else {
        options.type = 'double';
        this.removeSlider(options);
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
    outTo.onchange = () => {
      const value = parseInt(outToValue.toString(), 10);
      options.to = value;
      this.startPosition(options);
    };
    outFrom.onchange = () => {
      const value = parseInt(outFromValue.toString(), 10);
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
  removeSlider(options: Options): any {
    this.slider.remove();
    this.slider = this.createSlider(options);
    this.createElements(options);

    this.createScale(options);
    this.startPosition(options);

    this.addEventListeners();
    this.createBar(this.options);
  }

  // Начальная позиция бегунков
  startPosition(options: Options) {
    const from = `${options.from.toLocaleString()}₽`;
    const to = `${options.to.toLocaleString()}₽`;
    const outTo = this.slider.querySelector('.slider__range-outto') as HTMLElement;
    const outFrom = this.slider.querySelector('.slider__range-outfrom') as HTMLElement;
    const runners = this.slider.querySelectorAll('.slider__runner');

    if (options.type === 'double') {
      this.moveRunnerAtValue(options.to, runners[0]);

      runners[0].setAttribute('data-text', from);
    }

    this.moveRunnerAtValue(options.from, runners[1]);

    runners[1].setAttribute('data-text', from);
    (<HTMLInputElement>outTo).value = to;
    (<HTMLInputElement>outFrom).value = from;
    this.createBar(options);
  }

  // движение бегунков
  moveRunnerAtValue(value: number, element: Element): void {
    const coordinate = this.convertingValueToPx(value);
    const side = this.getSide(this.options);
    const position = this.convertingPxToPercentages(coordinate);
    (<HTMLElement>document.querySelector('.slider__runner_second')).style[side] = `${position}%`;
  }

  convertingPxToPercentages(value: number) {
    return (value * 100) / this.getSize(this.options);
  }

  convertingValueToPx(value: number): number {
    return (value * 100) / this.getSize(this.options);
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
  getTarget(target: HTMLElement): string {
    const runners = this.slider.querySelectorAll('.slider__runner');
    if (runners[0]) {
      if (runners[0].contains(target)) return 'from';
    }
    if (runners[1].contains(target)) {
      return 'to';
    }
    return 'undefined';
  }

  // 26 чтоб перетаскивать бегунки
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
    // const runners = this.slider.querySelectorAll('.slider__runner');

    // if (this.options.to === this.options.min) {
    //   this.active = false;
    // }
    // if (this.active) {
    //   runners[1].style.zIndex = '3';
    //   this.active = !this.active;
    // } else if (this.options.from === this.options.min) {
    //   runners[1].style.zIndex = '0';
    //   this.active = !this.active;
    // }
    const { orientation } = this.options;
    let mouseValue = 0;
    event.preventDefault();
    if (!/roller/.test(target.className)) return;

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
    // записываем в значения еще и рубли
    const valueOut = `${value.toLocaleString()}₽`;
    // записываем их для проверок
    const { from, to } = this.options;
    const type = this.getTarget(target);
    const runners = this.slider.querySelectorAll('.slider__runner');
    const outFrom = this.slider.querySelector('.slider__range-outfrom') as HTMLElement;
    const outTo = this.slider.querySelector('.slider__range-outto') as HTMLElement;

    const fromDistance = Math.abs(this.options.from - value);
    const toDistance = Math.abs(this.options.to - value);
    const singleType = this.options.type === 'single';

    if (fromDistance * toDistance === 0) return;
    // чтобы оба двигались
    if (!target) {
      const isFrom = (fromDistance < toDistance) ? 'from' : 'to';
      // 21 один бегунок проверяем и режим single
      if (singleType && fromDistance) {
        this.options.to = value;
        this.moveRunnerAtValue(value, this.runnerSecond);
        this.createBar(this.options);
        (<HTMLInputElement>outFrom).value = valueOut;
        runners[1].setAttribute('data-text', valueOut);
        return;
      }
      // 22 при клике по шкале ищем ближайший бегунок и его двигаем
      if (isFrom === 'from') {
        if (to > value) {
          this.options.from = value;
          (<HTMLInputElement>outFrom).value = valueOut;
          runners[1].setAttribute('data-text', valueOut);
          this.moveRunnerAtValue(this.options.from, this.runnerSecond);
          this.createBar(this.options);
        }
      } else if (from < value) {
        this.options.to = value;
        (<HTMLInputElement>outTo).value = valueOut;
        runners[0].setAttribute('data-text', valueOut);
        this.moveRunnerAtValue(this.options.to, this.runnerFirst);
        this.createBar(this.options);
      }
    } else if (this.options.type === 'from') {
      if (value < this.options.from) {
        value = this.options.to;
      }
      this.options.to = value;
      this.moveRunnerAtValue(this.options.to, target);
      this.createBar(this.options);
      if (value !== to) {
        (<HTMLInputElement>outTo).value = valueOut;
        runners[0].setAttribute('data-text', valueOut);
      }
    } else {
      if (value > this.options.to) {
        value = this.options.from;
      }
      this.options.from = value;
      this.moveRunnerAtValue(this.options.from, target);
      this.createBar(this.options);
      if (value !== from) {
        runners[1].setAttribute('data-text', valueOut);
        (<HTMLInputElement>outFrom).value = valueOut;
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
  getRunnerPositions(options: Options): number[] {
    const runners = this.slider.querySelectorAll('.slider__runner');
    const runnersPosition = [this.calculator(runners[0], options), this.calculator(runners[1], options)];
    return runnersPosition.sort((a, b) => a - b);
  }

  calculator(element: Element, options: Options): number {
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
  createScale(options: Options): void {
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
  createBar(options: Options) {
    const { type, orientation } = options;
    const horizontalType = orientation === 'horizontal';
    const side = horizontalType ? 'left' : 'top';
    const size = horizontalType ? 'width' : 'height';
    const runnersPositions = this.getRunnerPositions(options);
    const positionSlider = this.getPosition();
    const singleType = type === 'single';

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
  getSide(options: Options) {
    const { orientation } = options;
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
}

export { View };
