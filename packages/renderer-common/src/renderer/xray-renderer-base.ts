import * as THREE from 'three'
import { Viewport } from './viewport'

type SceneRef = number
type CameraRef = number

export class XRayRendererBase {
  private _pixelRatio: number
  get pixelRatio() {
    return this._pixelRatio
  }
  private _size: { width: number; height: number }
  get size() {
    return this._size
  }

  protected _scene: THREE.Scene
  protected _sceneRef: SceneRef
  protected _camera: THREE.Camera
  protected _cameraRef: CameraRef
  protected _viewport: Viewport

  protected sceneMap:Map<THREE.Scene, SceneRef>
  protected cameraMap:Map<THREE.Camera, CameraRef>

  constructor(parameters: any) {}

  setPixelRatio(ratio: number): void {
    this._pixelRatio = ratio
  }
  setSize(width: number, height: number): void {
    this._size = { width, height }
  }

  attachScene(scene: THREE.Scene): SceneRef {
    this._scene = scene
    this._sceneRef = xrayCore.allocateScene()
    return this._sceneRef
  }
  detachScene(scene: THREE.Scene): void {
    this._scene = scene
  }

  attachCamera(camera: THREE.Camera): CameraRef {
    this._camera = camera
    return this._cameraRef
  }
  detachCamera(camera: THREE.Camera): void {
    this._camera = camera
  }

  toggleRayTracing(): boolean {
    return true
  }
  startRayTracing(): void {}
  stopRayTracing(): void {}

  render(scene: SceneRef, camere: CameraRef): Promise<void> {
    return Promise.resolve()
  }
}
