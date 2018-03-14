import html2canvas from 'html2canvas'


function _getScreenshot(node) {
  return html2canvas(node).then(canvas => {
    canvas.style.position = 'absolute'
    canvas.style.top = '0px'
    var imgData = canvas.toDataURL("image/png");
    var img = document.createElement('img')
    img.src = imgData
    return img
  })
}

export default function screenshot() {
  if (document.readyState === 'interactive') {
    console.log('it is ready')
    return _getScreenshot(document.body)
  } else {
    console.log('it is not yet ready')
    return new Promise((resolve, reject) => {
      document.addEventListener("DOMContentLoaded", evt => {
        console.log('DOM IS READY', document.body)
        _getScreenshot(document.body).then(img => resolve(img))
      })
    })
  }
}
