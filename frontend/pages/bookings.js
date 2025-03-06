// Redirection to the Bookings page
//document.querySelector('#payButton').addEventListener('click', function () {});
//window.location.href = 'pages/bookings.html';
//let page = document.body.dataset.page;

const bookingsContainer = document.getElementById("bookingsContainer");
const emptyMessage = document.getElementById("emptyMessage");

const bookingData = { departure, arrival, date, price }; // Ensure these are defined

fetch("http://localhost:3000/bookings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(bookingData),
})
    .then((response) => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then((data) => {
        if (data.result) {
            bookingsContainer.innerHTML = "";
            const bookingDate = new Date(data.date);
            const hoursUntil = Math.round((bookingDate - new Date()) / (1000 * 60 * 60));
            const departureText = hoursUntil >= 0 
                ? `Departure in ${hoursUntil} hours` 
                : `Departed ${Math.abs(hoursUntil)} hours ago`;

            bookingsContainer.innerHTML = `
                <div id="booking-container">
                    <div class="booking-title">My bookings</div>
                    <div class="booking-box">
                        <span>${data.departure} > ${data.arrival}</span>
                        <span>${data.date}</span>
                        <span>${data.price}€</span>
                        <span>${departureText}</span>
                    </div>
                    <div class="separator"></div>
                    <a href="#" class="footer-text">Enjoy your travels with Tickethack!</a>
                </div>
            `;
            if (emptyMessage) emptyMessage.style.display = "none";
        } else {
            bookingsContainer.innerHTML = "No bookings found.";
        }
    })
    .catch((error) => {
        bookingsContainer.innerHTML = "Error fetching bookings. Please try again.";
        console.error('Fetch error:', error);
    });


