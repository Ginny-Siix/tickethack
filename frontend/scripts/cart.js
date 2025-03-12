// Définir l'URL de l'API
const apiUrl = "https://tickethack-two.vercel.app"; // Adresse de ton back-end

// Sélection des éléments HTML
const cartContainer = document.getElementById("cartContainer");
const totalPriceElement = document.getElementById("totalPrice");
const cartTotalSection = document.getElementById("cartTotalSection");
const payButton = document.getElementById("payButton");

// Fonction pour afficher les trajets dans le panier
function displayCart() {
  // Réinitialisation du contenu du panier
  cartContainer.innerHTML = "";
  let total = 0; // Initialisation du prix total

  fetch(`${apiUrl}/cart`)
    .then((response) => response.json())
    .then((data) => {
      if (data.result && data.cart.length > 0) {
        data.cart.forEach((cart) => {
          const tripDate = new Date(cart.date);

          // Formatage de l'heure et des minutes
          const formattedTime = tripDate.toLocaleTimeString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
          });

          // Formatage de la date
          const formattedDate = tripDate.toLocaleDateString("fr-FR");

          // Formatage des villes (majuscule initiale)
          const formattedDeparture =
            cart.departure.charAt(0).toUpperCase() +
            cart.departure.slice(1).toLowerCase();
          const formattedArrival =
            cart.arrival.charAt(0).toUpperCase() +
            cart.arrival.slice(1).toLowerCase();

          // Ajout de l'élément au panier
          cartContainer.innerHTML += `
            <div class="cart-item">
              <p>${formattedDeparture} > ${formattedArrival}</p>
              <p>${formattedDate} ${formattedTime}</p>
              <p>${cart.price}€</p>
              <button class="remove-button" onclick="removeFromCart('${cart._id}')">X</button>
            </div>
          `;

          total += parseFloat(cart.price); // Convertir en nombre et ajouter au total
        });

        totalPriceElement.textContent = `${total.toFixed(2)}€`; // Mise à jour du prix total avec 2 décimales
        cartTotalSection.style.display = "block"; // Afficher la section total
      } else {
        cartContainer.innerHTML = "<p>Aucun trajet dans votre panier.</p>";
        cartTotalSection.style.display = "none"; // Cacher la section total
      }
    })
    .catch((error) => {
      console.error("Erreur lors du chargement du panier :", error);
      cartContainer.innerHTML =
        "<p>Erreur lors du chargement du panier. Veuillez réessayer.</p>";
    });
}

// Fonction pour supprimer un trajet du panier
function removeFromCart(idTripDelete) {
  fetch(`${apiUrl}/cart/delete/${idTripDelete}`, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.result) {
        displayCart(); // Rafraîchir le panier après suppression
      } else {
        console.error("Erreur lors de la suppression de l'élément");
      }
    })
    .catch((error) => console.error("Erreur lors de la suppression :", error));
}

// Nouvelle fonction pour valider les billets et les transférer vers les réservations
function validateBookings() {
  fetch(`${apiUrl}/pay`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.result) {
        // Si les billets ont été transférés avec succès, rediriger vers la page des réservations
        localStorage.setItem("paymentInitiated", "true");
        window.location.href = "bookings.html"; // Ou mettre l'URL appropriée
      } else {
        alert(
          data.error ||
            "Une erreur est survenue lors de la validation des billets."
        );
      }
    })
    .catch((error) => {
      console.error("Erreur lors de la validation des billets :", error);
      alert("Erreur lors de la validation des billets.");
    });
}

// Écouteur pour le bouton "Payer"
payButton.addEventListener("click", validateBookings);

// Chargement initial du panier
displayCart();
