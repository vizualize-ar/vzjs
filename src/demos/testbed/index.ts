import { PlaneDirection } from "../../lib/plane-direction";
import { ModelType } from "../../lib/model-type";
import { ModelLoader, ModelOptions, LoaderOptions } from "../../ModelLoader";
new ModelLoader(
  document.querySelector<HTMLElement>('[data-vzid="ar-trigger"]'),
  new ModelOptions('./models/chair.fbx', ModelType.fbx, null, PlaneDirection.horizontal),
  new LoaderOptions(true, true, true),
);