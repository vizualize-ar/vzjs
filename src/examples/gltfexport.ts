import * as THREE from "three";
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter';

class GltfExportExample {
  renderer: THREE.Renderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
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
    // this.addCube();
    await this.addModel();
  }

  async addModel() {
    const loader = new THREE.TextureLoader();
    const texture: THREE.DataTexture = await loader.loadAsync("/demos/gstakis/models/tupac.png");
    const img = new THREE.MeshBasicMaterial({
      map: texture,
    });

    const width = 0.9144, height = 0.6096;
    // const width = 130, height = 100;
    const modelGeometery: THREE.PlaneGeometry = new THREE.PlaneGeometry(width, height);
    const model = new THREE.Mesh(modelGeometery, img);
    this.scene.add(model);

    this.exportGLTF(model);
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
      onlyVisible: true,
      binary: true,
    }
    gltfExporter.parse( input, (result: any) => {

      if ( result instanceof ArrayBuffer ) {
        this.saveArrayBuffer(result, 'scene.glb');
      } else {
        const output = JSON.stringify( result, null, 2 );
        console.log( output );
        // saveString( output, 'scene.gltf' );
      }
    }, options );
  }

  saveArrayBuffer(buffer: ArrayBuffer, filename: string) {
    this.save( new Blob( [ buffer ], { type: 'application/octet-stream' } ), filename );
  }

  save(blob: Blob, filename: string) {
    const link = document.createElement( 'a' );
    link.innerText = "Download";
    document.body.appendChild( link ); // Firefox workaround, see #6594

    link.href = URL.createObjectURL( blob );
    link.download = filename;
    link.click();
  }

  addCube() {
    const boxGeometry = new THREE.BoxGeometry(100, 100, 100);
  
    for (let i = 0; i < boxGeometry.faces.length; i += 2)
    {
  
      const color = {
        h: (1 / (boxGeometry.faces.length)) * i,
        s: 0.5,
        l: 0.5
      };
  
      boxGeometry.faces[i].color.setHSL(color.h, color.s, color.l);
      boxGeometry.faces[i + 1].color.setHSL(color.h, color.s, color.l);
  
    }
  
    const cubeMaterial = new THREE.MeshBasicMaterial(
    {
      vertexColors: true
    });
  
    const obj = new THREE.Mesh(boxGeometry, cubeMaterial);
    obj.position.y = 150;
    this.scene.add(obj);
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

  addLight() {
    const directionalLight = new THREE.DirectionalLight( 0xffffff, .6 );
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