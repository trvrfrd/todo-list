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

function todoLi(text) {
  var li = createElement('li', { className: 'todo' });
  li.prepend(createElement('input', { type: 'checkbox' }));
  li.appendChild(createElement('span', { contentEditable: true }, text));
  li.appendChild(createElement('a', { href: '#' }, 'x'));
  return li;
}

form.addEventListener('submit', function createTodo(e) {
  e.preventDefault();
  var text = textInput.value;
  if (!text) return false;
  todos.appendChild(todoLi(text));
  textInput.value = '';
});

todos.addEventListener('click', function deleteTodo(e) {
  if (e.target.nodeName == 'A') {
    var node = e.target;
    while (node.nodeName != 'LI') node = node.parentElement;
    todos.removeChild(node);
  }
});


document.addEventListener('DOMContentLoaded', function() {
  todos.appendChild(todoLi('add more todos'));
});
