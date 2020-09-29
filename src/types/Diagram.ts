import Layer from './Layer';

export interface Diagram {
    id: string
    name: string,
    description: string,
    layers: Layer[],
    // subject:
}

export default Diagram