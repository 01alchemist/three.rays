import { XRayRendererBase } from '~renderer-common'
import { HtmlViewport } from './html-viewport'

export class XRayRenderer extends XRayRendererBase {
  get viewport(): HtmlViewport {
    return this._viewport as HtmlViewport
  }

  constructor(parameters: any) {
    super(parameters)
    this._viewport = new HtmlViewport(parameters)
  }

  get domElement(): HTMLCanvasElement {
    return this.viewport.domElement
  }
}
