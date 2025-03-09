// Sélectionner les éléments HTML
const bookingContainer = document.getElementById("bookingContainer");
const archivedContainer = document.getElementById("archivedContainer");
const showArchivedButton = document.getElementById("showArchivedButton");

// Fonction pour afficher les réservations
function displayBookings() {
  fetch("http://localhost:3000/bookings")
    .then((response) => response.json())
    .then((data) => {
      if (data.length > 0) {
        bookingContainer.innerHTML = ""; // Réinitialiser l'affichage des réservations
        data.forEach((booking) => {
          const tripDate = new Date(booking.date);

          // Formatage de la date et de l'heure
          const formattedDate = tripDate.toLocaleDateString("fr-FR");
          const formattedTime = tripDate.toLocaleTimeString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
          });

          // Afficher les réservations non archivées
          if (!booking.archived) {
            bookingContainer.innerHTML += `
              <div class="booking-item">
                <p>${booking.departure} > ${booking.arrival}</p>
                <p>${formattedDate} ${formattedTime}</p>
                <p>${booking.price}€</p>
                <button onclick="archiveBooking('${booking._id}')">Archiver</button> <!-- Bouton d'archivage -->
              </div>
            `;
          } else {
            archivedContainer.innerHTML += `
              <div class="archived-item">
                <p>${booking.departure} > ${booking.arrival}</p>
                <p>${formattedDate} ${formattedTime}</p>
                <p>${booking.price}€</p>
              </div>
            `;
          }
        });
      } else {
        bookingContainer.innerHTML = "<p>Aucune réservation trouvée.</p>";
      }
    })
    .catch((error) => {
      console.error("Erreur lors du chargement des réservations :", error);
      bookingContainer.innerHTML = "<p>Erreur lors du chargement des réservations.</p>";
    });
}

// Fonction pour archiver une réservation
function archiveBooking(bookingId) {
  fetch(`http://localhost:3000/bookings/archive/${bookingId}`, {
    method: "PUT",
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.result) {
        displayBookings(); // Rafraîchir les réservations après archivage
        alert("Réservation archivée avec succès !");
      } else {
        alert("Erreur lors de l'archivage de la réservation.");
      }
    })
    .catch((error) => {
      console.error("Erreur lors de l'archivage :", error);
      alert("Erreur lors de l'archivage de la réservation.");
    });
}

// Fonction pour afficher/masquer les réservations archivées
function toggleArchived() {
  archivedContainer.style.display = archivedContainer.style.display === "none" ? "block" : "none";
}

// Écouteur pour afficher/masquer les réservations archivées
showArchivedButton.addEventListener("click", toggleArchived);

// Chargement initial des réservations
displayBookings();
