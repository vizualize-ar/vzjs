import * as THREE from "three";
import Rotator3D from "./Rotator3D";
import Zoomer from "./Zoomer";
import { PlaneDirection } from "./ModelLoader";
import { Rotator } from "./Rotator";
import Panner from "./Panner";

export class RotatorZoomOptions {
  constructor(
    public zoom: boolean,
    public rotate: boolean,
    public pan: boolean,
    /** Maximum rotation amount, 1-180 */
    public maxRotationDegrees: number,
    public planeDirection: PlaneDirection
  ) {}
}

// const PAN_THRESHOLD = 20;

export class RotatorZoom {
  rotateStartPoint = new THREE.Vector3(0, 0, 1);
  rotateEndPoint = new THREE.Vector3(0, 0, 1);
  curQuaternion: THREE.Quaternion;
  startPoint = {
    x: 0,
    y: 0,
  };
  deltaX = 0;
  deltaY = 0;

  touchTarget: HTMLElement;
  targetObject: THREE.Object3D;
  options: RotatorZoomOptions;

  rotator: Rotator;
  zoomer: Zoomer;
  panner: Panner;
  // Time in ms to wait between zoom and rotate actions to prevent accidental rotate after zoom
  actionBuffer = 100;
  /** Time the last move ended (in epoch time) */
  lastActionEnd: number;
  isZooming = false;
  isRotating = false;

  // /** Primary touch events, for rotating or start of pinch/pan */
  // touch1Events: PointerEvent[] = [];
  // /** Secondary touch events, for pinch/pan */
  // touch2Events: PointerEvent[] = [];

  constructor(
    touchTarget: HTMLElement,
    targetObject: THREE.Object3D,
    options: RotatorZoomOptions
  ) {
    this.touchTarget = touchTarget;
    this.targetObject = targetObject;
    this.options = options;

    if (this.options.rotate) {
      // if (this.options.planeDirection === PlaneDirection.horizontal) {
      //   this.rotator = new Rotator3D(this.targetObject, this.options.maxRotationDegrees, this.options.planeDirection);
      // } else {
      //   this.rotator = new Rotator2D(this.targetObject, this.options.maxRotationDegrees);
      // }
      this.rotator = new Rotator3D(this.targetObject, this.options.maxRotationDegrees, this.options.planeDirection);
    }
    if (this.options.zoom) {
      this.zoomer = new Zoomer(this.targetObject);
    }
    if (this.options.pan) {
      this.panner = new Panner(this.targetObject);
    }

    this.touchTarget.style.touchAction = "none"; // prevents weird browser issues

    // this.touchTarget.addEventListener('touchstart', this.onDocumentMouseDown, false);
    this.touchTarget.addEventListener("pointerdown", this.onPointerDown, false);
  }

  onPointerDown = (event: PointerEvent) => {
    if (this.targetObject.visible == false) return;
    event.preventDefault();

    this.touchTarget.addEventListener("pointermove", this.onPointerMove, false);
    this.touchTarget.addEventListener("pointerup", this.onPointerUp, false);
    this.touchTarget.addEventListener("pointercancel", this.onPointerUp, false);
    this.touchTarget.addEventListener("pointerout", this.onPointerUp, false);
    this.touchTarget.addEventListener("pointerleave", this.onPointerUp, false);

    // this.saveTouch(event);

    this.options.pan && this.panner.startPan(event);
    this.options.zoom && this.zoomer.startZoom(event);
    this.options.rotate && this.rotator.startRotation(event);
  };


  onPointerMove = (event: PointerEvent) => {
    if (new Date().getTime() - this.lastActionEnd < this.actionBuffer) return;
    // this.saveTouch(event);
    if (this.options.pan) {
      this.panner.onPointerEvent(event);
    }

    if (this.options.pan && this.panner.isPan && event.isPrimary) {
      this.panner.pan(event);
    } else if (this.options.zoom && this.zoomer.isZoom) {
      console.log("is zoom", new Date().getTime());
      this.zoomer.zoom(event);
      this.isZooming = true;
    } else if (this.options.rotate) {
      console.log("is rotate", new Date().getTime());
      this.rotator.rotate(event);
      this.isRotating = true;
    }
  };

  onPointerUp = (event: PointerEvent) => {
    if (this.options.zoom) {
      if (this.isZooming) {
        this.lastActionEnd = new Date().getTime();
        this.isZooming = false;
      }
      this.zoomer.stop(event);
    }
    // if (this.options.pan) {
    //   this.touch1Events = [];
    //   this.touch2Events = [];
    //   this.panner.stop(event);
    // }

    if (this.options.zoom && !this.zoomer.hasEvents) {
      this.touchTarget.removeEventListener(
        "pointermove",
        this.onPointerMove,
        false
      );
      this.touchTarget.removeEventListener(
        "pointerup",
        this.onPointerUp,
        false
      );
      this.touchTarget.removeEventListener(
        "pointercancel",
        this.onPointerUp,
        false
      );
      this.touchTarget.removeEventListener(
        "pointerout",
        this.onPointerUp,
        false
      );
      this.touchTarget.removeEventListener(
        "pointerleave",
        this.onPointerUp,
        false
      );
    }
  };

  // saveTouch(event: PointerEvent) {
  //   if (event.isPrimary) {
  //     this.touch1Events.push(event);
  //   } else {
  //     this.touch2Events.push(event);
  //   }
  //   if (this.touch1Events.length > 10) {
  //     this.touch1Events.shift();
  //   }
  //   if (this.touch2Events.length > 10) {
  //     this.touch2Events.shift();
  //   }
  // };

  // get isPan(): boolean {
  //   if (this.touch1Events.length > 0 && this.touch2Events.length > 0) {
  //     const deltaFirst = Util.PointerDelta(this.touch1Events[0], this.touch2Events[0]);
  //     const deltaLast = Util.PointerDelta(this.touch1Events[this.touch1Events.length -1 ], this.touch2Events[this.touch2Events.length - 1]);
  //     const delta = Math.abs(deltaFirst - deltaLast);
  //     const isPan = delta <= PAN_THRESHOLD;
  //     // console.log("pan delta", deltaFirst, deltaLast, new Date().getTime());
  //     return isPan;
  //   }
  //   return false;
  // }
}
