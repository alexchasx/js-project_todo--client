import { createTodoApp } from './view.js';
let apiModule = await import('./local-api.js');

const ownerBtns = document.querySelectorAll('.btn-owner');
ownerBtns.forEach((ownerBtn) => {
  ownerBtn.addEventListener('click', async () => {
    todoApp(ownerBtn.dataset.owner, ownerBtn.textContent);
  });
});

const toggleStorageBtn = document.querySelector('.toggle-storage');
toggleStorageBtn.addEventListener('click', async (event) => {
  event.preventDefault();

  const target = event.target;
  if (target.dataset.storage === 'local') {
    target.dataset.storage = 'server';
    target.textContent = 'Перейти на локальное хранилище';

    todoApp();

    return;
  }

  target.dataset.storage = 'local';
  target.textContent = 'Перейти на серверное хранилище';

  todoApp();
});

function showStorageBadge(ownerlink, textContent) {
  let badge = ownerlink.querySelector('.badge');
  if (!badge) {
    badge = document.createElement('span');
    badge.classList.add('badge', 'bg-secondary');
  }
  badge.textContent = textContent;
  return badge;
}

function disableCurrentOwnerLink(owner, currentStorage) {
  const ownerslinks = document.querySelectorAll('.btn-owner');

  ownerslinks.forEach((link) => {
    link.append(showStorageBadge(link, currentStorage));

    const ownerDataAttr = link.getAttribute('data-owner');
    if (ownerDataAttr === owner) {
      link.setAttribute('disabled', 'disabled');
      return false;
    }
    link.removeAttribute('disabled');
  });

  const currentOwnerLink = document.querySelector(
    `.btn-owner[data-owner=${owner}]`
  );
  currentOwnerLink.setAttribute('disabled', 'disabled');
}

async function todoApp(owner = 'my', title = 'Мои дела') {
  const currentStorage = toggleStorageBtn.dataset.storage;
  apiModule = await import(`./${toggleStorageBtn.dataset.storage}-api.js`);

  disableCurrentOwnerLink(owner, currentStorage);

  const todoItemList = await apiModule.getTodoList(owner);
  const appElement = document.getElementById('todo-app');
  appElement.innerHTML = '';

  createTodoApp(appElement, {
    title,
    owner,
    todoItemList,
    onCreateFormSubmit: apiModule.createTodoItem,
    onDoneClick: apiModule.switchTodoItemDone,
    onDeleteClick: apiModule.deleteTodoItem,
  });
}

todoApp();
