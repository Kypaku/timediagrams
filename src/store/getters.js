export default {
    /* settings */
    addBlockMode: state => state.settings.addBlockMode,
    addLayerMode: state => state.settings.addLayerMode,

    /* diagrams */
    diagrams: state => state.diagrams.diagrams,
    current: state => state.diagrams.current,
    currentLayer: state => state.diagrams.currentLayer,
    currentBlock: state => state.diagrams.currentBlock,
}
