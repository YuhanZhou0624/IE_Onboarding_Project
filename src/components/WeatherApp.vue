<template>
  <div class="website-container">
    <!-- Header/Navigation Bar -->
    <header class="main-header">
      <div class="header-container">
        <div class="logo-section">
          <span class="logo-icon">☀️</span>
          <h1>Sun Protection Australia</h1>
        </div>
        <nav class="main-navigation">
          <ul>
            <li class="active"><a href="#">Home</a></li>
          </ul>
        </nav>
      </div>
    </header>

    <!-- Hero Section with Banner Image -->
    <section class="hero-section">
      <div class="hero-content">
        <h1>Stay Safe Under the Australian Sun</h1>
        <p>Understanding UV exposure and protecting your skin from harmful rays</p>
      </div>
      <div class="hero-overlay"></div>
      <img src="/images/HomePage/Homepage.jpg" alt="Sun Protection Banner" class="hero-image">
    </section>

    <!-- Main Content Area -->
    <section class="main-content">
      <h2 class="section-title">Sun Protection Tools</h2>
      <p class="section-description">Monitor UV levels, set reminders, and stay protected with our interactive tools</p>
      
      <div class="weather-app">
        <!-- Main content area -->
        <div class="content">
          <!-- UV Index Module -->
          <div class="uv-card smaller">
            <h3>UV Index</h3>
            
            <div class="city-search">
              <input
                type="text"
                placeholder="Search for a city..."
                v-model="searchQuery"
                class="search-input"
              />
              <div v-if="searchQuery && filteredLocations.length > 0" class="search-results">
                <div 
                  v-for="location in filteredLocations" 
                  :key="location.name" 
                  class="search-result-item" 
                  @click="selectLocation(location)"
                >
                  {{ location.name }}
                </div>
              </div>
            </div>
            
            <div v-if="selectedLocation" class="selected-city">
              Selected: {{ selectedLocation.name }}
            </div>
            
            <div class="uv-display">
              {{ uvIndex !== null ? uvIndex : 'N/A' }}
            </div>
            
            
            <div class="sunscreen-reminder">
              <h3>Sunscreen Reminder</h3>
              <div class="reminder-toggle">
                <label class="switch">
                  <input type="checkbox" v-model="sunscreenReminderEnabled" @change="handleReminderToggle">
                  <span class="slider round"></span>
                </label>
                <span class="toggle-label">{{ sunscreenReminderEnabled ? 'Reminders Enabled' : 'Enable Reminders' }}</span>
              </div>
              
              <div v-if="sunscreenReminderEnabled" class="reminder-settings">
                <div class="interval-selector">
                  <label for="interval">Remind me every:</label>
                  <select id="interval" v-model="reminderInterval" @change="resetReminder">
                    <option value="60">1 hour</option>
                    <option value="120">2 hours</option>
                    <option value="180">3 hours</option>
                    <option value="240">4 hours</option>
                  </select>
                </div>
                
                <div class="next-reminder">
                  <p>Next reminder: <span>{{ nextReminderTime ? formatReminderTime(nextReminderTime) : 'Not set' }}</span></p>
                </div>
              </div>
            </div>
          </div>

          <!-- Melbourne Time & UV Danger Level Module -->
          <div class="time-city-card larger">
            <div class="datetime-row">
              <div class="city-display">{{ weather.city }}</div>
              <div class="time-date-group">
                <div class="time-display">{{ currentTime }}</div>
                <div class="date-display">{{ currentDate }}</div>
              </div>
            </div>
            
            <!-- UV 指数可视化 -->
            <div class="uv-container">
              <!-- UV 指数等级 -->
              <div class="uv-level">{{ uvDangerLevel }}</div>
              
              <!-- UV 指数条 -->
              <div class="uv-meter">
                <div class="uv-meter-gradient"></div>
                <div class="uv-meter-marker" :style="markerPosition"></div>
              </div>
              
              <!-- UV 指数标签 -->
              <div class="uv-meter-labels">
                <span>low</span>
                <span>moderate</span>
                <span>high</span>
                <span>extreme</span>
              </div>
              
              <!-- UV 指数解释 -->
              <div class="uv-explanation">
                {{ uvExplanation }}
              </div>
            </div>
          </div>

          <!-- Impact of Skin Cancer Module -->
          <div class="info-card cancer-card">
            <h3>Impact of Skin Cancer in Australia</h3>
            <div class="cancer-content">
              <p v-if="!selectedLocation || !selectedState || cancerImageError">
                Australia has one of the highest rates of skin cancer in the world. 2 in 3 Australians will be diagnosed with skin cancer by the age of 70.
              </p>
              <div v-else-if="selectedLocation && selectedState" class="cancer-image-container">
                <img :src="cancerImageUrl" alt="Cancer statistics" class="cancer-image" @error="handleCancerImageError" @click="showLargeCancerImage"/>
              </div>
              <div v-if="showFullCancerImage" class="image-modal" @click="showFullCancerImage = false">
                <div class="modal-content">
                  <img :src="cancerImageUrl" :alt="`${selectedState} cancer statistics`" class="full-size-image" />
                </div>
              </div>
              <p class="trend-description">Cancer Data Visualisation</p>
            </div>
          </div>

          <!-- Rising Temperature Trend Module -->
          <div class="info-card trend-card">
            <h3>Trend of rising temperatures over time</h3>
            <div class="temperature-trend-content">
              <p v-if="!selectedLocation">Select a location to view temperature trends.</p>
              <p v-else-if="loadingTrendImage">Loading trend data...</p>
              <p v-else-if="trendImageError">Unable to load temperature trend data.</p>
              <div v-else class="trend-image-container">
                <img :src="temperatureTrendImageUrl" :alt="`${selectedLocation.name} temperature trend`" class="trend-image" @error="handleImageError" @click="showLargeImage"/>
              </div>
              <div v-if="showFullImage" class="image-modal" @click="showFullImage = false">
                <div class="modal-content">
                  <img :src="temperatureTrendImageUrl" :alt="`${selectedLocation.name} temperature trend`" class="full-size-image" />
                </div>
              </div>
              <p class="trend-description">Trend Visualisation</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="main-footer">
      <div class="footer-container">
        <div class="footer-section">
          <h3>Sun Protection Australia</h3>
          <p>Helping Australians stay safe under the sun with real-time UV monitoring and reminders.</p>
        </div>
        <div class="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="#">Home</a></li>
            <li><a href="#">UV Index</a></li>
            <li><a href="#">Skin Cancer impact</a></li>
            <li><a href="#">Sunscreen Reminder</a></li>
          </ul>
        </div>
        <div class="footer-section">
          <h3>Contact</h3>
          <p>Email: MonashTA08@IE.com</p>
          <p>Phone: +61 1 2345 6789</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'WeatherApp',
  data() {
    return {
      searchQuery: '',
      currentTime: '',
      currentDate: '',
      selectedLocation: null,
      selectedState: null,
      uvIndex: null,
      uvDangerLevel: 'N/A',
      uvExplanation: '',
      weather: {
        city: 'Melbourne',
      },
      locations: [
        { name: 'Melbourne', lat: -37.81, lng: 144.96, state: 'VIC', timezone: 'Australia/Melbourne' },
        { name: 'Sydney', lat: -33.86, lng: 151.20, state: 'NSW', timezone: 'Australia/Sydney' },
        { name: 'Brisbane', lat: -27.46, lng: 153.02, state: 'QLD', timezone: 'Australia/Brisbane' },
        { name: 'Perth', lat: -31.95, lng: 115.86, state: 'WA', timezone: 'Australia/Perth' },
        { name: 'Adelaide', lat: -34.55, lng: 138.36, state: 'SA', timezone: 'Australia/Adelaide' },
        { name: 'Canberra', lat: -35.28, lng: 149.13, state: 'ACT', timezone: 'Australia/Canberra' },
        { name: 'Newcastle', lat: -32.93, lng: 151.78, state: 'NSW', timezone: 'Australia/Sydney' },
        { name: 'Darwin', lat: -12.46, lng: 130.84, state: 'NT', timezone: 'Australia/Darwin' },
        { name: 'GoldCoast', lat: -28.02, lng: 153.43, state: 'QLD', timezone: 'Australia/Brisbane' }
      ],
      
      sunscreenReminderEnabled: false,
      reminderInterval: 120,
      nextReminderTime: null,
      reminderId: null,
      
      loadingTrendImage: false,
      trendImageError: false,
      
      cancerImageError: false,
      
      showFullImage: false,
      showFullCancerImage: false
    };
  },
  mounted() {
    this.updateDateTime();
    setInterval(this.updateDateTime, 1000);
    
    if (this.locations.length > 0) {
      this.selectedLocation = this.locations[0];
      this.selectedState = this.locations[0].state;
      this.fetchUVIndex();
    }
    
    this.loadReminderSettings();
  },
  beforeUnmount() {
    this.clearReminders();
  },
  computed: {
    
    markerPosition() {
      if (this.uvIndex === null) return { left: '0%' };
      
      const maxUV = 12;
      const position = Math.min((this.uvIndex / maxUV) * 100, 100);
      return { left: `${position}%` };
    },
    
    suggestedInterval() {
      if (this.uvIndex === null) return 120;
      
      
      if (this.uvIndex >= 8) return 60;
      if (this.uvIndex >= 6) return 90;
      if (this.uvIndex >= 3) return 120;
      return 180;
    },
    
    temperatureTrendImageUrl() {
      if (!this.selectedLocation) return '';
      
      const locationName = this.selectedLocation.name.toLowerCase().replace(/\s+/g, '-');
      return `/images/temperature-trends/${locationName}.png`;
    },
    
    cancerImageUrl() {
      if (!this.selectedState) return '';
      
      return `/images/cancer/cancer_${this.selectedState}.png`;
    },

    filteredLocations() {
      if (!this.searchQuery) return [];
      
      const query = this.searchQuery.toLowerCase();
      return this.locations.filter(location => 
        location.name.toLowerCase().includes(query)
      ).slice(0, 5);
    }
  },
  methods: {
    updateDateTime() {
      const now = new Date();
  
      if (this.selectedLocation && this.selectedLocation.timezone) {
        const options = { timeZone: this.selectedLocation.timezone };
    
        this.currentTime = now.toLocaleTimeString('en-AU', { 
          ...options,
          hour: '2-digit', 
          minute: '2-digit', 
          hour12: false 
        });
    
        this.currentDate = now.toLocaleDateString('en-AU', { 
          ...options,
          weekday: 'long', 
          day: 'numeric', 
          month: 'short' 
        });
      } else {
        this.currentTime = now.toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit', hour12: false });
        this.currentDate = now.toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'short' });
      }
    },
    
  selectLocation(location) {
    this.selectedLocation = location;
    this.selectedState = location.state;
    this.searchQuery = '';
    this.fetchUVIndex();
    this.cancerImageError = false;
    this.updateDateTime();
  },
    
    async fetchUVIndex() {
      if (!this.selectedLocation) return;

      const { lat, lng } = this.selectedLocation;
      
      this.weather.city = this.selectedLocation.name;
      
      this.loadingTrendImage = true;
      this.trendImageError = false;

      try {
        //const response = await axios.get(`http://localhost:3001/api/uv/${lat}/${lng}`);
        //const response = await axios.get(`http://13.238.4.76:3001/api/uv/${lat}/${lng}`);
        const response = await axios.get(`https://ie-onboarding-project.onrender.com/api/uv/${lat}/${lng}`);
        this.uvIndex = Math.round(response.data.uvIndex); // 转成整数
        
        this.setUVInfo();
        
        if (this.sunscreenReminderEnabled) {
          const suggested = this.suggestedInterval;
          if (Math.abs(this.reminderInterval - suggested) >= 60) {
            if (confirm(`UV index is now ${this.uvIndex}. Would you like to update your reminder interval to ${suggested/60} hour(s)?`)) {
              this.reminderInterval = suggested;
              this.resetReminder();
            }
          }
        }
        
        this.loadingTrendImage = false;
        
        console.log(`UV Index for ${this.selectedLocation.name}: ${this.uvIndex}`);
      } catch (error) {
        console.error('Error fetching UV index:', error.response?.data || error.message);
        this.uvIndex = null;
        this.uvDangerLevel = 'N/A';
        this.uvExplanation = '';
        this.loadingTrendImage = false;
      }
    },
    
    setUVInfo() {
      if (this.uvIndex === null) {
        this.uvDangerLevel = 'N/A';
        this.uvExplanation = '';
      } else if (this.uvIndex <= 2) {
        this.uvDangerLevel = 'Low';
        this.uvExplanation = 'Low risk of harm from sun exposure. Wear sunscreen, sunglasses, and cover up when outside.';
      } else if (this.uvIndex <= 5) {
        this.uvDangerLevel = 'Moderate';
        this.uvExplanation = 'Moderate risk of harm from sun exposure. Wear sunscreen, sunglasses, and cover up when outside.';
      } else if (this.uvIndex <= 7) {
        this.uvDangerLevel = 'High';
        this.uvExplanation = 'High risk of harm from unprotected sun exposure. Minimize sun exposure between 10am-4pm.';
      } else if (this.uvIndex <= 10) {
        this.uvDangerLevel = 'Very High';
        this.uvExplanation = 'Very high risk of harm. Take full precautions and avoid midday sun exposure.';
      } else {
        this.uvDangerLevel = 'Extreme';
        this.uvExplanation = 'Extreme risk of harm. Avoid sun exposure between 10am-4pm and take all precautions when outside.';
      }
    },

    showLargeImage() {
      this.showFullImage = true;
    },
    
    showLargeCancerImage() {
      this.showFullCancerImage = true;
    },
    
    searchCity() {
      console.log('Searching for:', this.searchQuery);
    },
    
    useCurrentLocation() {
      console.log('Getting current location');
    },
    
    handleImageError() {
      this.trendImageError = true;
      console.error(`Failed to load temperature trend image for ${this.selectedLocation.name}`);
    },
    
    handleCancerImageError() {
      this.cancerImageError = true;
      console.error(`Failed to load cancer image for state ${this.selectedState}`);
    },
    
    handleReminderToggle() {
      if (this.sunscreenReminderEnabled) {
        this.startReminder();
      } else {
        this.clearReminders();
      }
      this.saveReminderSettings();
    },
    
    startReminder() {
      this.clearReminders();
      
      const now = new Date();
      this.nextReminderTime = new Date(now.getTime() + this.reminderInterval * 60000);
      
      this.reminderId = setTimeout(() => {
        this.showReminder();
        this.resetReminder();
      }, this.reminderInterval * 60000);
      
      console.log(`Reminder set for ${this.formatReminderTime(this.nextReminderTime)}`);
    },
    
    resetReminder() {
      this.clearReminders();
      this.startReminder();
      this.saveReminderSettings();
    },
    
    clearReminders() {
      if (this.reminderId) {
        clearTimeout(this.reminderId);
        this.reminderId = null;
      }
    },
    
    showReminder() {
      alert(`Time to reapply sunscreen! Current UV Index is ${this.uvIndex}.`);
      
      if ('Notification' in window) {
        if (Notification.permission === 'granted') {
          this.sendNotification();
        } else if (Notification.permission !== 'denied') {
          Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
              this.sendNotification();
            }
          });
        }
      }
    },
    
    sendNotification() {
      const notification = new Notification('Sunscreen Reminder', {
        body: `It's time to reapply your sunscreen! Current UV Index is ${this.uvIndex}.`
      });
      
      notification.onclick = () => {
        window.focus();
        notification.close();
      };
    },
    
    formatReminderTime(date) {
      if (!date) return '';
      return date.toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit', hour12: false });
    },
    
    saveReminderSettings() {
      const settings = {
        enabled: this.sunscreenReminderEnabled,
        interval: this.reminderInterval
      };
      localStorage.setItem('sunscreenReminderSettings', JSON.stringify(settings));
    },
    
    loadReminderSettings() {
      const savedSettings = localStorage.getItem('sunscreenReminderSettings');
      if (savedSettings) {
        try {
          const settings = JSON.parse(savedSettings);
          this.sunscreenReminderEnabled = settings.enabled;
          this.reminderInterval = settings.interval;
          
          if (this.sunscreenReminderEnabled) {
            this.startReminder();
          }
        } catch (e) {
          console.error('Error loading reminder settings:', e);
        }
      }
    }
  }
};
</script>

