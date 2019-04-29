import { RefCount } from '../../common/sys/ref'

export class Scene extends RefCount {}

enum Type {
  TY_UNKNOWN = 0,
  TY_ACCELN = 1,
  TY_ACCEL_INSTANCE = 2,
  TY_BVH4 = 3,
  TY_BVH8 = 4,
}

export class AccelData extends RefCount {
  public bounds:LBBox3fa
  constructor(public type: Type) {
    super()
  }

  /*! notifies the acceleration structure about the deletion of some geometry */
  deleteGeometry(geomID: int) {}

  /*! clears the acceleration structure data */
  clear(): void {}

  /*! returns normal bounds */
  @inline getBounds():BBox3fa {
    return bounds.bounds();
  }
}
