/* eslint-disable no-console */
import { Options } from '../interfaces';
import { View } from './View';

class Runner {
  public options: Options;

  public view: View;

  constructor(options: Options, view: View) {
    this.options = options;
    this.view = view;
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
    const posTo = this.view.convertingPxToPercentages(convertTo);
    const posFrom = this.view.convertingPxToPercentages(convertFrom);

    if (orientation === 'horizontal') {
      runnerFrom.style.left = `${posFrom}%`;
      runnerTo.style.left = `${posTo}%`;
    } else {
      runnerFrom.style.bottom = `${posFrom}%`;
      runnerTo.style.bottom = `${posTo}%`;
    }
  }

  convertingValueToPx(value: number): number {
    const { min, max, step } = this.options;
    if (value === max) {
      return this.view.getSize(this.options);
    }
    const pxValue = ((value - min) / step) * this.view.getStep(this.options);
    return pxValue;
  }
}
export { Runner };
