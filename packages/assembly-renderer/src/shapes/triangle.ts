import { Material } from '../objects/material'
import { Box } from './box'
import { Vector3 } from '../math/vector'
import { Ray } from '../objects/ray'
import { Hit } from '../objects/hit'
import { EPS } from '../math/constants'
import { NoHit } from '../objects/hit'
import { Color } from '../math/color'
import { Matrix4 } from '../math/matrix'
import { Shape, ShapeType } from './shape'
/**
 * Created by Nidin Vinayakan on 10-01-2016.
 */

var defaultMaterial = new Material();

export class Triangle implements Shape {
  constructor(
    public material: Material = defaultMaterial,
    public box: Box = new Box(),
    public v1: Vector3 = new Vector3(),
    public v2: Vector3 = new Vector3(),
    public v3: Vector3 = new Vector3(),
    public n1: Vector3 = new Vector3(),
    public n2: Vector3 = new Vector3(),
    public n3: Vector3 = new Vector3(),
    public t1: Vector3 = new Vector3(),
    public t2: Vector3 = new Vector3(),
    public t3: Vector3 = new Vector3()
  ) {
  }

  static fromMemory(ptr: usize): Triangle {
    return load<Triangle>(ptr)
  }

  /* static fromJson(triangles: Triangle | Triangle[]): Triangle | Triangle[] {
    if (triangles instanceof Triangle) {
      var t: Triangle = <Triangle>triangles
      return new Triangle(
        MaterialUtils.fromJson(t.material),
        Box.fromJson(t.box),
        Vector3.fromJson(t.v1),
        Vector3.fromJson(t.v2),
        Vector3.fromJson(t.v3),
        Vector3.fromJson(t.n1),
        Vector3.fromJson(t.n2),
        Vector3.fromJson(t.n3),
        Vector3.fromJson(t.t1),
        Vector3.fromJson(t.t2),
        Vector3.fromJson(t.t3)
      )
    } else {
      var _ts: Triangle[] = []
      var ts: Triangle[] = <Triangle[]>triangles
      ts.forEach(function(t: Triangle) {
        _ts.push(
          new Triangle(
            MaterialUtils.fromJson(t.material),
            Box.fromJson(t.box),
            Vector3.fromJson(t.v1),
            Vector3.fromJson(t.v2),
            Vector3.fromJson(t.v3),
            Vector3.fromJson(t.n1),
            Vector3.fromJson(t.n2),
            Vector3.fromJson(t.n3),
            Vector3.fromJson(t.t1),
            Vector3.fromJson(t.t2),
            Vector3.fromJson(t.t3)
          )
        )
      })
      return _ts
    }
  } */

  static newTriangle(
    v1: Vector3,
    v2: Vector3,
    v3: Vector3,
    t1: Vector3,
    t2: Vector3,
    t3: Vector3,
    material: Material
  ): Triangle {
    var t = new Triangle()
    t.v1 = v1
    t.v2 = v2
    t.v3 = v3
    t.t1 = t1
    t.t2 = t2
    t.t3 = t3
    t.material = material
    t.updateBox()
    t.fixNormals()
    return t
  }

  compile() {}

  get vertices(): Vector3[] {
    return [this.v1, this.v2, this.v3]
  }

