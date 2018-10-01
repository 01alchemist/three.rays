import { Triangle } from '../../primitives/assembly/triangle';

export class BVH {
    constructor(public primitives: Triangle, maxTrianglesPerNode: i32 = 0) {}
}
