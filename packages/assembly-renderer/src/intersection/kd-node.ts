import { Shape } from '../shapes/shape'

export class KDNode {
  constructor(
    public shapes: Shape[],
    public axis: Axis = Axis.AxisNone,
    public point: i32 = 0,
    public left: KDNode | null = null,
    public right: KDNode | null = null
  ) {}

  // Partition
  partitionScore(axis: Axis, point: float): float {
    var node: KDNode = this
    var left = 0
    var right = 0
    node.shapes.forEach(function(shape: Shape):void {
      var box = shape.bbox
      var p = box.partition(axis, point)
      if (p.left) {
        left++
      }
      if (p.right) {
        right++
      }
    })
    if (left >= right) {
      return left
    } else {
      return right
    }
  }

  intersect(r: Ray, tmin: f64, tmax: f64): Hit {}
}
