// Razorpay Payment Service
export class RazorpayService {
  
  static async initializeRazorpay() {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => reject(new Error('Failed to load Razorpay SDK'));
      document.body.appendChild(script);
    });
  }

  static async createOrder(plan) {
    try {
      // In production, this should call your backend to create a Razorpay order
      // For now, creating a simpler order structure
      const orderData = {
        amount: plan.price * 100, // Convert to paise
        currency: 'INR',
        receipt: `receipt_${Date.now()}`,
        notes: {
          plan: plan.id,
          userId: 'user_' + Date.now()
        }
      };

      // Return a simpler order structure for test mode
      return {
        id: `order_${Date.now()}`,
        amount: orderData.amount,
        currency: orderData.currency
      };
    } catch (error) {
      console.error('Error creating Razorpay order:', error);
      throw error;
    }
  }

  static async initiatePayment(plan, userInfo) {
    try {
      // Initialize Razorpay
      await this.initializeRazorpay();

      // Create order
      const order = await this.createOrder(plan);

      // Payment options - simplified for test mode
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'FlowAI',
        description: `${plan.name} Plan Subscription`,
        image: '/vite.svg',
        handler: async (response) => {
          // Handle successful payment
          const paymentResult = await this.verifyPayment(response, plan);
          return paymentResult;
        },
        prefill: {
          name: userInfo.name || 'User',
          email: userInfo.email || 'user@example.com',
          contact: userInfo.phone || ''
        },
        notes: {
          plan: plan.id,
          planName: plan.name,
          scripts: plan.scripts
        },
        theme: {
          color: '#6366f1'
        },
        modal: {
          ondismiss: () => {
            throw new Error('Payment cancelled by user');
          },
          escape: true,
          handleback: true
        }
      };

      // Create Razorpay instance
      const razorpay = new window.Razorpay(options);

      // Return promise for payment handling
      return new Promise((resolve, reject) => {
        razorpay.on('payment.failed', (response) => {
          console.error('Payment failed:', response.error);
          reject(new Error(`Payment failed: ${response.error.description}`));
        });

        razorpay.open();
        
        // Handle payment success
        razorpay.on('payment.success', async (response) => {
          try {
            const result = await this.verifyPayment(response, plan);
            resolve(result);
          } catch (error) {
            reject(error);
          }
        });
      });

    } catch (error) {
      console.error('Error initiating payment:', error);
      throw error;
    }
  }

  static async verifyPayment(paymentResponse, plan) {
    try {
      // In production, verify payment on your backend
      // For now, simulating verification
      
      const paymentData = {
        razorpay_order_id: paymentResponse.razorpay_order_id,
        razorpay_payment_id: paymentResponse.razorpay_payment_id,
        razorpay_signature: paymentResponse.razorpay_signature,
        plan: plan.id,
        amount: plan.price * 100,
        currency: 'INR'
      };

      // Simulate API call to verify payment
      // In production: const response = await fetch('/api/verify-razorpay-payment', {...})
      
      // Simulate successful verification
      const verificationResult = {
        success: true,
        paymentId: paymentResponse.razorpay_payment_id,
        orderId: paymentResponse.razorpay_order_id,
        plan: plan.id,
        amount: plan.price,
        currency: 'INR',
        status: 'captured',
        timestamp: new Date().toISOString()
      };

      return verificationResult;
    } catch (error) {
      console.error('Error verifying payment:', error);
      throw new Error('Payment verification failed');
    }
  }

  static async createSubscription(plan, userInfo) {
    try {
      // For recurring subscriptions (if needed in future)
      const subscriptionData = {
        plan_id: plan.id,
        total_count: 12, // 12 months
        quantity: 1,
        customer_note: `${plan.name} subscription`,
        customer: {
          name: userInfo.name,
          email: userInfo.email
        }
      };

      // Create Razorpay subscription
      // This would be implemented for recurring payments
      
      return subscriptionData;
    } catch (error) {
      console.error('Error creating subscription:', error);
      throw error;
    }
  }

  static formatPrice(amount) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  }

  static getPaymentMethods() {
    return [
      {
        id: 'card',
        name: 'Credit/Debit Card',
        icon: '💳',
        available: true
      },
      {
        id: 'upi',
        name: 'UPI',
        icon: '📱',
        available: true
      },
      {
        id: 'netbanking',
        name: 'Net Banking',
        icon: '🏦',
        available: true
      },
      {
        id: 'wallet',
        name: 'Wallet',
        icon: '👛',
        available: true
      }
    ];
  }

  static async refundPayment(paymentId, amount) {
    try {
      // In production, call your backend to process refund
      const refundData = {
        payment_id: paymentId,
        amount: amount * 100, // Convert to paise
        speed: 'normal' // or 'optimum'
      };

      // Simulate refund processing
      const refundResult = {
        success: true,
        refund_id: `refund_${Date.now()}`,
        payment_id: paymentId,
        amount: amount,
        status: 'processed',
        timestamp: new Date().toISOString()
      };

      return refundResult;
    } catch (error) {
      console.error('Error processing refund:', error);
      throw error;
    }
  }

  static async getPaymentHistory(userId) {
    try {
      // In production, fetch from your backend
      // Simulating payment history
      return [
        {
          id: 'pay_123',
          date: '2024-01-15',
          amount: 199,
          plan: 'Advance',
          status: 'success',
          method: 'UPI'
        }
      ];
    } catch (error) {
      console.error('Error fetching payment history:', error);
      return [];
    }
  }
}
