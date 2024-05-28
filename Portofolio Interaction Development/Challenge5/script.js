
const map = L.map('map').setView([51.2194, 4.4025], 13); // Antwerp coordinates


L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);


const locations = [
    { lat: 51.2194, lng: 4.4025, challenge: "Wat is de naam van de beroemde kathedraal in het centrum van Antwerpen?", answer: "Onze-Lieve-Vrouwekathedraal", points: 10 },
    { lat: 51.2161, lng: 4.3997, challenge: "Hoe heet het centrale plein van Antwerpen?", answer: "Grote Markt", points: 10 },
    { lat: 51.2101, lng: 4.3921, challenge: "Welke dierentuin bevindt zich in Antwerpen?", answer: "Zoo Antwerpen", points: 10 },
    { lat: 51.2282, lng: 4.4166, challenge: "Hoe heet het beroemde museum aan de Schelde?", answer: "Museum aan de Stroom", points: 10 },
    { lat: 51.2211, lng: 4.3997, challenge: "Welke bekende winkelstraat loopt van het Centraal Station naar de Meir?", answer: "De Keyserlei", points: 10 }
];

locations.forEach((location, index) => {
    const marker = L.marker([location.lat, location.lng]).addTo(map);
    marker.on('click', () => {
        handleChallenge(index);
    });
});

let score = 0;

function handleChallenge(index) {
    const location = locations[index];
    const userAnswer = prompt(location.challenge);

    if (userAnswer && userAnswer.toLowerCase() === location.answer.toLowerCase()) {
        alert("Correct! Je verdient " + location.points + " punten.");
        score += location.points;
        document.getElementById('score').innerText = score;
    } else {
        alert("Helaas, dat is niet correct.");
    }
}

// Geolocation to center the map on the user's location
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
        map.setView([userLat, userLng], 13);

        // Add a marker for the user's location
        L.marker([userLat, userLng]).addTo(map).bindPopup("Je bent hier!").openPopup();
    });
} else {
    alert("Geolocatie wordt niet ondersteund door deze browser.");
}
