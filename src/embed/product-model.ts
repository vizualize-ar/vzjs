import { ModelType } from "../lib/model-type";
import { PlaneDirection } from "../lib/plane-direction";

/** Inch to meter conversion factor */
const METER_FACTOR = 0.0254;
export class Product {
  public external_product_id: string;
  public name: string;
  public width?: number;
  public height: number;
  public unit: SizeUnit;
  public resource_url: string;
  public aspect_ratio: number;
  // public model_type: ModelType;
  public model_direction: PlaneDirection;
  public models: ProductModel[];
  public frame: ProductFrame;

  constructor(data: Product) {
    this.external_product_id = data.external_product_id;
    this.name = data.name;
    this.width = data.width;
    this.height = data.height;
    this.unit = data.unit;
    this.resource_url = data.resource_url;
    // this.model_type = data.model_type;
    this.model_direction = data.model_direction;
    this.models = data.models;
    this.frame = data.frame;

    if (this.unit === SizeUnit.Inch) {
      this.width = this.width * METER_FACTOR;
      this.height = this.height * METER_FACTOR;
      this.unit = SizeUnit.Centimeter;
    } else {
      // unit is in cm but we need to convert to meters
      this.width = Math.trunc(this.width / 100);
      this.height = Math.trunc(this.height / 100);
    }
    this.aspect_ratio = this.width / this.height;
  }

  get usdModel(): ProductModel {
    if (!this.models) return null;
    return this.models.find(x => x.model_type === ModelType.usd);
  }
}

export type ProductModel = {
  fullpath: string;
  thumbpath: string;
  model_type: ModelType;
}

export type ProductFrame = {
  fullpath: string;
  textures: Array<{
    name: string;
    path: string;
  }>;
}

export enum SizeUnit {
  Inch = "in",
  Centimeter = "cm",
}