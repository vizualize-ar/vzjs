// import * as THREE from '/node_modules/three/build/three.module.js';
import * as THREE from "three";
import { RotatorZoom, RotatorZoomOptions } from "./RotatorZoom";
// import { ARButton } from './jsm/webxr/ARButton.js';
import { GLTFLoader } from './jsm/loaders/GLTFLoader';
import { FBXLoader } from "./jsm/loaders/FBXLoader";
import { ModelType } from "./lib/model-type";
import { PlaneDirection } from "./lib/plane-direction";

import * as dat from "dat.gui";
// import init from "three-dat.gui"; // Import initialization method
// init(dat); // Init three-dat.gui with Dat
const REAL_WORLD_GEOMETRY = false;
const REAL_WORLD_GEOMETRY_MAX_POINTS = 500;
const DEBUG_CONTROLS = false;
const DEBUG_INSPECTOR = true;

export class LoaderOptions {
  constructor(
    public zoom: boolean = true,
    public rotate: boolean = true,
    public pan: boolean = true
  ){}
}

export class ModelOptions {
  constructor(
    public path: string,
    public type: ModelType,
    public maxRotationDegrees = 180,
    public planeDirection: PlaneDirection = PlaneDirection.horizontal,
    public aspectRatio?: number,
    /** Width, in meters */
    public width?: number,
    /** Height, in meters */
    public height?: number,
  ) {}
}

export class ModelLoader {
  private container: HTMLElement = null;
  private rotateDiv: HTMLElement = null;
  private overlayDiv: HTMLElement = null;
  private positionMessageElement: HTMLElement = null;
  private addCartElement: HTMLElement = null;
  private moveGestureElement: HTMLElement = null

  private camera: THREE.PerspectiveCamera = null;
  private scene: THREE.Scene = null;
  private renderer: THREE.WebGLRenderer = null;
  private controller: any = null;

  private reticle: THREE.Mesh = null;
  private model: THREE.Object3D = null;
  private modelPositioned = false;

  private hitTestSource: any = null;
  private hitTestSourceRequested = false;

  public static DatGui: dat.GUI;

  /** Real world geometry plane detected. */
  private realWorldPlane: any;

  // var control;

  // init();
  // animate();

  constructor(private trigger: HTMLElement, private resource: ModelOptions, private loaderOptions: LoaderOptions) {
    this.init();
  }

  async init(): Promise<void> {
    // do nothing if AR is not supported
    if (!await this.isARSupported()) return;

    try {
      await this.loadResource();
    } catch {
      // error happened, possibly couldn't load resource, no dice
      return;
    }

    try {
      this.overlayDiv = document.querySelector('[data-vzid="ol"]');
      this.trigger.style.display = '';
      this.trigger.addEventListener('click', () => {
        this.positionMessageElement.style.display = 'none';
        this.addCartElement.style.display = 'none';
        this.moveGestureElement.style.display = '';
        this.initAR();
      });

      if (DEBUG_CONTROLS) {
        ModelLoader.DatGui = new dat.GUI();
        this.overlayDiv.append(ModelLoader.DatGui.domElement);
      }
      this.positionMessageElement = document.querySelector<HTMLElement>('[data-vzid="position-message"]');
      this.addCartElement = document.querySelector<HTMLElement>('[data-vzid="add-cart"]');
      this.moveGestureElement = document.querySelector<HTMLElement>('[data-vzid="move-gesture"]');
    } catch (e) {
      console.error(e);
    }
  }

  async isARSupported(): Promise<boolean> {
    // Check to see if the UA can support an AR sessions.
    try {
      const isSupported = await navigator.xr.isSessionSupported('immersive-ar');
      return isSupported;
    } catch {
      return false;
    }
  }

