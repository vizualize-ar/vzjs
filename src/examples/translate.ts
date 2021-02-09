import * as THREE from "three";
// import { RotatorZoom, RotatorZoomOptions } from "../RotatorZoom";
import * as Hammer from "hammerjs";
import { Vector3 } from "three";

let renderer: THREE.Renderer;

const container = document.createElement( 'div' );
container.style.width = window.innerWidth + "px";
// container.style.height = window.innerWidth + "px";
container.style.height = window.innerHeight + "px";
container.style.border = "solid 1px red";
document.body.appendChild( container );

const scene = new THREE.Scene();
const camera = createCamera();

addLight();
const obj = addCube();
// const obj = addCylinder();
addRenderer();
animate();
// new RotatorZoom(container, obj, new RotatorZoomOptions(false, false, true));
const hammer: HammerManager = new Hammer(container);

// 2/08/2021 - commented out due to breaking changes in three.js upgrade.
// hammer.on('pan', function(ev) {
//   console.log('panning', ev);
//   const pos = screenToWorld(ev.deltaX, ev.deltaY, camera);
//   obj.translateX(ev.deltaX);
//   obj.translateY(ev.deltaY);
// });

function screenToWorld(screenX: number, screenY: number, camera: THREE.Camera)
{
    const pos = new Vector3();
    const dir = new Vector3();

    pos.set(
        -1.0 + 2.0 * screenX / window.innerWidth,
        -1.0 + 2.0 * screenY / window.innerHeight,
        0.5
    ).unproject( camera );

    // Calculate a unit vector from the camera to the projected position
    dir.copy( pos ).sub( camera.position ).normalize();

    // Project onto z=0
    const flDistance = -camera.position.z / dir.z;
    const newPosition = new THREE.Vector3();
    newPosition.copy( camera.position ).add( dir.multiplyScalar( flDistance ) );
    return newPosition;
}

window.addEventListener('resize', () =>
{
  container.style.width = window.innerWidth + "px";
  container.style.height = window.innerWidth + "px";

  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(container.clientWidth, container.clientHeight);
}, false);

function animate()
{
  requestAnimationFrame(animate);
  render();
}

function render()
{
  // if (!mouseDown)
  // {
  //   var drag = 0.95;
  //   var minDelta = 0.05;

  //   if (deltaX < -minDelta || deltaX > minDelta)
  //   {
  //     deltaX *= drag;
  //   }
  //   else
  //   {
  //     deltaX = 0;
  //   }

  //   if (deltaY < -minDelta || deltaY > minDelta)
  //   {
  //     deltaY *= drag;
  //   }
  //   else
  //   {
  //     deltaY = 0;
  //   }

  //   handleRotation();
  // }

  renderer.render(scene, camera);
}

function createCamera() {
  // const camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 20 );

  const aspectRatio = container.clientWidth / container.clientHeight;
  const camera = new THREE.PerspectiveCamera(50, aspectRatio, 0.1, 1000);
  camera.position.y = 150;
  camera.position.z = 500;

  return camera;
}

function addLight() {
  const directionalLight = new THREE.DirectionalLight( 0xffffff, .6 );
  scene.add( directionalLight );
}

function addCube() {
  // 2/08/2021 - commented out due to breaking changes in three.js upgrade.
  // var boxGeometry = new THREE.BoxGeometry(100, 100, 100);

  // for (var i = 0; i < boxGeometry.faces.length; i += 2)
  // {

  //   var color = {
  //     h: (1 / (boxGeometry.faces.length)) * i,
  //     s: 0.5,
  //     l: 0.5
  //   };

  //   boxGeometry.faces[i].color.setHSL(color.h, color.s, color.l);
  //   boxGeometry.faces[i + 1].color.setHSL(color.h, color.s, color.l);

  // }

  // var cubeMaterial = new THREE.MeshBasicMaterial(
  // {
  //   vertexColors: true
  // });

  // const obj = new THREE.Mesh(boxGeometry, cubeMaterial);
  // obj.position.y = 150;
  // scene.add(obj);

  // return obj;
}

function addCylinder() {
  const geometry = new THREE.CylinderBufferGeometry( 70, 70, 150, 32 );//.translate( 0, 0.1, 0 );
  const material = new THREE.MeshPhongMaterial( { color: 0xffffff * Math.random() } );
  const obj = new THREE.Mesh( geometry, material );
  obj.position.y = 150;
  scene.add(obj);
  
  return obj;
}

function addRenderer() {
  const webGlRenderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
  // webGlRenderer.setPixelRatio( window.devicePixelRatio );
  // webGlRenderer.setSize( window.innerWidth, window.innerHeight );
  webGlRenderer.setSize( container.clientWidth, container.clientHeight );
  container.appendChild( webGlRenderer.domElement );

  renderer = webGlRenderer;
}