import React, { useState, useEffect } from 'react';
import { SocialMediaService } from '../../services/socialMediaService';
import { SocialMediaParser } from '../../services/socialMediaParser';
import { 
  TrendingUp, 
  Youtube, 
  Instagram, 
  Twitter, 
  Trophy, 
  Target, 
  Lightbulb, 
  BarChart3,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Clock,
  ArrowUp,
  ArrowDown,
  Star
} from 'lucide-react';

export default function AnalyticsChart() {
  const [socialData, setSocialData] = useState([]);
  const [analytics, setAnalytics] = useState({
    bestPerforming: [],
    trends: [],
    suggestions: [],
    metrics: {}
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        // Load social media data
        const profileData = localStorage.getItem('userProfileData');
        let data = [];
        
        if (profileData) {
          const parsedProfile = JSON.parse(profileData);
          data = await SocialMediaService.syncProfileWithSocialData(parsedProfile);
        } else {
          data = SocialMediaService.loadSocialData();
        }
        
        setSocialData(data);
        
        // Generate comprehensive analytics
        const analyticsData = generateAnalytics(data);
        setAnalytics(analyticsData);
      } catch (error) {
        console.error('Error loading analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  const generateAnalytics = (data) => {
    const bestPerforming = [];
    const trends = [];
    const suggestions = [];
    const metrics = SocialMediaService.calculateTotalMetrics(data);

    // Generate best performing content for each platform
    data.forEach(platform => {
      const bestContent = generateBestPerformingContent(platform);
      bestPerforming.push(bestContent);
      
      const platformTrends = generatePlatformTrends(platform);
      trends.push(...platformTrends);
      
      const platformSuggestions = generatePlatformSuggestions(platform);
      suggestions.push(...platformSuggestions);
    });

    // Generate overall suggestions
    const overallSuggestions = generateOverallSuggestions(data, metrics);
    suggestions.push(...overallSuggestions);

    return {
      bestPerforming,
      trends: trends.slice(0, 5), // Top 5 trends
      suggestions: suggestions.slice(0, 8), // Top 8 suggestions
      metrics
    };
  };

  const generateBestPerformingContent = (platform) => {
    const contentTypes = {
      youtube: [
        { type: 'Tutorial', views: Math.floor(Math.random() * 100000) + 50000, engagement: 8.5 },
        { type: 'Review', views: Math.floor(Math.random() * 80000) + 30000, engagement: 6.2 },
        { type: 'Vlog', views: Math.floor(Math.random() * 60000) + 20000, engagement: 7.8 },
        { type: 'Challenge', views: Math.floor(Math.random() * 120000) + 80000, engagement: 12.3 }
      ],
      instagram: [
        { type: 'Reel', views: Math.floor(Math.random() * 50000) + 20000, engagement: 15.2 },
        { type: 'Carousel', views: Math.floor(Math.random() * 30000) + 10000, engagement: 8.7 },
        { type: 'Story', views: Math.floor(Math.random() * 40000) + 15000, engagement: 11.3 },
        { type: 'Static Post', views: Math.floor(Math.random() * 25000) + 8000, engagement: 5.4 }
      ],
      twitter: [
        { type: 'Thread', impressions: Math.floor(Math.random() * 30000) + 10000, engagement: 4.2 },
        { type: 'Single Tweet', impressions: Math.floor(Math.random() * 20000) + 5000, engagement: 2.8 },
        { type: 'Poll', impressions: Math.floor(Math.random() * 25000) + 8000, engagement: 6.7 },
        { type: 'Video Tweet', impressions: Math.floor(Math.random() * 35000) + 15000, engagement: 8.9 }
      ]
    };

    const platformContent = contentTypes[platform.platform] || [];
    const best = platformContent.reduce((prev, current) => 
      (prev.views || prev.impressions) > (current.views || current.impressions) ? prev : current
    );

    return {
      platform: platform.platform,
      username: platform.username,
      contentType: best.type,
      views: best.views || best.impressions,
      engagement: best.engagement,
      url: platform.url
    };
  };

  const generatePlatformTrends = (platform) => {
    const trends = {
      youtube: [
        { topic: 'AI Tools & Automation', growth: '+45%', mentions: 1250, sentiment: 'positive' },
        { topic: 'Sustainable Living', growth: '+32%', mentions: 890, sentiment: 'positive' },
        { topic: 'Remote Work Tips', growth: '+28%', mentions: 720, sentiment: 'neutral' }
      ],
      instagram: [
        { topic: 'Minimalist Aesthetics', growth: '+38%', mentions: 2100, sentiment: 'positive' },
        { topic: 'Wellness & Mindfulness', growth: '+29%', mentions: 1850, sentiment: 'positive' },
        { topic: 'DIY Projects', growth: '+22%', mentions: 980, sentiment: 'neutral' }
      ],
      twitter: [
        { topic: 'Tech Innovation', growth: '+52%', mentions: 3200, sentiment: 'positive' },
        { topic: 'Climate Action', growth: '+41%', mentions: 2800, sentiment: 'positive' },
        { topic: 'Startup Culture', growth: '+35%', mentions: 1650, sentiment: 'neutral' }
      ]
    };

    return (trends[platform.platform] || []).map(trend => ({
      ...trend,
      platform: platform.platform,
      username: platform.username
    }));
  };

  const generatePlatformSuggestions = (platform) => {
    const suggestions = {
      youtube: [
        { type: 'content', priority: 'high', title: 'Create more tutorial content', description: 'Your tutorials perform 40% better than other content types' },
        { type: 'timing', priority: 'medium', title: 'Post on Tuesdays at 6 PM', description: 'Highest engagement window for your audience' },
        { type: 'optimization', priority: 'medium', title: 'Optimize video titles', description: 'Add keywords to improve discoverability' }
      ],
      instagram: [
        { type: 'content', priority: 'high', title: 'Focus on Reels', description: 'Reels get 3x more engagement than posts' },
        { type: 'timing', priority: 'medium', title: 'Post daily at 7 PM', description: 'Peak activity time for your followers' },
        { type: 'engagement', priority: 'low', title: 'Use more interactive stickers', description: 'Boost story engagement by 25%' }
      ],
      twitter: [
        { type: 'content', priority: 'high', title: 'Start more threads', description: 'Threads get 2x more impressions than single tweets' },
        { type: 'timing', priority: 'medium', title: 'Tweet during commute hours', description: '8-9 AM and 5-6 PM are peak times' },
        { type: 'engagement', priority: 'medium', title: 'Ask more questions', description: 'Increase replies and conversation rate' }
      ]
    };

    return (suggestions[platform.platform] || []).map(suggestion => ({
      ...suggestion,
      platform: platform.platform,
      username: platform.username
    }));
  };

  const generateOverallSuggestions = (data, metrics) => {
    const overallSuggestions = [];

    if (metrics.platformCount >= 3) {
      overallSuggestions.push({
        type: 'strategy',
        priority: 'high',
        title: 'Cross-promote your platforms',
        description: 'Your audience across platforms could boost engagement by 35%',
        platform: 'all'
      });
    }

    if (metrics.averageEngagement < 5) {
      overallSuggestions.push({
        type: 'engagement',
        priority: 'high',
        title: 'Improve content quality',
        description: 'Focus on creating more engaging content to boost interaction',
        platform: 'all'
      });
    }

    overallSuggestions.push({
      type: 'growth',
      priority: 'medium',
      title: 'Analyze competitor strategies',
      description: 'Study successful creators in your niche for growth ideas',
      platform: 'all'
    });

    return overallSuggestions;
  };

  const getPlatformIcon = (platform) => {
    switch (platform) {
      case 'youtube': return <Youtube size={16} color="#FF0000" />;
      case 'instagram': return <Instagram size={16} color="#E4405F" />;
      case 'twitter': return <Twitter size={16} color="#1DA1F2" />;
      default: return <TrendingUp size={16} />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  if (loading) {
    return (
      <div className="dashboard-comp-AnalyticsChart" style={{
        background: 'var(--background-light)',
        borderRadius: '12px',
        padding: '1.5rem',
        border: '1px solid var(--border-color)',
        textAlign: 'center'
      }}>
        <div style={{ color: 'var(--text-secondary)' }}>Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-comp-AnalyticsChart" style={{
      background: 'var(--background-light)',
      borderRadius: '12px',
      padding: '1.5rem',
      border: '1px solid var(--border-color)'
    }}>
      <h2 style={{ margin: '0 0 1.5rem 0', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <BarChart3 size={24} />
        Comprehensive Analytics & Insights
      </h2>

      {/* Best Performing Content */}
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ margin: '0 0 1rem 0', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Trophy size={20} color="#f59e0b" />
          Best Performing Content
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
          {analytics.bestPerforming.map((content, index) => (
            <div key={index} style={{
              background: 'var(--background-color)',
              borderRadius: '8px',
              padding: '1rem',
              border: '1px solid var(--border-color)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                {getPlatformIcon(content.platform)}
                <span style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>
                  @{content.username}
                </span>
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                {content.contentType}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Eye size={14} />
                  <span style={{ color: 'var(--text-primary)' }}>
                    {SocialMediaParser.formatNumber(content.views)}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Heart size={14} />
                  <span style={{ color: 'var(--text-primary)' }}>
                    {content.engagement}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trending Topics */}
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ margin: '0 0 1rem 0', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <TrendingUp size={20} color="#10b981" />
          Trending Topics in Your Niche
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {analytics.trends.map((trend, index) => (
            <div key={index} style={{
              background: 'var(--background-color)',
              borderRadius: '6px',
              padding: '0.75rem 1rem',
              border: '1px solid var(--border-color)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {getPlatformIcon(trend.platform)}
                <div>
                  <div style={{ fontWeight: '500', color: 'var(--text-primary)' }}>
                    {trend.topic}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    {SocialMediaParser.formatNumber(trend.mentions)} mentions
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ArrowUp size={16} color="#10b981" />
                <span style={{ color: '#10b981', fontWeight: 'bold' }}>
                  {trend.growth}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actionable Suggestions */}
      <div>
        <h3 style={{ margin: '0 0 1rem 0', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Lightbulb size={20} color="#eab308" />
          Actionable Suggestions
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
          {analytics.suggestions.map((suggestion, index) => (
            <div key={index} style={{
              background: 'var(--background-color)',
              borderRadius: '8px',
              padding: '1rem',
              border: `1px solid ${getPriorityColor(suggestion.priority)}33`,
              borderLeft: `4px solid ${getPriorityColor(suggestion.priority)}`
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                {getPlatformIcon(suggestion.platform)}
                <span style={{ 
                  fontSize: '0.75rem', 
                  color: getPriorityColor(suggestion.priority),
                  fontWeight: 'bold',
                  textTransform: 'uppercase'
                }}>
                  {suggestion.priority} priority
                </span>
              </div>
              <div style={{ fontWeight: '500', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                {suggestion.title}
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                {suggestion.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
