import Vue from 'vue'
import Vuex from 'vuex'
// @ts-ignore
import getters from './getters'
// @ts-ignore
import settings from './modules/settings'
// @ts-ignore
import diagrams from './modules/diagrams'

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        settings,
        diagrams,
    },
    getters,
})
