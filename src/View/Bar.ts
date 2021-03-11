/* eslint-disable no-console */
/* eslint-disable max-len */
import { Options } from '../interfaces';
import { View } from './View';

class Bar {
  public options: Options;

  public view: View;

  constructor(options: Options, view: View) {
    this.options = options;
    this.view = view;
    this.createBarView(options);
    this.createBarSetting(options);
  }

  createBarView(options: Options): void {
    const { orientation } = options;
    const bar = document.createElement('div');
    bar.className = `slider__bar slider__bar_${orientation}`;
    const slider = document.querySelector('.slider') as HTMLElement;
    slider.append(bar);
    this.createBarSetting(options);
  }

  // вычисляем полоску, в конструктор чтоб сразу отображался на стр
  createBarSetting(options: Options) {
    const { type, orientation } = options;
    const horizontalType = orientation === 'horizontal';
    const leftTop: 'left' | 'top' = horizontalType ? 'left' : 'top';
    const widthHeight: 'width' | 'height' = horizontalType ? 'width' : 'height';
    const runnersPositions = this.getRunnerPositions(options);
    const positionSlider = this.view.getPosition();
    const bar = document.querySelector('.slider__bar') as HTMLElement;
    const singleType = type === 'single';
    if (singleType) {
      if (horizontalType) {
        const end = this.convertingPxToPercentages(Math.abs(runnersPositions[1] - positionSlider), options);
        bar.style[leftTop] = '0%';
        bar.style[widthHeight] = `${end}%`;
      } else {
        const start = this.convertingPxToPercentages(Math.abs(runnersPositions[1] - positionSlider), options);
        const end = 100 - start;

        bar.style[leftTop] = `${start}%`;
        bar.style[widthHeight] = `${end}%`;
      }
    } else {
      const start = this.convertingPxToPercentages(Math.abs(runnersPositions[0] - positionSlider), options);
      const length = this.convertingPxToPercentages(Math.abs(runnersPositions[1] - runnersPositions[0]), options);
      bar.style[leftTop] = `${start}%`;
      bar.style[widthHeight] = `${length}%`;
    }
  }

  // формула для вычисления каждого бегунка отдельно
  getRunnerPositions(options: Options): number[] {
    const slider = document.querySelector('.slider') as HTMLElement;
    const runners = slider.querySelectorAll('.slider__runner');
    const runnersPosition = [this.calculator(runners[0], options), this.calculator(runners[1], options)];
    return runnersPosition.sort((a, b) => a - b);
  }

  calculator(element: Element, options: Options): number {
    const { orientation } = options;
    const leftTop: 'left' | 'top' = orientation === 'horizontal' ? 'left' : 'top';
    const width = Number.parseInt(getComputedStyle(element).width, 10);
    return element.getBoundingClientRect()[leftTop] + width / 2;
  }

  convertingPxToPercentages(value: number, options: Options): number {
    return (value * 100) / this.view.getSize(options);
  }
}

export { Bar };
