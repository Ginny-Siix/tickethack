// Sélection des éléments HTML
const tripsContainer = document.getElementById("results-card");
const emptyMessage = document.getElementById("empty-message");
const searchButton = document.getElementById("searchButton");
const departureInput = document.getElementById("departure");
const arrivalInput = document.getElementById("arrival");
let allTrips = []; // Stocker tous les trajets ici

// Fonction pour charger les trajets depuis trips.json
function loadTrips() {
  fetch("../trips.json") // Récupère les données du fichier JSON
    .then((response) => {
      if (!response.ok) {
        throw new Error("Erreur de chargement des trajets");
      }
      return response.json();
    })
    .then((data) => {
      allTrips = data; // On stocke les trajets mais on ne les affiche pas
    })
}

// Fonction pour afficher les trajets
function displayTrips(trips) {
  tripsContainer.innerHTML = ""; // Vide la section avant d'ajouter les nouveaux trajets

  if (trips.length === 0) {
    emptyMessage.style.display = "block"; // Affiche le message si aucun résultat
  } else {
    emptyMessage.style.display = "none"; // Cache le message
  }

  const tripsHTML = trips
    .map(
      (trip) => `
        <div class="trip-item">
            <p><strong>Départ :</strong> ${trip.departure}</p>
            <p><strong>Arrivée :</strong> ${trip.arrival}</p>
            <p><strong>Date :</strong> ${new Date(
              trip.date.$date
            ).toLocaleDateString("fr-FR")}</p>
            <button class="add-to-cart" data-id="${trip.departure}-${
        trip.arrival
      }">Ajouter au panier</button>
        </div>
    `
    )
    .join("");

  tripsContainer.innerHTML = tripsHTML;
}

// Fonction pour rechercher les trajets
function searchTrips() {
  const departureValue = departureInput.value.trim().toLowerCase();
  const arrivalValue = arrivalInput.value.trim().toLowerCase();

  // Filtrer les trajets selon les entrées
  const filteredTrips = allTrips.filter(
    (trip) =>
      trip.departure.toLowerCase().includes(departureValue) &&
      trip.arrival.toLowerCase().includes(arrivalValue)
  );

  displayTrips(filteredTrips);
}

// Événement pour lancer la recherche
searchButton.addEventListener("click", searchTrips);

// Charger les trajets au démarrage de la page sans les afficher
loadTrips();
