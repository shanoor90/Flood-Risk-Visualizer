exports.getSurvivalGuide = (req, res) => {
    const guideData = {
        firstAid: [
            { id: 1, title: "Treating Hypothermia", content: "Move victim to dry area, remove wet clothes, cover with blankets." },
            { id: 2, title: "Wound Care", content: "Clean with pure water, apply pressure to stop bleeding." }
        ],
        emergencyContacts: [
            { name: "National Hotline", number: "119" },
            { name: "Disaster Management Center", number: "117" },
            { name: "Ambulance", number: "1990" }
        ],
        shelters: [
            { name: "Community Center A", location: "Colombo North", capacity: "High" },
            { name: "Public School B", location: "Gampaha", capacity: "Medium" }
        ],
        tips: [
            "Store enough clean water for 3 days.",
            "Keep an emergency radio with batteries.",
            "Know your local evacuation routes."
        ]
    };

    res.json(guideData);
};
