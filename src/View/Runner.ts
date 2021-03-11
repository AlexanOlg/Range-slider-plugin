/* eslint-disable no-console */
import { Options } from '../interfaces';
import { View } from './View';

class Runner {
  public options: Options;

  public view: View;

  public runnerFrom: HTMLElement;

  public runnerTo: HTMLElement;

  constructor(options: Options, view: View) {
    this.options = options;
    this.view = view;
    this.runnerFrom = this.createRunnerFrom(options);
    this.runnerTo = this.createRunnerTo(options);
  }

  createRunnerFrom(options: Options): HTMLElement {
    const { orientation } = options;
    const runnerFrom = document.createElement('div');
    runnerFrom.classList.add(
      'slider__runner',
      'js-slider__runner',
      `slider__runner_${orientation}`,
      'slider__runner_from',
    );

    const slider = document.querySelector('.slider') as HTMLElement;
    slider.append(runnerFrom);
    return runnerFrom;
  }

  createRunnerTo(options: Options): HTMLElement {
    const { orientation } = options;
    const runnerTo = document.createElement('div');
    runnerTo.classList.add(
      'slider__runner', 'js-slider__runner', `slider__runner_${orientation}`, 'slider__runner_to',
    );

    const slider = document.querySelector('.slider') as HTMLElement;
    slider.append(runnerTo);
    return runnerTo;
  }

  // расстановка бегунков по from и to
  moveRunnerAtValue(): void {
    const { to, from, orientation } = this.view.options;
    const convertTo = this.convertingValueToPx(to);
    const convertFrom = this.convertingValueToPx(from);
    const posTo = this.view.convertingPxToPercentages(convertTo);
    const posFrom = this.view.convertingPxToPercentages(convertFrom);
    const posToNumber = this.converPercentToPx(posTo);
    const posFromNumber = this.converPercentToPx(posFrom);
    const startFrom = posFromNumber.toLocaleString();
    const startTo = posToNumber.toLocaleString();

    if (orientation === 'horizontal') {
      this.runnerFrom.style.left = `${posFrom}%`;
      this.runnerFrom.setAttribute('data-text', startFrom);
      this.runnerTo.style.left = `${posTo}%`;
      this.runnerTo.setAttribute('data-text', startTo);
    } else {
      this.runnerFrom.style.bottom = `${posFrom}%`;
      this.runnerFrom.setAttribute('data-text', startFrom);
      this.runnerTo.style.bottom = `${posTo}%`;
      this.runnerTo.setAttribute('data-text', startTo);
    }
  }

  converPercentToPx(value: number): number {
    return value / 10;
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
