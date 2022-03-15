const todoContainer = document.querySelector(".list-todo");
let users = null;
const editPopup = document.querySelector('.popup-edit')
let cardId = 0
const cards = document.getElementsByClassName('card')

fetch("https://jsonplaceholder.typicode.com/users")
    .then((response) => response.json())
    .then((json) => {
        json.forEach((user) => {
            const userSelect = document.querySelector(".popup-button__user");
            const option = document.createElement("option");
            option.setAttribute("value", user.name);
            option.textContent = user.name;
            userSelect.append(option);
            
            const userEditSelect = document.querySelector(".popup-edit-button__user")
            userEditSelect.append(option.cloneNode(true))
        });
    });

const addCard = (id) => {
    const div = document.createElement("div");
    div.dataset.id = id;
    div.classList.add("card");

    div.insertAdjacentHTML(
        "afterbegin",
        `<div class="card-title">
      <h3 class="card-title__title"></h3>
      <div class="card-title__button">
        <button class="card-title__edit-button">Edit</button>
        <button class="card-title__delete-button">Delete</button>
      </div>
    </div>
    <div class="card-description">
      <h3 class="card-description__description">
      </h3>
      <button class="card-description__move-button">Move</button>
    </div>
    <div class="card-user">
      <p class="card-user__user"></p>
      <p class="card-user__time"></p>
    </div>`,
    );
    const divTitle = div.querySelector(".card-title__title");
    const divDescription = div.querySelector(".card-description__description");
    const divUser = div.querySelector(".card-user__user");
    const time = div.querySelector(".card-user__time");

    objectStorage = JSON.parse(localStorage.getItem(id));
    divTitle.append(objectStorage.title);

    divDescription.append(objectStorage.description);

    divUser.append(objectStorage.user);
    Data = new Date();
    Hour = Data.getHours();
    Minutes = Data.getMinutes();

    time.append(Hour, ":", Minutes < 10 ? "0" + Minutes : Minutes);
    todoContainer.append(div);
};

document.addEventListener("click", (event) => {
    if (event.target === document.querySelector(".popup-button__confirm")) {
        const title = document.querySelector(".popup__title");
        const description = document.querySelector(".popup__description");
        const userSelect = document.querySelector(".popup-button__user");

        let id = Date.now();

        function createCard() {
            return {
                title: title.value,
                description: description.value,
                user: userSelect.value,
                id,
                container: "todo",
            };
        }

        localStorage.setItem(id, JSON.stringify(createCard()));

        addCard(id);

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

// Clock
window.onload = function () {
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
};

document.addEventListener('click', event => {
    if (event.target.classList.contains('card-title__delete-button')) {
        const card = event.target.closest('.card')
        const cardId = card.dataset.id
        localStorage.removeItem(cardId)
        card.remove()
    }
})

document.addEventListener('click', event => {
    if (event.target.classList.contains('card-title__edit-button')) {
        editPopup.style.display = 'block'
        const card = event.target.closest('.card')
        cardId = card.dataset.id 
        const title = editPopup.querySelector('.popup-edit__title')
        const description = editPopup.querySelector('.popup-edit__description')
        const userData = JSON.parse(localStorage.getItem(cardId)) 
        title.value = userData.title
        description.value = userData.description
    } 
    if (event.target.classList.contains('popup-edit-button__cancel')) {
        editPopup.style.display = 'none'
    }
    if (event.target.classList.contains('popup-edit-button__edit')) {
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
        editPopup.style.display = 'none'

        for(let i = 0; i < cards.length; i++) {
            console.log(cards[i])
            const id = cards[i].dataset.id
            if(cardId === id) {
                const titleCard = cards[i].querySelector('.card-title__title')
                const descriptionCard = cards[i].querySelector('.card-description__description')
                const userCard = cards[i].querySelector('.card-user__user')
                titleCard.textContent = title.value
                descriptionCard.textContent = description.value
                userCard.textContent = userSelect.value
            } 
        }
    }
});

document.addEventListener('click', event => {
    if(event.target.classList.contains('card-description__move-button')) {
        const card = event.target.closest('.card')
        const cardId = card.dataset.id;

        const cardData = JSON.parse(localStorage.getItem(cardId));

        if (cardData.container === 'todo') {
            cardData.container = 'progress';
            
            localStorage.setItem(cardId, JSON.stringify(cardData)); 
        } else if (cardData.container === 'progress') {
            cardData.container = 'done';
            
            localStorage.setItem(cardId, JSON.stringify(cardData)); 
        }
    }
});