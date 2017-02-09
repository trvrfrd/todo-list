var app = new TodoApp();
var ui = new TodoAppUI(app, document.querySelector('#todos'));
document.addEventListener('DOMContentLoaded', ui.init.bind(ui));
