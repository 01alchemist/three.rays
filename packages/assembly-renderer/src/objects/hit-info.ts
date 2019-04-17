import { Ray } from './ray';
import { Color } from '../math/color';
import { Vector3 } from '../math/vector';
import { Shape } from '../shapes/shape';
import { Material } from './material';
/**
 * Created by Nidin Vinayakan on 10-01-2016.
 */

export class HitInfo {
    /**
     *
     * @param shape
     * @param position
     * @param normal
     * @param ray
     * @param color
     * @param material
     * @param inside
     */
    constructor(
        public shape: Shape,
        public position: Vector3,
        public normal: Vector3,
        public ray: Ray,
        public color: Color,
        public material: Material,
        public inside: boolean
    ) {}
}
