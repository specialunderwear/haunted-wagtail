import { getScreenshot } from 'screenshot';
import { muhaha } from 'sound';
import THREELib from "three-js";
var THREE = THREELib(["OBJLoader", "FresnelShader"]);

document.addEventListener('DOMContentLoaded', evt => {
  getScreenshot(document.body).then(img => {
    init(img);
    animate();
    muhaha(document);
  });
});

var container;

var camera, scene, renderer, bgTexture, bgWidth, bgHeight;
var refractSphereCamera;

var mouseX = 0, mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var devilObj;

var zMax = [-100, -50];
var zStep = 1;


function init(base64Image) {

  var loader = new THREE.TextureLoader();

  container = document.createElement( 'div' );
  container.style.cssText = 'position: absolute; top: 0';
  container.setAttribute("id", "hauntedoverlay");
  document.body.appendChild( container );

  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 300);
  camera.position.z = 250;

  // scene

  scene = new THREE.Scene();

  bgTexture = loader.load(base64Image);
  bgTexture.minFilter = THREE.LinearFilter;
  scene.background = bgTexture;

  var ambientLight = new THREE.AmbientLight(0xcccccc, 0.4);
  scene.add(ambientLight);

  var pointLight = new THREE.PointLight(0xffffff, 0.8);
  camera.add(pointLight);
  scene.add(camera);
  camera.lookAt(scene.position);

  refractSphereCamera = new THREE.CubeCamera(0.1, 1000, 1000);

	scene.add( refractSphereCamera );

  var fShader = THREE.FresnelShader;

  var fresnelUniforms =
  {
    "mRefractionRatio": { type: "f", value: 1.02 },
    "mFresnelBias":   { type: "f", value: 0.1 },
    "mFresnelPower":   { type: "f", value: 1.0 },
    "mFresnelScale":   { type: "f", value: 1.0 },
    "tCube":       { type: "t", value: refractSphereCamera.renderTarget }
  };

  // create custom material for the shader
  var customMaterial = new THREE.ShaderMaterial(
  {
    uniforms:     fresnelUniforms,
    vertexShader:   fShader.vertexShader,
    fragmentShader: fShader.fragmentShader
  });

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
        //var material = new THREE.MeshBasicMaterial( { map: bgTexture } );

        var scale = window.innerHeight / document.body.scrollHeight;

        child.scale.set(1, scale, 1);

        //child.material = material;
        child.material = customMaterial;
      }

    });

    devilObj = object;
    object.position.y = 60;
    object.position.z = -100;
    scene.add(object);


  }, onProgress, onError);

  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth - 20, document.body.scrollHeight);
  container.appendChild(renderer.domElement);

  // document.addEventListener('mousemove', onDocumentMouseMove, false);
  window.addEventListener('resize', onWindowResize, false);

  timeout();
}

function timeout() {

  var timer = setInterval(function() {
    if (devilObj != undefined) {
      if (devilObj.position.z < zMax[0]) {
        zStep = +1;
      }
      if (devilObj.position.z > zMax[1]) {
        zStep = -1;
      }
      devilObj.position.z += zStep;
    }
  }, 100);

}

function onWindowResize() {

  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;

  var aspect = window.innerWidth / window.innerHeight;

  camera.aspect = aspect;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, document.body.scrollHeight);

}

function animate() {
  requestAnimationFrame(animate);
  render();
}


function render() {
  if (devilObj != undefined) {
    devilObj.visible = false;
    refractSphereCamera.updateCubeMap( renderer, scene );
    devilObj.visible = true;
  }

  renderer.render(scene, camera);
}

