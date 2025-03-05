// Sélection des éléments HTML
const tripsContainer = document.getElementById("results-card");
const emptyMessage = document.getElementById("empty-message");
const searchButton = document.getElementById("searchButton");
const departureInput = document.getElementById("departure");
const arrivalInput = document.getElementById("arrival");
const dateDepartureInput = document.getElementById("date");

let allTrips = []; // Stocker tous les trajets ici

// Fonction pour charger les trajets au démarrage

// Événement pour lancer la recherche
searchButton.addEventListener("click", function () {
  const departureValue = departureInput.value.trim().toLowerCase();
  const arrivalValue = arrivalInput.value.trim().toLowerCase();
  const dateValue = dateDepartureInput.value; // Récupère la date de départ
  console.log("Bouton cliqué !", departureValue, arrivalValue, dateValue);

  if (departureValue === "" || arrivalValue === "" || dateValue === "") {
    emptyMessage.textContent =
      "Veuillez renseigner un départ, une arrivée et une date de départ.";
    emptyMessage.style.display = "block";
    tripsContainer.innerHTML = "";
    return;
  }

  fetch("http://localhost:3000/trip/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      departure: departureValue,
      arrival: arrivalValue,
      date: dateValue,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      allTrips = data.trips;
      if (data.result) {
        displayTrips(allTrips);
      } else {
        tripsContainer.innerHTML = "";
        // Ajouter l'image et le message
        tripsContainer.innerHTML = `
          <div class="no-trips">
            <img src="./images/notfound.png" alt="Illustration du train" class="no-trips-img">
            <p>Aucun trajet disponible</p>
          </div>`;
        emptyMessage.style.display = "none"; // Masquer le message d'erreur précédent
      }
    });
});

// Fonction pour afficher les trajets
function displayTrips(trips) {
  tripsContainer.innerHTML = ""; // Vide l'affichage avant d'ajouter les nouveaux trajets

  trips.forEach((trip) => {
    tripsContainer.innerHTML += `
      <div class="trip-item">
          <p><strong>Départ :</strong> ${trip.departure}</p>
          <p><strong>Arrivée :</strong> ${trip.arrival}</p>
          <p><strong>Date :</strong> ${new Date(trip.date).toLocaleDateString(
            "fr-FR"
          )}</p>
          <p><strong>Prix :</strong> ${trip.price} €</p>
          <button class="add-to-cart" data-id="${trip.departure}-${
      trip.arrival
    }">
            Ajouter au panier
          </button>
      </div>`;
  });
}
//ok