  initAR(): void {
    if (!this.model) {
      setTimeout(() => this.initAR(), 100);
      return;
    }
    const sessionConfig = {
      requiredFeatures: [ 'hit-test' ],
      optionalFeatures: [ 'dom-overlay' ],
      domOverlay: { root: this.overlayDiv }
    };
    (navigator as any).xr.requestSession( 'immersive-ar', sessionConfig ).then((session: any) => {
      this.initSession(session);
      this.animate();
    });
  }

  initSession(session: any) {

    this.container = document.createElement( 'div' );
    document.body.appendChild( this.container );

    // this.rotateDiv = document.getElementById( 'rotate' );
    this.rotateDiv = document.querySelector('[data-vzid="controls"]');
    new RotatorZoom(
      this.rotateDiv,
      this.model,
      new RotatorZoomOptions(
        this.loaderOptions.zoom,
        this.loaderOptions.rotate,
        this.loaderOptions.pan,
        this.resource.maxRotationDegrees,
        this.resource.planeDirection
      ),
    );

    this.scene = new THREE.Scene();
    if (DEBUG_INSPECTOR) {
      (window as any).scene = this.scene;
      (window as any).THREE = THREE;
    }

    this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 20 );

    // const light = new THREE.HemisphereLight(0xffffff, 0x000000, 1);
    // light.position.set(0, 3, 1);
    // this.scene.add( light );

    // const directionalLight = new THREE.DirectionalLight( 0xffffff, .6 );
    // // directionalLight.castShadow = true;
    // // directionalLight.shadowCameraVisible = true;
    // // directionalLight.shadowDarkness = 0.9;
    // this.scene.add( directionalLight );

