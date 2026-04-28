import { BasePage } from './BasePage';

// PLACEHOLDER selectors — replace '~*' accessibility IDs with real values from your app
class ProductScreen extends BasePage {
  private get productList()     { return $('~product-list'); }
  private get productItems()    { return $$('~product-item'); }
  private get addToCartButton() { return $('~add-to-cart-button'); }
  private get productTitle()    { return $('~product-title'); }
  private get productPrice()    { return $('~product-price'); }

  protected get anchor()        { return this.productList; }

  async tapFirstItem(): Promise<void> {
    await this.waitForLoad();
    const items = await this.productItems;
    await items[0].click();
  }

  async addToCart(): Promise<void> {
    await this.addToCartButton.waitForDisplayed();
    await this.addToCartButton.click();
  }

  async getTitle(): Promise<string> {
    await this.productTitle.waitForDisplayed();
    return this.productTitle.getText();
  }

  async getPrice(): Promise<string> {
    await this.productPrice.waitForDisplayed();
    return this.productPrice.getText();
  }
}

export default new ProductScreen();
