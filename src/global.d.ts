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
  export interface ProcessEnv {
    apiUrl: string;
  }
}
