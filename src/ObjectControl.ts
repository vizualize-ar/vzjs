// This is incomplete. It was an experiment to use hammer.js instead of custom touch event code but hammer.min.js is 21KB so leaving that out for now.
// import * as THREE from "three";
// import * as Hammer from "hammerjs";
// import { ModelDimension } from "./ModelLoader";

// export class ObjectControlOptions {
//   constructor(
//     public zoom: boolean = true,
//     public rotate: boolean = true,
//     public dimension = ModelDimension.three_d
//   ) {}
// }

// export class ObjectControl {
//   touchTarget: HTMLElement;
//   targetObject: THREE.Object3D;
//   options: ObjectControlOptions;
//   hammer: HammerManager;

//   constructor(
//     touchTarget: HTMLElement,
//     targetObject: THREE.Object3D,
//     options: ObjectControlOptions
//   ) {
//     this.touchTarget = touchTarget;
//     this.targetObject = targetObject;
//     this.options = options;
//     this.hammer = new Hammer(this.touchTarget);

//     this.touchTarget.style.touchAction = "none"; // prevents weird browser issues
//   }
// }