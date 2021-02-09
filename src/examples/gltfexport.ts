import * as THREE from "three";
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

class GltfExportExample {
  renderer: THREE.Renderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  controls: OrbitControls;
  container: HTMLElement;

  constructor() {
    this.container = document.createElement( 'div' );
    this.container.style.width = "600px";
    this.container.style.height = "600px";
    this.container.style.border = "solid 1px #ccc";
    document.body.appendChild( this.container );

    this.scene = new THREE.Scene();
    this.camera = this.createCamera();
    
    this.addRenderer();
    this.createControls();
    this.addLight();
    this.animate();
    this.init();

    window.addEventListener('resize', () =>
    {
      this.container.style.width = window.innerWidth + "px";
      this.container.style.height = window.innerWidth + "px";

      this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
      this.camera.updateProjectionMatrix();

      this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    }, false);
  }

  async init() {
    const model = await this.addCube();
    // const model = await this.addModel();

    this.exportGLTF(model);
  }

  async addModel() {
    const loader = new THREE.TextureLoader();
    const texture: THREE.DataTexture = await loader.loadAsync("/demos/gstakis/models/tupac.png") as THREE.DataTexture;
    const img = new THREE.MeshBasicMaterial({
      map: texture,
    });

    const width = 0.9144, height = 0.6096;
    // const width = 130, height = 100;
    const modelGeometery: THREE.PlaneGeometry = new THREE.PlaneGeometry(width, height);
    const model = new THREE.Mesh(modelGeometery, img);
    this.scene.add(model);
    return model;
  }

  // addCube() {
  //   // const boxGeometry = new THREE.BoxGeometry(100, 100, 100);
  //   const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
  
  //   for (let i = 0; i < boxGeometry.faces.length; i += 2)
  //   {  
  //     const color = {
  //       h: (1 / (boxGeometry.faces.length)) * i,
  //       s: 0.5,
  //       l: 0.5
  //     };
  
  //     boxGeometry.faces[i].color.setHSL(color.h, color.s, color.l);
  //     boxGeometry.faces[i + 1].color.setHSL(color.h, color.s, color.l);  
  //   }
  
  //   const cubeMaterial = new THREE.MeshBasicMaterial(
  //   {
  //     vertexColors: true
  //   });
  
  //   const obj = new THREE.Mesh(boxGeometry, cubeMaterial);
  //   // obj.position.y = 150;
  //   obj.position.y = -1;
  //   obj.position.x = -1;
  //   obj.position.z = -1;
  //   this.scene.add(obj);
  // }

  async addCube() {
    const loader = new THREE.TextureLoader();
    const texture: THREE.DataTexture = await loader.loadAsync("/demos/gstakis/models/tupac.png") as THREE.DataTexture;
    const pictureMaterial = new THREE.MeshBasicMaterial({
      map: texture,
    });
    
    const borderMaterial = new THREE.MeshBasicMaterial({
        color : 0x111111
    });
    
    const materials = [
      borderMaterial, // right
      borderMaterial, // left
      borderMaterial,  // top
      borderMaterial,  // maybe bottom
      pictureMaterial, // front
      borderMaterial  // Back side
    ];

    const width = 0.9144, height = 0.6096;
    const cube = new THREE.Mesh(new THREE.BoxBufferGeometry(width, height, 0.05), materials);
    this.scene.add(cube);
    return cube;

    // const mapWood = await new THREE.TextureLoader().loadAsync( '/demos/gstakis/models/tupac.png' );
    // const material = new THREE.MeshStandardMaterial( { map: mapWood, side: THREE.FrontSide  } as THREE.MeshStandardMaterialParameters );
    // const object = new THREE.Mesh( new THREE.BoxBufferGeometry( 0.9144, 0.6096, 0.5 ), material );
    // object.name = "Tupac";
    // this.scene.add( object );
    // return object;
  }

  exportGLTF( input: any ) {

    const gltfExporter = new GLTFExporter();

    // var options = {
    //   trs: document.getElementById( 'option_trs' ).checked,
    //   onlyVisible: document.getElementById( 'option_visible' ).checked,
    //   truncateDrawRange: document.getElementById( 'option_drawrange' ).checked,
    //   binary: document.getElementById( 'option_binary' ).checked,
    //   forcePowerOfTwoTextures: document.getElementById( 'option_forcepot' ).checked,
    //   maxTextureSize: Number( document.getElementById( 'option_maxsize' ).value ) || Infinity // To prevent NaN value
    // };
    const options = {
      trs: true,
      onlyVisible: true,
      binary: false,
      forceIndices: true
    }
    gltfExporter.parse( input, (result: any) => {

      if ( result instanceof ArrayBuffer ) {
        this.saveArrayBuffer(result, 'scene.glb');
      } else {
        const output = JSON.stringify( result, null, 2 );
        console.log( output );
        this.saveString( output, 'scene.gltf' );
      }
    }, options );
  }

  saveArrayBuffer(buffer: ArrayBuffer, filename: string) {
    this.save( new Blob( [ buffer ], { type: 'application/octet-stream' } ), filename );
  }

  saveString(text: string, filename: string) {
    this.save( new Blob( [ text ], { type: 'text/plain' } ), filename );
  }

  save(blob: Blob, filename: string) {
    const link = document.createElement( 'a' );
    link.innerText = "Download";
    document.body.appendChild( link ); // Firefox workaround, see #6594

    link.href = URL.createObjectURL( blob );
    link.download = filename;
    link.click();
  }

  animate = () => {
    requestAnimationFrame(this.animate);
    this.render();
  }

  render()
  {
    this.renderer.render(this.scene, this.camera);
  }

  createCamera() {
    const aspectRatio = this.container.clientWidth / this.container.clientHeight;
    const camera = new THREE.PerspectiveCamera(50, aspectRatio, 0.1, 1000);
    // camera.position.y = 150;
    camera.position.z = 3;  // 3m away

    return camera;
  }

  createControls() {
    const controls: OrbitControls = new OrbitControls(this.camera, this.renderer.domElement);
    controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
				controls.dampingFactor = 0.05;

				controls.screenSpacePanning = false;

				controls.minDistance = 1;
				controls.maxDistance = 500;

				controls.maxPolarAngle = Math.PI / 2;
  }

  addLight() {
    const light = new THREE.AmbientLight( 0xffffff, 0.2 );
    light.name = 'AmbientLight';
    this.scene.add( light );
        
    const directionalLight = new THREE.DirectionalLight( 0xffffff, .6 );
    directionalLight.position.set(0, 0, 1);
    this.scene.add( directionalLight );
  }

  addRenderer() {
    const webGlRenderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
    webGlRenderer.setSize( this.container.clientWidth, this.container.clientHeight );
    this.container.appendChild( webGlRenderer.domElement );

    this.renderer = webGlRenderer;
  }
}
new GltfExportExample();