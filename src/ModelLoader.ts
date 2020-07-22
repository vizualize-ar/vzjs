// import * as THREE from '/node_modules/three/build/three.module.js';
import * as THREE from "three";
import { RotatorZoom, RotatorZoomOptions } from "./RotatorZoom";
// import { ARButton } from './jsm/webxr/ARButton.js';
import { GLTFLoader } from './jsm/loaders/GLTFLoader';
import { FBXLoader } from "./jsm/loaders/FBXLoader";
// import { RotatorZoom } from './rotator.js';

export enum ModelType {
  GTLF = "GTLF",
  FBX = "FBX",
  PNG = "PNG",
}

export enum ModelDimension {
  /** 3 dimensional asset */
  three_d = "three_d",
  /** 2 dimensional asset */
  two_d = "two_d"
}

export class ModelResource {
  constructor(public path: string, public type: ModelType, public dimension = ModelDimension.three_d) {}
}

export class ModelLoader {
  private container: HTMLElement = null;
  private rotateDiv: HTMLElement = null;
  private overlayDiv: HTMLElement = null;
  private camera: THREE.PerspectiveCamera = null;
  private scene: THREE.Scene = null;
  private renderer: THREE.WebGLRenderer = null;
  private controller: any = null;

  private reticle: THREE.Mesh = null;
  private model: THREE.Object3D = null;
  private modelPositioned = false;

  private hitTestSource: any = null;
  private hitTestSourceRequested = false;

  // var control;

  // init();
  // animate();

  constructor(private resource: ModelResource) {
    this.loadResource();
    this.overlayDiv = document.getElementById( "overlay" );
    window.document.getElementById('ar-trigger').addEventListener('click', () => this.initAR());
  }

  initAR() {
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

    this.rotateDiv = document.getElementById( 'rotate' );
    new RotatorZoom(this.rotateDiv, this.model, new RotatorZoomOptions(true, true, this.resource.dimension));

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 20 );

    // var light = new THREE.HemisphereLight( 0xffffff, 0xbbbbff, 1 );
    // // light.position.set( 0.5, 1, 0.25 );
    // scene.add( light );

    var directionalLight = new THREE.DirectionalLight( 0xffffff, .6 );
    // directionalLight.castShadow = true;
    // directionalLight.shadowCameraVisible = true;
    // directionalLight.shadowDarkness = 0.9;
    this.scene.add( directionalLight );

    //

    this.renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
    this.renderer.setPixelRatio( window.devicePixelRatio );
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    this.renderer.xr.enabled = true;
    // renderer.shadowMapEnabled = true;
    // renderer.gammaOutput = true; // for color correction, see https://blender.stackexchange.com/questions/34728/materials-from-blender-to-three-js-colors-seem-to-be-different
    this.container.appendChild( this.renderer.domElement );

    //
    // document.body.appendChild( ARButton.createButton( renderer, sessionConfig ) );
    this.overlayDiv.style.display = "";
    session.addEventListener( 'end', () => {
      session = null;
    });
    this.renderer.xr.setReferenceSpaceType( 'local' );
    this.renderer.xr.setSession( session );

    document.getElementById('exit').addEventListener('click', () => {
      this.overlayDiv.style.display = "none";
      session.end();
    });
    document.getElementById('addToCart').addEventListener('click', () => {
      this.overlayDiv.style.display = "none";
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

    var geometry = new THREE.CylinderBufferGeometry( 0.1, 0.1, 0.2, 32 ).translate( 0, 0.1, 0 );

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
      if (!this.modelPositioned) {
        this.modelPositioned = true;
        document.getElementById('positionMessage').style.display = "none";
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

  loadResource( ) {

    // var geometry = new THREE.CylinderBufferGeometry( 0.1, 0.1, 0.2, 32 ).translate( 0, 0.1, 0 );
    // var material = new THREE.MeshPhongMaterial( { color: 0xffffff * Math.random() } );
    // var mesh = new THREE.Mesh( geometry, material );
    // mesh.scale.y = Math.random() * 2 + 1;
    // model = { scene: mesh };
    // model.visible = false;

    return new Promise( ( resolve ) => {

      // Instantiate a loader
      var loader = null;
      switch (this.resource.type) {
        case ModelType.GTLF:
          loader = new GLTFLoader();
          break;
        case ModelType.FBX:
          loader = new FBXLoader();
          break;
        case ModelType.PNG:
          return this.loadPNGResource().then(resolve);
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

  async loadPNGResource(): Promise<void> {
    var loader = new THREE.TextureLoader();
    const texture = await loader.loadAsync(this.resource.path);
    var img = new THREE.MeshBasicMaterial({
      map: texture,
    });

    this.model = new THREE.Mesh(new THREE.PlaneGeometry().rotateX( - Math.PI / 2 ), img);
    this.model.visible = false;
    this.model.lookAt(0, 1, 0);
    return Promise.resolve();
  }

  onWindowResize() {

    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize( window.innerWidth, window.innerHeight );

  }

  //

  animate() {
    this.renderer.setAnimationLoop((timestamp: any, frame: any) => this.render(timestamp, frame));
    // this.renderer.setAnimationLoop(this.render);
  }

  render (timestamp: any, frame: any): any {

    if (frame && !this.modelPositioned) {

      var referenceSpace = this.renderer.xr.getReferenceSpace();
      var session = this.renderer.xr.getSession();

      if (this.hitTestSourceRequested === false) {
        session.requestReferenceSpace( 'viewer' ).then((referenceSpace: any) => {
          session.requestHitTestSource( { space: referenceSpace } ).then(( source: any ) => {
            this.hitTestSource = source;
          } );
        } );

        session.addEventListener( 'end', () => {

          this.hitTestSourceRequested = false;
          this.hitTestSource = null;
          this.modelPositioned = false;

        } );

        this.hitTestSourceRequested = true;

      }

      if (this.hitTestSource) {

        var hitTestResults = frame.getHitTestResults( this.hitTestSource );

        if ( hitTestResults.length ) {

          var hit = hitTestResults[ 0 ];
          const pose = hit.getPose( referenceSpace );
          const hitMatrix = pose.transform.matrix;
          
          // this.reticle.matrix.fromArray( hitMatrix );
          // this.reticle.visible = true;

          // model.scene.matrix.fromArray(hitMatrix);
          const mat = new THREE.Matrix4();
          mat.fromArray( hitMatrix );
          this.model.position.setFromMatrixPosition(mat);
          this.model.rotation.setFromRotationMatrix(mat);
          
          this.model.visible = true;

          document.getElementById('positionMessage').style.display = "";
        } else {
          this.reticle.visible = false;
          this.model.visible = false;
        }
      } else {
        this.reticle.visible = false;
        this.model.visible = false;
      }
    }

    this.renderer.render(this.scene, this.camera);
  }
}