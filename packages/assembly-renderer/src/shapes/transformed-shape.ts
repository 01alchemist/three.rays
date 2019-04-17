import { Box } from './box'
import { Hit } from '../objects/hit'
import { Ray } from '../objects/ray'
import { Vector3 } from '../math/vector'
import { Material } from '../objects/material'
import { Color } from '../math/color'
import {
  Shape,
  ShapeType,
  ShapesfromJson,
  directRestoreShape,
  ShapefromJson,
  restoreShape,
} from './Shape'
import { Matrix4 } from '../math/matrix'
import { HitInfo } from '../objects/hit-info'
import { mulBox } from '../utils/matrix-utils';
/**
 * Created by Nidin Vinayakan on 11-01-2016.
 */
export class TransformedShape implements Shape {

  constructor(
    public shape: Shape,
    public matrix: Matrix4 = new Matrix4(),
    public inverse: Matrix4 = new Matrix4(),
    public normalMatrix?: THREE.Matrix3
  ) {}

  /* static fromJson(transformedShape: TransformedShape): TransformedShape {
    return new TransformedShape(
      ShapefromJson(transformedShape.shape),
      Matrix4.fromJson(<Matrix4>transformedShape.matrix),
      Matrix4.fromJson(<Matrix4>transformedShape.inverse)
    )
  } */

  static newTransformedShape(s: Shape, m: Matrix4): Shape {
    return new TransformedShape(s, m, m.inverse())
  }

  get box(): Box {
    return mulBox(this.matrix, this.shape.box)
  }

  compile() {
    this.shape.compile()
  }

  intersect(r: Ray): Hit {
    var shapeRay: Ray = this.inverse.mulRay(r)
    var hit: Hit = this.shape.intersect(shapeRay)
    if (!hit.ok()) {
      return hit
    }
    var shape = hit.shape
    var shapePosition = shapeRay.position(hit.T)
    var shapeNormal = shape.getNormal(shapePosition)
    var position = this.matrix.mulPosition(shapePosition)
    var normal = this.inverse.transpose().mulDirection(shapeNormal)
    var color = shape.getColor(shapePosition)
    var material = shape.getMaterial(shapePosition)
    var inside = false
    if (shapeNormal.dot(shapeRay.direction) > 0) {
      normal = normal.mulScalar(-1)
      inside = true
    }
    var ray = new Ray(position, normal)
    var info = new HitInfo(
      shape,
      position,
      normal,
      ray,
      color,
      material,
      inside
    )
    hit.T = position.sub(r.origin).length()
    hit.info = info
    return hit
  }

  getColor(p: Vector3): Color {
    return this.shape.getColor(this.inverse.mulPosition(p))
  }

  getMaterial(p: Vector3): Material {
    return this.shape.getMaterial(this.inverse.mulPosition(p))
  }

  getNormal(p: Vector3): Vector3 {
    console.log('getNormal')
    return null
    //return this.matrix.mulDirection(this.shape.getNormal(this.inverse.mulPosition(p)));
  }

  getRandomPoint(): Vector3 {
    return this.shape.getRandomPoint()
    //return this.matrix.mulPosition(this.shape.getRandomPoint());
  }
}
