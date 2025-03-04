// Sélection des éléments HTML
const tripsContainer = document.getElementById("results-card");
const emptyMessage = document.getElementById("empty-message");
const searchButton = document.getElementById("searchButton");
const departureInput = document.getElementById("departure");
const arrivalInput = document.getElementById("arrival");

let allTrips = []; // Stocker tous les trajets ici

// Fonction pour charger les trajets au démarrage
function loadTrips() {
  fetch("http://localhost:3000/trip/search")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Erreur lors du chargement des trajets");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Données chargées :", data); // Vérification

      if (data.trips && data.trips.length > 0) {
        allTrips = data.trips; // Stocke les trajets
      } else {
        allTrips = [];
      }
    })
    .catch((error) => console.error("Erreur :", error));
}

// Événement pour lancer la recherche
searchButton.addEventListener("click", function () {
  const departureValue = departureInput.value.trim().toLowerCase();
  const arrivalValue = arrivalInput.value.trim().toLowerCase();
  console.log("Bouton cliqué !", departureValue, arrivalValue);

  if (departureValue === "" || arrivalValue === "") {
    emptyMessage.textContent = "Veuillez renseigner un départ et une arrivée.";
    emptyMessage.style.display = "block";
    tripsContainer.innerHTML = "";
    return;
  }

  emptyMessage.style.display = "none"; // Cache le message d'erreur
  searchTrips(departureValue, arrivalValue); // Lancer la recherche
});

// Fonction pour rechercher des trajets avec des filtres
function searchTrips(departure, arrival) {
  const url = `http://localhost:3000/trip/search?departure=${encodeURIComponent(departure)}&arrival=${encodeURIComponent(arrival)}`;
  
  console.log("URL envoyée :", url); // Vérifie l'URL construite

  fetch(url)
    .then((response) => {
      if (!response.ok) {
        tripsContainer.innerHTML=``;
      }
      return response.json();
    })
    .then((data) => {
      console.log("Données reçues :", data); // Vérifie la réponse du backend
      if (data.trips && data.trips.length > 0) {
        displayTrips(data.trips);
      } else {
        tripsContainer.innerHTML = "";
        emptyMessage.textContent = "Aucun trajet trouvé.";
        emptyMessage.style.display = "block";
      }
    })
}

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
          <button class="add-to-cart" data-id="${trip.departure}-${
      trip.arrival
    }">
            Ajouter au panier
          </button>
      </div>`;
  });
}

// Charger les trajets au démarrage (remarque : ce fetch ne les affiche pas directement)
loadTrips();
