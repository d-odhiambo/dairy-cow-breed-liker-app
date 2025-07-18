const BASE_URL = "https://dairy-cow-breed-liker-app-1.onrender.com/breeds"; // The API endpoint where breed data is fetched.
const breedListEl = document.getElementById("breed-list"); // HTML element where the breed list will be displayed.
const detailsEl = document.getElementById("details-content"); // HTML element where details of a selected breed will appear.
const toggleBtn = document.getElementById("toggle-theme"); // Button that toggles between light and dark themes.

document.addEventListener("DOMContentLoaded", () => { // Waits until the page is fully loaded.
  fetch(BASE_URL) // Fetches cow breeds from the API.
    .then((res) => res.json())
    .then((breeds) => {
      breeds.forEach(displayBreedInList); // If successful, it loops through each breed and displays it using displayBreedInList.
    })
    .catch((error) => { // If there's an error, it displays an error message.
      breedListEl.innerHTML = "<p style='color:red;'>⚠️ Could not load breeds. Is json-server running?</p>";
      console.error("Fetch error:", error);
    });

  toggleBtn.addEventListener("click", () => { // Adds an event listener to the theme toggle button that switches the site to dark mode by toggling a CSS class.
    document.body.classList.toggle("dark-theme");
  });
});
// Creating a <div> for each breed name, adding a class for styling, adding a click event to show breed details when selected, and appending it to the breed list container.
function displayBreedInList(breed) {
  const item = document.createElement("div");
  item.textContent = breed.name;
  item.classList.add("breed-item");
  item.addEventListener("click", () => showBreedDetails(breed));
  breedListEl.appendChild(item);
}
// Checking if the breed was previously liked
function showBreedDetails(breed) {
  const isLiked = breed._liked === true;
// Then sets the inner HTML which displays breed data like image, origin, milk production, weight, temperament, likes, and a like/unlike button.
  detailsEl.innerHTML = `
    <div style="animation: fadeIn 0.3s ease-in-out;">
      <h3>${breed.name}</h3>
      <img id="cow-image" src="${breed.image}" alt="${breed.name}" class="breed-image"/>
      <p><strong>Origin:</strong> ${breed.origin}</p>
      <p><strong>Milk Per Day:</strong> ${breed.milkPerDay} L</p>
      <p><strong>Weight:</strong> ${breed.weightKg} kg</p>
      <p><strong>Temperament:</strong> ${breed.temperament}</p>
      <p><strong>Likes:</strong> <span id="likes-count">${breed.likes}</span></p>
      <button class="like-btn" id="like-btn">
        ${isLiked ? "👎 Unlike" : "👍 Like"}
      </button>
    </div>
  `;
// Calculating new likes based on whwther the breed is already liked
  const likeBtn = document.getElementById("like-btn");
  likeBtn.addEventListener("click", () => {
    const newLikes = isLiked ? breed.likes - 1 : breed.likes + 1;
    const newState = !isLiked;
// Sending the update to the server using PATCH to update likes and unlikes then re-renders the deatils
    fetch(`${BASE_URL}/${breed.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        likes: newLikes,
        _liked: newState
      })
    })
      .then((res) => res.json())
      .then((updatedBreed) => {
        breed.likes = updatedBreed.likes;
        breed._liked = updatedBreed._liked;
        showBreedDetails(breed); // Re-render the UI
      })
      .catch((error) => console.error("Like/unlike error:", error));
  });
  // Cow image event listener adds an interaction when the user clicks on the image, triggering an alert.
  const cowImage = document.getElementById("cow-image");
  cowImage.addEventListener("click", () => {
    alert(`You clicked on ${breed.name}!`);
  });
}
