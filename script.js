Vue.component('todo-form', {
  data: function() {
    return {
      id: null,
      title: "",
    }
  },
  methods: {
    sub(event) {
      this.$emit('submit', this.todo);
      event.target.reset();
    }
  },
  computed: {
    todo: function() {
      return {
        title: this.title,
        id: this.id,
      }
    }
  },
  template: `
    <form v-on:submit.prevent="sub">
      <input v-model="title" type="text"/>
      <input type="submit" value="Submit meeeee"/>
    </form>
  `
});

Vue.component('todo', {
  data: function() {
    return {
      placeholder: 1,
    }
  }
  ,
  props: ['todo'],
  template: `
    <div>
      <h1>{{ todo.title }}</h1>
      <button v-on:click.prevent="$emit('destroy', todo.id)">Delete</button>
    </div>
  `
})

Vue.component('todo-list', {
  data: function() {
    return {
      placeholder: 1,
    }
  },
  props: ['todos', 'destroy'],
  template: `
    <div>
      <todo v-for="todo in todos" v-bind:todo='todo' v-on:destroy="destroy" v-bind:key="todo.id"></todo>
    </div>
  `
})

let app = new Vue({
  el: '#app',
  data: {
    todos: [],
  },
  methods: {
    submit(data) {
      if (!data.id) {
        data.id = this.todos.length;
      }
      this.todos.push(data);
    },
    destroy(todo) {
      const index = this.todos.findIndex( el => el.id == todo );

      if (index > -1) {
        this.todos.splice(index, 1);
      }
    },
  },
});
