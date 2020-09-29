import Block from './Block';

export interface Layer {
    id: string
    name: string,
    description: string,
    blocks: Block[]
    // subject:
}

export default Layer