const axios = require('axios');

class WeatherService {
    constructor() {
        this.baseUrl = 'https://api.open-meteo.com/v1/forecast';
    }

    async getWeatherData(lat, lon) {
        try {
            // Using Open-Meteo (No API key required for non-commercial use)
            // It provides high-resolution data including rainfall, humidity, and elevation
            const response = await axios.get(this.baseUrl, {
                params: {
                    latitude: lat,
                    longitude: lon,
                    current: 'temperature_2m,relative_humidity_2m,rain,wind_speed_10m',
                    timezone: 'auto'
                }
            });

            // Fetch Elevation separately or mock it if not available in this endpoint (Open-Meteo has an elevation API, but simple forecast endpoint returns elevation in metadata sometimes. 
            // For now, let's use the elevation from the response if available, or fetch from elevation API.
            // Actually Open-Meteo returns elevation in the main response object, not 'current'.
            const elevation = response.data.elevation || 10; // Default to 10m if missing

            const current = response.data.current;
            return {
                temp: current.temperature_2m,
                humidity: current.relative_humidity_2m,
                rainfall: current.rain || 0,
                // Simulate storm intensity based on wind speed (km/h)
                stormIntensity: Math.min(100, current.wind_speed_10m * 2), 
                waterLevel: 1.5, // Mock water level as it's not in weather APIs
                elevation: elevation,
                time: current.time // Accurate current time from API
            };
        } catch (error) {
            console.error("Error fetching weather data from Open-Meteo:", error.message);
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
