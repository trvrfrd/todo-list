// globals are bad probz
var textInput = document.querySelector('input[type="text"]'),
    list = document.querySelector('#todos');

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

document.forms[0].addEventListener('submit', function createTodo(e) {
  e.preventDefault();
  var text = textInput.value;
  if (!text) return false;
  var item = { text: text, done: false };
  state.todos.push(item);
  textInput.value = '';
  render();
});

list.addEventListener('click', function deleteTodo(e) {
  if (e.target.nodeName == 'A') {
    var li = node.parentElement;
    state.todos.splice(li.id, 1);
    render();
  }
});

// checking off todo item
list.addEventListener('change', function(e) {
  if (e.target.nodeName == 'INPUT') {
    var li = e.target.parentElement;
    state.todos[li.id].done = e.target.checked;
    render();
  }
});

// editing todo text in contentEditable span
list.addEventListener('keydown', function editTodo(e) {
  if (e.keyCode == 13) { // enter
    e.preventDefault();
    var li = e.target.parentElement;
    state.todos[li.id].text = e.target.textContent;
    e.target.blur();
    render();
  } else if (e.keyCode == 27) { //esc
    document.execCommand('undo');
    e.target.blur();
  }
});

// filters
document.querySelector('#show-all').addEventListener('click', function() {
  state.filter = 'all';
  render();
});

document.querySelector('#show-done').addEventListener('click', function() {
  state.filter = 'done';
  render();
});

document.querySelector('#show-not-done').addEventListener('click', function() {
  state.filter = 'not-done';
  render();
});

function clearDone() {
  state.todos = state.todos.filter(function(todo) {
    return !todo.done;
  });
  render();
}

document.querySelector('#clear-done').addEventListener('click', clearDone);

function markAll(doneness) {
  // only want to check currently displayed todos, hence we iterate over the lis
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
