import * as THREE from "three";

export default class Rotator {
  public static IsDefaultQuaternion(quaternion: THREE.Quaternion) {
    if (!quaternion) return false;
    return quaternion.x === 0 &&
        quaternion.y === 0 &&
        quaternion.z === 0;
  }

	rotateStartPoint = new THREE.Vector3(0, 0, 1);
  rotateEndPoint = new THREE.Vector3(0, 0, 1); 
  curQuaternion: THREE.Quaternion;
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

	rotationTarget: THREE.Object3D;

	constructor(rotationTarget: THREE.Object3D) {
		this.rotationTarget = rotationTarget;
		window.addEventListener('resize', this.onWindowResize, false);
	}

	onWindowResize = () => {
		this.windowHalfX = window.innerWidth / 2;
		this.windowHalfY = window.innerHeight / 2;
	}

	startRotation(event: PointerEvent) {
		this.startPoint = {
			x: event.pageX,
			y: event.pageY,
		};

		this.rotateStartPoint = this.rotateEndPoint = this.projectOnTrackball(0, 0);
	}

	rotate(event: PointerEvent) {
		this.deltaX = event.pageX - this.startPoint.x;
    this.deltaY = event.pageY - this.startPoint.y;

		this.handleRotation();

		this.startPoint.x = event.pageX;
		this.startPoint.y = event.pageY;
	}

	handleRotation() {
		this.rotateEndPoint = this.projectOnTrackball(this.deltaX, this.deltaY);

    var rotateQuaternion = this.rotateMatrix(this.rotateStartPoint, this.rotateEndPoint);
    if (Rotator.IsDefaultQuaternion(rotateQuaternion)) {
      return;
    }
		this.curQuaternion = this.rotationTarget.quaternion;
		this.curQuaternion.multiplyQuaternions(rotateQuaternion, this.curQuaternion);
		this.curQuaternion.normalize();
		this.rotationTarget.setRotationFromQuaternion(this.curQuaternion);

		this.rotateEndPoint = this.rotateStartPoint;
  };
  
  rotateMatrix(rotateStart: THREE.Vector3, rotateEnd: THREE.Vector3) {
		var axis = new THREE.Vector3(0, 0, 0),
			quaternion = new THREE.Quaternion(0, 0, 0, 0);

		var angle = Math.acos(rotateStart.dot(rotateEnd) / rotateStart.length() / rotateEnd.length());

		if (angle)
		{
			axis.crossVectors(rotateStart, rotateEnd).normalize();
			angle *= this.rotationSpeed;
			quaternion.setFromAxisAngle(axis, angle);
		} else {
      // console.log("Rotator.rotateMatrix: no angle", rotateStart, rotateEnd, quaternion)
    }
		return quaternion;
	}
	
	projectOnTrackball(touchX: number, touchY: number)
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
  
  clamp(value: number, min: number, max: number)
	{
		return Math.min(Math.max(value, min), max);
	}
}