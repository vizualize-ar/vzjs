import { ModelType } from "../../lib/model-type";
import { PlaneDirection } from "../../lib/plane-direction";
import { ModelLoader, ModelOptions, LoaderOptions } from "../../ModelLoader";
// 24" wide
new ModelLoader(
  new ModelOptions("./models/tupac.png", ModelType.image, 15, PlaneDirection.vertical, 1.33, 0.9144, 0.6096),
  new LoaderOptions(false, true, true),
)