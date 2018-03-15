import { getScreenshot } from 'screenshot'
import * as THREE from 'three'
import OBJLoader from 'three-obj-loader'


OBJLoader(THREE)


document.addEventListener('DOMContentLoaded', evt => {
  getScreenshot(document.body).then(img => {
    init(img)
    animate()
  })
})

var container;

var camera, scene, renderer, bgTexture, bgWidth, bgHeight;

var mouseX = 0, mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;


function init(base64Image) {

  var loader = new THREE.TextureLoader();

  container = document.createElement( 'div' );
  container.style.cssText = 'position: absolute; top: 0';
  container.setAttribute("id", "hauntedoverlay");
  document.body.appendChild( container );

  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
  camera.position.z = 250;

  // scene

  scene = new THREE.Scene();

  bgTexture = loader.load(base64Image);
  bgTexture.minFilter = THREE.LinearFilter;
  scene.background = bgTexture;
  // bgTexture.wrapS = THREE.MirroredRepeatWrapping;
  // bgTexture.wrapT = THREE.MirroredRepeatWrapping;

  var ambientLight = new THREE.AmbientLight(0xcccccc, 0.4);
  scene.add(ambientLight);

  var pointLight = new THREE.PointLight(0xffffff, 0.8);
  camera.add(pointLight);
  scene.add(camera);

  // texture

  var onProgress = function (xhr) {
    if (xhr.lengthComputable) {
      var percentComplete = xhr.loaded / xhr.total * 100;
      console.log(Math.round(percentComplete, 2) + '% downloaded');
    }
  };

  var onError = function (xhr) {
  };

  var objLoader = new THREE.OBJLoader();

  objLoader.load('/static/haunted/male02.obj', function (object) {

    object.traverse(function (child) {

      if (child instanceof THREE.Mesh) {
        //child.material.map = bgTexture;
        var material = new THREE.MeshBasicMaterial( { map: bgTexture } );
        material.transparent = true;
        material.blending = THREE.MultiplyBlending;
        //texture = new THREE.MeshBasicMaterial( { map: map } );
        child.material = material;
        // object.material.transparent = true;
        //child.material.blending = "NormalBlending";
      }

    });

    object.position.y = - 95;
    scene.add(object);

  }, onProgress, onError);

  //

  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, document.body.scrollHeight);
  container.appendChild(renderer.domElement);

  document.addEventListener('mousemove', onDocumentMouseMove, false);
  window.addEventListener('resize', onWindowResize, false);
}


function onWindowResize() {

  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;

  var aspect = window.innerWidth / window.innerHeight;

  camera.aspect = aspect;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, document.body.scrollHeight);

}


function onDocumentMouseMove(event) {

  mouseX = (event.clientX - windowHalfX) / 2;
  mouseY = (event.clientY - windowHalfY) / 2;

}


function animate() {

  requestAnimationFrame(animate);
  render();

}

function render() {

  camera.position.x += (mouseX - camera.position.x) * 0.05;
  camera.position.y += (- mouseY - camera.position.y) * 0.05;

  camera.lookAt(scene.position);

  renderer.render(scene, camera);
}
