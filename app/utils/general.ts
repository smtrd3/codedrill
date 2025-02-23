import EventEmitter from 'eventemitter3';

export function delay(ms: number) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(true), ms);
  });
}

export function onTimeout(ms: number, fn: () => void) {
  const timerId = setTimeout(fn, ms);

  return () => {
    clearTimeout(timerId);
  };
}

export function onInterval(ms: number, fn: () => void) {
  const timerId = setInterval(fn, ms);

  return () => {
    clearTimeout(timerId);
  };
}

export function createEventBridge<T extends Record<string, Array<unknown>>>() {
  const eventBridge = new EventEmitter();

  return {
    on<EventType extends keyof T>(
      event: EventType,
      listener: (...args: T[EventType]) => void
    ) {
      const handler = (...args: T[EventType]) => {
        listener(...args);
      };

      eventBridge.addListener(event as string, handler);

      return () => {
        eventBridge.removeListener(event as string, handler);
      };
    },

    emit<EventType extends keyof T>(event: EventType, ...args: T[EventType]) {
      eventBridge.emit(event as string, ...args);
    },
  };
}
