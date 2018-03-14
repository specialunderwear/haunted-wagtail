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

    container = document.createElement( 'div' );
    document.body.appendChild( container );

    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
    camera.position.z = 250;

    // scene

    scene = new THREE.Scene();

    bgTexture = THREE.ImageUtils.loadTexture(base64Image);
    scene.background = bgTexture;
    bgTexture.wrapS = THREE.MirroredRepeatWrapping;
    bgTexture.wrapT = THREE.MirroredRepeatWrapping;

    var ambientLight = new THREE.AmbientLight( 0xcccccc, 0.4 );
    scene.add( ambientLight );

    var pointLight = new THREE.PointLight( 0xffffff, 0.8 );
    camera.add( pointLight );
    scene.add( camera );

    // texture

    var manager = new THREE.LoadingManager();
    manager.onProgress = function ( item, loaded, total ) {

	console.log( item, loaded, total );

    };

    var textureLoader = new THREE.TextureLoader( manager );
    var texture = textureLoader.load( '/static/haunted/wagtail_screenshot.png' );

    // model

    var onProgress = function ( xhr ) {
	if ( xhr.lengthComputable ) {
	    var percentComplete = xhr.loaded / xhr.total * 100;
	    console.log( Math.round(percentComplete, 2) + '% downloaded' );
	}
    };

    var onError = function ( xhr ) {
    };

    var objLoader = new THREE.OBJLoader( manager );

    objLoader.load( '/static/haunted/male02.obj', function ( object ) {

	object.traverse( function ( child ) {

	    if ( child instanceof THREE.Mesh ) {

		child.material.map = texture;

	    }

	} );

	object.position.y = - 95;
	scene.add( object );

    }, onProgress, onError );

    //

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );

    document.addEventListener( 'mousemove', onDocumentMouseMove, false );
    window.addEventListener( 'resize', onWindowResize, false );

}

function onWindowResize() {

    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    var aspect = window.innerWidth / window.innerHeight;

    camera.aspect = aspect;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

function onDocumentMouseMove( event ) {

    mouseX = ( event.clientX - windowHalfX ) / 2;
    mouseY = ( event.clientY - windowHalfY ) / 2;

}


function animate() {

    requestAnimationFrame( animate );
    render();

}

function render() {

    camera.position.x += ( mouseX - camera.position.x ) * .05;
    camera.position.y += ( - mouseY - camera.position.y ) * .05;

    camera.lookAt( scene.position );

    renderer.render( scene, camera );

}
