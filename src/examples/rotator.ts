import * as THREE from "three";
import { RotatorZoom, RotatorZoomOptions } from "../RotatorZoom";

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
const cube = addObjects();
new RotatorZoom(container, cube, new RotatorZoomOptions());
addRenderer();
animate();

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
  var directionalLight = new THREE.DirectionalLight( 0xffffff, .6 );
  scene.add( directionalLight );
}

function addObjects() {
  var boxGeometry = new THREE.BoxGeometry(100, 100, 100);

  for (var i = 0; i < boxGeometry.faces.length; i += 2)
  {

    var color = {
      h: (1 / (boxGeometry.faces.length)) * i,
      s: 0.5,
      l: 0.5
    };

    boxGeometry.faces[i].color.setHSL(color.h, color.s, color.l);
    boxGeometry.faces[i + 1].color.setHSL(color.h, color.s, color.l);

  }

  var cubeMaterial = new THREE.MeshBasicMaterial(
  {
    vertexColors: true
  });

  const cube = new THREE.Mesh(boxGeometry, cubeMaterial);
  cube.position.y = 150;
  scene.add(cube);

  return cube;
}

function addRenderer() {
  const webGlRenderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
  // webGlRenderer.setPixelRatio( window.devicePixelRatio );
  // webGlRenderer.setSize( window.innerWidth, window.innerHeight );
  webGlRenderer.setSize( container.clientWidth, container.clientHeight );
  container.appendChild( webGlRenderer.domElement );

  renderer = webGlRenderer;
}