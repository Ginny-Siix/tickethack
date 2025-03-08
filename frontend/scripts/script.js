// Sélection des éléments HTML
const tripsContainer = document.getElementById("results-card");
const emptyMessage = document.getElementById("empty-message");
const searchButton = document.getElementById("searchButton");
const departureInput = document.getElementById("departure");
const arrivalInput = document.getElementById("arrival");
const dateDepartureInput = document.getElementById("date");
const addToCartButton = document.querySelectorAll('.add-to-cart');
const cartMessage = document.getElementById("cart-message");

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

  fetch(
    `http://localhost:3000/trip/search?departure=${departureValue}&arrival=${arrivalValue}&date=${dateValue}`
  )
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
    const tripId = trip._id;

    tripsContainer.innerHTML += `
      <div class="trip-item">
          <p><strong></strong> ${trip.departure}</p>
          <p><strong></strong> ${trip.arrival}</p>
          <p><strong></strong> ${formattedTime}</p>
          <p><strong></strong> ${trip.price} €</p>
          <button class="add-to-cart" onclick="addToCart('${tripId}')">Ajouter au panier</button>
      </div>`;
  });
}

function addToCart(tripId) {
  console.log("Appel fonction addToCart");
  console.log("trip id : ", tripId);

  fetch(`http://localhost:3000/cart/add/${tripId}`, {
    method: 'POST',
  })
    .then(response => response.json())
    .then(data => {
      console.log("Réponse API :", data); // Debugging
      const cartMessage = document.getElementById("cart-message");

      if (data.result) {
        cartMessage.textContent = "✅ Votre billet a été ajouté au panier !";
        cartMessage.style.color = "green";
      } else if (data.error && data.error.toLowerCase().includes("ce billet existe déjà")) { 
        // Vérifie si l'erreur retournée par l'API indique que le billet est déjà dans le panier
        cartMessage.textContent = "⚠️ Ce billet existe déjà dans votre panier.";
        cartMessage.style.color = "orange";
      } else {
        cartMessage.textContent = "❌ Erreur : le billet n'a pas pu être ajouté.";
        cartMessage.style.color = "red";
      }

      cartMessage.style.display = "block";

      // Faire disparaître le message après 3 secondes
      setTimeout(() => {
        cartMessage.style.display = "none";
      }, 3000);
    })
    .catch(error => {
      console.error("Erreur lors de l'ajout au panier :", error);
    });
}
//ok
