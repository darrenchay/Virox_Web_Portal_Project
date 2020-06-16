var app = new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue!'
  }
});

/* var app = new Vue({
    el: '#app',
    data: {
      message: 'Hello Vue!'
    }
  })

var app2 = new Vue({
    el: '#app-2',
    data: {
      message: 'You loaded this page on ' + new Date().toLocaleString()
    }
  })

var app3 = new Vue({
    el: '#app-3',
    data: {
      seen: true
    }
  })

var app4 = new Vue({
    el: '#app-4',
    data: {
      todos: [
        { text: 'Learn JavaScript' },
        { text: 'Learn Vue' },
        { text: 'Build something awesome' }
      ]
    }
})

var app5 = new Vue({
    el: '#app-5',
    data: {
      message: 'Hello Vue.js!'
    },
    methods: {
      reverseMessage: function () {
        this.message = this.message.split('').reverse().join('')
      }
    }
})
app4.todos.push({ text: 'New item' }) */

var app5 = new Vue({
  el: '#app-5',
  data: {
    titles: []
  },
  methods: {
    getData: function() {
      $.ajax({
        type: 'GET',
        url: '/getData',
        success: function (data) {
          this.titles = data.row
          console.log(this.titles);
        },
        fail: function(error) {
          console.log(error); 
        }
      });
    }
  }
})

// Define a new component called todo-item
Vue.component('todo-item', {
    props: ['todo'],
    template: '<li>{{ todo.text }}</li>'
})


  
  
  var app7 = new Vue({
    el: '#app-7',
    data: {
      titles: []
    },
    methods: {
      getData: function() {
        $.ajax({
          type: 'GET',
          url: '/getData',
          success: function (data) {
            this.titles = data.row
            console.log(this.titles);
          },
          fail: function(error) {
            console.log(error); 
          }
        });
      }
    }
  })

