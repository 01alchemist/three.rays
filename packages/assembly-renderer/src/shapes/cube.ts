import { Vector3 } from '../math/vector'
import { Material } from '../objects/material'
import { Box } from './box'
import { Shape, ShapeType } from './shape'
import { Ray } from '../objects/ray'
import { Color } from '../math/color'
import { EPS } from '../math/constants'
import { Hit, NoHit } from '../objects/hit'
/**
 * Created by Nidin Vinayakan on 10-01-2016.
 */
export class Cube implements Shape {
    type: ShapeType = ShapeType.CUBE
    index: number

    constructor(
        public min: Vector3 = new Vector3(),
        public max: Vector3 = new Vector3(),
        public material: Material = null,
        public box: Box = null,
    ) {}

    directWrite(memory: Float32Array, offset: number): number {
        memory[offset++] = this.type
        offset = this.min.directWrite(memory, offset)
        offset = this.max.directWrite(memory, offset)
        memory[offset++] = this.material.index
        return offset
    }

    directRead(memory: Float32Array, offset: number): number {
        offset = this.min.directRead(memory, offset)
        offset = this.max.directRead(memory, offset)

        this.box = new Box(this.min, this.max)

        this.material.index = memory[offset++]
        var material: Material = Material.map[this.material.index]
        if (material) {
            this.material = material
        }
        return offset
    }

    // static fromJson(shape: Cube): Cube {
    //     return new Cube(
    //         Vector3.fromJson(shape.min),
    //         Vector3.fromJson(shape.max),
    //         MaterialUtils.fromJson(shape.material),
    //         Box.fromJson(shape.box),
    //     )
    // }

    static newCube(min: Vector3, max: Vector3, material: Material): Shape {
        var box = new Box(min, max)
        return new Cube(min, max, material, box)
    }

    compile() {}

    intersect(r: Ray): Hit {
        var n: Vector3 = this.min.sub(r.origin).div(r.direction)
        var f: Vector3 = this.max.sub(r.origin).div(r.direction)
        let _n = n
        n = _n.min(f)
        f = _n.max(f)
        var t0: number = Math.max(Math.max(n.x, n.y), n.z)
        var t1: number = Math.min(Math.min(f.x, f.y), f.z)

        if (t0 > 0 && t0 < t1) {
            return new Hit(this, t0)
        }
        return NoHit
    }

    getColor(p: Vector3): Color {
        return this.material.color
    }

    getMaterial(p: Vector3): Material {
        return this.material
    }

    getNormal(p: Vector3): Vector3 {
        if (p.x < this.min.x + EPS) {
            return new Vector3(-1, 0, 0)
        } else if (p.x > this.max.x - EPS) {
            return new Vector3(1, 0, 0)
        } else if (p.y < this.min.y + EPS) {
            return new Vector3(0, -1, 0)
        } else if (p.y > this.max.y - EPS) {
            return new Vector3(0, 1, 0)
        } else if (p.z < this.min.z + EPS) {
            return new Vector3(0, 0, -1)
        } else if (p.z > this.max.z - EPS) {
            return new Vector3(0, 0, 1)
        }
        return new Vector3(0, 1, 0)
    }

    getRandomPoint(): Vector3 {
        var x = this.min.x + Math.random() * (this.max.x - this.min.x)
        var y = this.min.y + Math.random() * (this.max.y - this.min.y)
        var z = this.min.z + Math.random() * (this.max.z - this.min.z)
        return new Vector3(x, y, z)
    }
}