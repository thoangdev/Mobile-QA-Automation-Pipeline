import HomeScreen from '../../screens/HomeScreen';
import CheckoutScreen from '../../screens/CheckoutScreen';
import ProductScreen from '../../screens/ProductScreen';
import { resetApp, loginAs } from '../../helpers';
import { snapshot, Snapshots } from '../../../percy/snapshots';

describe('@smoke Checkout', () => {
  before(async () => {
    await resetApp();
    await loginAs();
  });

  it('should add an item to the cart', async () => {
    await ProductScreen.tapFirstItem();
    await ProductScreen.addToCart();
    const count = await HomeScreen.getCartBadgeCount();
    expect(count).toBeGreaterThan(0);
  });

  it('should proceed through the checkout flow', async () => {
    await HomeScreen.openCart();
    await CheckoutScreen.waitForLoad();
    await snapshot(Snapshots.CHECKOUT_CART);
    await CheckoutScreen.proceedToPayment();
  });

  it('should display an order confirmation after checkout', async () => {
    await CheckoutScreen.confirmOrder();
    expect(await CheckoutScreen.isConfirmationDisplayed()).toBe(true);
    await snapshot(Snapshots.CHECKOUT_CONFIRM);
    const orderId = await CheckoutScreen.getOrderId();
    expect(orderId).toMatch(/^ORD-\d+$/); // PLACEHOLDER: adjust pattern to your app
  });

  it('should reach the checkout screen via deep link', async () => {
    await resetApp();
    await loginAs();
    await driver.execute('mobile: deepLink', {
      url: 'yourapp://checkout', // PLACEHOLDER: replace with your app's deep link scheme
      package: 'com.your.app',  // PLACEHOLDER: Android only — remove for iOS
    });
    await CheckoutScreen.waitForLoad();
    expect(await CheckoutScreen.isDisplayed()).toBe(true);
  });
});
