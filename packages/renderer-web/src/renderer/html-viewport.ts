import * as THREE from 'three'
import { Viewport } from '~renderer-common'

export class HtmlViewport extends Viewport {
  domElement: HTMLCanvasElement
  constructor(parameters: any) {
    super(parameters)
    let canvas = document.createElement('canvas')
    let context = canvas.getContext('2d', {
      alpha: parameters.alpha === true,
    })

    let canvasWidth, canvasHeight

    let clearColor = new THREE.Color(0x000000)

    this.domElement = canvas
  }
}
