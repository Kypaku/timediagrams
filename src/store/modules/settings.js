import ls from 'local-storage'

export default {
    state: {
        language: 'Ru',
        theme: ls('theme'),
    },
    mutations: {

    },
    actions: {
        setLanguage({ commit }, lng) {
            // /settings
            commit('SET_LANGUAGE', lng)
        },
        setTheme({ commit }, theme) {
            // /settings
            commit('SET_THEME', theme)
        },
    },
}
