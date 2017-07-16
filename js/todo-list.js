(function (exports) {
  var todoListProto = {
    updateFilter: function updateFilter (str) {
      return this.filter = str
    },

    add: function add (todo) {
      this.items.push(todo)
    },

    markDone: function markDone (i, doneness) {
      this.items[i].done = doneness
    },

    updateText: function updateText (i, text) {
      this.items[i].text = text
    },

    remove: function remove (i) {
      this.items.splice(i, 1)[0]
    },

    forEach: function forEach (fn) {
      this.items.forEach(fn)
    },

    markAll: function markAll (doneness) {
      this.forEach(function (item) { item.done = doneness })
    },

    clearDone: function clearDone () {
      this.items = this.items.filter(function (item) {
        return !item.done
      })
    },

    loadState: function loadState () {
      return JSON.parse(window.localStorage.getItem('todoList'))
    },

    saveState: function saveState () {
      window.localStorage.setItem('todoList', JSON.stringify(this))
    }
  }

  Object.defineProperty(todoListProto, 'length', {
    get () {
      return this.items.length
    }
  })

  exports.createTodoList = function createTodoList () {
    var list = Object.create(todoListProto)
    var state = list.loadState() || {
      items: [{ text: 'add more todos', done: false }],
      filter: 'all'
    }
    list.items = state.items
    list.filter = state.filter
    window.addEventListener('beforeunload', list.saveState.bind(list))
    return list
  }
}(typeof exports !== 'undefined' ? exports : window))
