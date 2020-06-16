import * as THREE from '../node_modules/three/build/three.module.js';

export class RotatorZoom {
  rotateStartPoint = new THREE.Vector3(0, 0, 1);
  rotateEndPoint = new THREE.Vector3(0, 0, 1); 
  curQuaternion;
	windowHalfX = window.innerWidth / 2;
	windowHalfY = window.innerHeight / 2;
	rotationSpeed = 2;
	lastMoveTimestamp;
	moveReleaseTimeDelta = 50;
	startPoint = {
		x: 0,
		y: 0
	};
	deltaX = 0;
  deltaY = 0;

  touchTarget;
	targetObject;
	
	rotator;
	zoomer;
	// Time to wait between zoom and rotate actions to prevent accidental rotate after zoom
	actionBuffer = 500;
	lastActionEnd;
  
  constructor(touchTarget, targetObject) {
    this.touchTarget = touchTarget;
		this.targetObject = targetObject;
		this.rotator = new Rotator(this.targetObject);
		this.zoomer = new Zoomer(this.targetObject);
		
		this.touchTarget.style.touchAction = "none";	// prevents weird browser issues

		// this.touchTarget.addEventListener('touchstart', this.onDocumentMouseDown, false);
		this.touchTarget.addEventListener('pointerdown', this.onPointerDown, false);
	}

  onPointerDown = (event) => {
		event.preventDefault();

		this.touchTarget.addEventListener('pointermove', this.onPointerMove, false);
    this.touchTarget.addEventListener('pointerup', this.onPointerUp, false);
    this.touchTarget.addEventListener('pointercancel', this.onPointerUp, false);
    this.touchTarget.addEventListener('pointerout', this.onPointerUp, false);
    this.touchTarget.addEventListener('pointerleave', this.onPointerUp, false);

		this.zoomer.startZoom(event);
		this.rotator.startRotation(event);
  }

  onPointerMove = (event) => {
		if (new Date().getTime() - this.lastActionEnd < this.actionBuffer) return;

		if (this.zoomer.canZoom) {
			// console.log("rotatorzoom: zoom");
			this.zoomer.zoom(event);
			this.isZooming = true;
		} else {
			// console.log("rotatorzoom: rotate");
			this.rotator.rotate(event);
			this.isRotating = true;
		}
  }

  onPointerUp = (event) => {

		if (this.isZooming) {
			this.lastActionEnd = new Date().getTime();
			this.isZooming = false;
		}
		this.zoomer.stop(event);
		
		if (!this.zoomer.hasEvents) {
			this.touchTarget.removeEventListener('pointermove', this.onPointerMove, false);
			this.touchTarget.removeEventListener('pointerup', this.onPointerUp, false);
			this.touchTarget.removeEventListener('pointercancel', this.onPointerUp, false);
			this.touchTarget.removeEventListener('pointerout', this.onPointerUp, false);
			this.touchTarget.removeEventListener('pointerleave', this.onPointerUp, false);
		}
	}
}

class Rotator {
	rotateStartPoint = new THREE.Vector3(0, 0, 1);
  rotateEndPoint = new THREE.Vector3(0, 0, 1); 
  curQuaternion;
	windowHalfX = window.innerWidth / 2;
	windowHalfY = window.innerHeight / 2;
	rotationSpeed = 2;
	moveReleaseTimeDelta = 50;
	startPoint = {
		x: 0,
		y: 0
	};
	deltaX = 0;
	deltaY = 0;

	rotationTarget;

	constructor(rotationTarget) {
		this.rotationTarget = rotationTarget;
		window.addEventListener('resize', this.onWindowResize, false);
	}

	onWindowResize = () => {
		this.windowHalfX = window.innerWidth / 2;
		this.windowHalfY = window.innerHeight / 2;
	}

	startRotation(event) {
		this.startPoint = {
			x: event.pageX,
			y: event.pageY,
		};

		this.rotateStartPoint = this.rotateEndPoint = this.projectOnTrackball(0, 0);
	}

	rotate(event) {
		this.deltaX = event.pageX - this.startPoint.x;
		this.deltaY = event.pageY - this.startPoint.y;

		this.handleRotation();

		this.startPoint.x = event.pageX;
		this.startPoint.y = event.pageY;
	}

