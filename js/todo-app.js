function TodoApp() {
  var state = this.loadState() || {
    filter: 'all',
    todos: [{ text: 'add more todos', done: false }]
  };
  this.todoList = new TodoList(state.todos);
  this.filter = state.filter;
  window.addEventListener('beforeunload', this.saveState.bind(this));
}

TodoApp.prototype.loadState = function loadState() {
  return JSON.parse(window.localStorage.getItem('todo-list'));
}

TodoApp.prototype.saveState = function saveState() {
  var state = {
    filter: this.filter,
    todos: this.todoList.todos
  }
  window.localStorage.setItem('todo-list', JSON.stringify(state));
}

TodoApp.prototype.updateFilter = function updateFilter(str) {
  return this.filter = str;
}
