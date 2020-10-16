// import * as THREE from '/node_modules/three/build/three.module.js';
import * as THREE from "three";
import { RotatorZoom, RotatorZoomOptions } from "../../../RotatorZoom";
// import { ARButton } from './jsm/webxr/ARButton.js';
import { GLTFLoader } from '../../../jsm/loaders/GLTFLoader.js';
import { PlaneDirection } from "../../../ModelLoader";
// import { RotatorZoom } from './rotator.js';

let container, rotateDiv;
let camera: any, scene: any, renderer: any;
let controller;

let reticle: any, model: any;

let hitTestSource: any = null;
let hitTestSourceRequested = false;

// var control;

// init();
// animate();

const overlayDiv = document.getElementById( "overlay" );
const sessionConfig = {
  requiredFeatures: [ 'hit-test' ],
  optionalFeatures: [ 'dom-overlay' ],
  domOverlay: { root: overlayDiv }
};
document.getElementById('ar-trigger').addEventListener('click', () => {
  (navigator as any).xr.requestSession( 'immersive-ar', sessionConfig ).then((session: any) => {
    init(session);
    animate();
  });
});

loadResource();

function init(session: any) {

  container = document.createElement( 'div' );
  document.body.appendChild( container );

  rotateDiv = document.getElementById( 'rotate' );
  new RotatorZoom(rotateDiv, model.scene, new RotatorZoomOptions(true, true, true, 180, PlaneDirection.horizontal));

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 20 );

  // var light = new THREE.HemisphereLight( 0xffffff, 0xbbbbff, 1 );
  // // light.position.set( 0.5, 1, 0.25 );
  // scene.add( light );

  const directionalLight = new THREE.DirectionalLight( 0xffffff, .6 );
  // directionalLight.castShadow = true;
  // directionalLight.shadowCameraVisible = true;
  // directionalLight.shadowDarkness = 0.9;
  scene.add( directionalLight );

  //

  renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.xr.enabled = true;
  // renderer.shadowMapEnabled = true;
  // renderer.gammaOutput = true; // for color correction, see https://blender.stackexchange.com/questions/34728/materials-from-blender-to-three-js-colors-seem-to-be-different
  container.appendChild( renderer.domElement );

  //
  // document.body.appendChild( ARButton.createButton( renderer, sessionConfig ) );
  overlayDiv.style.display = "";
  session.addEventListener( 'end', () => {
    session = null;
  });
  renderer.xr.setReferenceSpaceType( 'local' );
  renderer.xr.setSession( session );

  document.getElementById('exit').addEventListener('click', () => {
    overlayDiv.style.display = "none";
    session.end();
  });
  document.getElementById('addToCart').addEventListener('click', () => {
    overlayDiv.style.display = "none";
    session.end();
    window.alert("Added product to cart!")
  });

  // CONTROLS
  // cameraControls = new OrbitControls( camera, renderer.domElement );
  // cameraControls.addEventListener( 'change', render );

  // control = new TransformControls( camera, renderer.domElement );
  // control.addEventListener( 'change', render );
  // control.setMode( "rotate" );


  //

  const geometry = new THREE.CylinderBufferGeometry( 0.1, 0.1, 0.2, 32 ).translate( 0, 0.1, 0 );

  function onSelect() {

    // if ( reticle.visible ) {

    //   // var material = new THREE.MeshPhongMaterial( { color: 0xffffff * Math.random() } );
    //   // var mesh = new THREE.Mesh( geometry, material );
    //   // mesh.position.setFromMatrixPosition( reticle.matrix );
    //   // mesh.scale.y = Math.random() * 2 + 1;
    //   // scene.add( mesh );
    //   loadResource().then( () => {

    //     controller.removeEventListener( 'select', onSelect);

    //   }
    //   );
    // }
    if (!model.positioned) {
      model.positioned = true;
      document.getElementById('positionMessage').style.display = "none";
    }
  }

  controller = renderer.xr.getController( 0 );
  controller.addEventListener( 'select', onSelect );
  scene.add( controller );

  reticle = new THREE.Mesh(
    new THREE.RingBufferGeometry( 0.15, 0.2, 32 ).rotateX( - Math.PI / 2 ),
    new THREE.MeshBasicMaterial()
  );
  reticle.matrixAutoUpdate = false;
  reticle.visible = false;
  scene.add( reticle );

  function addResource() {
    if (model) {
      model.visible = false;
      scene.add( model.scene );
    } else {
      setTimeout(addResource, 100);
    }
  }
  addResource();

  //
  window.addEventListener( 'resize', onWindowResize, false );

}

