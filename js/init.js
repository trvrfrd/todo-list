var list = createTodoList()
var ui = createTodoListUI(list, document.querySelector('#todos'))
document.addEventListener('DOMContentLoaded', ui.init.bind(ui))
