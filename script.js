Vue.component('todo-form', {
  data: function() {
    return {
      id: null,
      title: "",
      date: (new Date()).toISOString().substr(0,10),
      errors: [],
      disabled: true,
    }
  },
  methods: {
    sub(event) {
      if (this.title != "") {
        this.errors = []
        this.$emit('submit', this.todo);

        // Clear form
        this.title = "";
        this.date = (new Date()).toISOString().substr(0,10);
      } else {
        this.errors = ["Title cannot be blank"];
      }
    }
  },
  watch: {
    title: function(val) {
      if (val == "")
        this.disabled = true;
      else
        this.disabled = false;
    }
  },
  computed: {
    todo: function() {
      return {
        title: this.title,
        id: this.id,
        date: this.date,
      }
    }
  },
  template: `
    <form
      v-on:submit.prevent="sub"
      class="p-4 border-b flex flex-wrap"
    >
      <ul v-if="errors.length > 0">
        <li v-for="error in errors" v-bind:key="error">{{error}}</li>
      </ul>
      <input
        class='w-full flex-none border rounded px-3 py-2 focus:border-blue-500 transition-colors duration-150 outline-none'
        v-model="title"
        placeholder="Type something..."
        type="text"/>
      <input
        class='flex-auto mt-4 border rounded px-3 py-2 focus:border-blue-500 transition-colors duration-150 outline-none'
        v-model="date"
        type="date"/>
      <input
        class="ml-2 mt-4 px-3 py-2 rounded bg-blue-500 hover:bg-blue-700 focus:bg-blue-700 text-white cursor-pointer disabled:bg-gray-200 disabled:text-gray-600 disabled:cursor-not-allowed"
        v-bind:disabled="disabled"
        type="submit"
        value="Add"/>
    </form>
  `
});

Vue.component('todo', {
  data: function() {
    return {
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
    }
  },
  props: ['todos', 'destroy'],
  template: `
    <div v-if='todos.length > 0'>
      <todo v-for="todo in todos" v-bind:todo='todo' v-on:destroy="destroy" v-bind:key="todo.id"></todo>
    </div>
    <div
      class="w-full h-full text-center flex justify-center items-center text-gray-600"
      v-else>
      Nothing here yet.
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
