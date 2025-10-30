'use client';

import { useState } from 'react';
import { useCart } from '@/hooks/useCart';
import { formatPrice } from '@/utils/formatters';


export default function Checkout() {
  const { cart } = useCart();
  const [step, setStep] = useState(1);
  const [shippingInfo, setShippingInfo] = useState({
    firstame: '',
    lastame: '',
    address: '',
    city: '',
    zipCode: '',
    country: '',
  });
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: '',
  });

  console.log('Cart at checkout:', cart);

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(3);
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    alert("Order placed successfully!");
    return;
    
    // For a side project, we'll just simulate payment processing
    console.log('Processing payment...');
    
    // ACT: Simulate API call; can we actually validate against Stripe?
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Create order (in a real app, this would send to your backend)
    const order = {
      items,
      total,
      shippingInfo,
      paymentInfo: { 
        cardNumber: paymentInfo.cardNumber.slice(-4), // Only store last 4 digits
      },
      orderDate: new Date().toISOString(),
      orderNumber: `ORD-${Math.floor(Math.random() * 1000000)}`,
    };
    
    // Store order in localStorage for this demo
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    // Clear cart and redirect to confirmation
    clearCart();
    router.push(`/order-confirmation?orderId=${order.orderNumber}`);
  };

  if (cart.items.length === 0) {
    return (
      <div className="container mx-auto py-10 px-4">
        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
        <p>Add some items to your cart before checking out.</p>
        <button 
          onClick={() => alert('go back')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  // ACT: set up google address autocomplete

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>
      
      {/* Progress indicator */}
      <div className="flex mb-8">
        <div className={`flex-1 text-center pb-2 ${step >= 1 ? 'border-b-2 border-blue-500 text-blue-500' : ''}`}>
          Review Cart
        </div>
        <div className={`flex-1 text-center pb-2 ${step >= 2 ? 'border-b-2 border-blue-500 text-blue-500' : ''}`}>
          Shipping
        </div>
        <div className={`flex-1 text-center pb-2 ${step >= 3 ? 'border-b-2 border-blue-500 text-blue-500' : ''}`}>
          Payment
        </div>
      </div>

      {step === 1 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Review Your Cart</h2>
          {cart.items.map(item => (
            <div key={item.product.id} className="flex items-center mb-4 p-4 border-b">
              {item.product.image && (
                <img src={item.product.image} alt={item.product.title} className="w-16 h-16 object-cover mr-4" />
              )}
              <div className="flex-1">
                <h3 className="font-medium">{item.product.title}</h3>
                <p className="text-gray-600">Qty: {item.quantity}</p>
              </div>
              <div className="font-medium">{formatPrice(item.product.price * item.quantity)}</div>
            </div>
          ))}
          
          <div className="flex justify-between text-lg font-bold mt-4">
            <span>Total:</span>
            <span>${cart.total.toFixed(2)}</span>
          </div>
          
          <button 
            onClick={() => setStep(2)}
            className="mt-6 w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Continue to Shipping
          </button>
        </div>
      )}

      {step === 2 && (
        <form onSubmit={handleShippingSubmit}>
          <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="mb-4">
              <label className="block mb-2">First Name</label>
              <input 
                type="text" 
                required
                value={shippingInfo.firstName}
                onChange={(e) => setShippingInfo({...shippingInfo, firstName: e.target.value})}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Last Name</label>
              <input 
                type="text" 
                required
                value={shippingInfo.lastName}
                onChange={(e) => setShippingInfo({...shippingInfo, lastName: e.target.value})}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block mb-2">Address</label>
            <input 
              type="text" 
              required
              value={shippingInfo.address}
              onChange={(e) => setShippingInfo({...shippingInfo, address: e.target.value})}
              className="w-full p-2 border rounded"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="mb-4">
              <label className="block mb-2">City</label>
              <input 
                type="text" 
                required
                value={shippingInfo.city}
                onChange={(e) => setShippingInfo({...shippingInfo, city: e.target.value})}
                className="w-full p-2 border rounded"
              />
            </div>
            
            <div className="mb-4">
              <label className="block mb-2">Zip Code</label>
              <input 
                type="text" 
                required
                value={shippingInfo.zipCode}
                onChange={(e) => setShippingInfo({...shippingInfo, zipCode: e.target.value})}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block mb-2">Country</label>
            <select 
              required
              value={shippingInfo.country}
              onChange={(e) => setShippingInfo({...shippingInfo, country: e.target.value})}
              className="w-full p-2 border rounded"
            >
              <option value="">Select Country</option>
              <option value="US">United States</option>
              <option value="CA">Canada</option>
              <option value="MX">Mexico</option>
            </select>
          </div>
          
          <div className="flex justify-between mt-6">
            <button 
              type="button"
              onClick={() => setStep(1)}
              className="py-2 px-4 border rounded"
              tabIndex={100}
            >
              Back
            </button>
            <button 
              type="submit"
              className="py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Continue to Payment
            </button>
          </div>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={handlePaymentSubmit} className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left: Payment Fields */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Payment Information</h2>
              <div className="mb-4">
                <label className="block mb-2">Card Number</label>
                <input 
                  type="text" 
                  required
                  placeholder="1234 5678 9012 3456"
                  value={paymentInfo.cardNumber}
                  onChange={(e) => setPaymentInfo({...paymentInfo, cardNumber: e.target.value})}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Name on Card</label>
                <input 
                  type="text" 
                  required
                  value={paymentInfo.cardName}
                  onChange={(e) => setPaymentInfo({...paymentInfo, cardName: e.target.value})}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="mb-4">
                  <label className="block mb-2">Expiration Date</label>
                  <input 
                    type="text" 
                    required
                    placeholder="MM/YY"
                    value={paymentInfo.expiry}
                    onChange={(e) => setPaymentInfo({...paymentInfo, expiry: e.target.value})}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-2">CVV</label>
                  <input 
                    type="text" 
                    required
                    placeholder="123"
                    value={paymentInfo.cvv}
                    onChange={(e) => setPaymentInfo({...paymentInfo, cvv: e.target.value})}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
            </div>
            {/* Right: Address Summary & Order Summary */}
            <div>
              <div className="mb-6 p-4 border rounded bg-gray-50">
                <h3 className="font-medium mb-2">Shipping Address</h3>
                <p>
                  {shippingInfo.fullName}<br />
                  {shippingInfo.address}<br />
                  {shippingInfo.city}, STATE {shippingInfo.zipCode}<br />
                  {shippingInfo.country}
                </p>
              </div>
              <div className="border-t pt-4 mt-6">
                <h3 className="font-medium mb-2">Order Summary</h3>
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${cart.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>$0.00</span>
                </div>
                <div className="flex justify-between font-bold mt-2 pt-2 border-t">
                  <span>Total</span>
                  <span>${cart.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-between mt-6">
            <button 
              type="button"
              onClick={() => setStep(2)}
              className="py-2 px-4 border rounded"
              tabIndex={100}
            >
              Back
            </button>
            <button 
              type="submit"
              className="py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Place Order
            </button>
          </div>
        </form>
      )}
    </div>
  );
}