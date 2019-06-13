import { DofusWindowEmitter } from './dofus-window-emitter';

// TODO exporter juste new DofusWindowEmitter, virer cette merde
export class DofusWindowEmitterSingleton {
  public static get instance(): DofusWindowEmitter {
    return DofusWindowEmitterSingleton.getInstance();
  }
  public static getInstance(): DofusWindowEmitter {
    if (!DofusWindowEmitterSingleton._instance) {
      DofusWindowEmitterSingleton._instance = new DofusWindowEmitter();
    }
    return DofusWindowEmitterSingleton._instance;
  }

  public static destroy(): void {
    if (DofusWindowEmitterSingleton._instance) {
      DofusWindowEmitterSingleton._instance.removeAllListeners();
      DofusWindowEmitterSingleton._instance.destroy();
      delete DofusWindowEmitterSingleton._instance;
    }
  }

  private static _instance: DofusWindowEmitter;

  private constructor() { }
}
