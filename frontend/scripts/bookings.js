// Redirection to the Bookings page
//document.querySelector('#payButton').addEventListener('click', function () {});
//window.location.href = 'pages/bookings.html';
//let page = document.body.dataset.page;

const bookingsContainer = document.getElementById("bookingsContainer");
const loadBookingsBtn = document.getElementById("loadBookingsBtn");
const emptyMessage = document.getElementById("emptyMessage"); // 


const bookingData = {
    departure: "Paris",
    arrival: "Lyon",
    date: "2025-03-03",
    price: 30
};
//tripId = '67c71793f2cecf2d3cdda3d8';
function fetchBookings() {
    //
    //bookingsContainer.innerHTML = "Loading...";

    fetch("http://localhost:3000/bookings") //$//{tripId}
        .then((response) => response.json())
        .then((data) => {
            //let dataArray = Object.values(data);
            //console.log(dataArray.length);
            //console.log(dataArray[0]);
            //console.log(dataArray[1]);
            //let iterableArray = Object.values(dataArray[1]);
            bookingsContainer.innerHTML = `<div class="booking-title">My bookings</div>`;
            for (let elem of data) {
                //console.log(elem);
                if (data) {
                    console.log(elem);
                    bookingsContainer.innerHTML += "";
                    const bookingDate = new Date(elem.date);
                    const hoursUntil = Math.round((bookingDate - new Date()) / (1000 * 60 * 60));
                    const departureText = hoursUntil >= 0
                        ? `Departure in ${hoursUntil} hours`
                        : `Departed ${Math.abs(hoursUntil)} hours ago`;

                    bookingsContainer.innerHTML += `
                    <div id="booking-container">
                        
                        <div class="booking-box">
                            <span>${elem.departure} > ${elem.arrival}</span>
                            <span>${elem.date.split("T")[0]}</span>
                            <span>${elem.price}€</span>
                            <span>${departureText}</span>
                        </div>
                        
                        
                    </div>
                `;
                    if (emptyMessage) {emptyMessage.style.display = "none"};
                }
                    else {
                        bookingsContainer.innerHTML = "No bookings found.";
                    }
            }
            bookingsContainer.innerHTML += `
            <div class="separator"></div>
            <a href="#" class="footer-text">Enjoy your travels with Tickethack!</a>`
            })
            .catch((error) => {
                bookingsContainer.innerHTML = "Error fetching bookings. Please try again.";
                console.error('Fetch error:', error);
            });
}


loadBookingsBtn.addEventListener('click', fetchBookings);


