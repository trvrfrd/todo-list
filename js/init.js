var list = new TodoList();
var ui = new TodoListUI(list, document.querySelector('#todos'));
document.addEventListener('DOMContentLoaded', ui.init.bind(ui));