	handleRotation() {
		this.rotateEndPoint = this.projectOnTrackball(this.deltaX, this.deltaY);

		var rotateQuaternion = this.rotateMatrix(this.rotateStartPoint, this.rotateEndPoint);
		this.curQuaternion = this.rotationTarget.quaternion;
		this.curQuaternion.multiplyQuaternions(rotateQuaternion, this.curQuaternion);
		this.curQuaternion.normalize();
		this.rotationTarget.setRotationFromQuaternion(this.curQuaternion);

		this.rotateEndPoint = this.rotateStartPoint;
  };
  
  rotateMatrix(rotateStart, rotateEnd) {
		var axis = new THREE.Vector3(),
			quaternion = new THREE.Quaternion();

		var angle = Math.acos(rotateStart.dot(rotateEnd) / rotateStart.length() / rotateEnd.length());

		if (angle)
		{
			axis.crossVectors(rotateStart, rotateEnd).normalize();
			angle *= this.rotationSpeed;
			quaternion.setFromAxisAngle(axis, angle);
		}
		return quaternion;
	}
	
	projectOnTrackball(touchX, touchY)
	{
		var mouseOnBall = new THREE.Vector3();

		mouseOnBall.set(
			this.clamp(touchX / this.windowHalfX, -1, 1), this.clamp(-touchY / this.windowHalfY, -1, 1),
			0.0
		);

		var length = mouseOnBall.length();

		if (length > 1.0)
		{
			mouseOnBall.normalize();
		}
		else
		{
			mouseOnBall.z = Math.sqrt(1.0 - length * length);
		}

		return mouseOnBall;
  }
  
  clamp(value, min, max)
	{
		return Math.min(Math.max(value, min), max);
	}
}


export class Zoomer {
  zoomTarget;

  eventCache = [];
  prevDiff;

  constructor(zoomTarget) {
    this.zoomTarget = zoomTarget;
	}
	
	get canZoom() {
		// console.log("zoom: is zooming", this.eventCache.length > 1);
		return this.eventCache.length > 1;
	}

	get hasEvents() {
		return this.eventCache.length > 0;
	}

  startZoom(event) {
    // This event is cached to support 2-finger gestures
		this.eventCache.push(event);
		// console.log("zoom: pushed event", event.pointerId, this.eventCache.length);
  };

  zoom(event) {
    // Find this event in the cache and update its record with this event
    for (var i = 0; i < this.eventCache.length; i++) {
      if (event.pointerId == this.eventCache[i].pointerId) {
        this.eventCache[i] = event;
        break;
      }
    }

    // If two pointers are down, check for pinch gestures
    if (this.eventCache.length == 2) {
      // Calculate the distance between the two pointers
			const curXDiff = Math.abs(this.eventCache[0].pageX - this.eventCache[1].pageX);
			const curYDiff = Math.abs(this.eventCache[0].pageY - this.eventCache[1].pageY);
			const curDiff = Math.max(curXDiff, curYDiff);
			// console.log("zoomer: pinch diff", curDiff, this.prevDiff);

      if (this.prevDiff > 0) {
        if (curDiff > this.prevDiff) {
          // The distance between the two pointers has increased
          this.zoomTarget.scale.x = this.zoomTarget.scale.x * 1.01;
          this.zoomTarget.scale.y = this.zoomTarget.scale.y * 1.01;
					this.zoomTarget.scale.z = this.zoomTarget.scale.z * 1.01;
					// console.log("zoomer: zooming in", this.zoomTarget.scale);
        }
        if (curDiff < this.prevDiff) {
          // The distance between the two pointers has decreased
          this.zoomTarget.scale.x = this.zoomTarget.scale.x * 0.99;
          this.zoomTarget.scale.y = this.zoomTarget.scale.y * 0.99;
					this.zoomTarget.scale.z = this.zoomTarget.scale.z * 0.99;
					// console.log("zoomer: zooming out", this.zoomTarget.scale);
        }
      }

      // Cache the distance for the next move event 
      this.prevDiff = curDiff;
    }
  };

  stop(event) {
    // Remove this pointer from the cache and reset the target's
    this.remove_event(event);

    // If the number of pointers down is less than two then reset diff tracker
    if (this.eventCache.length < 2) {
      this.prevDiff = -1;
    }
  }

  remove_event(event) {
		// console.log("zoomer: find to remove", event.pointerId);
    // Remove this event from the target's cache
    for (var i = 0; i < this.eventCache.length; i++) {
      if (this.eventCache[i].pointerId == event.pointerId) {
				this.eventCache.splice(i, 1);
				// console.log("zoomer: removed", event.pointerId);
        break;
      }
    }
   }
}