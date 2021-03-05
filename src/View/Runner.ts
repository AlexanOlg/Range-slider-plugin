/* eslint-disable no-console */
import { Options } from '../interfaces';

class Runner {
  public options: Options;

  constructor(options: Options) {
    this.options = options;
    this.createRunnerFromTo(options);
  }

  createRunnerFromTo(options: Options) {
    const { orientation } = options;
    const runnerFrom = document.createElement('div');
    runnerFrom.classList.add(
      'slider__runner',
      'js-slider__runner',
      `slider__runner_${orientation}`,
      'slider__runner_from',
    );
    const runnerTo = document.createElement('div');
    runnerTo.classList.add(
      'slider__runner', 'js-slider__runner', `slider__runner_${orientation}`, 'slider__runner_to',
    );

    const slider = document.querySelector('.slider') as HTMLElement;
    slider.append(runnerFrom);
    slider.append(runnerTo);
    this.moveRunnerAtValue(options, runnerFrom, runnerTo);
  }

  // расстановка бегунков по from и to
  moveRunnerAtValue(options: Options, runnerFrom: HTMLElement, runnerTo: HTMLElement): void {
    const { to, from, orientation } = options;
    const convertTo = this.convertingValueToPx(to);
    const convertFrom = this.convertingValueToPx(from);
    const posTo = this.convertingPxToPercentages(convertTo);
    const posFrom = this.convertingPxToPercentages(convertFrom);

    if (orientation === 'horizontal') {
      runnerFrom.style.left = `${posFrom}%`;
      runnerTo.style.left = `${posTo}%`;
    } else {
      runnerFrom.style.bottom = `${posFrom}%`;
      runnerTo.style.bottom = `${posTo}%`;
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
}
export { Runner };
