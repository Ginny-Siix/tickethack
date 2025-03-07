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

  fetch(`http://localhost:3000/trip/search?departure=${departureValue}&arrival=${arrivalValue}&date=${dateValue}`)
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

    const tripDate = new Date(trip.date);
      
    // Récupérer l'heure et les minutes en UTC 
    let hours = tripDate.getUTCHours(); 
    let minutes = tripDate.getUTCMinutes();

    // Format HH:MM (ajoute un zéro devant si nécessaire)
    const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;

    tripsContainer.innerHTML += `
      <div class="trip-item">
          <p><strong>Départ :</strong> ${trip.departure}</p>
          <p><strong>Arrivée :</strong> ${trip.arrival}</p>
          <p><strong>Date :</strong> ${formattedTime}</p>
          <p><strong>Prix :</strong> ${trip.price} €</p>
          <button class="add-to-cart" data-id="${trip.departure}-${
      trip.arrival
    }">
            Ajouter au panier
          </button>
      </div>`;

      for (let i = 0; i < addToCartButton.length; i++) {
        addToCartButton[i].addEventListener('click', function () {
           fetch(`http://localhost:3000/cart/add?departure=${trip.departure}&arrival=${trip.arrival}&date=${trip.date}&price=${trip.price}`, {
             method: 'POST',
             headers : {'Content-Type': 'application/json'},
             body: JSON.stringify({departure: trip.departure, arrival: trip.arrival, date: trip.date, price: trip.price})
           })
           .then(reponse => reponse.json())
           .then(data => {console.log("Trip well added in collection : ", data)})
           
         })
       };
  });
}
//ok