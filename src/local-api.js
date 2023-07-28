const STORAGE_KEY = 'todoItems';

function findMaxId(owner, todoItems) {
  let maxId = 0;
  for (const [key, items] of Object.entries(todoItems)) {
    if (owner === key) {
      for (const item of items) {
        maxId = Math.max(maxId, item.id);
      }
    }
  }
  return maxId;
}

function saveData(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function getDataFromStorage() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY));
}

export async function getTodoList(owner) {
  const getAll = JSON.parse(localStorage.getItem(STORAGE_KEY));

  if (getAll && getAll[owner]) {
    return getAll[owner];
  }
  return null;
}

export async function createTodoItem({ owner, name }) {
  let maxId = 0;
  let items = { [owner]: [] };
  const todoItems = getDataFromStorage();
  if (todoItems) {
    items = todoItems;
    maxId = findMaxId(owner, todoItems);
  }

  const newItem = {
    id: maxId + 1,
    name: name,
    done: false,
  };

  if (items[owner]) {
    items[owner].push(newItem);
  } else {
    items[owner] = [newItem];
  }

  saveData(items);
  return newItem;
}

export function switchTodoItemDone({ owner, todoItem }) {
  todoItem.done = !todoItem.done;

  const todoItems = getDataFromStorage();
  if (todoItems) {
    for (const [person, items] of Object.entries(todoItems)) {
      if (owner === person) {
        for (const item of items) {
          if (item.id === todoItem.id) {
            item['done'] = todoItem.done;
          }
        }
      }
    }
    saveData(todoItems);
  }
}

export function deleteTodoItem({ owner, element, todoItem }) {
  if (confirm('Вы уверены?')) {
    element.remove();

    const todoItems = getDataFromStorage();
    if (todoItems) {
      for (const [person, items] of Object.entries(todoItems)) {
        if (owner === person) {
          for (let i = 0; i < items.length; i++) {
            if (todoItem.id === items[i].id) {
              items.splice(i, 1);
            }
          }
        }
      }
      saveData(todoItems);
    }
  }
}
