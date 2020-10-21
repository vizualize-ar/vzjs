/* eslint-disable @typescript-eslint/no-var-requires */
import { VzConfig } from "./vzconfig";
import { ModelType } from "../lib/model-type";
import { PlaneDirection } from "../lib/plane-direction";
import { ModelOptions, ModelLoader, LoaderOptions } from "../ModelLoader";
import { Product } from "./product-model";
// import WebXRPolyfill from 'webxr-polyfill';
import * as checks from './checks';
import { QuickLookLoader } from "../QuickLookLoader";

// const polyfill = new WebXRPolyfill();

// move-gesture svg comes from "movegesture" folder
const OVERLAY =
`<div data-vzid="ol" style="display: none;">
<div data-vzid="controls" style="width:100vw; height:100vh; position: absolute; bottom: 0px; left: 0px;">
</div>
<div data-vzid="exit" style="position:absolute; right: 20px; top: 20px; width: 50px; height: 50px; line-height: 50px; text-align: center; color: #fff; background: #666; opacity: 0.4; border-radius: 25px; font-weight: bold; font-size: 20px;">
  X
</div>
<div data-vzid="add-cart" style="position:absolute; right: 20px; bottom: 20px; width: 120px; height: 50px; line-height: 50px; text-align: center; color: #fff; background: #333; opacity: 0.5; border-radius: 3px;">
  Add to Cart
</div>
<div data-vzid="position-message" style="position:absolute; right: 20px; bottom: 200px; width: calc(100vw - 40px); height: 50px; line-height: 50px; text-align: center; color: #fff; background: #666; opacity: 0.4; border-radius: 3px; display: none;">
  Tap to place
</div>
<div data-vzid="move-gesture">
  <svg data-vzid="gesture" viewBox="0 0 300 250" xml:space="preserve">
  <g data-vzid="phone" transform="translate(75 50) scale(.5)">
    <path  d="M212.1 23.1H90.2c-4.8 0-8.8 3.9-8.8 8.8v236.4c0 4.8 3.9 8.8 8.8 8.8h121.9c4.8 0 8.8-3.9 8.8-8.8V31.8c0-4.8-4-8.7-8.8-8.7zm0 8.5c.1 0 .2.1.2.2v28.4H90.2V31.6h121.9zM90 268.2l.2-200.6h122.1l-.2 200.8-122.1-.2z"/>
    <circle cx="151.1" cy="248.2" r="8.8"/>
    <path d="M142 49.5h18.3c2.3 0 4.1-1.8 4.1-4.1s-1.8-4.1-4.1-4.1H142c-2.3 0-4.1 1.8-4.1 4.1s1.8 4.1 4.1 4.1z"/>
  </g>
  <path data-vzid="infinity" transform="translate(150 125) scale(.5)" d="M0 0 A 120 120 0 0 1 240 0 A 120 120 0 0 1 0 0 A 120 120 0 0 0 -240 0 A 120 120 0 0 0 0 0"  pathLength="100"/>
  <circle data-vzid="pointer" cx="150" cy="125" r="6"/>
  </svg>
</div>
<style type="text/css">
[data-vzid=move-gesture] {
  position: absolute;
  z-index: 1000;
  top: calc(50vh - 58.8235294118px);
  left: calc(50vw - 100px);
}

[data-vzid=gesture] {
  width: 200px;
  height: 142.8571428571px;
}

[data-vzid=pointer] {
  fill: #fff;
  animation: line-orbit 4s linear infinite;
  opacity: 0;
  offset-path: path("M0 0 A 60 60 0 0 1 120 0 A 60 60 0 0 1 0 0 A 60 60 0 0 0 -120 0 A 60 60 0 0 0 0 0");
  offset-rotate: 0deg;
  offset-distance: 2;
  will-change: transform, opacity;
}

[data-vzid=phone] {
  fill: #fff;
  animation: phone-orbit 4s linear infinite;
  opacity: 0;
  offset-path: path("M0 0 A 60 60 0 0 1 120 0 A 60 60 0 0 1 0 0 A 60 60 0 0 0 -120 0 A 60 60 0 0 0 0 0");
  offset-rotate: 0deg;
  offset-distance: 2;
  will-change: transform, opacity;
}

@keyframes phone-orbit {
  0% {
    opacity: 1;
    offset-distance: 0%;
  }
  100% {
    opacity: 1;
    offset-distance: 100%;
  }
}
[data-vzid=infinity] {
  fill: none;
  stroke-width: 20;
  stroke: white;
  animation-fill-mode: forwards;
  stroke-dasharray: 100;
  stroke-dashoffset: 100;
  opacity: 0;
  animation: infinity-fill 4s linear infinite;
}

@keyframes infinity-fill {
  0% {
    stroke-dashoffset: 100;
    opacity: 0.1;
  }
  100% {
    stroke-dashoffset: 0;
  }
  95% {
    opacity: 0.1;
    stroke-width: 10;
  }
}
@keyframes phone-orbit {
  0% {
    opacity: 1;
    offset-distance: 0%;
  }
  100% {
    opacity: 1;
    offset-distance: 100%;
  }
}
@keyframes line-orbit {
  0% {
    opacity: 0.1;
    offset-distance: 0%;
  }
  100% {
    opacity: 0.1;
    offset-distance: 100%;
  }
}
</style>
</div>`;

