import { ModelLoader, ModelOptions, ModelType, LoaderOptions } from "../../ModelLoader";
new ModelLoader(
  new ModelOptions('./models/lamp1/lamp5.gltf', ModelType.gltf),
  new LoaderOptions(true, true, true),
);