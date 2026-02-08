const axios = require('axios');

class WeatherService {
    constructor() {
        this.baseUrl = 'https://api.open-meteo.com/v1/forecast';
    }

    async getWeatherData(lat, lon) {
        try {
            // Using Open-Meteo (No API key required for non-commercial use)
            // It provides high-resolution data including rainfall and humidity
            const response = await axios.get(this.baseUrl, {
                params: {
                    latitude: lat,
                    longitude: lon,
                    current: 'temperature_2m,relative_humidity_2m,rain,wind_speed_10m',
                    timezone: 'auto'
                }
            });

            const current = response.data.current;
            return {
                temp: current.temperature_2m,
                humidity: current.relative_humidity_2m,
                rainfall: current.rain || 0,
                // Simulate storm intensity based on wind speed (km/h)
                stormIntensity: Math.min(100, current.wind_speed_10m * 2), 
                waterLevel: 1.5, // Mock water level as it's not in weather APIs
                time: current.time // Accurate current time from API
            };
        } catch (error) {
            console.error("Error fetching weather data from Open-Meteo:", error.message);
            return this.getMockData();
        }
    }

    calculateRiskScore(data) {
        const { rainfall, stormIntensity, humidity, waterLevel, time } = data;
        
        // Equation: Risk Score = (Rainfall × 0.5) + (Storm Intensity × 0.3) + (Humidity × 0.2)
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

        // Override: if water level is high (e.g. > 2.0m), show as severe
        if (waterLevel > 2.0) {
            level = 'SEVERE';
            color = 'red';
        }

        return { score: score.toFixed(2), level, color, lastUpdated: time };
    }

    simulateStormIntensity(weather) {
        // Simple logic to simulate storm intensity based on wind speed
        const windSpeed = weather.wind ? weather.wind.speed : 0;
        return Math.min(100, windSpeed * 5); // Scale wind to 0-100
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
