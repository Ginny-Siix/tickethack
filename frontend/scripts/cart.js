// Variables pour les éléments HTML
const cartContainer = document.getElementById("cartContainer");
const totalPriceElement = document.getElementById("totalPrice");
let cartItems = []; // Tableau pour stocker les éléments du panier

// Exemple de fonction pour ajouter un trajet au panier
function addToCart(departure, arrival, time, date, price) {
  const cartItem = {
    departure,
    arrival,
    time,
    date,
    price,
  };

  cartItems.push(cartItem);
  displayCart();
}
console.log(cartItems)
// Fonction pour afficher les trajets dans le panier
function displayCart() {
  // Vider le panier avant de réafficher les éléments
  cartContainer.innerHTML = "";

  let total = 0;
  
  cartItems.forEach((item, index) => {
    const cartItemDiv = document.createElement("div");
    cartItemDiv.classList.add("cart-item");
    
    cartItemDiv.innerHTML = `
      <p>${item.departure} > ${item.arrival}</p>
      <p>${item.date}</p>
      <p>${item.time}</p>
      <p>${item.price}€</p>
      <button class="remove-button" onclick="removeFromCart(${index})">X</button>
    `;
    
    cartContainer.appendChild(cartItemDiv);
    
    total += item.price; // Ajouter au total
  });

  totalPriceElement.textContent = total + "€";
  document.getElementById("cartTotalSection").style.display = cartItems.length ? "block" : "none"; // Afficher ou cacher la section total
}

// Fonction pour supprimer un trajet du panier
function removeFromCart(index) {
  cartItems.splice(index, 1); // Supprimer l'élément à l'index donné
  displayCart(); // Réafficher le panier après suppression
}

// Ajouter des trajets au panier (exemples)
addToCart("Paris", "Lyon", "20:09", "03/03/25", 100);
addToCart("Orleans", "Valence", "18:55","03/03/25", 100);
addToCart("Orleans", "Valence", "18:55", "03/03/25",100);
addToCart("Orleans", "Nantes",  "18:55", "03/03/25",100);
addToCart("Orleans", "Poudlard", "18:55", "03/03/25",100);
addToCart("Valence", "Orleans", "13:55", "03/03/25",100);