  /* intersectSIMD(r: Ray): Hit {
    //Möller–Trumbore intersection algorithm

    var _v1 = SIMD.Float32x4.load(this.data, 0)
    var _v2 = SIMD.Float32x4.load(this.data, 4)
    var _v3 = SIMD.Float32x4.load(this.data, 8)

    //Edge1
    var _e1 = SIMD.Float32x4.sub(_v2, _v1)

    //Edge2
    var _e2 = SIMD.Float32x4.sub(_v3, _v1)

    //Begin calculating determinant - also used to calculate u parameter
    //var p:Vector3 = r.direction.cross(e2);
    var _p = r.direction.SIMD_cross(_e2)
    //var px:number = r.direction.y * e2z - r.direction.z * e2y;
    //var py:number = r.direction.z * e2x - r.direction.x * e2z;
    //var pz:number = r.direction.x * e2y - r.direction.y * e2x;
    //if determinant is near zero, ray lies in plane of triangle
    //var det:number = e1x * px + e1y * py + e1z * pz;
    // var det:number = e1.dot(p);
    var det: number = Vector3.SIMD.dot(_e1, _p)
    //NOT CULLING
    if (det > -EPS && det < EPS) {
      return NoHit
    }
    var inv: number = 1 / det

    //calculate distance from V1 to ray origin
    // var t:Vector3 = r.origin.sub(this.v1);
    var _t = r.origin.SIMD_sub(_v1)
    //var tx:number = r.origin.x - this.v1.x;
    //var ty:number = r.origin.y - this.v1.y;
    //var tz:number = r.origin.z - this.v1.z;

    //Calculate u parameter and test bound
    //var u:number = (tx * px + ty * py + tz * pz) * inv;
    //var u:number = t.dot(p) * inv;
    var u: number = Vector3.SIMD.dot(_t, _p) * inv
    //The intersection lies outside of the triangle
    if (u < 0 || u > 1) {
      return NoHit
    }

    //Prepare to test v parameter
    //var qx:number = ty * e1z - tz * e1y;
    //var qy:number = tz * e1x - tx * e1z;
    //var qz:number = tx * e1y - ty * e1x;
    //var q:Vector3 = t.cross(e1);
    var _q = Vector3.SIMD.cross(_t, _e1)

    //Calculate V parameter and test bound
    //var v:number = (r.direction.x * qx + r.direction.y * qy + r.direction.z * qz) * inv;
    //var v:number = r.direction.dot(q) * inv;
    var v: number = r.direction.SIMD_dot(_q) * inv
    //The intersection lies outside of the triangle
    if (v < 0 || u + v > 1) {
      return NoHit
    }

    //var d:number = (e2x * qx + e2y * qy + e2z * qz) * inv;
    // var d:number = e2.dot(q) * inv;
    var d: number = Vector3.SIMD.dot(_e2, _q) * inv
    if (d < EPS) {
      return NoHit
    }

    //ray intersection
    return new Hit(this, d)
  } */

  intersect(r: Ray): Hit {
    //return this.intersectSIMD(r);
    //Möller–Trumbore intersection algorithm

    //Edge1
    var e1: Vector3 = this.v2.sub(this.v1)

    //Edge2
    var e2: Vector3 = this.v3.sub(this.v1)

    //Begin calculating determinant - also used to calculate u parameter
    var p: Vector3 = r.direction.cross(e2)
    var det: number = e1.dot(p)
    //NOT CULLING
    if (det > -EPS && det < EPS) {
      return NoHit
    }
    var inv: number = 1 / det

    //calculate distance from V1 to ray origin
    var t: Vector3 = r.origin.sub(this.v1)

    //Calculate u parameter and test bound
    var u: number = t.dot(p) * inv
    //The intersection lies outside of the triangle
    if (u < 0 || u > 1) {
      return NoHit
    }

    //Prepare to test v parameter
    var q: Vector3 = t.cross(e1)

    //Calculate V parameter and test bound
    var v: number = r.direction.dot(q) * inv
    //The intersection lies outside of the triangle
    if (v < 0 || u + v > 1) {
      return NoHit
    }

    var d: number = e2.dot(q) * inv
    if (d < EPS) {
      return NoHit
    }

    //ray intersection
    return new Hit(this, d)
  }

  getColor(p: Vector3): Color {
    var t = this
    if (t.material.texture == null) {
      return t.material.color
    }
    var _uvw = t.baryCentric(p)
    var u = _uvw.u
    var v = _uvw.v
    var w = _uvw.w
    var n = new Vector3()
    n = n.add(t.t1.mulScalar(u))
    n = n.add(t.t2.mulScalar(v))
    n = n.add(t.t3.mulScalar(w))
    return t.material.texture.sample(n.x, n.y)
  }

  getMaterial(p: Vector3): Material {
    return this.material
  }

