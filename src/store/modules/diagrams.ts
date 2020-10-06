import ls from 'local-storage'
import { uuid } from '@/helpers/index.js';
import Diagram from '@/types/Diagram'
import Layer from '@/types/Layer';
import Block from '@/types/Block';
import { cloneDeep } from 'lodash';

export default {
    state: {
        diagrams: [] as Diagram[],
        current: {} as Diagram,
        currentLayer: {} as Layer,
        currentBlock: {} as Block,
    },
    mutations: {
        SET_DIAGRAMS: (state: any, diagrams: Diagram[]) => {
            // Convert date string  to date
            const newDiagrams = cloneDeep(diagrams)
            newDiagrams.forEach((diagram: Diagram) => {
                if (!diagram.layers) return
                diagram.layers.forEach((layer: Layer) => {
                    layer.blocks.forEach((block: Block) => {
                        block.start = new Date(block.start)
                        block.end = new Date(block.end)
                    })
                })
            })
            state.diagrams = newDiagrams || []
            ls('diagrams', diagrams)
        },
        SET_CURRENT: (state: any, current: Diagram) => {
            state.current = current
            ls('current', current)
            if (current.layers && current.layers[0]) {
                state.currentLayer = current.layers[0]
            }
        },
        SET_CURRENT_LAYER: (state: any, current: Layer) => {
            state.currentLayer = current
        },
        SET_CURRENT_BLOCK: (state: any, current: Block) => {
            state.currentBlock = current || {}
        },
        ADD_DIAGRAM: (state: any, diagram: Diagram) => {
            // const defaultData = { name: 'NEW DIAGRAM', description: '', layers: [], id: uuid() } as any
            // for (const key in diagram) {
            //     defaultData[key] = (diagram as any)[key]
            // }
            if (!diagram.layers) return
            const newDiagram = cloneDeep(diagram)
            newDiagram.id = uuid()
            newDiagram.layers.forEach((layer: Layer) => {
                layer.blocks.forEach((block: Block) => {
                    block.start = new Date(block.start)
                    block.end = new Date(block.end)
                })
            })
            state.diagrams.push(newDiagram || defaultData)
            ls('diagrams', state.diagrams)
        },
        DEL_DIAGRAM: (state: any, diagramID: string) => {
            state.diagrams = state.diagrams.filter((el: Diagram) => el.id !== diagramID)
            ls('diagrams', state.diagrams)
        },
        UPD_DIAGRAM: (state: any, data: any) => {
            const diagram = state.diagrams.find((el: Diagram) => el.id === data.id)
            for (const key in data) {
                if (Object.prototype.hasOwnProperty.call(data, key)) {
                    diagram[key] = (data as any)[key]
                }
            }
            ls('diagrams', state.diagrams)
        },
        ADD_LAYER: (state: any, { diagramId, data }: { diagramId: string; data: object}) => {
            const diagram = state.diagrams.find((el: Diagram) => el.id === (diagramId || state.current.id))
            diagram.layers.push({ id: uuid(), blocks: [], ...data })
            ls('diagrams', state.diagrams)
        },
        DEL_LAYER: (state: any, { diagramId, layerId }: { diagramId: string; layerId: string}) => {
            const diagram = state.diagrams.find((el: Diagram) => el.id === (diagramId || state.current.id))
            diagram.layers = diagram.layers.filter((el: Layer) => el.id !== layerId)
            ls('diagrams', state.diagrams)
        },
        UPD_LAYER: (state: any, { diagramId, data }: { diagramId: string; data: any}) => {
            const diagram = state.diagrams.find((el: Diagram) => el.id === (diagramId || state.current.id))
            const layer = diagram.layers.find((el: Layer) => el.id === data.id)
            for (const key in data) {
                if (Object.prototype.hasOwnProperty.call(data, key)) {
                    layer[key] = (data as any)[key]
                }
            }
            ls('diagrams', state.diagrams)
        },
        ADD_BLOCK: (state: any, { diagramId, layerId, data }: { diagramId: string; layerId: string; data: object}) => {
            const diagram = state.diagrams.find((el: Diagram) => el.id === (diagramId || state.current.id))
            const layer = diagram.layers.find((el: Layer) => el.id === (layerId || state.currentLayer.id)) || diagram.layers[0]
            if (layer) {
                layer.blocks.push({ id: uuid(), ...data })
                ls('diagrams', state.diagrams)
            }
        },
        DEL_BLOCK: (state: any, { diagramId, layerId, blockId }: { diagramId: string; layerId: string; blockId: string}) => {
            const diagram = state.diagrams.find((el: Diagram) => el.id === (diagramId || state.current.id))
            const layer = diagram.layers.find((el: Layer) => el.id === (layerId || state.currentLayer.id)) || diagram.layers[0]
            if (layer) {
                layer.blocks = layer.blocks.filter((el: Block) => el.id !== blockId)
                ls('diagrams', state.diagrams)
            }
        },
        UPD_BLOCK: (state: any, { diagramId, layerId, data }: { diagramId: string; layerId: string; data: any}) => {
            const diagram = state.diagrams.find((el: Diagram) => el.id === (diagramId || state.current.id))
            const layer = diagram.layers.find((el: Layer) => el.id === (layerId || state.currentLayer.id)) || diagram.layers[0]
            if (layer) {
                const block = layer.blocks.find((el: Block) => el.id === data.id)
                for (const key in data) {
                    if (Object.prototype.hasOwnProperty.call(data, key)) {
                        block[key] = (data as any)[key]
                    }
                }
                ls('diagrams', state.diagrams)
            }
        },
    },
    actions: {

    },
}
