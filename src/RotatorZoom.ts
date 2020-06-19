import * as THREE from "three";
import Rotator from "./Rotator";
import Zoomer from "./Zoomer";

export class RotatorZoomOptions {
	constructor(public zoom: boolean = true, public rotate: boolean = true) {

	}
}

export class RotatorZoom {
  rotateStartPoint = new THREE.Vector3(0, 0, 1);
  rotateEndPoint = new THREE.Vector3(0, 0, 1); 
  curQuaternion: THREE.Quaternion;
	startPoint = {
		x: 0,
		y: 0
	};
	deltaX = 0;
  deltaY = 0;

  touchTarget: HTMLElement;
	targetObject: THREE.Object3D;
	options: RotatorZoomOptions;
	
	rotator: Rotator;
	zoomer: Zoomer;
	// Time in ms to wait between zoom and rotate actions to prevent accidental rotate after zoom
	actionBuffer = 100;
	/** Time the last move ended (in epoch time) */
	lastActionEnd: number;
	isZooming: boolean = false;
	isRotating: boolean = false;
  
  constructor(touchTarget: HTMLElement, targetObject: THREE.Object3D, options: RotatorZoomOptions) {
    this.touchTarget = touchTarget;
		this.targetObject = targetObject;
		this.options = options;

		if (this.options.rotate) {
			this.rotator = new Rotator(this.targetObject);
		}
		if (this.options.zoom) {
			this.zoomer = new Zoomer(this.targetObject);
		}
		
		this.touchTarget.style.touchAction = "none";	// prevents weird browser issues

		// this.touchTarget.addEventListener('touchstart', this.onDocumentMouseDown, false);
		this.touchTarget.addEventListener('pointerdown', this.onPointerDown, false);
	}

  onPointerDown = (event: PointerEvent) => {
		event.preventDefault();

		this.touchTarget.addEventListener('pointermove', this.onPointerMove, false);
    this.touchTarget.addEventListener('pointerup', this.onPointerUp, false);
    this.touchTarget.addEventListener('pointercancel', this.onPointerUp, false);
    this.touchTarget.addEventListener('pointerout', this.onPointerUp, false);
    this.touchTarget.addEventListener('pointerleave', this.onPointerUp, false);

		this.options.zoom && this.zoomer.startZoom(event);
		this.options.rotate && this.rotator.startRotation(event);
  }

  onPointerMove = (event: PointerEvent) => {
		if (new Date().getTime() - this.lastActionEnd < this.actionBuffer) return;

		if (this.options.zoom && this.zoomer.canZoom) {
			this.zoomer.zoom(event);
			this.isZooming = true;
		} else if (this.options.rotate) {
			this.rotator.rotate(event);
			this.isRotating = true;
		}
  }

  onPointerUp = (event: PointerEvent) => {

		if (this.options.zoom) {
			if (this.isZooming) {
				this.lastActionEnd = new Date().getTime();
				this.isZooming = false;
			}
			this.zoomer.stop(event);
		}
		
		if (this.options.zoom && !this.zoomer.hasEvents) {
			this.touchTarget.removeEventListener('pointermove', this.onPointerMove, false);
			this.touchTarget.removeEventListener('pointerup', this.onPointerUp, false);
			this.touchTarget.removeEventListener('pointercancel', this.onPointerUp, false);
			this.touchTarget.removeEventListener('pointerout', this.onPointerUp, false);
			this.touchTarget.removeEventListener('pointerleave', this.onPointerUp, false);
		}
	}
}