function loadResource( ) {

  // var geometry = new THREE.CylinderBufferGeometry( 0.1, 0.1, 0.2, 32 ).translate( 0, 0.1, 0 );
  // var material = new THREE.MeshPhongMaterial( { color: 0xffffff * Math.random() } );
  // var mesh = new THREE.Mesh( geometry, material );
  // mesh.scale.y = Math.random() * 2 + 1;
  // model = { scene: mesh };
  // model.visible = false;

  return new Promise( ( resolve ) => {

    // Instantiate a loader
    const loader = new GLTFLoader();
    // Load a glTF resource
    loader.load(
      // resource URL
      //'models/gltf/simplyfit/simplyfitblue3.gltf',
      './models/lamp1/lamp5.gltf',
      // 'models/gltf/simplyfit/newtest001.gltf',
      // called when the resource is loaded
      function ( gltf ) {

        // gltf.scene.scale.set( 0.015, 0.015, 0.015 );
        model = gltf;
        model.visible = false;

        // model.castShadow = true;
        // model.scene.position.setFromMatrixPosition( reticle.matrix );
        // scene.add( model.scene );

        // control.attach( model.scene );
        // scene.add( control );

        // gltf.animations; // Array<THREE.AnimationClip>
        // gltf.scene; // THREE.Group
        // gltf.scenes; // Array<THREE.Group>
        // gltf.cameras; // Array<THREE.Camera>
        // gltf.asset; // Object

        resolve();

      },
      // called while loading is progressing
      function ( xhr ) {

        console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

      },
      // called when loading has errors
      function ( error ) {

        console.error( 'An error happened', error );

      }
    );

  });
}

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

}

//

function animate() {

  renderer.setAnimationLoop( render );

}

function render( timestamp: any, frame: any ) {

  if ( frame ) {

    const referenceSpace = renderer.xr.getReferenceSpace();
    const session = renderer.xr.getSession();

    if (hitTestSourceRequested === false) {

      session.requestReferenceSpace( 'viewer' ).then( function ( referenceSpace: any ) {

        session.requestHitTestSource( { space: referenceSpace } ).then( function ( source: any ) {

          hitTestSource = source;

        } );

      } );

      session.addEventListener( 'end', function () {

        hitTestSourceRequested = false;
        hitTestSource = null;
        model.positioned = false;

      } );

      hitTestSourceRequested = true;

    }

    if (hitTestSource && !model.positioned) {

      const hitTestResults = frame.getHitTestResults( hitTestSource );

      if ( hitTestResults.length ) {

        const hit = hitTestResults[ 0 ];
        const pose = hit.getPose( referenceSpace );
        const hitMatrix = pose.transform.matrix;
        
        reticle.matrix.fromArray( hitMatrix );
        reticle.visible = true;

        // model.scene.matrix.fromArray(hitMatrix);
        const mat = new THREE.Matrix4();
        mat.fromArray( hitMatrix );
        model.scene.position.setFromMatrixPosition(mat);
        model.scene.rotation.setFromRotationMatrix(mat);
        
        model.visible = true;

        document.getElementById('positionMessage').style.display = "";
      } else {

        reticle.visible = false;
        model.visible = false;

      }

    }

  }

  renderer.render( scene, camera );

}