import Vue from 'vue'
import { IElectronLog } from 'electron-log';

// 2. Spécifiez un fichier avec les types que vous voulez augmenter
//    Vue a le type de constructeur dans types/vue.d.ts
declare module 'vue/types/vue' {
  // 3. Déclarez l'augmentation pour Vue
  interface Vue {
    $log: IElectronLog;
  }

  interface VueConstructor {
    $log: IElectronLog
  }
}