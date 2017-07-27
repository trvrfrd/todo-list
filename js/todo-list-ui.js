(function (exports) {
  function createElement (name, attrs, text) {
    var el = document.createElement(name)
    for (var attr in attrs) {
      el[attr] = attrs[attr]
    }
    if (text != null) {
      el.appendChild(document.createTextNode(text))
    }
    return el
  }

  var TodoListUIProto = {
    init: function init () {
      // check-all stays checked when refreshing in Firefox
      document.querySelector('#check-all').checked = false
      this.render()
      this.initListeners()
      document.querySelector('input[type="text"]').focus()
    },

    render: function render () {
      this.renderList(this.list)
      this.updateFilters(this.list.filter)
      this.filterList(this.list.filter)
      this.updateCount(this.list)
    },

    renderItem: function renderItem (item, index) {
      var li = createElement('li', { id: index, className: 'todo' })
      if (item.done) li.classList.add('done')
      li.prepend(createElement('input', { type: 'checkbox', checked: item.done }))
      li.appendChild(createElement('span', { contentEditable: true }, item.text))
      li.appendChild(createElement('a', { href: '#' }, 'x'))
      return li
    },

    renderList: function renderList (list) {
      this.root.innerHTML = ''
      var self = this
      this.list.forEach(function (item, index) {
        self.root.appendChild(self.renderItem(item, index))
      })
    },

    updateFilters: function updateFilters (filter) {
      document.querySelector('#filters').querySelectorAll('a').forEach(function (a) {
        a.classList.remove('active')
        if (filter === a.id) a.classList.add('active')
      })
    },

    filterList: function filterList (show) {
      this.root.childNodes.forEach(function (li) {
        li.classList.remove('hide')
        if (show === 'done' && !li.classList.contains('done')) { li.classList.add('hide') } else if (show === 'not-done' && li.classList.contains('done')) { li.classList.add('hide') }
      })
    },

    updateCount: function updateCount (list) {
      var span = document.querySelector('#count')
      var count = list.length
      if (count === 0) {
        span.textContent = 'all done, nice work!'
      } else if (count === 1) {
        span.textContent = '1 item left'
      } else {
        span.textContent = count + ' items left'
      }
    },

    initListeners: function initListeners () {
      var self = this
      document.forms[0].addEventListener('submit', function fireCreate (e) {
        e.preventDefault()
        var input = e.target.querySelector('input[type="text"]')
        var text = input.value
        if (!text) return false
        self.list.add({text: text, done: false})
        input.value = ''
        self.render()
        // obnoxious hack to make sure cursor reappears after submitting in Firefox
        input.blur(); input.focus()
      })

      var list = document.querySelector('#todos')
      list.addEventListener('click', function fireDelete (e) {
        if (e.target.nodeName === 'A') {
          var li = e.target.parentElement
          self.list.remove(li.id)
          self.render()
        }
      })

      list.addEventListener('change', function fireComplete (e) {
        if (e.target.nodeName === 'INPUT') {
          var li = e.target.parentElement
          self.list.markDone(li.id, e.target.checked)
          self.render()
        }
      })

      list.addEventListener('keydown', function fireEdit (e) {
        if (e.keyCode === 13) { // enter
          e.preventDefault()
          var li = e.target.parentElement
          self.list.updateText(li.id, e.target.textContent)
          e.target.blur()
        } else if (e.keyCode === 27) { // esc
          document.execCommand('undo')
          e.target.blur()
        }
      })

      document.querySelector('#clear-done').addEventListener('click', function () {
        document.querySelector('#check-all').checked = false
        self.list.clearDone()
        self.render()
      })

      document.querySelector('#check-all').addEventListener('change', function (e) {
        self.list.markAll(e.target.checked)
        self.render()
      })

      document.querySelector('#filters').addEventListener('click', function (e) {
        if (e.target.nodeName === 'A') {
          self.list.filter = e.target.id
          self.render()
        }
      })

      document.querySelector('#style').addEventListener('click', function toggleStyle (e) {
        document.body.classList.toggle('lofi')
        document.body.classList.toggle('modern')
        this.textContent = 'style: ' + document.body.classList
      })
    }
  }

  exports.createTodoListUI = function createTodoListUI (list, root) {
    var ui = Object.create(TodoListUIProto)
    ui.list = list
    ui.root = root
    return ui
  }
}(typeof exports !== 'undefined' ? exports : window))
