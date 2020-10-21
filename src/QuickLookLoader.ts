import { Product } from "embed/product-model";

export class QuickLookLoader {
  triggers: NodeListOf<HTMLElement>;
  addCartElement: HTMLElement = null;

  constructor() {
    this.triggers = document.querySelectorAll<HTMLElement>('[data-vzid="ar-trigger"]');
    this.addCartElement = document.querySelector<HTMLElement>('[data-vzid="add-cart"]');
  }

  load(product: Product): void {
    if (!this.triggers) return;

    const usdModel = product.usdModel;
    if (!usdModel) return;

    let url = usdModel.fullpath;
    url += `#checkoutTitle=${encodeURIComponent(product.name)}&callToAction=Add%20to%20cart&checkoutSubtitle=${encodeURIComponent(product.name)}`;

    this.triggers.forEach((trigger) => {
      trigger.setAttribute("rel", "ar");
      trigger.setAttribute("href", url);
      trigger.style.display = '';

      trigger.addEventListener("message", function (event: MessageEvent) {
        if (event.data == "_apple_ar_quicklook_button_tapped") {
          // shopify form
          const productForm = document.querySelector<HTMLFormElement>('[id^=product_form]');
          if (productForm) {
            productForm.submit();
          }
        }
      }, false);
    });
  }
}