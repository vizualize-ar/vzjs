import { ModelType } from "../../lib/model-type";
import { ModelLoader, ModelOptions, LoaderOptions } from "../../ModelLoader";
new ModelLoader(
  document.querySelector<HTMLElement>('[data-vzid="ar-trigger"]'),
  new ModelOptions('./models/simplyfitgreen.gltf', ModelType.gltf),
  new LoaderOptions(true, true, true),
);