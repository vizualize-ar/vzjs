import { ModelLoader, ModelOptions, ModelType, LoaderOptions } from "../../ModelLoader";
new ModelLoader(
  new ModelOptions('./models/lamp1/lamp5.gltf', ModelType.GTLF),
  new LoaderOptions(true, true, true),
);