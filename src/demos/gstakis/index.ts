import { ModelLoader, ModelOptions, ModelType, ModelDimension, PlaneDirection, LoaderOptions } from "../../ModelLoader";
// 24" wide
new ModelLoader(
  new ModelOptions("./models/tupac.png", ModelType.PNG, ModelDimension.three_d, 15, PlaneDirection.vertical, 1.33, 0.9144, 0.6096),
  new LoaderOptions(false, true, true),
);