/* eslint-disable max-len */

//   /**
//    * @param {string} eventName
//    * @param {Function} callback
//    */
//   // метод для отписки от события
//   // в качестве аргументов принимает eventName (имя события) и
//   // callback (ссылка на функцию, которую нужно удалить из списка обработчиков этого события).
//   // Для избежания утечек памяти, нужно всегда отписываться от событий, которые больше не нужны.
//   unsubscribe(eventName, callback) {
//     this.events[eventName] = this.events[eventName].filter((eventCallback) => callback !== eventCallback);
//   }

// паттерн, суть которого заключается в том, чтобы дать возможность с любого места
// у вашем приложении сообщить о каком-либо событии. Все кто были “подписаны”
// на это событие — сразу же об этом узнают.

// Пока так написала, это для правильной работы с typescript,
// указание типов
type EventsArray = (data?: any) => void;

interface Events {
  [key: string]: Array<EventsArray>
}

class EventEmitter {
  // в объекте events храним события и подписки на них
  private events: Events = {};

  /**
   * @param {string} eventName
   * @param {Function} callback
   */
  // метод для подписки на событие
  // Он принимает в качестве аргументов eventName (имя события)
  // и callback (ссылка на функцию, которая будет вызвана после того как произойдет это событие).
  // Все eventName и callback будут добавляться в объект events , соблюдая такую структуру:
  // events: {
  // eventName1: [callback1, callback2, ..., callbackN],
  // Каждый раз когда будет вызываться метод subscribe нужно проверить,
  // имеется ли поле с именем события eventName в объекте events.
  // Если такого поля нет — создаем его, и устанавливаем в качестве его значения пустой массив.
  // После в этот массив добавляем callback функцию.
  public subscribe(eventName: string, callback: EventsArray): void {
    const EventsNames = this.events[eventName];
    if (EventsNames) {
      EventsNames.push(callback);
    } else {
      this.events[eventName] = [callback];
    }
  }

  /**
   * @param {string} eventName
   * @param {any} args
   */
  // метод для инициирования события
  // Предназначенный для инициирования события с последующим вызовом его обработчиков.
  // Он принимает в качестве параметров eventName (имя события) и
  // args (данные которые будут переданы в качестве параметров для функций обработчиков).
  // В этом методе нужно проверить если ли в объекте events поле с именем eventName .
  // Если поле такое есть — значит нужно взять все обработчики этого события
  // и вызвать их с параметрами args.
  public emit(eventName: string, args?: object): void {
    const EventNames = this.events[eventName];
    if (EventNames) {
      EventNames.forEach((EventsArray: EventsArray) => {
        EventsArray(args);
      });
    }
  }
}

export { EventEmitter };