<style scoped>
.website-container {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
  line-height: 1.6;
}

.main-header {
  background-color: #ffffff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-container {
  max-width: 1600px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 80px;
}

.logo-section {
  display: flex;
  align-items: center;
  padding: 10px 0;
}

.logo-icon {
  font-size: 42px;
  margin-right: 15px;
  color: #ff9800;
}

.logo-section h1 {
  font-size: 32px;
  font-weight: 700;
  color: #4a90e2;
  margin: 0;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
  letter-spacing: 0.5px;
}

.main-navigation ul {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
}

.main-navigation li {
  margin: 0 15px;
}

.main-navigation a {
  text-decoration: none;
  color: #333;
  font-weight: 500;
  padding: 8px 0;
  position: relative;
  transition: color 0.3s;
}

.main-navigation a:hover {
  color: #4a90e2;
}

.main-navigation li.active a {
  color: #4a90e2;
}

.main-navigation li.active a::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 3px;
  background-color: #4a90e2;
  bottom: 0;
  left: 0;
}

.hero-section {
  position: relative;
  height: 500px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-image {
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -2;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: -1;
}

.hero-content {
  color: white;
  text-align: center;
  max-width: 800px;
  padding: 0 20px;
  z-index: 1;
}

.hero-content h1 {
  font-size: 48px;
  margin-bottom: 20px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.hero-content p {
  font-size: 20px;
  margin-bottom: 30px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

.hero-button {
  background-color: #4a90e2;
  color: white;
  border: none;
  padding: 12px 30px;
  font-size: 18px;
  border-radius: 30px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.hero-button:hover {
  background-color: #3a7bca;
}

.main-content {
  max-width: 1600px;
  margin: 0 auto;
  padding: 60px 20px;
}

.section-title {
  text-align: center;
  font-size: 36px;
  margin-bottom: 15px;
  color: #333;
}

.section-description {
  text-align: center;
  font-size: 18px;
  max-width: 800px;
  margin: 0 auto 50px;
  color: #666;
}

.weather-app {
  max-width: 1600px; 
  margin: 0 auto;
  padding: 0;
  background-color: #f5f9fc; 
  border-radius: 20px;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
}

.main-footer {
  background-color: #333;
  color: #fff;
  padding: 60px 0 20px;
}

.footer-container {
  max-width: 1600px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.footer-section {
  width: 30%;
  margin-bottom: 30px;
}

.footer-section h3 {
  font-size: 20px;
  margin-bottom: 20px;
  color: #4a90e2;
}

.footer-section p {
  margin-bottom: 10px;
  color: #ddd;
}

.footer-section ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-section ul li {
  margin-bottom: 10px;
}

.footer-section ul li a {
  color: #ddd;
  text-decoration: none;
  transition: color 0.3s;
}

.footer-section ul li a:hover {
  color: #4a90e2;
}

.copyright {
  max-width: 1600px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
  border-top: 1px solid #444;
}

.copyright p {
  color: #aaa;
  font-size: 14px;
}

.content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  padding: 40px;
}

.uv-card, .time-city-card {
  background-color: #f3f4f6;
  border-radius: 15px;
  padding: 30px;
  box-shadow: 5px 5px 15px rgba(0, 0, 0, 0.1), -5px -5px 15px #ffffff;
  text-align: center;
}

.uv-card.smaller {
  grid-column: 1;
}

.time-city-card.larger {
  grid-column: 2;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.datetime-row {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
}

.city-display {
  font-size: 28px;
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
}

.time-date-group {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.time-display {
  font-size: 48px;
  font-weight: bold;
  margin: 0;
  color: #333;
  line-height: 1.2;
}

.date-display {
  font-size: 16px;
  color: #555;
  margin: 0;
}

.info-card {
  background-color: #f3f4f6;
  border-radius: 15px;
  padding: 30px;
  grid-column: span 1;
  min-height: 200px;
  text-align: center;
  box-shadow: 5px 5px 15px rgba(0, 0, 0, 0.1), -5px -5px 15px #ffffff;
  font-size: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
}

.info-card h3 {
  margin-top: 0;
  margin-bottom: 15px;
  color: #4a90e2;
}

.info-card p {
  margin-top: 15px;
  font-size: 16px;
  line-height: 1.5;
}

.cancer-card, .trend-card {
  background-color: #f3f4f6;
  border-radius: 15px;
  padding: 30px;
  box-shadow: 5px 5px 15px rgba(0, 0, 0, 0.1), -5px -5px 15px #ffffff;
  text-align: center;
  height: 400px;
  display: flex;
  flex-direction: column;
}

.cancer-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 300px;
  justify-content: center;
}

.cancer-image-container {
  width: 100%;
  height: 220px;
  overflow: hidden;
  margin: 10px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  background-color: #fff;
}

.cancer-image {
  max-width: 95%;
  max-height: 95%;
  object-fit: contain;
  transition: transform 0.3s ease, opacity 0.3s ease;
  cursor: pointer;
}

.cancer-image:hover {
  transform: scale(1.02);
}

.uv-display {
  margin: 15px auto;
  font-size: 40px;
  font-weight: bold;
  padding: 15px;
  border-radius: 12px;
  width: 80px;
  height: 80px;
  background-color: #fff;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: center;
}


.uv-container {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.uv-level {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  text-align: center;
  margin-bottom: 15px;
}

.uv-meter {
  position: relative;
  height: 20px;
  width: 100%;
  border-radius: 10px;
  overflow: hidden;
}

.uv-meter-gradient {
  height: 100%;
  width: 100%;
  background: linear-gradient(to right, 
    #4caf50 0%,
    #ffeb3b 33%,
    #ff9800 66%,
    #f44336 100%
  );
}

.uv-meter-marker {
  position: absolute;
  top: 0;
  height: 100%;
  width: 3px;
  background-color: #000;
  transform: translateX(-50%);
}

.uv-meter-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 5px;
  margin-bottom: 15px;
}

.uv-meter-labels span {
  font-size: 14px;
  color: #555;
}

.uv-explanation {
  margin-top: 10px;
  font-size: 14px;
  line-height: 1.4;
  text-align: left;
  color: #555;
  padding: 10px;
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 8px;
}

.sunscreen-reminder {
  margin-top: 25px;
  padding: 15px;
  background-color: #fff;
  border-radius: 12px;
  text-align: left;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.sunscreen-reminder h3 {
  margin-top: 0;
  margin-bottom: 15px;
  font-size: 18px;
  color: #4a90e2;
}

.reminder-toggle {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
}

.toggle-label {
  font-size: 14px;
}

.switch {
  position: relative;
  display: inline-block;
  width: 46px;
  height: 24px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .3s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: .3s;
}

input:checked + .slider {
  background-color: #4caf50;
}

input:focus + .slider {
  box-shadow: 0 0 1px #4caf50;
}

input:checked + .slider:before {
  transform: translateX(22px);
}

.slider.round {
  border-radius: 24px;
}

.slider.round:before {
  border-radius: 50%;
}

.reminder-settings {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.interval-selector {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
}

.interval-selector select {
  padding: 5px 8px;
  border-radius: 5px;
  border: 1px solid #ddd;
  background-color: #f8f8f8;
  cursor: pointer;
}

.next-reminder {
  font-size: 14px;
  color: #555;
}

.next-reminder span {
  font-weight: bold;
  color: #4a90e2;
}

.temperature-trend-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 300px;
}

.trend-image-container {
  width: 100%;
  height: 220px;
  overflow: hidden;
  margin: 10px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  background-color: #fff;
}

.trend-image {
  max-width: 95%;
  max-height: 95%;
  object-fit: contain;
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.trend-description {
  margin-top: 10px;
  font-size: 14px;
  text-align: center;
  color: #555;
}

.info-card {
  padding: 20px;
  min-height: 300px;
}

.trend-image:hover {
  cursor: pointer;
  transform: scale(1.02);
}

.image-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.modal-content {
  max-width: 90%;
  max-height: 90%;
}

.full-size-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

@media (max-width: 1200px) {
  .content {
    grid-template-columns: 1fr;
  }
  
  .uv-card.smaller, .time-city-card.larger, .info-card {
    grid-column: span 1;
  }
  
  .cancer-card, .trend-card {
    height: auto;
    min-height: 350px;
  }
  
  .hero-content h1 {
    font-size: 40px;
  }
  
  .hero-content p {
    font-size: 18px;
  }
}

@media (max-width: 768px) {
  .header-container {
    flex-direction: column;
    height: auto;
    padding: 15px;
  }
  
  .logo-section {
    margin-bottom: 15px;
  }
  
  .main-navigation ul {
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .main-navigation li {
    margin: 5px 10px;
  }
  
  .hero-section {
    height: 400px;
  }
  
  .hero-content h1 {
    font-size: 32px;
  }
  
  .hero-content p {
    font-size: 16px;
  }
  
  .footer-section {
    width: 100%;
  }
}

select {
  appearance: none;
  background-color: #fff;
  border: 1px solid #ddd;
  padding: 10px 15px;
  border-radius: 8px;
  font-size: 16px;
  width: 100%;
  max-width: 300px;
  cursor: pointer;
  color: #333;
  background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23333%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E");
  background-repeat: no-repeat;
  background-position: right 0.7em top 50%;
  background-size: 0.65em auto;
  transition: border-color 0.3s, box-shadow 0.3s;
}

select:hover {
  border-color: #aaa;
}

select:focus {
  border-color: #4a90e2;
  outline: none;
  box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.2);
}

button {
  background-color: #4a90e2;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 25px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #3a7bca;
}

input[type="text"] {
  border: 1px solid #ddd;
  padding: 10px 15px;
  border-radius: 25px;
  font-size: 16px;
  outline: none;
  transition: border-color 0.3s, box-shadow 0.3s;
}

input[type="text"]:focus {
  border-color: #4a90e2;
  box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.2);
}

.city-search {
  position: relative;
  width: 100%;
  margin: 15px 0;
}

.search-input {
  width: 100%;
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  outline: none;
  transition: border-color 0.3s, box-shadow 0.3s;
  box-sizing: border-box;
}

.search-input:focus {
  border-color: #4a90e2;
  box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.2);
}

.search-results {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  max-height: 200px;
  overflow-y: auto;
  background-color: white;
  border-radius: 0 0 8px 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.search-result-item {
  padding: 10px 15px;
  cursor: pointer;
  transition: background-color 0.2s;
  text-align: left;
}

.search-result-item:hover {
  background-color: #f5f9fc;
}

.selected-city {
  margin-top: 10px;
  font-size: 14px;
  color: #4a90e2;
  font-weight: 500;
}
</style>