  getNormal(p: Vector3): Vector3 {
    var t = this
    var _uvw = t.baryCentric(p)
    var u = _uvw.u
    var v = _uvw.v
    var w = _uvw.w
    var n: Vector3 = new Vector3()
    n = n.add(t.n1.mulScalar(u))
    n = n.add(t.n2.mulScalar(v))
    n = n.add(t.n3.mulScalar(w))
    n = n.normalize()
    if (t.material.normalTexture != null) {
      var b: Vector3 = new Vector3()
      b = b.add(t.t1.mulScalar(u))
      b = b.add(t.t2.mulScalar(v))
      b = b.add(t.t3.mulScalar(w))
      var ns: Vector3 = t.material.normalTexture.normalSample(b.x, b.y)
      var dv1: Vector3 = t.v2.sub(t.v1)
      var dv2: Vector3 = t.v3.sub(t.v1)
      var dt1: Vector3 = t.t2.sub(t.t1)
      var dt2: Vector3 = t.t3.sub(t.t1)
      var T: Vector3 = dv1
        .mulScalar(dt2.y)
        .sub(dv2.mulScalar(dt1.y))
        .normalize()
      var B: Vector3 = dv2
        .mulScalar(dt1.x)
        .sub(dv1.mulScalar(dt2.x))
        .normalize()
      var N: Vector3 = T.cross(B)
      var matrix = new Matrix4(
        T.x,
        B.x,
        N.x,
        0,
        T.y,
        B.y,
        N.y,
        0,
        T.z,
        B.z,
        N.z,
        0,
        0,
        0,
        0,
        1
      )
      n = matrix.mulDirection(ns)
    }
    if (t.material.bumpTexture != null) {
      var b = new Vector3()
      b = b.add(t.t1.mulScalar(u))
      b = b.add(t.t2.mulScalar(v))
      b = b.add(t.t3.mulScalar(w))
      var bump = t.material.bumpTexture.bumpSample(b.x, b.y)
      var dv1 = t.v2.sub(t.v1)
      var dv2 = t.v3.sub(t.v1)
      var dt1 = t.t2.sub(t.t1)
      var dt2 = t.t3.sub(t.t1)
      var tangent = dv1
        .mulScalar(dt2.y)
        .sub(dv2.mulScalar(dt1.y))
        .normalize()
      var biTangent = dv2
        .mulScalar(dt1.x)
        .sub(dv1.mulScalar(dt2.x))
        .normalize()
      n = n.add(tangent.mulScalar(bump.x * t.material.bumpMultiplier))
      n = n.add(biTangent.mulScalar(bump.y * t.material.bumpMultiplier))
    }
    n = n.normalize()
    return n
  }

  getRandomPoint(): Vector3 {
    return new Vector3() // TODO: fix
  }

  area(): number {
    var t = this
    var e1: Vector3 = t.v2.sub(t.v1)
    var e2: Vector3 = t.v3.sub(t.v1)
    var n: Vector3 = e1.cross(e2)
    return n.length() / 2
  }

  baryCentric(p: Vector3): { u: number; v: number; w: number } {
    var t = this
    var v0 = t.v2.sub(t.v1)
    var v1 = t.v3.sub(t.v1)
    var v2 = p.sub(t.v1)
    var d00 = v0.dot(v0)
    var d01 = v0.dot(v1)
    var d11 = v1.dot(v1)
    var d20 = v2.dot(v0)
    var d21 = v2.dot(v1)
    var d = d00 * d11 - d01 * d01
    var v = (d11 * d20 - d01 * d21) / d
    var w = (d00 * d21 - d01 * d20) / d
    var u = 1 - v - w
    return { u: u, v: v, w: w }
  }

  updateBox() {
    var t = this
    var min = t.v1.min(t.v2).min(t.v3)
    var max = t.v1.max(t.v2).max(t.v3)
    t.box = new Box(min, max)
  }

  fixNormals() {
    var t = this
    var e1 = t.v2.sub(t.v1)
    var e2 = t.v3.sub(t.v1)
    var n = e1.cross(e2).normalize()
    var zero = new Vector3()
    if (t.n1 == undefined || t.n1.equals(zero)) {
      t.n1 = n
    }
    if (t.n2 == undefined || t.n2.equals(zero)) {
      t.n2 = n
    }
    if (t.n3 == undefined || t.n3.equals(zero)) {
      t.n3 = n
    }
  }
}
