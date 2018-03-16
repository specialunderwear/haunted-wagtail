import THREELib from "three-js";
import { SETTINGS } from 'settings';
var THREE = THREELib(["OBJLoader", "FresnelShader"]);


export class Animator {

  constructor(texture) {
    this.container = null;
    this.camera = null;
    this.scene = null;
    this.renderer = null;
    this.bgTexture = null;
    this.refractSphereCamera = null;
    this.windowHalfX = window.innerWidth / 2;
    this.windowHalfY = window.innerHeight / 2;
    this.devilObj = null;
    this.zStep = 1;

    this.texture = texture;
    this.init();
  }

  init() {

    var loader = new THREE.TextureLoader();

    this.container = document.createElement( 'div' );
    this.container.style.cssText = 'position: absolute; top: 0';
    this.container.setAttribute("id", "hauntedoverlay");
    document.body.appendChild( this.container );

    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 300);
    this.camera.position.z = 250;

    // scene

    this.scene = new THREE.Scene();

    this.bgTexture = loader.load(this.texture);
    this.bgTexture.minFilter = THREE.LinearFilter;
    this.scene.background = this.bgTexture;

    var ambientLight = new THREE.AmbientLight(0xcccccc, 0.4);
    this.scene.add(ambientLight);

    var pointLight = new THREE.PointLight(0xffffff, 0.8);
    this.camera.add(pointLight);
    this.scene.add(this.camera);
    this.camera.lookAt(this.scene.position);

    this.refractSphereCamera = new THREE.CubeCamera(0.1, 1000, 1000);

    this.scene.add( this.refractSphereCamera );

    var fShader = THREE.FresnelShader;

    var fresnelUniforms =
      {
        "mRefractionRatio": { type: "f", value: 1.02 },
        "mFresnelBias":   { type: "f", value: 0.1 },
        "mFresnelPower":   { type: "f", value: 1.0 },
        "mFresnelScale":   { type: "f", value: 1.0 },
        "tCube":       { type: "t", value: this.refractSphereCamera.renderTarget }
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

    objLoader.load(SETTINGS.spook, (object) => {

      object.traverse(function (child) {

        if (child instanceof THREE.Mesh) {
          //var material = new THREE.MeshBasicMaterial( { map: this.bgTexture } );

          //var scale = window.innerHeight / document.body.scrollHeight;

          child.scale.set(10, 10, 10);

          //child.material = material;
          child.material = customMaterial;
        }

      });

      this.devilObj = object;
      this.devilObj.position.y = SETTINGS.spookposition.y;
      this.devilObj.position.z = SETTINGS.spookposition.z;
      this.scene.add(this.devilObj);


    }, onProgress, onError);

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth - 20, document.body.scrollHeight);
    this.container.appendChild(this.renderer.domElement);

    // document.addEventListener('mousemove', onDocumentMouseMove, false);
    window.addEventListener('resize', this.onWindowResize, false);

    this.timeout();
  }

  timeout() {

    var timer = setInterval(() => {
      if (this.devilObj != undefined) {
        if (this.devilObj.position.z < SETTINGS.spook_z_range[0]) {
          this.zStep = +1;
        }
        if (this.devilObj.position.z > SETTINGS.spook_z_range[1]) {
          this.zStep = -1;
        }
        this.devilObj.position.z += this.zStep;
      }
    }, 100);

  }

  onWindowResize() {

    this.windowHalfX = window.innerWidth / 2;
    this.windowHalfY = window.innerHeight / 2;

    var aspect = window.innerWidth / window.innerHeight;

    this.camera.aspect = aspect;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(window.innerWidth, document.body.scrollHeight);

  }

  animate() {
    requestAnimationFrame(()=>{this.animate()});
    this.render();
  }


  render() {
    if (this.devilObj != undefined) {
      this.devilObj.visible = false;
      this.refractSphereCamera.updateCubeMap( this.renderer, this.scene );
      this.devilObj.visible = true;
    }

    this.renderer.render(this.scene, this.camera);
  }
}

