// Отдельный слой для обновления модели и отображения
// Это - единственный слой среди трех, который может иметь зависимость
// от других слоев. Он будет:
// - реагировать на сообщения от отображения о действиях пользователей
// и обновлять модель;
// - реагировать на сообщения об обновлении модели и обновлять
// отображение

import { standartOptions } from './standartOptions';
import { View } from './View';
import { Model } from './Model';
import { Options } from './interfaces';
import { EventEmitter } from './EventEmitter';

class Presenter {
  public emitter: EventEmitter;

  public view: View;

  public model: Model;

  public options: Options;

  constructor(options: Options, public element: JQuery<HTMLElement>) {
    this.options = options;
    this.emitter = new EventEmitter();

    this.model = this.createModel(options);
    this.view = this.createView(this.model.options, element, this.emitter);
    this.bindSubscribe();
  }

  public createModel(options: Options): Model {
    return new Model(options);
  }

  public createView(options: Options, element: JQuery<HTMLElement>, emitter: EventEmitter): View {
    return new View(options, element, emitter);
  }

  // бинд this
  private bindSubscribe(): void {
    this.getNewChange = this.getNewChange.bind(this);
    this.sendNewSetting = this.sendNewSetting.bind(this);
    this.subscribePresenterOnChange();
  }

  // метод вызовется из бинд
  // Тут подписываемся презентером на изменения модели и вью
  private subscribePresenterOnChange(): void {
    this.model.emitter.subscribe('newChange', this.getNewChange);
    this.view.emitter.subscribe('newSetting', this.sendNewSetting);
  }

  // getNewChange и sendNewSetting будут вызываться когда придет уведомление от модели или вью
  private getNewChange(newChange: Options): void {
    this.view.upDataPresenter(newChange);
    this.emitter.emit('newChange', newChange);
  }

  private sendNewSetting(newSetting: Partial<Options>): void {
    const modelOptions: Options = this.model.options;
    const newChange: Options = { ...modelOptions, ...newSetting };
    this.model.checkOptions(newChange);
  }

  public setOptions(options: Partial<Options>): void {
    const newOptions: Options = { ...standartOptions, ...options };
    this.model.checkOptions(newOptions);
  }

  public getOptions(): Options {
    return this.model.options;
  }
}

export { Presenter };
