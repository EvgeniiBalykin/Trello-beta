const listToDo = document.querySelector(".list-todo");
const listProgress = document.querySelector('.list-progress');
const listDone = document.querySelector('.list-done');
let users = null;
const editPopup = document.querySelector(".popup-edit");
let cardId = 0;
const cards = document.getElementsByClassName("card");
const inprogressCountEl = document.getElementById("inprogress_counter");
const popupAddCard = document.querySelector(".popup");
const popupBtnConfirm = document.querySelector('.popup-button__confirm')
const popupTitle = document.querySelector(".popup__title");
const popupDescription = document.querySelector(".popup__description");
const popupUserSelect = document.querySelector(".popup-button__user");
const popupBtnCancel = document.querySelector('.popup-button__cancel')
const btnAddCard = document.querySelector(".list__button");
const popupEditTitle = document.querySelector(".popup-edit__title");
const popupEditDescription = document.querySelector(".popup-edit__description");
const popupEditUserSelect = document.querySelector(".popup-edit-button__user");

initTimer();

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

popupBtnConfirm.addEventListener('click', () => {
        const id = Date.now();
        const cardData = createCard(
            id,
            popupTitle.value,
            popupDescription.value,
            popupUserSelect.value,
        );

        // add to storage
        localStorage.setItem(id, JSON.stringify(cardData));

        // render card
        const card = renderCard(cardData);
        listToDo.append(card)
        updateColumnsCounter();

        popupTitle.value = "";
        popupDescription.value = "";
        popupAddCard.style.display = "none";
})

popupBtnCancel.addEventListener('click', () => {
    popupAddCard.style.display = "none";
})


btnAddCard.addEventListener("click", () => {
    popupAddCard.style.display = "block";
});

document.addEventListener("click", (event) => {
    if (event.target.classList.contains("card-title__delete-button")) {
        const card = event.target.closest(".card");
        const cardId = card.dataset.id;
        localStorage.removeItem(cardId);
        card.remove();
        updateColumnsCounter();
    }

    if (event.target.classList.contains("card-title__edit-button")) {
        editPopup.style.display = "block";
        const card = event.target.closest(".card");
        cardId = card.dataset.id;
        const userData = JSON.parse(localStorage.getItem(cardId));
        popupEditTitle.value = userData.title;
        popupEditDescription.value = userData.description;
    }
    if (event.target.classList.contains("popup-edit-button__cancel")) {
        editPopup.style.display = "none";
    }
    if (event.target.classList.contains("popup-edit-button__edit")) {

        function createCard() {
            return {
                title: popupEditTitle.value,
                description: popupEditDescription.value,
                user: popupEditUserSelect.value,
                id: cardId,
                container: "todo",
            };
        }
        localStorage.setItem(cardId, JSON.stringify(createCard()));
        editPopup.style.display = "none";

        for (let i = 0; i < cards.length; i++) {
            const id = cards[i].dataset.id;
            if (cardId === id) {
                const titleCard = cards[i].querySelector(".card-title__title");
                const descriptionCard = cards[i].querySelector(
                    ".card-description__description",
                );
                const userCard = cards[i].querySelector(".card-user__user");
                titleCard.textContent = popupEditTitle.value;
                descriptionCard.textContent = popupEditDescription.value;
                userCard.textContent = popupEditUserSelect.value;
            }
        }
    }
    if(event.target.classList.contains('card-description__move-button')) {
        const card = event.target.closest('.card');
        const cardId = card.dataset.id;
        const editBtn = card.querySelector('.card-title__edit-button');
        const moveBtn = card.querySelector('.card-description__move-button');
        const deleteBtn = card.querySelector('.card-title__delete-button');
        const cardTitle = card.querySelector('.card-title__button');
        const cardDescr = card.querySelector('.card-description');

        const cardData = JSON.parse(localStorage.getItem(cardId));

        if (cardData.container === 'progress') {
            const confirmToDone = confirm("Do you really want to move this card to 'Done' column?");

            if (confirmToDone) {
                changeBtnInDone({cardData, cardId, card, deleteBtn, moveBtn})

            card.querySelector('.card-title__back-button').remove();

            } 

        } else if (cardData.container === 'todo') {
            if (inprogressCountEl.innerText < 6) {
            const confirmToInProgress = confirm("Do you really want to move this card to 'In Progress' column?");

                if (confirmToInProgress) {
                cardData.container = 'progress';
                    
                localStorage.setItem(cardId, JSON.stringify(cardData));
                    
                listProgress.append(card);

                moveBtn.innerHTML = 'complete';
                
                editBtn.style.display = 'none';
                deleteBtn.style.display = 'none';
    
                const backBtn = document.createElement('button');
                backBtn.classList.add('card-title__back-button');
                backBtn.innerHTML = 'back';
                cardTitle.append(backBtn);
    
                backBtn.addEventListener('click', () => 
                backBtnHandler({cardData, cardId, card, moveBtn, deleteBtn, editBtn, backBtn, cardDescr}))

                cardTitle.append(moveBtn);

                } else {
                    return;
                }

            } else {
                alert('Oh, lazy asses, please, finish your 6 current tasks!');
            }
        }
    }

    updateColumnsCounter();
});

