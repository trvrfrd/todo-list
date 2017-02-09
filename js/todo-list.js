function TodoList(todoArr) {
  this.todos = todoArr;
}

TodoList.prototype.add = function add(todo) {
  this.todos.push(todo);
}

TodoList.prototype.markDone = function markDone(i, doneness) {
  this.todos[i].done = doneness;
}

TodoList.prototype.updateText = function updateText(i, text) {
  this.todos[i].text = text;
}

TodoList.prototype.remove = function remove(i) {
  this.todos.splice(i, 1)[0];
}

TodoList.prototype.forEach = function forEach(fn) {
  this.todos.forEach(fn);
}

TodoList.prototype.markAll = function markAll(doneness) {
  this.forEach(function(item) { item.done = doneness; });
}

TodoList.prototype.clearDone = function clearDone() {
  this.todos = this.todos.filter(function(item) {
    return !item.done;
  });
}
