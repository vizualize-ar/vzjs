/* eslint-disable @typescript-eslint/no-var-requires */
import { VzConfig } from "./vzconfig";
import { ModelType } from "../lib/model-type";
import { PlaneDirection } from "../lib/plane-direction";
import { ModelOptions, ModelLoader, LoaderOptions } from "../ModelLoader";
import { Product } from "./product-model";
// import WebXRPolyfill from 'webxr-polyfill';
import * as checks from './checks';
import { QuickLookLoader } from "../QuickLookLoader";
import Analytics from "./analytics/vizualize-analytics";
import { Order } from "./analytics/order";

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
<div style="position:absolute; bottom: 10px; left: 10px;">
  <a href="https://vizualize.io" target="_blank">
    <img width="24" height="24" src="data:image/png;base64,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" />
  </a>
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
      if (!this.config.api_key) {
        return; // not configured correctly
      }
      this.P1_createGlobal();
      const trigger = document.querySelector<HTMLElement>('[data-vzid="ar-trigger"]');
      if (this.config.identifier) {
        if (await this.isARSupported()) {
          const customerApiKey = this.config.api_key;

          if ((customerApiKey || "") == "") {
            console.error(
              "Vizualize: Missing API key. Please refer to the documentation for proper usage."
            );
            return;
          }

          if (await this.P1_createModelLoader(trigger, this.config.identifier)) {
            this.P1_createOverlay();
          }
        } else if (checks.IS_AR_QUICKLOOK_CANDIDATE) {
          this.createQuickLook(trigger, this.config.identifier);
        }
      } else {
        // single item not configured, look for a gallery/list of products
        this.initList();
      }
    } catch (e) {
      console.error('VZ embed error', e);
    }
  }

  /** Searches for a list of images that have a data-vz-id attribute */
  async initList(): Promise<void> {
    const isARSupported = this.isARSupported();
    const arTargets = document.querySelectorAll<HTMLElement>('[data-vz-product-id]');
    arTargets.forEach((trigger) => {
      const productId = trigger.dataset.vzProductId;
      if (isARSupported) {
        this.P1_createModelLoader(trigger, productId);
      } else if (checks.IS_AR_QUICKLOOK_CANDIDATE) {
        this.createQuickLook(trigger, productId);
      }
    });
    this.P1_createOverlay();
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

  async createQuickLook(trigger: HTMLElement, productId: string): Promise<boolean> {
    console.log('creating quicklook')
    const product = await this.loadProduct(productId);
    if (!product) return false;

    const loader = new QuickLookLoader(trigger);
    loader.load(product); 
  }

  async P1_createModelLoader(trigger: HTMLElement, productId: string): Promise<boolean> {
    // fetch data from API
    const product = await this.loadProduct(productId);
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
      trigger,
      modelOptions,
      new LoaderOptions(false, true, true),
    );
    return true;
  }

  async loadProduct(productId: string): Promise<Product> {
    try {
      const requestInit: RequestInit = {
        headers: {
          Authorization: `Bearer ${this.config.api_key}`
        }
      }
      const url = `${this.apiUrl}/p/products/${productId}`;
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
    const handle: any = setInterval(() => this.drainQueue(handle), 100);
  }

  drainQueue(handle: any) {
    if (window.vza_commands.length > 0) {
      clearInterval(handle);

      const api = new Analytics(this.config.api_key);
      while (window.vza_commands.length > 0) {
        const args = window.vza_commands.shift();
        switch (args[0]) {
          case "send_order":
            api.sendOrder(args[1] as unknown as Order);
            break;
          default:
            console.warn("Invalid command for Vizualize Analytics", args[0]);
        }
      }

      handle =  setInterval(() => this.drainQueue(handle), 100);
    }
  }

  async logDebugInfo() {
    const isQuickLook = checks.IS_AR_QUICKLOOK_CANDIDATE;
    const isARSupported = await this.isARSupported();
    const hasConfig = window.vz_config && !!window.vz_config.api_key && !!window.vz_config.identifier;
    console.log("vzdbg", hasConfig, isQuickLook, isARSupported);
  }
}

export default new Embed();