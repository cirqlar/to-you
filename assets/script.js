Vue.component('todo-form', {
  data: function() {
    return {
      id: null,
      title: "",
      date: (new Date()).toISOString().substr(0,10),
      category: 'default',
      errors: [],
      disabled: true,
    }
  },
  props: ['categories'],
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
        category: this.category,
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
      <select
        class="w-full flex-none border rounded mt-4 px-3 py-2 bg-white focus:border-blue-500 transition-colors duration-150 outline-none sm:w-auto sm:flex-auto"
        v-model="category">
        <option v-for='(color, name) in categories' v-bind:value='name'>{{name}}</option>
      </select>
      <input
        class='flex-auto mt-4 border rounded px-3 py-2 focus:border-blue-500 transition-colors duration-150 outline-none sm:ml-2'
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

Vue.component('category-item', {
  data: function() {
    return {

    }
  },
  props: ['name', 'color', 'active'],
  computed: {
    bg: function() {
      let strength = this.active ? '500' : '300';
      return `bg-${this.color}-${strength} hover:bg-${this.color}-700 focus:bg-${this.color}-700`;
    }
  },
  template: `
    <button
      v-bind:class="[bg, 'text-sm px-2 py-1 rounded focus:outline-none']"
      v-on:click.prevent="$emit('click')"
      >
      {{name}}
    </button>
  `
})

Vue.component('category-list', {
  data: function() {
    return {
      active: "",
    }
  },
  methods: {
    click(name) {
      if (this.active == name) {
        name = "";
      }
      this.active = name;
      this.$emit('filter', name);
    }
  },
  props: ['categories'],
  template: `
    <div class="px-4 py-2 border-b overflow-x-auto">
      <div class="inline-flex items-center">
        <span class=''>Categories: </span>
        <category-item
          v-for='(color, name) in categories'
          class='ml-2'
          v-bind:key="name"
          v-bind:color="color"
          v-bind:name="name"
          v-bind:active=" active == '' || active == name"
          v-on:click='click(name)'
          >
        </category-item>
      </div>
    </div>
  `
})

Vue.component('todo', {
  data: function() {
    return {
    }
  },
  computed: {
    border: function() {
      return `border-${this.color}-500`;
    }
  },
  props: ['todo', 'color'],
  template: `
    <div
      v-bind:class="[border, 'border-l-4']">
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
  props: ['todos', 'destroy', 'categories'],
  template: `
    <div
      class="grid template-auto-fill w-full justify-center mx-auto p-4 gap-3"
      v-if='todos.length > 0'>
      <todo
        v-for="todo in todos"
        v-bind:todo='todo'
        v-on:destroy="destroy"
        v-bind:color="categories[todo.category]"
        v-bind:key="todo.id">
      </todo>
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
    categories: {
      'default': 'blue',
    },
    filter: '',
  },
  computed: {
    filteredTodos: function() {
      if (this.filter == "")
        return this.todos;
      return this.todos.filter(x => x.category == this.filter)
    }
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
    filt(name) {
      this.filter = name;
    }
  },
});
