const todoContainer = document.querySelector(".list-todo");
const progressContainer = document.querySelector('.list-progress')
const doneContainer = document.querySelector('.list-done')
let users = null;
const editPopup = document.querySelector(".popup-edit");
let cardId = 0;
const cards = document.getElementsByClassName("card");

fetch("https://jsonplaceholder.typicode.com/users")
    .then((response) => response.json())
    .then((json) => {
        json.forEach((user) => {
            const userSelect = document.querySelector(".popup-button__user");
            const option = document.createElement("option");
            option.setAttribute("value", user.name);
            option.textContent = user.name;
            userSelect.append(option);

            const userEditSelect = document.querySelector(
                ".popup-edit-button__user",
            );
            userEditSelect.append(option.cloneNode(true));
        });
    });

const renderCard = (card) => {
    const currentDate = new Date();

    const div = document.createElement("div");
    div.dataset.id = card.id;
    div.classList.add("card");

    div.insertAdjacentHTML(
        "afterbegin",
        `<div class="card-title">
      <h3 class="card-title__title">${card.title}</h3>
      <div class="card-title__button">
        <button class="card-title__edit-button">Edit</button>
        <button class="card-title__delete-button">Delete</button>
      </div>
    </div>
    <div class="card-description">
      <h3 class="card-description__description">
          ${card.description}
      </h3>
      <button class="card-description__move-button">Move</button>
    </div>
    <div class="card-user">
      <p class="card-user__user">
        ${card.user}
      </p>
      <p class="card-user__time">
      ${currentDate.getHours()}:
      ${formatMinutes(currentDate.getMinutes())}</p>
    </div>`,
    );
    return div
};

document.addEventListener("click", (event) => {
    if (event.target === document.querySelector(".popup-button__confirm")) {
        const title = document.querySelector(".popup__title");
        const description = document.querySelector(".popup__description");
        const userSelect = document.querySelector(".popup-button__user");

        const id = Date.now();

        const cardData = createCard(
            id,
            title.value,
            description.value,
            userSelect.value,
        );

        // add to storage
        localStorage.setItem(id, JSON.stringify(cardData));

        // render card
        const card = renderCard(cardData);
        todoContainer.append(card)
        updateColumnsCounter();

        title.value = "";
        description.value = "";

        const popup = document.querySelector(".popup");
        popup.style.display = "none";
    }

    if (event.target === document.querySelector(".popup-button__cancel")) {
        const popup = document.querySelector(".popup");
        popup.style.display = "none";
    }
});

const btn = document.querySelector(".list__button");

btn.addEventListener("click", () => {
    const popup = document.querySelector(".popup");
    popup.style.display = "block";
});

// Clok
window.onload = function () {
    initTimer();
    updateColumnsCounter();
};

function initTimer() {
    setInterval(function () {
        // Seconds
        const seconds = new Date().getSeconds();
        document.getElementById("seconds").innerHTML =
            (seconds < 10 ? "0" : "") + seconds;

        // Minutes
        const minutes = new Date().getMinutes();
        document.getElementById("minutes").innerHTML =
            (minutes < 10 ? "0" : "") + minutes;

        // Hours
        const hours = new Date().getHours();
        document.getElementById("hours").innerHTML =
            (hours < 10 ? "0" : "") + hours;
    }, 1000);
}

document.addEventListener("click", (event) => {
    if (event.target.classList.contains("card-title__delete-button")) {
        const card = event.target.closest(".card");
        const cardId = card.dataset.id;
        localStorage.removeItem(cardId);
        card.remove();
        updateColumnsCounter();
    }
});

document.addEventListener("click", (event) => {
    if (event.target.classList.contains("card-title__edit-button")) {
        editPopup.style.display = "block";
        const card = event.target.closest(".card");
        cardId = card.dataset.id;
        const title = editPopup.querySelector(".popup-edit__title");
        const description = editPopup.querySelector(".popup-edit__description");
        const userData = JSON.parse(localStorage.getItem(cardId));
        title.value = userData.title;
        description.value = userData.description;
    }
    if (event.target.classList.contains("popup-edit-button__cancel")) {
        editPopup.style.display = "none";
    }
    if (event.target.classList.contains("popup-edit-button__edit")) {
        const title = document.querySelector(".popup-edit__title");
        const description = document.querySelector(".popup-edit__description");
        const userSelect = document.querySelector(".popup-edit-button__user");

        function createCard() {
            return {
                title: title.value,
                description: description.value,
                user: userSelect.value,
                id: cardId,
                container: "todo",
            };
        }
        localStorage.setItem(cardId, JSON.stringify(createCard()));
        editPopup.style.display = "none";

        for (let i = 0; i < cards.length; i++) {
            console.log(cards[i]);
            const id = cards[i].dataset.id;
            if (cardId === id) {
                const titleCard = cards[i].querySelector(".card-title__title");
                const descriptionCard = cards[i].querySelector(
                    ".card-description__description",
                );
                const userCard = cards[i].querySelector(".card-user__user");
                titleCard.textContent = title.value;
                descriptionCard.textContent = description.value;
                userCard.textContent = userSelect.value;
            }
        }
    }
});

function updateColumnsCounter() {
    const todoCountEl = document.getElementById("todo_counter");
    const inprogressCountEl = document.getElementById("inprogress_counter");
    const doneCountEl = document.getElementById("done_counter");

    todoCountEl.innerText = todoContainer.querySelectorAll(".card").length;
    inprogressCountEl.innerText = progressContainer.querySelectorAll(".card").length;
    doneCountEl.innerText = doneContainer.querySelectorAll(".card").length;
}

function createCard(id, title, description, user, container = "todo") {
    return {
        title,
        description,
        user,
        id,
        container,
    };
}

function formatMinutes(minutes) {
    return minutes > 10 ? minutes.toString() : `0${minutes}`;
}
