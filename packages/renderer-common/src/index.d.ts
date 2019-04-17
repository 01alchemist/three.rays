type SceneRef = number
type CameraRef = number
type SceneUpdateRef = number

declare namespace xrayCore {
  function newScene(): SceneRef
  function freeScene(scene: SceneRef): void
  function newCamera(): CameraRef
  function freeCamera(camera: CameraRef): void

  function updateScene(data: SceneUpdateRef): void
  function commitScene(): void
}

declare namespace xray {
  interface Profiler {
    startTime: number
    duration: number
    constructor()
    start(): number
    end(): number
    print(): string
  }

  class Job {
    id: string
    iterations: number
    profiler: Profiler
    payload: {
      samples: number
      width: number
      height: number
      xoffset: number
      yoffset: number
    }
  }

  type JobParameters = {
    width: number
    hieght: number
    tileSize: number
    profiler?: Profiler
  }

  class JobManager {
    constructor()
    createJobs(params: JobParameters): Job[]
  }

  class WorkerManager {
    constructor()
    initialize(): void
    start(): void
  }

  /**
   * Three.js renderer
   */

  class Viewport {
    readonly pixels: Uint8Array
    readonly canvas: HTMLCanvasElement
    readonly context2d: CanvasRenderingContext2D
    constructor()
  }

  class XRayRendererBase {
    readonly viewport: Viewport
    readonly domElement: HTMLCanvasElement

    constructor()

    setPixelRatio(ratio: number): void
    setSize(width: number, height: number): void

    attachScene(scene: THREE.Scene): SceneRef
    detachScene(scene: THREE.Scene): void

    attachCamera(camea: THREE.Camera): CameraRef
    detachCamera(camea: THREE.Camera): void

    toggleRayTracing(): boolean
    startRayTracing(): void
    stopRayTracing(): void

    render(scene: SceneRef, camere: CameraRef): Promise<void>
  }
}
