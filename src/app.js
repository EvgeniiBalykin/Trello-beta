const todoContainer = document.querySelector('.list-todo')
let users = null

fetch('https://jsonplaceholder.typicode.com/users')
  .then(response => response.json())
  .then(json => {
    json.forEach(user => {
      const userSelect = document.querySelector(".popup-button__user");
      const option = document.createElement('option')
      option.setAttribute('value', user.name)
      option.textContent = user.name
      userSelect.append(option)
    })
  })

const addCard = (id) => {
  
  const div = document.createElement("div");
  div.dataset.id = id
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
    </div>`
  );
  const divTitle = div.querySelector(".card-title__title");
  const divDescription = div.querySelector(
    ".card-description__description"
  );
  const divUser = div.querySelector(".card-user__user");
  const time = div.querySelector(".card-user__time");

  objectStorage = JSON.parse(localStorage.getItem(id));
  divTitle.append(objectStorage.title);

  divDescription.append(objectStorage.description);

  divUser.append(objectStorage.user);
  Data = new Date();
  Hour = Data.getHours();
  Minutes = Data.getMinutes();
  
  time.append(Hour, ":", Minutes < 10 ? '0' + Minutes : Minutes);
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
        container: 'todo'
      };
    }

    localStorage.setItem(id, JSON.stringify(createCard()));

    addCard(id);

    title.value= ''
    description.value = ''

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
