const API_URL = "https://crudcrud.com/api/87dc6dddc4e84febb3c2b3143e1b96bf/bookings";
const bookingForm = document.getElementById("booking-form");
const seatList = document.getElementById("seat-list");
const totalSeatsElement = document.getElementById("total-seats");
const searchNameInput = document.getElementById("search-name");
const searchButton = document.getElementById("search-button");

const fetchBookings = async () => {
  try {
    const response = await axios.get(API_URL);
    seatList.innerHTML = "";
    updateTotalSeats(response.data.length);
    response.data.forEach((booking) => displayBooking(booking));
  } catch (error) {
    console.error("Error fetching bookings:", error);
  }
};

const displayBooking = (booking) => {
  const li = document.createElement("li");
  li.textContent = `Name: ${booking.name}, Seat: ${booking.seatNumber}`;

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Cancel";
  deleteButton.style.marginLeft = "10px";
  deleteButton.onclick = async () => {
    try {
      await axios.delete(`${API_URL}/${booking._id}`);
      fetchBookings();
    } catch (error) {
      console.error("Error deleting booking:", error);
    }
  };

  li.appendChild(deleteButton);
  seatList.appendChild(li);
};

bookingForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const name = document.getElementById("name").value;
  const seatNumber = document.getElementById("seat-number").value;

  const newBooking = { name, seatNumber };

  try {
    await axios.post(API_URL, newBooking);
    fetchBookings();
    bookingForm.reset();
  } catch (error) {
    console.error("Error adding booking:", error);
  }
});

const updateTotalSeats = (total) => {
  totalSeatsElement.textContent = total;
};

searchButton.addEventListener("click", async () => {
  const searchName = searchNameInput.value.trim().toLowerCase();

  if (!searchName) {
    alert("Please enter a name to search.");
    return;
  }

  try {
    const response = await axios.get(API_URL);
    const filteredBookings = response.data.filter(
      (booking) => booking.name.toLowerCase() === searchName
    );

    seatList.innerHTML = "";
    if (filteredBookings.length > 0) {
      filteredBookings.forEach((booking) => displayBooking(booking));
    } else {
      seatList.innerHTML = "<li>No bookings found for this name.</li>";
    }
  } catch (error) {
    console.error("Error searching bookings:", error);
  }
});

fetchBookings();
