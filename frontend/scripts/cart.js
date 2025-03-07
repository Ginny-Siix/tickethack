// Variables pour les éléments HTML
const cartContainer = document.getElementById("cartContainer");
const totalPriceElement = document.getElementById("totalPrice");
//let cartItems = []; // Tableau pour stocker les éléments du panier

// Exemple de fonction pour ajouter un trajet au panier
/* function addToCart(departure, arrival, time, price) {
  const cartItem = {
    departure,
    arrival,
    time,
    price,
  };

  //cartItems.push(cartItem);
  displayCart();
} */

// Fonction pour afficher les trajets dans le panier
function displayCart() {
  // Vider le panier avant de réafficher les éléments
  cartContainer.innerHTML = "";

  // initialisation de la variable pour afficher le prix total du panier
  let total = 0;

  fetch("http://localhost:3000/cart")
    .then(response => response.json())
    .then(data => {
      if (data.result) {

        data.cart.forEach((cart) => {
          //const cartItemDiv = document.createElement("div");
          //cartItemDiv.classList.add("cart-item");
          const tripDate = new Date(cart.date);
      
          // Récupérer l'heure et les minutes en UTC 
          let hours = tripDate.getUTCHours(); 
          let minutes = tripDate.getUTCMinutes();

          const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;

          // Récupérer les jours, mois et année
          const day = String(tripDate.getDate()).padStart(2, '0');  // Ajouter un zéro devant si nécessaire
          const month = String(tripDate.getMonth() + 1).padStart(2, '0');  // Les mois commencent à 0 (Jan = 0, Feb = 1, etc.)
          const year = tripDate.getFullYear();

          const formattedDate = `${day}/${month}/${year}`;

          //Formatter pour les villes de départ et d'arrrivée ont la première lettre en majuscule et le reste en miniscule
          const formattedDeparture = cart.departure.charAt(0).toUpperCase() + cart.departure.slice(1).toLowerCase();
          const formattedArrival = cart.arrival.charAt(0).toUpperCase() + cart.arrival.slice(1).toLowerCase();
  

          cartContainer.innerHTML += `
          <div class ="cart-item">
            <p>${formattedDeparture} > ${formattedArrival}</p>
            <p>${formattedDate} ${formattedTime}</p>
            <p>${cart.price}€</p>
            <button class="remove-button" onclick="removeFromCart">X</button>
            </div>
          `;

          //cartContainer.appendChild(cartItemDiv);

          total += cart.price; // Ajouter au total

          totalPriceElement.textContent = total + "€";
          document.getElementById("cartTotalSection").style.display = data.cart.length ? "block" : "none"; // Afficher ou cacher la section total
        });
      }
    });
}

// Fonction pour supprimer un trajet du panier
function removeFromCart(index) {
  //cartItems.splice(ex, 1); // Supprimer l'élément à l'index donné
  for (let i = 0; i < document.querySelectorAll('.remove-button').length; i++) {
    document.querySelectorAll('.delete')[i].addEventListener('click', function () {
      this.parentNode.remove();
      const messagesCount = document.querySelectorAll('p').length;
      document.querySelector('#count').textContent = messagesCount;
    })
  };

  displayCart(); // Réafficher le panier après suppression
}

//Appel de la fonction pour afficher la liste des voyages contenus dans le panier
displayCart();

// Ajouter des trajets au panier (exemples)
//addToCart("Paris", "Lyon", "20:09", 103);
//addToCart("Lyon", "Marseille", "15:45", 89);
