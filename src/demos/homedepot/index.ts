import { ModelType } from "../../lib/model-type";
import { PlaneDirection } from "../../lib/plane-direction";
import { ModelLoader, ModelOptions, LoaderOptions } from "../../ModelLoader";
// 24" wide
new ModelLoader(
  document.querySelector<HTMLElement>('[data-vzid="ar-trigger"]'),
  new ModelOptions("./models/chair.fbx", ModelType.fbx, 320, PlaneDirection.horizontal),
  new LoaderOptions(true, true, true),
)