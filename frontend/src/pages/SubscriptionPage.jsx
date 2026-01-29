import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import { useAuth0 } from '@auth0/auth0-react';
import { SubscriptionService } from '../services/subscriptionService';
import { RazorpayService } from '../services/razorpayService';
import { 
  Check, 
  X, 
  Star, 
  Zap, 
  Crown, 
  Rocket,
  Users,
  MessageSquare,
  TrendingUp,
  Brain,
  Sparkles,
  CreditCard,
  Loader
} from 'lucide-react';

export default function SubscriptionPage() {
  const { user } = useAuth0();
  const [selectedPlan, setSelectedPlan] = useState('basic');
  const [loading, setLoading] = useState(false);

  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      price: 0,
      currency: 'INR',
      priceDisplay: 'FREE',
      scripts: 2,
      features: [
        '2 Script Generations per month',
        'Basic script templates',
        'Standard trending topics',
        'Email support',
        'Basic analytics'
      ],
      limitations: [
        'No advanced AI features',
        'Limited topic suggestions',
        'No priority support'
      ],
      icon: <Star size={24} color="#10b981" />,
      color: '#10b981',
      popular: false
    },
    {
      id: 'advance',
      name: 'Advance',
      price: 199,
      currency: 'INR',
      priceDisplay: '₹199',
      scripts: 20,
      features: [
        '20 Script Generations per month',
        'Advanced script templates',
        'Trending topics + Domain analysis',
        'Google Gemini AI integration',
        'Priority email support',
        'Advanced analytics',
        'Custom script styles',
        'Trending keyword suggestions'
      ],
      limitations: [
        'Limited to 20 scripts/month'
      ],
      icon: <Zap size={24} color="#3b82f6" />,
      color: '#3b82f6',
      popular: true
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 299,
      currency: 'INR',
      priceDisplay: '₹299',
      scripts: 30,
      features: [
        '30 Script Generations per month',
        'Premium script templates',
        'Real-time trending topics',
        'Advanced Google Gemini AI',
        'Priority support (24/7)',
        'Premium analytics dashboard',
        'Custom script styles',
        'Viral keyword analysis',
        'Competitor analysis',
        'Multi-language support',
        'API access',
        'Custom branding'
      ],
      limitations: [],
      icon: <Crown size={24} color="#f59e0b" />,
      color: '#f59e0b',
      popular: false
    }
  ];

  const handleSubscribe = async (planId) => {
    if (loading) return; // Prevent multiple clicks
    
    setLoading(true);
    try {
      const plan = plans.find(p => p.id === planId);
      
      if (plan.price === 0) {
        // Handle free plan subscription
        await handleFreeSubscription();
      } else {
        // Handle paid plan subscription
        await handlePayment(plan);
      }
    } catch (error) {
      console.error('Subscription error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFreeSubscription = async () => {
    // Save subscription to localStorage
    const subscription = {
      plan: 'basic',
      scriptsRemaining: 2,
      totalScripts: 2,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
      status: 'active'
    };
    
    localStorage.setItem('userSubscription', JSON.stringify(subscription));
    
    // Redirect to script generator
    window.location.href = '/script-generator';
  };

  const handlePayment = async (plan) => {
    try {
      // Don't set loading here as it's already set in handleSubscribe
      
      // Initiate Razorpay payment
      const paymentResult = await RazorpayService.initiatePayment(plan, {
        name: user?.name || 'User',
        email: user?.email || 'user@example.com',
        phone: user?.phone || ''
      });

      // If payment successful, save subscription
      if (paymentResult.success) {
        const subscription = {
          plan: plan.id,
          scriptsRemaining: plan.scripts,
          totalScripts: plan.scripts,
          price: plan.price,
          currency: plan.currency,
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
          status: 'active',
          paymentId: paymentResult.paymentId,
          orderId: paymentResult.orderId,
          paymentMethod: 'razorpay'
        };
        
        SubscriptionService.saveSubscription(subscription);
        
        // Show success message
        alert(`🎉 Payment successful! You're now subscribed to ${plan.name} plan!`);
        
        // Redirect to script generator
        window.location.href = '/script-generator';
      } else {
        throw new Error('Payment failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert(`❌ Payment failed: ${error.message}`);
      throw error; // Re-throw to handle in handleSubscribe
    }
  };

  const getCurrentSubscription = () => {
    const subscription = localStorage.getItem('userSubscription');
    return subscription ? JSON.parse(subscription) : null;
  };

  const currentSubscription = getCurrentSubscription();

  return (
    <DashboardLayout>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
          Choose Your Plan
        </h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
          Unlock powerful script generation with AI-powered content creation, trending topics, and domain-specific insights
        </p>
      </div>

      {/* Current Subscription Status */}
      {currentSubscription && (
        <div style={{
          background: 'var(--background-light)',
          border: '1px solid var(--border-color)',
          borderRadius: '12px',
          padding: '1.5rem',
          marginBottom: '2rem',
          textAlign: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <Sparkles size={20} color="var(--primary-color)" />
            <span style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>
              Current Plan: {currentSubscription.plan.charAt(0).toUpperCase() + currentSubscription.plan.slice(1)}
            </span>
          </div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Scripts Remaining: {currentSubscription.scriptsRemaining}/{currentSubscription.totalScripts}
          </div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '0.25rem' }}>
            Valid until: {new Date(currentSubscription.endDate).toLocaleDateString()}
          </div>
        </div>
      )}

      {/* Pricing Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
        gap: '2rem',
        marginBottom: '3rem'
      }}>
        {plans.map((plan) => (
          <div
            key={plan.id}
            style={{
              background: 'var(--background-light)',
              border: plan.popular ? `2px solid ${plan.color}` : '1px solid var(--border-color)',
              borderRadius: '16px',
              padding: '2rem',
              position: 'relative',
              transform: selectedPlan === plan.id ? 'scale(1.05)' : 'scale(1)',
              transition: 'all 0.3s ease',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
            onClick={() => {
              if (!loading && currentSubscription?.plan !== plan.id) {
                setSelectedPlan(plan.id);
              }
            }}
          >
            {/* Popular Badge */}
            {plan.popular && (
              <div style={{
                position: 'absolute',
                top: '-12px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: plan.color,
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '20px',
                fontSize: '0.875rem',
                fontWeight: 'bold'
              }}>
                MOST POPULAR
              </div>
            )}

            {/* Plan Header */}
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{ marginBottom: '1rem' }}>
                {plan.icon}
              </div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                {plan.name}
              </h3>
              <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: plan.color, marginBottom: '0.5rem' }}>
                {plan.priceDisplay}
              </div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                {plan.price > 0 ? 'per month' : 'forever free'}
              </div>
            </div>

            {/* Scripts Info */}
            <div style={{
              background: `${plan.color}20`,
              border: `1px solid ${plan.color}40`,
              borderRadius: '8px',
              padding: '1rem',
              marginBottom: '1.5rem',
              textAlign: 'center'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                <MessageSquare size={18} color={plan.color} />
                <span style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>
                  {plan.scripts} Script Generations
                </span>
              </div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                per month
              </div>
            </div>

            {/* Features */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '0.9rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
                What's included:
              </h4>
              {plan.features.map((feature, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <Check size={16} color="#10b981" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    {feature}
                  </span>
                </div>
              ))}
            </div>

            {/* Limitations */}
            {plan.limitations.length > 0 && (
              <div style={{ marginBottom: '2rem' }}>
                <h4 style={{ fontSize: '0.9rem', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
                  Limitations:
                </h4>
                {plan.limitations.map((limitation, index) => (
                  <div key={index} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <X size={16} color="#ef4444" style={{ marginTop: '2px', flexShrink: 0 }} />
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                      {limitation}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Subscribe Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                handleSubscribe(plan.id);
              }}
              disabled={loading || (currentSubscription?.plan === plan.id)}
              className="btn"
              style={{
                width: '100%',
                padding: '1rem',
                fontSize: '1rem',
                fontWeight: 'bold',
                background: currentSubscription?.plan === plan.id ? 'var(--text-secondary)' : plan.color,
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: (loading || currentSubscription?.plan === plan.id) ? 'not-allowed' : 'pointer',
                opacity: (loading || currentSubscription?.plan === plan.id) ? 0.6 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                pointerEvents: loading ? 'none' : 'auto'
              }}
            >
              {loading ? (
                <>
                  <Loader size={16} style={{ animation: 'spin 1s linear infinite' }} />
                  Processing...
                </>
              ) : currentSubscription?.plan === plan.id ? (
                'Current Plan'
              ) : plan.price === 0 ? (
                'Get Started'
              ) : (
                <>
                  <CreditCard size={16} />
                  Pay {plan.priceDisplay}
                </>
              )}
            </button>
          </div>
        ))}
      </div>

      {/* Features Comparison */}
      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--text-primary)' }}>
          Compare Features
        </h2>
        <div style={{
          background: 'var(--background-light)',
          border: '1px solid var(--border-color)',
          borderRadius: '12px',
          padding: '2rem',
          overflowX: 'auto'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                  Feature
                </th>
                <th style={{ textAlign: 'center', padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                  Basic
                </th>
                <th style={{ textAlign: 'center', padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                  Advance
                </th>
                <th style={{ textAlign: 'center', padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                  Pro
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', color: 'var(--text-primary)' }}>
                  Script Generations
                </td>
                <td style={{ textAlign: 'center', padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>2</td>
                <td style={{ textAlign: 'center', padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>20</td>
                <td style={{ textAlign: 'center', padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>30</td>
              </tr>
              <tr>
                <td style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', color: 'var(--text-primary)' }}>
                  Google Gemini AI
                </td>
                <td style={{ textAlign: 'center', padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                  <X size={16} color="#ef4444" />
                </td>
                <td style={{ textAlign: 'center', padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                  <Check size={16} color="#10b981" />
                </td>
                <td style={{ textAlign: 'center', padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                  <Check size={16} color="#10b981" />
                </td>
              </tr>
              <tr>
                <td style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', color: 'var(--text-primary)' }}>
                  Trending Topics
                </td>
                <td style={{ textAlign: 'center', padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                  <Check size={16} color="#10b981" />
                </td>
                <td style={{ textAlign: 'center', padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                  <Check size={16} color="#10b981" />
                </td>
                <td style={{ textAlign: 'center', padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                  <Check size={16} color="#10b981" />
                </td>
              </tr>
              <tr>
                <td style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', color: 'var(--text-primary)' }}>
                  Domain Analysis
                </td>
                <td style={{ textAlign: 'center', padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                  <X size={16} color="#ef4444" />
                </td>
                <td style={{ textAlign: 'center', padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                  <Check size={16} color="#10b981" />
                </td>
                <td style={{ textAlign: 'center', padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                  <Check size={16} color="#10b981" />
                </td>
              </tr>
              <tr>
                <td style={{ padding: '1rem', color: 'var(--text-primary)' }}>
                  Priority Support
                </td>
                <td style={{ textAlign: 'center', padding: '1rem' }}>
                  <X size={16} color="#ef4444" />
                </td>
                <td style={{ textAlign: 'center', padding: '1rem' }}>
                  <Check size={16} color="#10b981" />
                </td>
                <td style={{ textAlign: 'center', padding: '1rem' }}>
                  <Check size={16} color="#10b981" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQ Section */}
      <div>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--text-primary)' }}>
          Frequently Asked Questions
        </h2>
        <div style={{ display: 'grid', gap: '1rem' }}>
          <div style={{
            background: 'var(--background-light)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            padding: '1.5rem'
          }}>
            <h4 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
              What happens when I run out of scripts?
            </h4>
            <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
              Your script count resets on the same day each month. You can upgrade your plan anytime to get more scripts.
            </p>
          </div>
          <div style={{
            background: 'var(--background-light)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            padding: '1.5rem'
          }}>
            <h4 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
              Can I change my plan later?
            </h4>
            <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
              Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.
            </p>
          </div>
          <div style={{
            background: 'var(--background-light)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            padding: '1.5rem'
          }}>
            <h4 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
              What payment methods do you accept?
            </h4>
            <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
              We accept all major credit cards, debit cards, UPI, and net banking through our secure payment partners.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
