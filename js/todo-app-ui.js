function TodoAppUI(app, listRoot) {
  this.app = app;
  this.listRoot = listRoot;
}

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

TodoAppUI.prototype.init = function init() {
  // check-all stays checked when refreshing in Firefox
  document.querySelector('#check-all').checked = false;
  this.render();
  this.initListeners();
  document.querySelector('input[type="text"]').focus();
}

TodoAppUI.prototype.render = function render() {
  this.renderList(this.app.todoList);
  this.updateFilters(this.app.filter);
  this.filterList(this.app.filter);
}

TodoAppUI.prototype.renderItem = function renderItem(item, index) {
  var li = createElement('li', { id: index, className: 'todo' });
  if (item.done) li.classList.add('done');
  li.prepend(createElement('input', { type: 'checkbox', checked: item.done }));
  li.appendChild(createElement('span', { contentEditable: true }, item.text));
  li.appendChild(createElement('a', { href: '#' }, 'x'));
  return li;
}

TodoAppUI.prototype.renderList = function renderList(list) {
  this.listRoot.innerHTML = '';
  var self = this;
  this.app.todoList.forEach(function(item, index) {
    self.listRoot.appendChild(self.renderItem(item, index));
  });
}

TodoAppUI.prototype.updateFilters = function updateFilters(show) {
  document.querySelector('#filters').querySelectorAll('a').forEach(function(a) {
    a.classList.remove('active');
    if (show == a.id) a.classList.add('active');
  });
}

TodoAppUI.prototype.filterList = function filterList(show) {
  this.listRoot.querySelectorAll('li').forEach(function(li) {
    li.classList.remove('hide');
    if (show == 'done' && !li.classList.contains('done'))
      li.classList.add('hide');
    else if (show == 'not-done' && li.classList.contains('done'))
      li.classList.add('hide');
  });
}

TodoAppUI.prototype.initListeners = function initListeners() {
  var self = this;
  document.forms[0].addEventListener('submit', function fireCreate(e) {
    e.preventDefault();
    var input = e.target.querySelector('input[type="text"]'),
    text = input.value;
    if (!text) return false;
    self.app.todoList.add({text: text, done: false});
    input.value = '';
    self.render();
    // obnoxious hack to make sure cursor reappears after submitting in Firefox
    input.blur(); input.focus();
  });

  var list = document.querySelector('#todos');
  list.addEventListener('click', function fireDelete(e) {
    if (e.target.nodeName == 'A') {
      var li = e.target.parentElement;
      self.app.todoList.remove(li.id);
      self.render();
    }
  });

  list.addEventListener('change', function fireComplete(e) {
    if (e.target.nodeName == 'INPUT') {
      var li = e.target.parentElement;
      self.app.todoList.markDone(li.id, e.target.checked);
      self.render();
    }
  });

  list.addEventListener('keydown', function fireEdit(e) {
    if (e.keyCode == 13) { // enter
      e.preventDefault();
      var li = e.target.parentElement;
      self.app.todoList.updateText(li.id, e.target.textContent);
      e.target.blur();
    } else if (e.keyCode == 27) { //esc
      document.execCommand('undo');
      e.target.blur();
    }
  });

  document.querySelector('#clear-done').addEventListener('click', function() {
    self.app.todoList.clearDone();
    self.render();
  });

  document.querySelector('#check-all').addEventListener('change', function(e) {
    self.app.todoList.markAll(e.target.checked);
    self.render();
  });

  document.querySelector('#filters').addEventListener('click', function(e) {
    if (e.target.nodeName == 'A') {
      self.app.filter = e.target.id;
      self.render();
    }
  });
}
