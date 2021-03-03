// содержит бизнес-логику приложения и не производит
// никаких расчетов, которые нужны для отображения
// Модель не знает ни о ком, кроме Options и EventEmitter

import { Options } from './interfaces';
import { EventEmitter } from './EventEmitter';

class Model {
  public options: Options;

  public custom: Options;

  public emitter: EventEmitter;

  constructor(options: Options) {
    this.options = options;
    this.emitter = new EventEmitter();
    this.custom = this.getOptions(options);
  }

  // getOptions и checkOptions нужны для обмена параметрами между
  // сюда передаем настройки с презентера и вызываем след метод
  private getOptions(options: Options): Options {
    this.checkOptions(options);
    return this.custom;
  }

  // метод отправляет параметры на корректировку в следущий метод,
  // потом уже исправленые параметры отправляет в EventEmitter
  // В EventEmitter есть 2 метода, один для уведомления emit, другой для подписки subscribe
  public checkOptions(options: Options): void {
    const correctOptions: Options = this.correctOptions(options);
    this.custom = { ...options, ...correctOptions };
    this.emitter.emit('newChange', this.custom);
  }

  private correctOptions(options: Options): Options {
    return options;
  }
}

export { Model };
