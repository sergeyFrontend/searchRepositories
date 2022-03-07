const form = document.querySelector('.form');
const btnReset = document.querySelector('.form__btn-reset');
const input = document.querySelector('.form__input');
const hints = document.querySelector('.hints');
const postsContainer = document.querySelector('.posts');
let users;

function renderPosts(posts) {
  postsContainer.innerHTML = '';
  posts.forEach(item => {
    postsContainer.innerHTML += `<li class="post">
                 <a class="post__link" 
                    href="${item.owner.url}" 
                    target="_blank">
                    <img class="post__avatar" 
                      src="${item.owner.avatar_url}" 
                      alt="${item.name}" />
                 </a>
                 <div class="post__info-wrapper">
                  <div class="post__info-header">
                     <span class="post__id">${item.id}</span>
                     <span class="post__type">${item.private}</span>
                   </div>
                   <span class="post__name">${item.name}</span>
                   <span class="post__full-name">${item.full_name}</span>
                  </div>
                </li>`;
  });
}

async function getUsers() {
    const respons = await fetch(`https://api.github.com/users`);
    const data = await respons.json();
    // const posts = data.items;
    // renderPosts(posts);
    users = data.map(item => item.login); // преобразуем получаемый массив объектов в массив логинов
    users.forEach(item => console.log(item));
  };
  
  getUsers();


async function getPosts(name) {
  const respons = await fetch(`https://api.github.com/search/repositories?q=${name}&per_page=4`);
  const data = await respons.json();
  const posts = data.items;
  renderPosts(posts);
};

const addHints = () => {
  input.classList.add('active');
  hints.classList.add('active');
}

const removeHints = () => {
  input.classList.remove('active');
  hints.classList.remove('active');
}

input.addEventListener('input', () => {
  // console.log(users)
    if (input.value.length > 2) {
      const arr = users.filter((item) => item.includes(input.value));
      if (arr.length) { // это условие чтоб лишний раз не 
                        // выводить стили для подсказок, если совпадений нет
        addHints(); // это чтоб добавить некоторые стили, при выводе подсказок
        hints.innerHTML = '';
        arr.forEach(item => {
          hints.innerHTML += `<li class="hints__item">${item}</li>`;
        });
      } else {
          removeHints(); //это чтоб удалить эти стили
        }
    } 
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  getPosts(input.value)
  
});

// сбросить поиск 
btnReset.addEventListener('click', () => {
  input.value = '';
  postsContainer.innerHTML = '';
})

// обрбатываем клик по блоку с подсказками
hints.addEventListener('click', (event) => {
  const target = event.target;
  if (target.classList.contains('hints__item')) {
    getPosts(target.textContent);
    removeHints(); // удаляем стили после клика по какой нибудь подсказке
  }});