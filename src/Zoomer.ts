import * as THREE from "three";

export default class Zoomer {
  zoomTarget: THREE.Object3D;

  eventCache: PointerEvent[] = [];
  prevDiff: number;

  constructor(zoomTarget: THREE.Object3D) {
    this.zoomTarget = zoomTarget;
	}
	
  /**
   * Can zoom if there's more than 1 pointer event now.
   */
  get canZoom() {
		// console.log("zoom: is zooming", this.eventCache.length > 1);
		return this.eventCache.length > 1;
	}

	get hasEvents() {
		return this.eventCache.length > 0;
	}

  startZoom(event: PointerEvent) {
    // This event is cached to support 2-finger gestures
		this.eventCache.push(event);
		// console.log("zoom: pushed event", event.pointerId, this.eventCache.length);
  };

  zoom(event: PointerEvent) {
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

  stop(event: PointerEvent) {
    // Remove this pointer from the cache and reset the target's
    this.remove_event(event);

    // If the number of pointers down is less than two then reset diff tracker
    if (this.eventCache.length < 2) {
      this.prevDiff = -1;
    }
  }

  remove_event(event: PointerEvent) {
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