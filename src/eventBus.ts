// eventBus.ts
import { reactive, provide, inject } from 'vue';
import type { InjectionKey } from 'vue'
interface EventBus {
    listeners: Record<string, Array<(...args: any[]) => void>>;
    $on(event: string, callback: (...args: any[]) => void): void;
    $emit(event: string, ...args: any[]): void;
}
  
const eventBusSymbol: InjectionKey<EventBus> = Symbol();
  
  export function createEventBus(): EventBus {
    const listeners: Record<string, Array<(...args: any[]) => void>> = {};
  
    const $on = (event: string, callback: (...args: any[]) => void): void => {
      if (!listeners[event]) {
        listeners[event] = [];
      }
      listeners[event].push(callback);
    };
  
    const $emit = (event: string, ...args: any[]): void => {
      if (listeners[event]) {
        listeners[event].forEach(callback => callback(...args));
      }
    };
  
    const eventBus: EventBus = {
      listeners,
      $on,
      $emit
    };
  
    provide(eventBusSymbol, eventBus);
    return eventBus;
  }
  
  export function useEventBus(): EventBus {
    const eventBus = inject(eventBusSymbol);
    if (!eventBus) {
      throw new Error('useEventBus() must be called within a component wrapped with createEventBus().');
    }
    return eventBus;
  }
  