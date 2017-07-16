var list = window.createTodoList()
var ui = window.createTodoListUI(list, document.querySelector('#todos'))
document.addEventListener('DOMContentLoaded', ui.init.bind(ui))
