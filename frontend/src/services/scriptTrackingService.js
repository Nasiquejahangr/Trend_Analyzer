export class ScriptTrackingService {
  static SCRIPT_STORAGE_KEY = 'generatedScripts';
  static SCRIPT_STATS_KEY = 'scriptStats';

  // Initialize script tracking
  static initializeTracking() {
    const existingScripts = localStorage.getItem(this.SCRIPT_STORAGE_KEY);
    const existingStats = localStorage.getItem(this.SCRIPT_STATS_KEY);
    
    if (!existingScripts) {
      localStorage.setItem(this.SCRIPT_STORAGE_KEY, JSON.stringify([]));
    }
    
    if (!existingStats) {
      const initialStats = {
        totalGenerated: 0,
        thisWeek: 0,
        thisMonth: 0,
        byPlatform: {
          youtube: 0,
          instagram: 0,
          twitter: 0
        },
        byStyle: {
          casual: 0,
          professional: 0,
          energetic: 0
        },
        averageWordCount: 0,
        totalWordsGenerated: 0
      };
      localStorage.setItem(this.SCRIPT_STATS_KEY, JSON.stringify(initialStats));
    }
  }

  // Track a new script generation
  static trackScript(scriptData, generatedContent) {
    try {
      const scripts = this.getAllScripts();
      const stats = this.getStats();
      
      const newScript = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        topic: scriptData.topic,
        platform: scriptData.platform,
        style: scriptData.style,
        wordCount: generatedContent.split(/\s+/).filter(word => word.length > 0).length,
        content: generatedContent,
        domain: scriptData.domain || 'general',
        trendingKeywords: scriptData.trendingKeywords || [],
        status: 'completed'
      };

      // Add to scripts list
      scripts.unshift(newScript);
      
      // Keep only last 100 scripts to manage storage
      if (scripts.length > 100) {
        scripts.splice(100);
      }
      
      localStorage.setItem(this.SCRIPT_STORAGE_KEY, JSON.stringify(scripts));
      
      // Update statistics
      stats.totalGenerated++;
      stats.totalWordsGenerated += newScript.wordCount;
      stats.averageWordCount = Math.round(stats.totalWordsGenerated / stats.totalGenerated);
      
      // Update platform counts
      if (stats.byPlatform[newScript.platform] !== undefined) {
        stats.byPlatform[newScript.platform]++;
      }
      
      // Update style counts
      if (stats.byStyle[newScript.style] !== undefined) {
        stats.byStyle[newScript.style]++;
      }
      
      // Update time-based counts
      const now = new Date();
      const scriptDate = new Date(newScript.timestamp);
      
      // This week
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - now.getDay());
      weekStart.setHours(0, 0, 0, 0);
      
      if (scriptDate >= weekStart) {
        stats.thisWeek++;
      }
      
      // This month
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      if (scriptDate >= monthStart) {
        stats.thisMonth++;
      }
      
      localStorage.setItem(this.SCRIPT_STATS_KEY, JSON.stringify(stats));
      
      return newScript;
    } catch (error) {
      console.error('Error tracking script:', error);
      return null;
    }
  }

  // Get all generated scripts
  static getAllScripts() {
    try {
      const scripts = localStorage.getItem(this.SCRIPT_STORAGE_KEY);
      return scripts ? JSON.parse(scripts) : [];
    } catch (error) {
      console.error('Error getting scripts:', error);
      return [];
    }
  }

  // Get script statistics
  static getStats() {
    try {
      const stats = localStorage.getItem(this.SCRIPT_STATS_KEY);
      return stats ? JSON.parse(stats) : {
        totalGenerated: 0,
        thisWeek: 0,
        thisMonth: 0,
        byPlatform: { youtube: 0, instagram: 0, twitter: 0 },
        byStyle: { casual: 0, professional: 0, energetic: 0 },
        averageWordCount: 0,
        totalWordsGenerated: 0
      };
    } catch (error) {
      console.error('Error getting stats:', error);
      return {
        totalGenerated: 0,
        thisWeek: 0,
        thisMonth: 0,
        byPlatform: { youtube: 0, instagram: 0, twitter: 0 },
        byStyle: { casual: 0, professional: 0, energetic: 0 },
        averageWordCount: 0,
        totalWordsGenerated: 0
      };
    }
  }

  // Get recent scripts (last 10)
  static getRecentScripts(limit = 10) {
    const scripts = this.getAllScripts();
    return scripts.slice(0, limit);
  }

  // Get scripts by platform
  static getScriptsByPlatform(platform) {
    const scripts = this.getAllScripts();
    return scripts.filter(script => script.platform === platform);
  }

  // Get scripts from this week
  static getThisWeekScripts() {
    const scripts = this.getAllScripts();
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    weekStart.setHours(0, 0, 0, 0);
    
    return scripts.filter(script => new Date(script.timestamp) >= weekStart);
  }

  // Get scripts from this month
  static getThisMonthScripts() {
    const scripts = this.getAllScripts();
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    
    return scripts.filter(script => new Date(script.timestamp) >= monthStart);
  }

  // Delete a script
  static deleteScript(scriptId) {
    try {
      const scripts = this.getAllScripts();
      const filteredScripts = scripts.filter(script => script.id !== scriptId);
      localStorage.setItem(this.SCRIPT_STORAGE_KEY, JSON.stringify(filteredScripts));
      
      // Recalculate stats
      this.recalculateStats();
      return true;
    } catch (error) {
      console.error('Error deleting script:', error);
      return false;
    }
  }

  // Clear all scripts
  static clearAllScripts() {
    try {
      localStorage.setItem(this.SCRIPT_STORAGE_KEY, JSON.stringify([]));
      this.initializeTracking();
      return true;
    } catch (error) {
      console.error('Error clearing scripts:', error);
      return false;
    }
  }

  // Recalculate statistics from scripts
  static recalculateStats() {
    try {
      const scripts = this.getAllScripts();
      const stats = {
        totalGenerated: scripts.length,
        thisWeek: 0,
        thisMonth: 0,
        byPlatform: { youtube: 0, instagram: 0, twitter: 0 },
        byStyle: { casual: 0, professional: 0, energetic: 0 },
        averageWordCount: 0,
        totalWordsGenerated: 0
      };
      
      const now = new Date();
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - now.getDay());
      weekStart.setHours(0, 0, 0, 0);
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      
      scripts.forEach(script => {
        stats.totalWordsGenerated += script.wordCount;
        
        if (stats.byPlatform[script.platform] !== undefined) {
          stats.byPlatform[script.platform]++;
        }
        
        if (stats.byStyle[script.style] !== undefined) {
          stats.byStyle[script.style]++;
        }
        
        const scriptDate = new Date(script.timestamp);
        if (scriptDate >= weekStart) {
          stats.thisWeek++;
        }
        if (scriptDate >= monthStart) {
          stats.thisMonth++;
        }
      });
      
      stats.averageWordCount = scripts.length > 0 ? Math.round(stats.totalWordsGenerated / scripts.length) : 0;
      
      localStorage.setItem(this.SCRIPT_STATS_KEY, JSON.stringify(stats));
    } catch (error) {
      console.error('Error recalculating stats:', error);
    }
  }

  // Export scripts data
  static exportScripts() {
    const scripts = this.getAllScripts();
    const stats = this.getStats();
    
    return {
      scripts,
      stats,
      exportDate: new Date().toISOString()
    };
  }

  // Get formatted statistics for dashboard
  static getFormattedStats() {
    const stats = this.getStats();
    const recentScripts = this.getRecentScripts(5);
    
    return {
      totalGenerated: stats.totalGenerated,
      thisWeek: stats.thisWeek,
      thisMonth: stats.thisMonth,
      averageWordCount: stats.averageWordCount,
      totalWordsGenerated: stats.totalWordsGenerated,
      byPlatform: stats.byPlatform,
      byStyle: stats.byStyle,
      recentScripts: recentScripts.map(script => ({
        id: script.id,
        topic: script.topic,
        platform: script.platform,
        style: script.style,
        wordCount: script.wordCount,
        timestamp: script.timestamp,
        timeAgo: this.getTimeAgo(script.timestamp)
      }))
    };
  }

  // Get time ago string
  static getTimeAgo(timestamp) {
    const now = new Date();
    const past = new Date(timestamp);
    const diffMs = now - past;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 60) {
      return `${diffMins} minutes ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hours ago`;
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return past.toLocaleDateString();
    }
  }
}
