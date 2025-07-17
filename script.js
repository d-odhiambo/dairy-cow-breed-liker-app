const BASE_URL = "http://localhost:3000/breeds";

const breedListEl = document.getElementById("breed-list");
const detailsEl = document.getElementById("details-content");
const toggleBtn = document.getElementById("toggle-theme");

document.addEventListener("DOMContentLoaded", () => {
  fetch(BASE_URL)
    .then((res) => res.json())
    .then((breeds) => {
      breeds.forEach(displayBreedInList);
    })
    .catch((error) => {
      breedListEl.innerHTML = "<p style='color:red;'>⚠️ Could not load breeds. Is json-server running?</p>";
      console.error("Fetch error:", error);
    });

  toggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-theme");
  });
});

function displayBreedInList(breed) {
  const item = document.createElement("div");
  item.textContent = breed.name;
  item.classList.add("breed-item");
  item.addEventListener("click", () => showBreedDetails(breed));
  breedListEl.appendChild(item);
}

function showBreedDetails(breed) {
  const isLiked = breed._liked === true;

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

  const likeBtn = document.getElementById("like-btn");
  likeBtn.addEventListener("click", () => {
    const newLikes = isLiked ? breed.likes - 1 : breed.likes + 1;
    const newState = !isLiked;

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
  // Cow image event listener
  const cowImage = document.getElementById("cow-image");
  cowImage.addEventListener("click", () => {
    alert(`You clicked on ${breed.name}!`);
  });
}
