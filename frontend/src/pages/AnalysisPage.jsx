import React from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import AnalyticsChart from '../components/dashboard/AnalyticsChart';
import SocialMediaAnalytics from '../components/dashboard/SocialMediaAnalytics';

export default function AnalysisPage() {
  return (
    <DashboardLayout>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
          Comprehensive Analysis
        </h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '600px' }}>
          Deep insights into your social media performance, trending topics, and actionable recommendations to grow your online presence.
        </p>
      </div>

      {/* Social Media Analytics Section */}
      <SocialMediaAnalytics />

      {/* Comprehensive Analytics Section */}
      <AnalyticsChart />
    </DashboardLayout>
  );
}
