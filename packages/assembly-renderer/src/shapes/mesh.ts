import { Triangle } from './triangle'
import { Matrix4 } from '../math/matrix'
import { Vector3 } from '../math/vector'
import { Hit } from '../objects/hit'
import { Ray } from '../objects/ray'
import { Shape, ShapeType } from './shape'
import { Color } from '../math/color'
import { Material } from '../objects/material'
// import { append } from '../../utils/map-utils'
import { KDTree } from '../intersection/kd-tree'
import { Box } from './Box'
/**
 * Created by Nidin Vinayakan on 10-01-2016.
 */

type Tree = KDTree;

export class Mesh implements Shape {
  material: Material

  constructor(
    public box: Box,
    public triangles: Triangle[] = [],
    public tree?: Tree | null
  ) {}

  /* static fromJson(mesh: Mesh): Mesh {
    return new Mesh(Box.fromJson(mesh.box), <Triangle[]>(
      Triangle.fromJson(mesh.triangles)
    ))
  } */

  static newMesh(triangles: Triangle[]): Mesh {
    var box = Box.boxForTriangles(triangles)
    return new Mesh(box, triangles, null)
  }

  compile() {
    var m: Mesh = this
    if (m.tree == null) {
      /*var shapes:Shape[] = [];
             m.triangles.forEach(function (triangle, i) {
             shapes[i] = triangle;
             });*/
      m.tree = Tree.newTree(m.triangles, m.box)
    }
  }

  static inter = 0

  intersect(r: Ray): Hit {
    return this.tree.intersect(r)
  }

  getColor(p: Vector3): Color {
    return new Color() // not implemented
  }

  getMaterial(p: Vector3): Material {
    return this.material //new Material(); // not implemented
  }

  getNormal(p: Vector3): Vector3 {
    return new Vector3() // not implemented
  }

  getRandomPoint(): Vector3 {
    return new Vector3() // not implemented
  }

  updateBox(): void {
    this.box = Box.boxForTriangles(this.triangles)
  }

  private _smoothNormalsThreshold(
    normal: Vector3,
    normals: Vector3[],
    threshold: number
  ): Vector3 {
    var result: Vector3 = new Vector3()
    normals.forEach(function(x) {
      if (x.dot(normal) >= threshold) {
        result = result.add(x)
      }
    })
    return result.normalize()
  }

  smoothNormalsThreshold(radians: number): void {
    var m: Mesh = this
    var threshold: number = Math.cos(radians)
    //var lookup = make(map[Vector3][]Vector3)
    var lookup: Map<any, Vector3[]> = new Map<any, Vector3[]>()
    m.triangles.forEach(function(t: any) {
      lookup[t.v1] = append(lookup[t.v1], t.n1)
      lookup[t.v2] = append(lookup[t.v2], t.n2)
      lookup[t.v3] = append(lookup[t.v3], t.n3)
    })
    m.triangles.forEach(function(t: any) {
      t.n1 = m._smoothNormalsThreshold(t.n1, lookup[t.v1], threshold)
      t.n2 = m._smoothNormalsThreshold(t.n2, lookup[t.v2], threshold)
      t.n3 = m._smoothNormalsThreshold(t.n3, lookup[t.v3], threshold)
    })
  }

  smoothNormals(): void {
    var m: Mesh = this
    //var lookup = make(map[Vector3]Vector3)
    var lookup: Map<any, Vector3> = new Map<any, Vector3>()
    m.triangles.forEach(function(t: any) {
      lookup[t.v1] = lookup[t.v1] ? lookup[t.v1].add(t.n1) : t.n1
      lookup[t.v2] = lookup[t.v2] ? lookup[t.v2].add(t.n2) : t.v2
      lookup[t.v3] = lookup[t.v3] ? lookup[t.v3].add(t.n3) : t.v3
    })
    lookup.forEach(function(v: Vector3, k) {
      lookup[k] = v.normalize()
    })
    m.triangles.forEach(function(t: any) {
      t.n1 = lookup[t.v1]
      t.n2 = lookup[t.v2]
      t.n3 = lookup[t.v3]
    })
  }

  moveTo(position: Vector3, anchor: Vector3): void {
    var m: Mesh = this
    var matrix: Matrix4 = Matrix4.translate(position.sub(m.box.anchor(anchor)))
    m.transform(matrix)
  }

  fitInside(box: Box, anchor: Vector3) {
    var m: Mesh = this
    var scale = box
      .size()
      .div(m.box.size())
      .minComponent()
    var extra = box.size().sub(m.box.size().mulScalar(scale))
    var matrix = Matrix4.identity()
    matrix = matrix.translate(m.box.min.mulScalar(-1))
    matrix = matrix.scale(new Vector3(scale, scale, scale))
    matrix = matrix.translate(box.min.add(extra.mul(anchor)))
    m.transform(matrix)
  }

  transform(matrix: Matrix4): void {
    var m: Mesh = this
    m.triangles.forEach(function(t: Triangle) {
      t.v1 = matrix.mulPosition(t.v1)
      t.v2 = matrix.mulPosition(t.v2)
      t.v3 = matrix.mulPosition(t.v3)
      t.n1 = matrix.mulDirection(t.n1)
      t.n2 = matrix.mulDirection(t.n2)
      t.n3 = matrix.mulDirection(t.n3)
      t.updateBox()
    })
    m.updateBox()
    m.tree = null // dirty
  }
}
