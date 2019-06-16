import { updaterEmitter } from '@/services/updater-emitter';
import Vue from 'vue';
import { Module, MutationTree, ActionTree, GetterTree } from 'vuex';
import { RootState } from './types';
import { ProgressInfo } from '@/shared/updater/types';
import { UpdateInfo } from 'electron-updater';
// eslint-disable-next-line
import { remote } from 'electron';
const { app } = remote;

export interface UpdatesState {
  hasLookedForUpdates: boolean,
  isLookingForUpdates: boolean,
  foundUpdate?: UpdateInfo,
  status?: string,
  downloadProgress?: ProgressInfo,
  isReadyToInstall: boolean,
}

const TOGGLE_IS_LOOKING_FOR_UPDATES = 'TOGGLE_IS_LOOKING_FOR_UPDATES';

const UPDATE_STATUS = 'UPDATE_STATUS';

const UPDATE_FOUND_UPDATE = 'UPDATE_FOUND_UPDATE';

const TOGGLE_HAS_LOOKED_FOR_UPDATES = 'TOGGLE_HAS_LOOKED_FOR_UPDATES';

const UPDATE_DOWNLOAD_PROGRESS = 'UPDATE_DOWNLOAD_PROGRESS';

const TOGGLE_IS_READY_TO_INSTALL = 'TOGGLE_IS_READY_TO_INSTALL';

const state: UpdatesState = {
  hasLookedForUpdates: false,
  isLookingForUpdates: false,
  foundUpdate: undefined,
  status: undefined,
  downloadProgress: undefined,
  isReadyToInstall: false,
};

const actions: ActionTree<UpdatesState, RootState> = {
  async lookForUpdates({ commit, dispatch }) {
    commit(TOGGLE_IS_LOOKING_FOR_UPDATES, true);
    
    try {
      const updateInfo = await updaterEmitter.lookForUpdates();

      if (!updateInfo || updateInfo.version === app.getVersion()) {
        commit(UPDATE_STATUS, 'Le programme est à jour !');
      } else {
        commit(UPDATE_FOUND_UPDATE, updateInfo);
        dispatch('downloadUpdate');
        commit(UPDATE_STATUS, `Une mise à jour est en cours de téléchargement.`);
      }
    } catch (error) {
        commit(UPDATE_STATUS, 'Impossible de récupérer les mises à jour !');
    }
    commit(TOGGLE_HAS_LOOKED_FOR_UPDATES, true);
    commit(TOGGLE_IS_LOOKING_FOR_UPDATES, false);
  },
  async downloadUpdate({ commit, state }) {
    if (!state.foundUpdate) {
      return;
    }
    updaterEmitter.on('download-progress', (progressInfo: ProgressInfo) => {
      commit(UPDATE_DOWNLOAD_PROGRESS, progressInfo);
    });
    try {
      await updaterEmitter.downloadUpdate();
      commit(UPDATE_STATUS, 'La mise à jour est prête à être installée !');
      commit(TOGGLE_IS_READY_TO_INSTALL, true);
    } catch (error) {
      commit(UPDATE_STATUS, 'Impossible de télécharger la mise à jour !');
    }
  }
}

const mutations: MutationTree<UpdatesState> = {
  [TOGGLE_IS_LOOKING_FOR_UPDATES](state: UpdatesState, value?: boolean) {
    state.isLookingForUpdates = value || !state.isLookingForUpdates;
  },
  [UPDATE_STATUS](state: UpdatesState, value?: string) {
    state.status = value;
  },
  [UPDATE_FOUND_UPDATE](state: UpdatesState, value: UpdateInfo) {
    state.foundUpdate = value;
  },
  [TOGGLE_HAS_LOOKED_FOR_UPDATES](state: UpdatesState, value?: boolean) {
    state.hasLookedForUpdates = value || !state.hasLookedForUpdates;
  },
  [UPDATE_DOWNLOAD_PROGRESS](state: UpdatesState, value?: ProgressInfo) {
    state.downloadProgress = value;
  },
  [TOGGLE_IS_READY_TO_INSTALL](state: UpdatesState, value?: boolean) {
    state.isReadyToInstall = value || !state.isReadyToInstall;
  }
}

const getters: GetterTree<UpdatesState, RootState> = {
  hasLookedForUpdates: state => state.hasLookedForUpdates,
  isLookingForUpdates: state => state.isLookingForUpdates,
  foundUpdate: (state: UpdatesState): UpdateInfo | undefined => state.foundUpdate,
  status: state => state.status,
  downloadProgress: state => state.downloadProgress,
  isReadyToInstall: state => state.isReadyToInstall,
};

export const updates: Module<UpdatesState, RootState> = {
  namespaced: true,
  state,
  actions,
  mutations,
  getters,
};