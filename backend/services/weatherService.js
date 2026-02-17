const axios = require('axios');

class WeatherService {
    constructor() {
        this.baseUrl = 'https://api.open-meteo.com/v1/forecast';
        this.cache = { data: null, timestamp: 0 };
        this.CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
    }

    async getWeatherData(lat, lon) {
        try {
            // Check Cache
            const now = Date.now();
            if (this.cache.data && (now - this.cache.timestamp < this.CACHE_DURATION)) {
                console.log("Serving Weather from Cache");
                return this.cache.data;
            }

            // Using Open-Meteo (No API key required for non-commercial use)
            // Added 3s timeout to fail fast and use mock data if API is slow
            const response = await axios.get(this.baseUrl, {
                params: {
                    latitude: lat,
                    longitude: lon,
                    current: 'temperature_2m,relative_humidity_2m,rain,wind_speed_10m',
                    timezone: 'auto'
                },
                timeout: 3000 // 3 seconds timeout
            });

            const elevation = response.data.elevation || 10; 
            const current = response.data.current;
            
            const weatherData = {
                temp: current.temperature_2m,
                humidity: current.relative_humidity_2m,
                rainfall: current.rain || 0,
                stormIntensity: Math.min(100, current.wind_speed_10m * 2), 
                waterLevel: 1.5, 
                elevation: elevation,
                time: current.time 
            };

            // Update Cache
            this.cache = { data: weatherData, timestamp: now };
            
            return weatherData;
        } catch (error) {
            console.error("Error fetching weather data (using fallback):", error.message);
            return this.getMockData();
        }
    }

    calculateRiskScore(data) {
        const { rainfall, stormIntensity, humidity, waterLevel, elevation, time } = data;
        
        // Equation: Risk Score = (Rainfall × 0.5) + (Storm × 0.3) + (Humidity × 0.2)
        let score = (rainfall * 0.5) + (stormIntensity * 0.3) + (humidity * 0.2);
        
        let level = 'LOW';
        let color = 'green';

        if (score > 80) {
            level = 'SEVERE';
            color = 'red';
        } else if (score > 55) {
            level = 'HIGH';
            color = 'orange';
        } else if (score > 30) {
            level = 'MODERATE';
            color = 'yellow';
        }

        // --- Severe Override Logic ---
        
        // 1. Water Level Override
        // if (water_level > threshold || risk_score > 80) { status = "SEVERE"; }
        if (waterLevel > 2.0) {
            level = 'SEVERE';
            color = 'red';
        }

        // 2. Elevation Awareness Override
        // Logic: If (Rain > 50mm) AND (Elevation is Low < 10m), then (Status = Severe).
        if (rainfall > 50 && elevation < 10) {
            level = 'SEVERE';
            color = 'red';
            console.log("Severe Risk Triggered: High Rain + Low Elevation");
        }

        return { score: score.toFixed(2), level, color, lastUpdated: time };
    }

    getMockData() {
        return {
            temp: 28,
            humidity: 85,
            rainfall: 45,
            stormIntensity: 60,
            waterLevel: 1.8
        };
    }
}

module.exports = new WeatherService();
