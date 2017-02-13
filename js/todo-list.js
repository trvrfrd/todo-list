function TodoList() {
  var state = this.loadState() || {
    items: [{ text: 'add more todos', done: false }],
    filter: 'all'
  };
  this.items = state.items;
  this.filter = state.filter;
  window.addEventListener('beforeunload', this.saveState.bind(this));
}

Object.defineProperty(TodoList.prototype, 'length', {
  get() {
    return this.items.length;
  }
});

TodoList.prototype.updateFilter = function updateFilter(str) {
  return this.filter = str;
}

TodoList.prototype.add = function add(todo) {
  this.items.push(todo);
}

TodoList.prototype.markDone = function markDone(i, doneness) {
  this.items[i].done = doneness;
}

TodoList.prototype.updateText = function updateText(i, text) {
  this.items[i].text = text;
}

TodoList.prototype.remove = function remove(i) {
  this.items.splice(i, 1)[0];
}

TodoList.prototype.forEach = function forEach(fn) {
  this.items.forEach(fn);
}

TodoList.prototype.markAll = function markAll(doneness) {
  this.forEach(function(item) { item.done = doneness; });
}

TodoList.prototype.clearDone = function clearDone() {
  this.items = this.items.filter(function(item) {
    return !item.done;
  });
}

TodoList.prototype.loadState = function loadState() {
  return JSON.parse(window.localStorage.getItem('todoList'));
}

TodoList.prototype.saveState = function saveState() {
  window.localStorage.setItem('todoList', JSON.stringify(this));
}
