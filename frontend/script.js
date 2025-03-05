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

// Ajouter un événement à chaque bouton "Ajouter au panier" pour ajouter le ticket au panier

document.addEventListener("click", function (event) {
  if (event.target.classList.contains("add-to-cart")) {
    const tripId = event.target.dataset.id;
    const trip = allTrips.find((trip) => trip.departure + "-" + trip.arrival === tripId);

    // Créer un nouveau ticket
    const ticket = {
      departure: trip.departure,
      arrival: trip.arrival,
      date: trip.date,
      price: trip.price, // Ajouter le prix du ticket à votre choix
    };
    console.log("Ticket ajouté :", ticket);

    // Ajouter le ticket au panier
    // TODO: Ajouter le ticket au panier en utilisant une API ou une base de données

    // Afficher un message de confirmation
    alert("Trajet ajouté au panier");
  }
});