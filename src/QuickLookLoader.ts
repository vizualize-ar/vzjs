import { Product } from "embed/product-model";

export class QuickLookLoader {
  // trigger: HTMLElement;
  addCartElement: HTMLElement = null;

  constructor(private trigger: HTMLElement) {
    // this.triggers = document.querySelectorAll<HTMLElement>('[data-vzid="ar-trigger"]');
    this.addCartElement = document.querySelector<HTMLElement>('[data-vzid="add-cart"]');
  }

  load(product: Product): void {
    if (!this.trigger) return;

    const usdModel = product.usdModel;
    if (!usdModel) return;

    let url = usdModel.fullpath;
    url += `#checkoutTitle=${encodeURIComponent(product.name)}&callToAction=Add%20to%20cart&checkoutSubtitle=${encodeURIComponent(product.name)}`;

    this.trigger.setAttribute("rel", "ar");
    this.trigger.setAttribute("href", url);
    this.trigger.style.display = '';

    this.trigger.addEventListener("message", function (event: MessageEvent) {
      if (event.data == "_apple_ar_quicklook_button_tapped") {
        // shopify form
        const productForm = document.querySelector<HTMLFormElement>('[id^=product_form]');
        if (productForm) {
          productForm.submit();
        }
      }
    }, false);
  }
}