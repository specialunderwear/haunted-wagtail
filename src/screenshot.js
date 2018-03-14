import html2canvas from 'html2canvas'
import * as THREE from 'three'

export function getScreenshot(node) {
  return html2canvas(node).then(canvas => {
    canvas.style.position = 'absolute'
    canvas.style.top = '0px'
    return canvas.toDataURL("image/png");
    var ctx = canvas.getContext("2d");
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    var texture = new THREE.Texture(imageData);
    texture.needsUpdate = true;
    return texture
  })
}
