/* eslint-disable max-len */
import { Options } from '../interfaces';

class Bar {
  public options: Options;

  constructor(options: Options) {
    this.options = options;
    this.createBarView(options);
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
    const side: 'left' | 'top' = horizontalType ? 'left' : 'top';
    const size: 'width' | 'height' = horizontalType ? 'width' : 'height';
    const runnersPositions = this.getRunnerPositions(options);
    const positionSlider = this.getPosition(options);
    const bar = document.querySelector('.slider__bar') as HTMLElement;
    const singleType = type === 'single';
    if (singleType) {
      if (horizontalType) {
        const end = this.convertingPxToPercentages(Math.abs(runnersPositions[1] - positionSlider), options);
        bar.style[side] = '0%';
        bar.style[size] = `${end}%`;
      } else {
        const start = this.convertingPxToPercentages(Math.abs(runnersPositions[1] - positionSlider), options);
        const end = 100 - start;

        bar.style[side] = `${start}%`;
        bar.style[size] = `${end}%`;
      }
    } else {
      const start = this.convertingPxToPercentages(Math.abs(runnersPositions[0] - positionSlider), options);
      const length = this.convertingPxToPercentages(Math.abs(runnersPositions[1] - runnersPositions[0]), options);
      bar.style[side] = `${start}%`;
      bar.style[size] = `${length}%`;
    }
  }

  getPosition(options: Options): number {
    const { orientation } = options;
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
    const slider = document.querySelector('.slider') as HTMLElement;
    const positionSlider = slider.getBoundingClientRect();
    return orientation === 'horizontal' ? positionSlider.width : positionSlider.height;
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
    const side: 'left' | 'top' = orientation === 'horizontal' ? 'left' : 'top';
    const width = Number.parseInt(getComputedStyle(element).width, 10);
    return element.getBoundingClientRect()[side] + width / 2;
  }

  convertingPxToPercentages(value: number, options: Options): number {
    return (value * 100) / this.getSize(options);
  }
}

export { Bar };
