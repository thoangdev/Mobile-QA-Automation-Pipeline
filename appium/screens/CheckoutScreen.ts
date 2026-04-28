import { BasePage } from './BasePage';

// PLACEHOLDER selectors — replace '~*' accessibility IDs with real values from your app
class CheckoutScreen extends BasePage {
  private get cartList()            { return $('~checkout-cart-list'); }
  private get proceedButton()       { return $('~checkout-proceed-button'); }
  private get paymentForm()         { return $('~checkout-payment-form'); }
  private get confirmButton()       { return $('~checkout-confirm-button'); }
  private get confirmationMessage() { return $('~checkout-confirmation-message'); }
  private get orderIdLabel()        { return $('~checkout-order-id'); }

  protected get anchor()            { return this.cartList; }

  async proceedToPayment(): Promise<void> {
    await this.waitForLoad();
    await this.proceedButton.click();
  }

  /**
   * Confirms the order. PLACEHOLDER: fill in payment details before calling
   * if your app requires them (card number, billing address, etc.).
   */
  async confirmOrder(): Promise<void> {
    await this.paymentForm.waitForDisplayed();
    await this.confirmButton.click();
  }

  async isConfirmationDisplayed(): Promise<boolean> {
    try {
      await this.confirmationMessage.waitForDisplayed({ timeout: 10_000 });
      return this.confirmationMessage.isDisplayed();
    } catch {
      return false;
    }
  }

  async getOrderId(): Promise<string> {
    await this.orderIdLabel.waitForDisplayed({ timeout: 10_000 });
    return this.orderIdLabel.getText();
  }
}

export default new CheckoutScreen();
