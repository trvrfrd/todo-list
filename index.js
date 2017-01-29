// globals are bad probz
var form = document.forms[0],
    textInput = form.querySelector('input[type="text"]'),
    todos = document.querySelector('#todos');

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

function todoLi(item) {
  var li = createElement('li', { className: 'todo' });
  if (item.done) li.classList.add('done');
  li.prepend(createElement('input', { type: 'checkbox', checked: item.done }));
  li.appendChild(createElement('span', { contentEditable: true }, item.text));
  li.appendChild(createElement('a', { href: '#' }, 'x'));
  return li;
}

form.addEventListener('submit', function createTodo(e) {
  e.preventDefault();
  var text = textInput.value;
  if (!text) return false;
  todos.appendChild(todoLi({ text: text, done: false }));
  textInput.value = '';
  saveTodos();
});

todos.addEventListener('click', function deleteTodo(e) {
  if (e.target.nodeName == 'A') {
    var node = e.target;
    while (node.nodeName != 'LI') node = node.parentElement;
    todos.removeChild(node);
    saveTodos();
  }
});

// checking off todo item
todos.addEventListener('change', function(e) {
  if (e.target.nodeName == 'INPUT') {
    e.target.parentElement.classList.toggle('done'); // parent == li
    saveTodos();
  }
});

// editing todo text in contentEditable span
todos.addEventListener('keydown', function editTodo(e) {
  if (e.keyCode == 13) { // enter
    e.preventDefault();
    saveTodos();
    e.target.blur();
  } else if (e.keyCode == 27) { //esc
    document.execCommand('undo');
    e.target.blur();
  }
});

// persistence is key
function saveTodos() {
  var items = [];
  todos.querySelectorAll('li').forEach(function(li) {
    var item = {
      done: li.querySelector('input').checked,
      text: li.querySelector('span').textContent
    }
    items.push(item);
  });
  window.localStorage.setItem('todos', JSON.stringify(items));
}

function loadTodos() {
  var items = JSON.parse(window.localStorage.getItem('todos'));
  items.forEach(function(item) {
    todos.appendChild(todoLi(item));
  });
}

function init() {
  if (window.localStorage.getItem('todos')) {
    loadTodos();
  } else {
    todos.appendChild(todoLi('add more todos'));
  }
}

document.addEventListener('DOMContentLoaded', init);
