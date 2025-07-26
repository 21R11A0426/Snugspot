document.addEventListener("DOMContentLoaded", () => {
  if (!window.L || !listingCoordinates) return;

  const map = L.map('map').setView([listingCoordinates[1], listingCoordinates[0]], 13); // [lat, lng]

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  L.marker([listingCoordinates[1], listingCoordinates[0]]).addTo(map)
    .bindPopup('Listing Location')
    .openPopup();
});


