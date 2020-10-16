import { ModelLoader, ModelOptions, ModelType, PlaneDirection, LoaderOptions } from "../../ModelLoader";
// 24" wide
new ModelLoader(
  new ModelOptions("./models/tupac.png", ModelType.png, 15, PlaneDirection.vertical, 1.33, 0.9144, 0.6096),
  new LoaderOptions(false, true, true),
);