class Embed {
  
  private config: VzConfig;
  private apiUrl = process.env.apiUrl;

  constructor() {
    this.P1_init();
  }

  async P1_init(): Promise<void> {
    try {
      this.logDebugInfo();
      // Get config from window object created from product page
      this.config = window.vz_config;
      if (!this.config.apiKey || !this.config.identifier) return; // not configured correctly
      if (await this.isARSupported()) {
        const customerApiKey = this.config.apiKey;

        if ((customerApiKey || "") == "") {
          console.error(
            "Vizualize: Missing API key. Please refer to the documentation for proper usage."
          );
          return;
        }

        // this.createGlobal();
        if (await this.P1_createModelLoader()) {
          this.P1_createOverlay();
        }
      } else if (checks.IS_AR_QUICKLOOK_CANDIDATE) {
        this.createQuickLook();
      }
    } catch (e) {
      console.error('VZ embed error', e);
    }
  }

  async isARSupported(): Promise<boolean> {
    // Check to see if the UA can support an AR sessions.
    try {
      const isSupported = await navigator.xr.isSessionSupported('immersive-ar');
      return isSupported && await checks.IS_WEBXR_AR_CANDIDATE;
    } catch {
      return false;
    }
  }

  async createQuickLook(): Promise<boolean> {
    console.log('creating quicklook')
    const product = await this.loadProduct();
    if (!product) return false;

    const loader = new QuickLookLoader();
    loader.load(product); 
  }

  async P1_createModelLoader(): Promise<boolean> {
    // fetch data from API
    const product = await this.loadProduct();
    if (!product) return false;

    const model = product.model_direction === PlaneDirection.vertical
      ? product.models.find(x => x.model_type === ModelType.image)
      : product.models.find(x => x.model_type !== ModelType.image);

    // for now, test with
    const modelOptions = new ModelOptions(
      model.fullpath,
      model.model_type,
      15,
      PlaneDirection.vertical,
      product.aspect_ratio,
      product.width,
      product.height,
    );
    new ModelLoader(
      modelOptions,
      new LoaderOptions(false, true, true),
    );
    return true;
  }

  async loadProduct(): Promise<Product> {
    try {
      const requestInit: RequestInit = {
        headers: {
          Authorization: `Bearer ${this.config.apiKey}`
        }
      }
      const url = `${this.apiUrl}/p/products/${this.config.identifier}`;
      console.log('loading product', url)
      const input: RequestInfo = new Request(url, requestInit);
      const response = await fetch(input);
      const product = new Product(await response.json());
      return product;
    } catch (e) {
      console.error('Unable to load product', e);
      return null;
    }
  }

  P1_createOverlay() {
    const overlay = document.createElement('div');
    overlay.innerHTML = OVERLAY;
    document.body.prepend(overlay);
  }

  P1_createGlobal(): void {
    window.vza_commands = window.vza_commands || [];
    window.vza =
      window.vza ||
      function () {
        // eslint-disable-next-line prefer-rest-params
        window.vza_commands.push(...arguments);
      };

    // Queue logic
    let handle = setInterval(drainQueue, 100);
    function drainQueue() {
      if (window.vza_commands.length > 0) {
        clearInterval(handle);

        const api = require("./vizualize-analytics")(this.config.apiKey);
        while (window.vza_commands.length > 0) {
          const args = window.vza_commands.shift();
          switch (args[0]) {
            case "send_order":
              api.sendOrder(args[1]);
              break;
            default:
              console.warn("Invalid command for Vizualize Analytics", args[0]);
          }
        }

        handle = setInterval(drainQueue, 100);
      }
    }
  }

  async logDebugInfo() {
    const isQuickLook = checks.IS_AR_QUICKLOOK_CANDIDATE;
    const isARSupported = await this.isARSupported();
    const hasConfig = window.vz_config && !!window.vz_config.apiKey && !!window.vz_config.identifier;
    console.log("vzdbg", hasConfig, isQuickLook, isARSupported);
  }
}

export default new Embed();