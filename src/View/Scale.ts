/* eslint-disable no-console */
import { Options } from '../interfaces';
import { View } from './View';

class Scale {
  public options: Options;

  public view: View;

  public stepSlider: number;

  public sizeSlider: number;

  constructor(options: Options, view: View) {
    this.options = options;
    this.view = view;
    console.log(view);
    this.createScaleView(options);
    this.stepSlider = this.getStep(options);
    this.sizeSlider = this.getSize(options);
  }

  createScaleView(options: Options) {
    const { orientation } = options;
    const scale = document.createElement('div');
    scale.className = `slider__scale slider__scale_${orientation}`;
    const slider = document.querySelector('.slider') as HTMLElement;
    slider.append(scale);
    this.listeners(scale);
  }

  public listeners(scale: HTMLElement) {
    this.onclickScale = this.onclickScale.bind(this);
    scale.addEventListener('click', this.onclickScale);
  }

  // Добавляем новое событие по клику по шкале
  // Потому что иначе никак не получалось передать значение в View
  private onclickScale(event: Event): void {
    const { target } = event;
    // target тут это slider__scale-value
    // Тут проверяем, является ли target HTML-элементом
    // если нет, то просто выходим и ничего не делаем
    if (!(target instanceof HTMLElement)) return;
    if (!target.classList.contains('slider__scale-value')) return;
    // Переменной value Приписываем значение с Target со шкалы(2, 4, 6, 8, 10 например)
    const value = target.innerHTML;
    // Передаем это значение в view
    this.view.newPosition(Number(value));
  }

  // метод чтобы прятать шкалу
  createScaleSettings(options: Options): void {
    const { hideScale } = options;
    const scale = document.querySelector('.slider__scale') as HTMLElement;
    if (hideScale) {
      scale.style.display = 'none';
      return;
    }
    scale.style.display = '';
    scale.innerHTML = '';
    scale.className = `slider__scale slider__scale_${this.options.orientation}`;
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
    const scale = document.querySelector('.slider__scale') as HTMLElement;
    scale.append(fragDoc);
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

  getSize(options: Options): number {
    const { orientation } = options;
    const slider = document.querySelector('.slider') as HTMLElement;
    const positionSlider = slider.getBoundingClientRect();
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
}
export { Scale };
