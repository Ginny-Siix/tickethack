// Définir l'URL de l'API
const apiUrl = "https://tickethack-back404.vercel.app"; // Adresse de ton back-end

// Sélection des éléments HTML
const tripsContainer = document.getElementById("results-card");
const emptyMessage = document.getElementById("empty-message");
const searchButton = document.getElementById("searchButton");
const departureInput = document.getElementById("departure");
const arrivalInput = document.getElementById("arrival");
const dateDepartureInput = document.getElementById("date");
const cartMessage = document.getElementById("cart-message");

let allTrips = []; // Stocke tous les trajets récupérés depuis l'API

// Événement pour lancer la recherche de trajets
searchButton.addEventListener("click", function () {
  const departureValue = departureInput.value.trim().toLowerCase();
  const arrivalValue = arrivalInput.value.trim().toLowerCase();
  const dateValue = dateDepartureInput.value;

  console.log(departureValue, arrivalValue, dateValue); // Debugging

  // Vérification que tous les champs sont remplis
  if (!departureValue || !arrivalValue || !dateValue) {
    emptyMessage.textContent =
      "Veuillez renseigner un départ, une arrivée et une date de départ.";
    emptyMessage.style.display = "block";
    tripsContainer.innerHTML = "";
    return;
  }

  // Requête à l'API pour chercher les trajets correspondants
  fetch(
    `https://tickethack-back404.vercel.app/trip/search?departure=${departureValue}&arrival=${arrivalValue}&date=${dateValue}`
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      if (data.result) {
        allTrips = data.trips;
        displayTrips(allTrips); // Affichage des trajet s
      } else {
        tripsContainer.innerHTML = ` 
          <div class="no-trips">
            <img src="./images/notfound.png" alt="Illustration du train" class="no-trips-img">
            <p>Aucun trajet disponible</p>
          </div>`;
        emptyMessage.style.display = "none";
      }
    })
    .catch((error) => {
      console.error("Erreur lors de la récupération des trajets :", error);
      tripsContainer.innerHTML = `<p>Erreur lors de la récupération des trajets. Veuillez réessayer.</p>`;
      emptyMessage.style.display = "none";
    });
});

// Fonction pour afficher les trajets récupérés
function displayTrips(trips) {
  tripsContainer.innerHTML = ""; // Réinitialise le conteneur avant l'affichage

  trips.forEach((trip) => {
    const tripDate = new Date(trip.date);
    const formattedTime = `${tripDate
      .getUTCHours()
      .toString()
      .padStart(2, "0")}:${tripDate
      .getUTCMinutes()
      .toString()
      .padStart(2, "0")}`;

    tripsContainer.innerHTML += `
      <div class="trip-item">
        <p><strong>Départ :</strong> ${trip.departure}</p>
        <p><strong>Arrivée :</strong> ${trip.arrival}</p>
        <p><strong>Heure :</strong> ${formattedTime}</p>
        <p><strong>Prix :</strong> ${trip.price} €</p>
        <button class="add-to-cart" onclick="addToCart('${trip._id}')">Ajouter au panier</button>
      </div>`;
  });
}

// Fonction pour ajouter un trajet au panier
function addToCart(tripId) {
  fetch(`${apiUrl}/cart/add/${tripId}`, {
    method: "POST",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Erreur lors de l'ajout au panier.");
      }
      return response.json();
    })
    .then((data) => {
      if (data.result) {
        cartMessage.textContent = "✅ Votre billet a été ajouté au panier !";
        cartMessage.style.color = "green";
      } else if (data.error?.toLowerCase().includes("ce billet existe déjà")) {
        cartMessage.textContent = "⚠️ Ce billet existe déjà dans votre panier.";
        cartMessage.style.color = "orange";
      } else {
        cartMessage.textContent =
          "❌ Erreur : le billet n'a pas pu être ajouté.";
        cartMessage.style.color = "red";
      }
      cartMessage.style.display = "block";

      // Faire disparaître le message après 3 secondes
      setTimeout(() => (cartMessage.style.display = "none"), 3000);
    })
    .catch((error) => {
      console.error("Erreur lors de l'ajout au panier :", error);
      cartMessage.textContent = "❌ Erreur lors de l'ajout au panier.";
      cartMessage.style.color = "red";
      cartMessage.style.display = "block";
      setTimeout(() => (cartMessage.style.display = "none"), 3000);
    });
}