    const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0xbfbfbf, 2);
    this.scene.add(hemisphereLight);

    const light1 = new THREE.DirectionalLight(0xffffff);
    light1.position.set(1, 1, 1);
    this.scene.add(light1);

    const light2 = new THREE.DirectionalLight(0x002288);
    light2.position.set(-1, -1, -1);
    this.scene.add(light2);

    // const light3 = new THREE.AmbientLight(0x222222);
    const light3 = new THREE.AmbientLight(0xffffff);
    this.scene.add(light3);

    const pointLight = new THREE.PointLight(
      0xffffff, // color
      7.0, // intensity
      20, // distance
      2 // decay
    );
    pointLight.position.set(1.5, 1.5, 0);
    this.scene.add(pointLight);

    //

    // 11/23 - disabled alpha
    this.renderer = new THREE.WebGLRenderer( { antialias: true } );
    this.renderer.setPixelRatio( window.devicePixelRatio );
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    this.renderer.xr.enabled = true;
    // 11/23 - fix unrealistic color of HD chair demo
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 0.8;

    // renderer.shadowMapEnabled = true;
    // renderer.gammaOutput = true; // for color correction, see https://blender.stackexchange.com/questions/34728/materials-from-blender-to-three-js-colors-seem-to-be-different
    this.container.appendChild( this.renderer.domElement );

    this.overlayDiv.style.display = "";
    session.addEventListener( 'end', () => {
      session = null;
    });
    this.renderer.xr.setReferenceSpaceType( 'local' );
    this.renderer.xr.setSession( session );

    if (REAL_WORLD_GEOMETRY) {
      // Enable real world geometry tracking
      session.updateWorldTrackingState({
        planeDetectionState : {
            enabled : true
        }
      });
    }

    // document.getElementById('exit').addEventListener('click', () => {
    document.querySelector('[data-vzid="exit"]').addEventListener('click', () => {
      this.overlayDiv.style.display = "none";
      session.end();
    });
    // document.getElementById('addToCart').addEventListener('click', () => {
    this.addCartElement.addEventListener('click', () => {
      this.model.visible = false;
      this.overlayDiv.style.display = "none";
      this.positionMessageElement.style.display = "none";
      this.addCartElement.style.display = 'none';
      this.moveGestureElement.style.display = 'none';
      session.end();
      
      // shopify form
      const productForm = document.querySelector<HTMLFormElement>('[id^=product_form]');
      if (productForm) {
        productForm.submit();
      }

      // squarespace
      const sqsAddToCart = document.querySelector<HTMLElement>('.sqs-add-to-cart-button');
      if (sqsAddToCart) {
        document.getElementById(sqsAddToCart.id).click();
      }
    });

    // CONTROLS
    // cameraControls = new OrbitControls( camera, renderer.domElement );
    // cameraControls.addEventListener( 'change', render );

    // control = new TransformControls( camera, renderer.domElement );
    // control.addEventListener( 'change', render );
    // control.setMode( "rotate" );

    // var geometry = new THREE.CylinderBufferGeometry( 0.1, 0.1, 0.2, 32 ).translate( 0, 0.1, 0 );

    const onSelect = () => {

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
      if (this.positionMessageElement.style.display === 'none') return;

      if (!this.modelPositioned) {
        this.modelPositioned = true;
        // document.getElementById('position-message').style.display = "none";
        this.positionMessageElement.style.display = 'none';
        this.addCartElement.style.display = '';
      }
    }

    this.controller = this.renderer.xr.getController( 0 );
    this.controller.addEventListener( 'select', onSelect );
    this.scene.add( this.controller );

    this.reticle = new THREE.Mesh(
      new THREE.RingBufferGeometry( 0.15, 0.2, 32 ).rotateX( - Math.PI / 2 ),
      new THREE.MeshBasicMaterial()
    );
    this.reticle.matrixAutoUpdate = false;
    this.reticle.visible = false;
    this.scene.add( this.reticle );

    // const addResource = () => {
    //   if (this.model) {
    //     this.model.visible = false;
    //     this.scene.add( this.model );
    //   } else {
    //     setTimeout(addResource, 100);
    //   }
    // }
    // addResource();
    this.model.visible = false;
    this.scene.add(this.model);

    //
    window.addEventListener( 'resize', () => this.onWindowResize(), false );

  }

  loadResource(): Promise<void> {

    // var geometry = new THREE.CylinderBufferGeometry( 0.1, 0.1, 0.2, 32 ).translate( 0, 0.1, 0 );
    // var material = new THREE.MeshPhongMaterial( { color: 0xffffff * Math.random() } );
    // var mesh = new THREE.Mesh( geometry, material );
    // mesh.scale.y = Math.random() * 2 + 1;
    // model = { scene: mesh };
    // model.visible = false;

    return new Promise( ( resolve ) => {

      // Instantiate a loader
      let loader = null;
      switch (this.resource.type) {
        case ModelType.gltf:
          loader = new GLTFLoader();
          break;
        case ModelType.fbx:
          loader = new FBXLoader();
          break;
        case ModelType.image:
          return this.loadImageResource().then(resolve);
      }

      // Load a glTF resource
      loader.load(
        this.resource.path,
        // called when the resource is loaded
        (model) => {
          this.model = model.scene || model;
          this.model.visible = false;
          resolve();
        },
        // called while loading is progressing
        (xhr) => {
          console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
        },
        // called when loading has errors
        (error) => {
          console.error( 'An error happened', error );
        }
      );

    });
  }

  async loadImageResource(): Promise<void> {
    // const loader = new THREE.TextureLoader();
    // const texture: THREE.DataTexture = await loader.loadAsync(this.resource.path);
    // const img = new THREE.MeshBasicMaterial({
    //   map: texture,
    // });

    // //this.model = new THREE.Mesh(new THREE.PlaneGeometry().rotateX( - Math.PI / 2 ), img);
    // let modelGeometery: THREE.PlaneGeometry = new THREE.PlaneGeometry(0.9, 0.9 / this.resource.aspectRatio);
    // if (this.resource.width && this.resource.height) {
    //   modelGeometery = new THREE.PlaneGeometry(this.resource.width, this.resource.height);
    // }
    // if (this.resource.width) {
    //   modelGeometery = new THREE.PlaneGeometry(this.resource.width, this.resource.width / this.resource.aspectRatio);
    // }
    // this.model = new THREE.Mesh(modelGeometery, img);
    // this.model.visible = false;
    // // this.model.lookAt(0, 1, 0);

    const loader = new THREE.TextureLoader();
    const texture: THREE.DataTexture = await loader.loadAsync(this.resource.path) as THREE.DataTexture;
    const pictureMaterial = new THREE.MeshBasicMaterial({
      map: texture
    });

    const borderMaterial = new THREE.MeshBasicMaterial({
      color: 0x111111
    });

    const materials = [
      borderMaterial, // right
      borderMaterial, // left
      borderMaterial, // top
      borderMaterial, // maybe bottom
      pictureMaterial, // front
      borderMaterial // Back side
    ];

    this.model = new THREE.Mesh(
      new THREE.BoxBufferGeometry(this.resource.width, this.resource.height, 0.05),
      materials
    );
    this.model.visible = false;

    if (DEBUG_CONTROLS) {
      const guiPosition = ModelLoader.DatGui.addFolder("position");
      guiPosition.add(this.model.position, "x", -6, 6, 0.001);
      guiPosition.add(this.model.position, "y", -6, 6, 0.001);
      guiPosition.add(this.model.position, "z", -6, 6, 0.001);

      const guiRotation = ModelLoader.DatGui.addFolder("rotation");
      guiRotation.add(this.model.rotation, "x", -6, 6, 0.001)
      guiRotation.add(this.model.rotation, "y", -6, 6, 0.001)
      guiRotation.add(this.model.rotation, "z", -6, 6, 0.001);
    }
    return Promise.resolve();
  }

  onWindowResize() {

    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize( window.innerWidth, window.innerHeight );

  }

  animate(): void {
    this.renderer.setAnimationLoop((timestamp: any, frame: any) => this.render(timestamp, frame));
  }

  render (timestamp: any, frame: XRFrame): any {

    if (REAL_WORLD_GEOMETRY && frame) {
      const detectedPlanes = frame.worldInformation.detectedPlanes;
      if (detectedPlanes.size > 0) {
        const referenceSpace = this.renderer.xr.getReferenceSpace();
        detectedPlanes.forEach((plane: any) => {
            const planePose = frame.getPose(plane.planeSpace, referenceSpace);
            const planeVertices = plane.polygon; // plane.polygon is an array of objects containing x,y,z coordinates
        
            // ...draw plane_vertices relative to plane_pose...
            this.drawPlane(planePose, planeVertices);
        });
      }
    }

    if (frame && !this.modelPositioned) {

      const referenceSpace = this.renderer.xr.getReferenceSpace();
      const session = this.renderer.xr.getSession();

      if (this.hitTestSourceRequested === false) {
        session.requestReferenceSpace( 'viewer' ).then((referenceSpace: any) => {
          session.requestHitTestSource( { space: referenceSpace } ).then(( source: any ) => {
            this.hitTestSource = source;
          } );
        } );

        session.addEventListener( 'end', () => {
          this.renderer.setAnimationLoop(null);
          this.hitTestSourceRequested = false;
          this.hitTestSource = null;
          this.modelPositioned = false;
          this.model.visible = false;
          this.overlayDiv.style.display = "none";
          this.positionMessageElement.style.display = "none";
          this.addCartElement.style.display = 'none';
          this.moveGestureElement.style.display = 'none';
          
          document.body.removeChild(this.container);
          this.renderer.resetState();
        } );

        this.hitTestSourceRequested = true;

      }

      if (this.hitTestSource) {

        const hitTestResults = frame.getHitTestResults( this.hitTestSource );

        if ( hitTestResults.length ) {

          const hit = hitTestResults[ 0 ];
          const pose = hit.getPose( referenceSpace );
          const hitMatrix = pose.transform.matrix;

          this.logPose(pose);
          
          // this.reticle.matrix.fromArray( hitMatrix );
          // this.reticle.visible = true;

          // model.scene.matrix.fromArray(hitMatrix);
          const mat = new THREE.Matrix4();
          mat.fromArray( hitMatrix );
          this.model.position.setFromMatrixPosition(mat);
          // this.model.rotation.setFromRotationMatrix(mat);
          
          this.model.visible = true;

          // document.getElementById('positionMessage').style.display = "";
          this.positionMessageElement.style.display = "";
          this.moveGestureElement.style.display = "none";

          // this.addTransformLines(pose.transform);
        } else {
          this.reticle.visible = false;
          this.model.visible = false;
          this.positionMessageElement.style.display = 'none';
        }
      } else {
        this.reticle.visible = false;
        this.model.visible = false;
        this.positionMessageElement.style.display = 'none';
      }
    }

    // if (this.model.visible) {
    //   this.addModelLines();
    // }

    this.renderer.render(this.scene, this.camera);
    
    if (DEBUG_CONTROLS) {
      ModelLoader.DatGui.updateDisplay();
    }
  }

  xLine: THREE.Line;
  yLine: THREE.Line;
  zLine: THREE.Line;
  rxLine: THREE.Line;
  ryLine: THREE.Line;
  rzLine: THREE.Line;

  addModelLines() {
    // 2/08/2021 - commented out due to breaking changes in three.js upgrade.

    // // add x line
    // if (this.xLine) {
    //   this.scene.remove(this.xLine);
    // }
    // const xGeometry = new THREE.Geometry();
    // xGeometry.vertices.push( this.model.position, new THREE.Vector3(this.model.position.x + 0.5, this.model.position.y, this.model.position.z) );
    // this.xLine = new THREE.Line( xGeometry, new THREE.LineBasicMaterial( {
    //     color: "red",
    // } ) );
    // this.scene.add( this.xLine );

    // // add y line
    // if (this.yLine) {
    //   this.scene.remove(this.yLine);
    // }
    // const yGeometry = new THREE.Geometry();
    // yGeometry.vertices.push( this.model.position, new THREE.Vector3(this.model.position.x, this.model.position.y + 0.5, this.model.position.z) );
    // this.yLine = new THREE.Line( yGeometry, new THREE.LineBasicMaterial( {
    //     color: "green",
    // } ) );
    // this.scene.add( this.yLine );

    // // add z line
    // if (this.zLine) {
    //   this.scene.remove(this.zLine);
    // }
    // let zGeometry = new THREE.Geometry();
    // zGeometry.vertices.push( this.model.position, new THREE.Vector3(this.model.position.x, this.model.position.y, this.model.position.z + 0.5) );
    // this.zLine = new THREE.Line( zGeometry, new THREE.LineBasicMaterial( {
    //     color: "blue",
    // } ) );
    // this.scene.add( this.zLine );

    // ////////////
    // if (this.rxLine) {
    //   this.scene.remove(this.rxLine);
    // }
    // zGeometry = new THREE.Geometry();
    // const rotation = this.model.rotation.toVector3();
    // zGeometry.vertices.push( rotation, new THREE.Vector3(rotation.x + 0.5, rotation.y, rotation.z) );
    // this.rxLine = new THREE.Line( zGeometry, new THREE.LineBasicMaterial( {
    //     color: "yellow",
    // } ) );
    // this.scene.add( this.rxLine );
  }

  addTransformLines(transform: XRRigidTransform) {
    // 2/08/2021 - commented out due to breaking changes in three.js upgrade.

    // const startVector = new THREE.Vector3(transform.position.x, transform.position.y, transform.position.z);

    // // draw model x axis
    // if (this.xLine) {
    //   this.scene.remove(this.xLine);
    // }
    // const xGeometry = new THREE.Geometry();
    // xGeometry.vertices.push( startVector, new THREE.Vector3(transform.position.x + 0.5, transform.position.y, transform.position.z) );
    // this.xLine = new THREE.Line( xGeometry, new THREE.LineBasicMaterial( {
    //     color: 0xff6666,
    // } ) );
    // this.scene.add( this.xLine );

    // // add y line
    // if (this.yLine) {
    //   this.scene.remove(this.yLine);
    // }
    // const yGeometry = new THREE.Geometry();
    // yGeometry.vertices.push( startVector, new THREE.Vector3(transform.position.x, transform.position.y + 0.5, transform.position.z) );
    // this.yLine = new THREE.Line( yGeometry, new THREE.LineBasicMaterial( {
    //     color: 0x66ff66,
    // } ) );
    // this.scene.add( this.yLine );

    // // add z line
    // if (this.zLine) {
    //   this.scene.remove(this.zLine);
    // }
    // const zGeometry = new THREE.Geometry();
    // zGeometry.vertices.push( startVector, new THREE.Vector3(transform.position.x, transform.position.y, transform.position.z + 0.5) );
    // this.zLine = new THREE.Line( zGeometry, new THREE.LineBasicMaterial( {
    //     color: 0x6666ff,
    // } ) );
    // this.scene.add( this.zLine );
  }


  logPose(pose: any) {
    if (!DEBUG_CONTROLS) return;

    if ((ModelLoader.DatGui.__folders as any).pose) {
      ModelLoader.DatGui.removeFolder((ModelLoader.DatGui.__folders as any).pose);
    }
    const guiPose = ModelLoader.DatGui.addFolder("pose");
    let gui = guiPose.addFolder("position");
    gui.add(pose.transform.position, "w", -6, 6, 0.001)
    gui.add(pose.transform.position, "x", -6, 6, 0.001)
    gui.add(pose.transform.position, "y", -6, 6, 0.001)
    gui.add(pose.transform.position, "z", -6, 6, 0.001);
    gui.open();

    gui = guiPose.addFolder("orientation");
    gui.add(pose.transform.orientation, "w", -6, 6, 0.001)
    gui.add(pose.transform.orientation, "x", -6, 6, 0.001)
    gui.add(pose.transform.orientation, "y", -6, 6, 0.001)
    gui.add(pose.transform.orientation, "z", -6, 6, 0.001);
    gui.open();
    
    guiPose.open();
  }

  drawPlane(pose: any, vertices: any) {
    // geometry
    const geometry = new THREE.BufferGeometry();

    // attributes
    const positions = new Float32Array( REAL_WORLD_GEOMETRY_MAX_POINTS * 3 ); // 3 vertices per point
    let index = 0;
    for ( let i = 0; i < vertices.length;  i ++ ) {
        positions[ index ++ ] = vertices[i].x;
        positions[ index ++ ] = vertices[i].y;
        positions[ index ++ ] = vertices[i].z;
    }
    geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
    
    // drawCalls
    geometry.setDrawRange( 0, vertices.length );

    // material
    const material = new THREE.LineBasicMaterial( { color: 0xff0000, linewidth: 2 } );

    // line
    const line = new THREE.Line( geometry,  material );
    
    // var positions = line.geometry.attributes.position.array;                        
    // var index = 0;
    // for ( var i = 0; i < vertices.length;  i ++ ) {
    //     positions[ index ++ ] = vertices[i].x;
    //     positions[ index ++ ] = vertices[i].y;
    //     positions[ index ++ ] = vertices[i].z;
    // }
    // line.geometry.setDrawRange( 0, vertices.length );

    // Set position relative to pose
    const poseMatrix = pose.transform.matrix;

    const mat = new THREE.Matrix4();
    mat.fromArray( poseMatrix );
    line.position.setFromMatrixPosition(mat);
    line.rotation.setFromRotationMatrix(mat);
    
    if (this.realWorldPlane) {
        this.scene.remove(this.realWorldPlane);
    }
    this.scene.add(line);
    this.realWorldPlane = line;
}
}