import { ModelLoader, ModelOptions, ModelType, LoaderOptions } from "../../ModelLoader";
new ModelLoader(
  new ModelOptions('./models/simplyfitgreen.gltf', ModelType.GTLF),
  new LoaderOptions(true, true, true),
);