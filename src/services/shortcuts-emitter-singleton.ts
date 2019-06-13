import { ShortcutsEmitter } from '@/shared/shortcuts/renderer';

export class ShortcutsEmitterSingleton {
  public static get instance(): ShortcutsEmitter {
    return ShortcutsEmitterSingleton.getInstance();
  }
  public static getInstance(): ShortcutsEmitter {
    if (!ShortcutsEmitterSingleton._instance) {
      ShortcutsEmitterSingleton._instance = new ShortcutsEmitter();
    }
    return ShortcutsEmitterSingleton._instance;
  }

  public static destroy(): void {
    if (ShortcutsEmitterSingleton._instance) {
      ShortcutsEmitterSingleton._instance.removeAllListeners();
      ShortcutsEmitterSingleton._instance.destroy();
      delete ShortcutsEmitterSingleton._instance;
    }
  }

  private static _instance: ShortcutsEmitter;

  private constructor() {}
}
