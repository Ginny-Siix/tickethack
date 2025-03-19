// Sélectionner les éléments HTML
const bookingContainer = document.getElementById("bookingsContainer");
const archivedContainer = document.getElementById("archivedContainer");
const showArchivedButton = document.getElementById("showArchivedButton");

// URL de l'API
const apiUrl = "https://tickethack-back404.vercel.app"; // Adresse de ton back-end

// Fonction pour afficher les réservations
function displayBookings() {
  fetch(`${apiUrl}/bookings`)
    .then((response) => response.json())
    .then((data) => {
      if (data.length > 0) {
        bookingContainer.innerHTML = ""; // Réinitialiser l'affichage des réservations
        archivedContainer.innerHTML = ""; // Réinitialiser l'affichage des archives

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
                <input type="checkbox" class="select-archive" data-id="${booking._id}" />
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
      bookingContainer.innerHTML =
        "<p>Erreur lors du chargement des réservations.</p>";
    });
}

// Fonction pour archiver une réservation
function archiveBooking(bookingId) {
  fetch(`${apiUrl}/bookings/archive/${bookingId}`, {
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
  archivedContainer.style.display =
    archivedContainer.style.display === "none" ? "block" : "none";
}

// Écouteur pour afficher/masquer les réservations archivées
showArchivedButton.addEventListener("click", toggleArchived);

// Chargement initial des réservations
displayBookings();

// Ajouter le bouton de suppression en haut des archives
const deleteButton = document.createElement("button");
deleteButton.id = "deleteArchivedButton";
deleteButton.textContent = "Supprimer les archives sélectionnées";
deleteButton.style.display = "none"; // Cacher au départ
archivedContainer.insertAdjacentElement("beforebegin", deleteButton);

// Cacher/afficher le bouton de suppression en fonction des cases cochées
archivedContainer.addEventListener("change", () => {
  const selectedCheckboxes = document.querySelectorAll(
    ".select-archive:checked"
  );
  deleteButton.style.display = selectedCheckboxes.length > 0 ? "block" : "none";
});

// Fonction pour afficher la confirmation avant de supprimer
deleteButton.addEventListener("click", () => {
  const selectedCheckboxes = document.querySelectorAll(
    ".select-archive:checked"
  );
  const idsToDelete = Array.from(selectedCheckboxes).map(
    (checkbox) => checkbox.dataset.id
  );

  if (idsToDelete.length > 0) {
    const confirmation = confirm(
      "Êtes-vous certain(e) de vouloir supprimer ? Cette action est définitive."
    );
    if (confirmation) {
      // Suppression des réservations sélectionnées
      deleteArchivedBookings(idsToDelete);
    }
  }
});

// Fonction pour supprimer les réservations
function deleteArchivedBookings(ids) {
  // Suppression des éléments du DOM
  ids.forEach((id) => {
    const archivedItem = document.querySelector(
      `.archived-item input[data-id="${id}"]`
    ).parentElement;
    archivedItem.remove();
  });

  // Suppression des réservations côté serveur
  fetch(`${apiUrl}/bookings/delete`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ids }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        alert("Les réservations ont été supprimées définitivement.");
      } else {
        alert("Erreur lors de la suppression des réservations.");
      }
    })
    .catch((error) => {
      console.error("Erreur lors de la suppression côté serveur :", error);
      alert("Erreur lors de la suppression des réservations.");
    });
}
