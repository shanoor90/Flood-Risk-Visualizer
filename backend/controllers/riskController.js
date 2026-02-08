const weatherService = require('../services/weatherService');

exports.getRiskData = async (req, res) => {
    try {
        const { lat, lon } = req.query;

        if (!lat || !lon) {
            return res.status(400).json({ error: "Latitude and Longitude are required" });
        }

        const weatherData = await weatherService.getWeatherData(lat, lon);
        const riskAnalysis = weatherService.calculateRiskScore(weatherData);

        res.json({
            location: { lat, lon },
            weather: weatherData,
            risk: riskAnalysis,
            timestamp: new Date()
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
