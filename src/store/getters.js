export default {
    /* settings */
    theme: state => state.settings.theme,

    /* diagrams */
    diagrams: state => state.diagrams.diagrams,
    current: state => state.diagrams.current,
    currentLayer: state => state.diagrams.currentLayer,
    currentBlock: state => state.diagrams.currentBlock,
}
