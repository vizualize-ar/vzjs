import { Product, SizeUnit } from '../embed/product-model'
import { ModelType } from '../lib/model-type'
import { PlaneDirection } from '../lib/plane-direction'
import { rest } from 'msw'

export const handlers = [
  rest.get(`${process.env.apiUrl}/p/products/3936965361731`, (req: any, res: any, ctx: any) => {
    const product: Product = {
      external_product_id: "3936965361731",
      name: "Poetic Justice",
      width: 32,
      height: 24,
      unit: SizeUnit.Inch,
      resource_url: "",
      model_direction: PlaneDirection.vertical,
      models: [
        {
          fullpath: "https://trdevmedia.blob.core.windows.net/business-product-media/1/30/Poetic Justic - 30x40 - 3936965361731-1011-f08db.jpg", 
          model_type: ModelType.image, 
          thumbpath: "https://trdevmedia.blob.core.windows.net/business-product-media/1/30/Poetic Justic - 30x40 - 3936965361731-1011-t6663.jpg"
        }, 
        {
          fullpath: "https://trdevmedia.blob.core.windows.net/business-product-media/1/30/tupac-9833.usdz1/30/Poetic Justic - 30x40 - 3936965361731-1011-f7ec.gltf", 
          model_type: ModelType.gltf, 
          thumbpath: null
        }, 
        {
          fullpath: "https://trdevmedia.blob.core.windows.net/business-product-media/1/30/tupac-9833.usdz", 
          model_type: ModelType.usd, 
          thumbpath: null
        }
      ],
      aspect_ratio: undefined,
      usdModel: undefined,
    };
    return res(
      ctx.json(product)
    )
  }),
]