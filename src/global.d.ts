import { VzConfig } from "./embed/vzconfig";

declare global {
  interface Window {
    vz_config: VzConfig;
    vza_commands: string[];
    vza: () => void;
  }

  // namespace NodeJS {
  //   interface ProcessEnv {
  //     apiUrl: string;
  //   }
  // }
}

declare namespace NodeJS {
  // @ts-ignore
  export interface ProcessEnv {
    apiUrl: string;
  }
}

// declare var window: Window;
// declare module "three-dat.gui";

declare module dat {
  export interface GUI {
    addFog(name: string, light: THREE.Fog): void;
    addFogExp2(name: string, light: THREE.FogExp2): void;
    addLight(name: string, light: THREE.Light): void;
    addMaterial(name: string, material: THREE.Material): void;
    addMesh(name: string, mesh: THREE.Mesh): void;
    addObject3D(name: string, mesh: THREE.Object3D): void;
    addScene(name: string, scene: THREE.Scene): void;
    addVector(name: string, vector: THREE.Vector): void;
  }
}