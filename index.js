function createElement(name, attrs, text) {
  var el = document.createElement(name);
  for (var attr in attrs) {
    el[attr] = attrs[attr];
  }
  if (text != null) {
    el.appendChild(document.createTextNode(text));
  }
  return el;
}

function renderTodo(item, index) {
  var li = createElement('li', { id: index, className: 'todo' });
  if (item.done) li.classList.add('done');
  li.prepend(createElement('input', { type: 'checkbox', checked: item.done }));
  li.appendChild(createElement('span', { contentEditable: true }, item.text));
  li.appendChild(createElement('a', { href: '#' }, 'x'));
  return li;
}

document.forms[0].addEventListener('submit', function fireCreate(e) {
  e.preventDefault();
  var input = e.target.querySelector('input[type="text"]'),
      text = input.value;
  if (!text) return false;
  document.body.dispatchEvent(new CustomEvent('create', { detail: text }));
  input.value = '';
});

// globals are bad probz
var list = document.querySelector('#todos');

list.addEventListener('click', function fireDelete(e) {
  if (e.target.nodeName == 'A') {
    var li = e.target.parentElement;
    document.body.dispatchEvent(new CustomEvent('delete', { detail: li.id }));
  }
});

// checking off todo item
list.addEventListener('change', function fireComplete(e) {
  if (e.target.nodeName == 'INPUT') {
    var li = e.target.parentElement,
        details = { id: li.id, done: e.target.checked };
    document.body.dispatchEvent(new CustomEvent('complete', { detail: details }));
  }
});

// editing todo text in contentEditable span
list.addEventListener('keydown', function fireEdit(e) {
  if (e.keyCode == 13) { // enter
    e.preventDefault();
    var li = e.target.parentElement,
        details = { id: li.id, text: e.target.textContent };
    document.body.dispatchEvent(new CustomEvent('edit', { detail: details }));
    e.target.blur();
  } else if (e.keyCode == 27) { //esc
    document.execCommand('undo');
    e.target.blur();
  }
});

// filters
document.querySelector('#show-all').addEventListener('click', function() {
  document.body.dispatchEvent(new CustomEvent('filter', { detail: 'all' }));
});

document.querySelector('#show-done').addEventListener('click', function() {
  document.body.dispatchEvent(new CustomEvent('filter', { detail: 'done' }));
});

document.querySelector('#show-not-done').addEventListener('click', function() {
  document.body.dispatchEvent(new CustomEvent('filter', { detail: 'not-done' }));
});

function clearDone() {
  state.todos = state.todos.filter(function(todo) {
    return !todo.done;
  });
  render();
}

document.querySelector('#clear-done').addEventListener('click', clearDone);

function markAll(doneness) {
  // only want to check currently displayed todos, so we iterate over the list
  // instead of the application state
  list.querySelectorAll('li').forEach(function(li) {
    state.todos[li.id].done = doneness;
  });
  render();
}

document.querySelector('#check-all').addEventListener('change', function(e) {
  markAll(e.target.checked);
});

// persistence is key
function saveState() {
  window.localStorage.setItem('todo-list', JSON.stringify(state));
}

function loadState() {
  return JSON.parse(window.localStorage.getItem('todo-list'));
}

function render() {
  list.innerHTML = '';
  state.todos.forEach(function(item, index) {
    if (shouldRender(item)) {
      list.appendChild(renderTodo(item, index));
    }
  });
}

function shouldRender(item) {
  return (state.filter == 'all') ||
         (state.filter == 'done' && item.done) ||
         (state.filter == 'not-done' && !item.done)
}

function init() {
  // intentional global state WHOA BAD TIMES
  state = loadState() || {
    filter: 'all',
    todos: [{ text: 'add more todos', done: false }]
  };
  render();
  // check-all stays checked when refreshing in Firefox
  document.querySelector('#check-all').checked = false;
}

document.addEventListener('DOMContentLoaded', init);
window.addEventListener('beforeunload', saveState);
document.body.addEventListener('create', function handleCreate(e) {
  state.todos.push({ text: e.detail, done: false });
  render();
});
document.body.addEventListener('delete', function handleDelete(e) {
    state.todos.splice(e.detail, 1);
    render();
});
document.body.addEventListener('complete', function handleComplete(e) {
    state.todos[e.detail.id].done = e.detail.done;
    render();
});
document.body.addEventListener('edit', function handleEdit(e) {
    state.todos[e.detail.id].text = e.detail.text;
    render();
});
document.body.addEventListener('filter', function handleFilter(e) {
  state.filter = e.detail;
  render();
});
