import * as THREE from "three";
import { Util } from "./Util";

const PAN_THRESHOLD = 50;

export default class Panner {
  panTarget: THREE.Object3D;
  /** Primary touch events, for rotating or start of pinch/pan */
  touch1Events: PointerEvent[] = [];
  /** Secondary touch events, for pinch/pan */
  touch2Events: PointerEvent[] = [];

  constructor(zoomTarget: THREE.Object3D) {
    this.panTarget = zoomTarget;
	}
	
  get isPan(): boolean {
    if (this.touch1Events.length > 0 && this.touch2Events.length > 0) {
      const deltaFirst = Util.PointerDelta(this.touch1Events[0], this.touch2Events[0]);
      const deltaLast = Util.PointerDelta(this.touch1Events[this.touch1Events.length -1 ], this.touch2Events[this.touch2Events.length - 1]);
      const delta = Math.abs(deltaFirst - deltaLast);
      const isPan = delta <= PAN_THRESHOLD;
      // console.log("pan delta", deltaFirst, deltaLast, new Date().getTime());
      return isPan;
    }
    return false;
  }
  
  onPointerEvent(event: PointerEvent) {
    if (event.isPrimary) {
      this.touch1Events.push(event);
    } else {
      this.touch2Events.push(event);
    }
    if (this.touch1Events.length > 10) {
      this.touch1Events.shift();
    }
    if (this.touch2Events.length > 10) {
      this.touch2Events.shift();
    }
  };

  pan(event: PointerEvent) {
    // If two pointers are down, check for pan gesture
    if (this.touch1Events.length > 1 && this.touch2Events.length > 1) {
      // Calculate the distance between the two pointers
			const curXDiff = this.touch1Events[this.touch1Events.length - 1].pageX - this.touch1Events[0].pageX;
      const curYDiff = this.touch1Events[this.touch1Events.length - 1].pageY - this.touch1Events[0].pageY;
      
      const deltaX = (curXDiff / window.innerWidth) * 0.3;
      const deltaY = (curYDiff / window.innerHeight) * 0.3;

      // this.panTarget.position.x += deltaX;
      // this.panTarget.position.y += deltaY;

      if (deltaX > 0) {
        this.panTarget.position.x += deltaX;
      } else if (deltaX < 0) {
        this.panTarget.position.x -= Math.abs(deltaX);
      }
      if (deltaY > 0) {
        this.panTarget.position.y -= deltaY;
      } else if (deltaY < 0) {
        this.panTarget.position.y += Math.abs(deltaY);
      }
      console.log("panTarget", deltaX, deltaY, curXDiff, curYDiff);
      // console.log("panTarget yN, y0, diffX, diffZ", this.touch1Events[this.touch1Events.length - 1].pageY, this.touch1Events[0].pageY, curXDiff, curZDiff);

      // this.panTarget.position.y -= this.panTarget.position.y * deltaY;
      // if (curXDiff > 0) {
      //   console.log("right");
      //   // this.panTarget.position.x = this.panTarget.position.x * 1.01;
      //   this.panTarget.translateX(0.01);
      // }
      // if (curXDiff < 0) {
      //   console.log("left");
      //   // this.panTarget.position.x = this.panTarget.position.x * 0.99;
      //   this.panTarget.translateX(-0.01);
      // }
      // if (curYDiff > 0) {
      //   console.log("up");
      //   // this.panTarget.position.y = this.panTarget.position.y * 1.01;
      //   this.panTarget.translateY(0.01);
      // }
      // if (curYDiff < 0) {
      //   console.log("down");
      //   // this.panTarget.position.y = this.panTarget.position.y * 0.99;
      //   this.panTarget.translateY(-0.01);
      // }
    }
  };

  startPan(event: PointerEvent) {
    this.touch1Events = [event];
    this.touch2Events = [];
  }

  stop() {
    this.touch1Events = [];
    this.touch2Events = [];
  }
}