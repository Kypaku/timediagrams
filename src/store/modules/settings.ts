import { formModes } from '@/types/Misc'
import ls from 'local-storage'

export default {
    state: {
        // language: 'Ru',
        // theme: ls('theme'),
        addBlockMode: 0 as formModes,
        addLayerMode: 0 as formModes,
        oldUser: false,
    },
    mutations: {
		SET_OLD_USER: (state: any, oldUser: boolean) => {
            state.oldUser = oldUser
            ls('oldUser', oldUser)
        },
		SET_ADD_LAYER_MODE: (state: any, addLayerMode: formModes) => {
            state.addLayerMode = addLayerMode
        },
		SET_ADD_BLOCK_MODE: (state: any, addBlockMode: formModes) => {
            state.addBlockMode = addBlockMode
        },
    },
    actions: {
        // setLanguage({ commit }, lng) {
        //     // /settings
        //     commit('SET_LANGUAGE', lng)
        // },
        // setTheme({ commit }, theme) {
        //     // /settings
        //     commit('SET_THEME', theme)
        // },
    },
}
