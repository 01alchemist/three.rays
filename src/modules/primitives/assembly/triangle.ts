import { Vector3 } from './vector';

export class Triangle {
    constructor(
        public v1: Vector3 = new Vector3(),
        public v2: Vector3 = new Vector3(),
        public v3: Vector3 = new Vector3(),
        public n1: Vector3 = new Vector3(),
        public n2: Vector3 = new Vector3(),
        public n3: Vector3 = new Vector3(),
        public t1: Vector3 = new Vector3(),
        public t2: Vector3 = new Vector3(),
        public t3: Vector3 = new Vector3(),
    ) {}

    static fromMemory(ptr: usize): Triangle {
        return load<Triangle>(ptr);
    }
}
