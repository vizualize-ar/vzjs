import * as THREE from "three";
import { Rotator } from "./Rotator";

export class Rotator2D implements Rotator {
  rotationTarget: THREE.Object3D;
  /** Max rotation allowed, in radians */
  maxDelta = Math.PI / 2;

  startPoint = {
    x: 0,
    y: 0,
  };
  deltaX = 0;
  deltaY = 0;
  rotateStartPoint = new THREE.Vector3(0, 0, 1);
  rotateEndPoint = new THREE.Vector3(0, 0, 1);
  
  xVector = new THREE.Vector3(1, 0, 0);
  yVector = new THREE.Vector3(0, 1, 0);
  zVector = new THREE.Vector3(0, 0, 1);

  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;

  constructor(rotationTarget: THREE.Object3D, maxDegrees: number) {
    this.rotationTarget = rotationTarget;
    if (maxDegrees > 0) {
      // conver to radians
      this.maxDelta = (maxDegrees * (Math.PI / 180));
    }
  }

  startRotation(event: PointerEvent): void {
    this.startPoint = {
      x: event.pageX,
      y: event.pageY,
    };

    this.rotateStartPoint = this.rotateEndPoint = this.projectOnTrackball(0, 0);
  }

  rotate(event: PointerEvent): void {
    this.deltaX = event.pageX - this.startPoint.x;
    this.deltaY = event.pageY - this.startPoint.y;

    this.handleRotation();

    this.startPoint.x = event.pageX;
    this.startPoint.y = event.pageY;
  }

  handleRotation() {
    // this.rotateEndPoint = this.projectOnTrackball(this.deltaX, this.deltaY);
    // var angle = Math.acos(
    //   this.rotateStartPoint.dot(this.rotateEndPoint) / this.rotateStartPoint.length() / this.rotateEndPoint.length()
    // );
    var angle = THREE.MathUtils.degToRad(10);
    this.rotationTarget.rotateOnAxis(this.zVector, angle);
  }

  projectOnTrackball(touchX: number, touchY: number): THREE.Vector3 {
    var mouseOnBall = new THREE.Vector3();

    mouseOnBall.set(
      this.clamp(touchX / this.windowHalfX, -1, 1),
      this.clamp(-touchY / this.windowHalfY, -1, 1),
      0.0
    );

    var length = mouseOnBall.length();

    if (length > 1.0) {
      mouseOnBall.normalize();
    } else {
      mouseOnBall.z = Math.sqrt(1.0 - length * length);
    }

    return mouseOnBall;
  }

  clamp(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max);
  }
}