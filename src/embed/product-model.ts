/** Inch to meter conversion factor */
const METER_FACTOR = 0.0254;
export class ProductModel {
  public external_product_id: string;
  public name: string;
  public width?: number;
  public height: number;
  public unit: SizeUnit;
  public resource_url: string;
  public aspect_ratio: number;

  constructor(data: ProductModel) {
    this.external_product_id = data.external_product_id;
    this.name = data.name;
    this.width = data.width;
    this.height = data.height;
    this.unit = data.unit;
    this.resource_url = data.resource_url;

    if (this.unit === SizeUnit.Inch) {
      this.width = this.width * METER_FACTOR;
      this.height = this.height * METER_FACTOR;
      this.unit = SizeUnit.Centimeter;
    }
    this.aspect_ratio = this.width / this.height;
  }
}

export enum SizeUnit {
  Inch = 0,
  Centimeter = 1,
}