function updateColumnsCounter() {
    const todoCountEl = document.getElementById("todo_counter");
    const doneCountEl = document.getElementById("done_counter");

    todoCountEl.innerText = listToDo.querySelectorAll(".card").length;
    inprogressCountEl.innerText = listProgress.querySelectorAll(".card").length;
    doneCountEl.innerText = listDone.querySelectorAll(".card").length;
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

document.addEventListener('DOMContentLoaded', () => {
    
    for(let i = 0; i < localStorage.length; i++) {
        let keysStorage = localStorage.key(i);
        let cardData = JSON.parse(localStorage.getItem(keysStorage))
        const card = renderCard(cardData)
        const editBtn = card.querySelector('.card-title__edit-button');
            const moveBtn = card.querySelector('.card-description__move-button');
            const deleteBtn = card.querySelector('.card-title__delete-button');
            const cardTitle = card.querySelector('.card-title__button');
            const cardDescr = card.querySelector('.card-description');
            const cardId = card.dataset.id;

            console.log(editBtn)
        
        
        if(cardData.container === 'todo'){
            listToDo.append(card)

        }
        if(cardData.container === 'progress'){
            moveBtn.innerHTML = 'complete'
            editBtn.style.display = 'none';
            deleteBtn.style.display = 'none';
            const backBtn = document.createElement('button');
            backBtn.classList.add('card-title__back-button');
            backBtn.innerHTML = 'back';
            cardTitle.append(backBtn);
            backBtn.addEventListener('click',() => backBtnHandler({cardData, cardId, card, moveBtn, deleteBtn, editBtn, backBtn, cardDescr})) 
            cardTitle.append(moveBtn);
            listProgress.append(card)
        }

        if(cardData.container === 'done'){
            editBtn.style.display = 'none';
            changeBtnInDone({cardData, cardId, card, deleteBtn, moveBtn})
            listDone.append(card)
        }
    }
updateColumnsCounter();
})

const deleteAllCards = () => {
    const card = listDone.querySelectorAll('.card')
    card.forEach(item => {
        for(key in localStorage){
        const keysStorage = key
        if(item.dataset.id === keysStorage){
            item.remove()
            localStorage.removeItem(key)
        }
    }
    })
}

const deleteAllBtn = document.getElementsByClassName('list__button')
deleteAllBtn[1].addEventListener('click', deleteAllCards)



function backBtnHandler (data){ 
     const {cardData, cardId, card, moveBtn, deleteBtn, editBtn, backBtn, cardDescr} = data 
    let confirmBackAction = confirm("Do you really want to move this card back?");

    if (confirmBackAction) {
    cardData.container = 'todo';
    
    localStorage.setItem(cardId, JSON.stringify(cardData));
        
    listToDo.append(card);

    moveBtn.innerHTML = 'move';

    deleteBtn.style.display = 'block';
    editBtn.style.display = 'block';

    backBtn.remove();
    cardDescr.append(moveBtn);

    } else {
        return;
    }
}

function changeBtnInDone({cardData, cardId, card, deleteBtn, moveBtn}){

            
            cardData.container = 'done';
                
            localStorage.setItem(cardId, JSON.stringify(cardData));
    
            listDone.append(card);

            deleteBtn.style.display = 'block';
            moveBtn.style.display = 'none';

}

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
