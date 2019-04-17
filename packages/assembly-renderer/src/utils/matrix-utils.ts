import { Matrix4 } from "../math/matrix";
import { Box } from "../shapes/Box";
import { Vector3 } from "../math/vector";
import { Ray } from "../objects/ray";

export function mulBox(mat: Matrix4, box: Box): Box {
  // http://dev.theomader.com/transform-bounding-boxes/
  var r: Vector3 = new Vector3(mat.x00, mat.x10, mat.x20)
  var u: Vector3 = new Vector3(mat.x01, mat.x11, mat.x21)
  var b: Vector3 = new Vector3(mat.x02, mat.x12, mat.x22)
  var t: Vector3 = new Vector3(mat.x03, mat.x13, mat.x23)
  var xa: Vector3 = r.mulScalar(box.min.x)
  var xb: Vector3 = r.mulScalar(box.max.x)
  var ya: Vector3 = u.mulScalar(box.min.y)
  var yb: Vector3 = u.mulScalar(box.max.y)
  var za: Vector3 = b.mulScalar(box.min.z)
  var zb: Vector3 = b.mulScalar(box.max.z)
  xa = xa.min(xb)
  xb = xa.max(xb)
  ya = ya.min(yb)
  yb = ya.max(yb)
  za = za.min(zb)
  zb = za.max(zb)
  // var min: Vector3 = xa
  //   .add(ya)
  //   .add(za)
  //   .add(t)
  var min: Vector3 = xa + ya + za + t;
  var max: Vector3 = xb + yb + zb + t;
  return new Box(min, max)
}

export function mulRay(mat:Matrix4, b: Ray): Ray {
  return new Ray(mat.mulPosition(b.origin), mat.mulDirection(b.direction))
}
