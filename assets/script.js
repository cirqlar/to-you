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
  props: ['categories', 'editing'],
  methods: {
    sub(event) {
      if (this.title != "") {
        this.errors = [];
        this.$emit('submit', this.todo);

        // Clear form
        this.title = "";
        this.date = (new Date()).toISOString().substr(0,10);
      } else {
        this.errors = ["Title cannot be blank"];
      }
    },
    stopEdit() {
      this.errors = []
      this.$emit('submit', this.editing);

      // Clear form
      this.title = "";
      this.date = (new Date()).toISOString().substr(0,10);
    },
  },
  watch: {
    title: function(val) {
      if (val == "")
        this.disabled = true;
      else
        this.disabled = false;
    },
    editing: function(val) {
      this.id = val?.id ?? null;
      this.title = val?.title ?? "";
      this.category = val?.category ?? 'default';
      this.date = val?.date ?? (new Date()).toISOString().substr(0,10);
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
      @submit.prevent="sub"
      class="p-4 border-b flex flex-wrap"
    >
      <div class="text-sm py-2" v-if='editing'>
        Currently editing a todo. <button
          @click.prevent='stopEdit'
          class="ml-1 text-blue-500 bg-transparent hover:text-blue-700 focus:text-black">Stop</button>
      </div>
      <ul v-if="errors.length > 0">
        <li v-for="error in errors" :key="error">{{error}}</li>
      </ul>
      <input
        class='w-full flex-none border rounded px-3 py-2 focus:border-blue-500 transition-colors duration-150 outline-none'
        :value="title"
        @input="title = $event.target.value"
        placeholder="Type something..."
        type="text"/>
      <select
        class="w-full flex-none border rounded mt-4 px-3 py-2 bg-white focus:border-blue-500 transition-colors duration-150 outline-none sm:w-auto sm:flex-auto"
        v-model="category">
        <option v-for='(color, name) in categories' :value='name'>{{name}}</option>
      </select>
      <input
        class='flex-auto mt-4 border rounded px-3 py-2 bg-white focus:border-blue-500 transition-colors duration-150 outline-none sm:ml-2'
        v-model="date"
        type="date"/>
      <input
        class="ml-2 mt-4 px-3 py-2 rounded bg-blue-500 hover:bg-blue-700 focus:bg-blue-700 text-white cursor-pointer disabled:bg-gray-200 disabled:text-gray-600 disabled:cursor-not-allowed"
        :disabled="disabled"
        type="submit"
        :value="this.editing ? 'Edit' : 'Add'"/>
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
      :class="[bg, 'text-sm px-2 py-1 rounded focus:outline-none']"
      @click.prevent="$emit('click')"
      >
      {{name}}
    </button>
  `
});

Vue.component('category-form', {
  data: function() {
    return {
      name: "",
      colors: ['gray', 'red', 'orange', 'yellow', 'green', 'teal', 'blue', 'indigo', 'purple', 'pink'],
      color: 'blue',
      errors: [],
      editing: null,
      disabled: true,
    }
  },
  computed: {
    category: function() {
      return {
        name: this.name,
        color: this.color,
      }
    }
  },
  watch: {
    name: function(val) {
      if (val == "") {
        this.disabled = true;
      } else {
        this.disabled = false;
      }
    }
  },
  methods: {
    sub() {
      if (this.name == "") {
        alert("Name can't be blank");
      } else {
        this.$emit('submit', this.category);

        this.name = "";
      }
    }
  },
  template: `
    <form
      class="ml-2 inline-flex min-w-100px max-w-90vw"
      @submit.prevent="sub">
      <input
        class="text-sm w-1/2 px-2 py-1 rounded border focus:border-blue-500 transition-colors duration-150 outline-none" 
        type="text" :value='name' @input="name = $event.target.value" />
      <select
        class="text-sm w-1/4 ml-2 px-2 py-1 bg-white rounded border focus:border-blue-500 transition-colors duration-150 outline-none"
        v-model='color'>
        <option v-for="fColor in colors" :key='fColor' :value='fColor'>{{fColor}}</option>
      </select>
      <button
        :disabled='disabled'
        class="text-sm ml-2 px-2 py-1 rounded bg-blue-500 hover:bg-blue-700 focus:bg-blue-700 text-white cursor-pointer disabled:bg-gray-200 disabled:text-gray-600 disabled:cursor-not-allowed"
        type='submit'>Add</button>
    </form>
  `
});

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
  props: ['categories', 'submit'],
  template: `
    <div class="px-4 py-2 border-b overflow-x-auto">
      <div class="inline-flex items-center">
        <span class=''>Categories: </span>
        <category-item
          v-for='(color, name) in categories'
          class='ml-2 flex-none'
          :key="name"
          :color="color"
          :name="name"
          :active=" active == '' || active == name"
          @click='click(name)'
          >
        </category-item>
        <category-form @submit='submit' class='flex-none'></category-form>
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
      :class="[border, 'border-l-4 flex px-4 py-2 rounded shadow-md items-center justify-between bg-white', {'opacity-50': todo.completed}]">
      <div class="w-3/5">
        <h1 class="break-words">{{ todo.title }}</h1>
        <span class="text-sm text-gray-600">{{ todo.date }}</span>
        <button
          class="text-sm ml-1 text-blue-500 bg-transparent hover:text-blue-700 focus:text-black"
          @click.prevent="$emit('finish', todo.id)">
          {{ todo.completed ? 'Finished' : 'Finish' }}
        </button>
      </div>
      <div class="flex">
        <button
          class="text-sm ml-1 p-2 rounded bg-blue-500 hover:bg-blue-700 focus:bg-blue-700 text-white cursor-pointer"
          @click.prevent="$emit('edit', todo.id)">
            <svg width="13" height="13" class="w-4 h-4" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 11.3125H0.5C0.223437 11.3125 0 11.5359 0 11.8125V12.375C0 12.4438 0.05625 12.5 0.125 12.5H12.375C12.4438 12.5 12.5 12.4438 12.5 12.375V11.8125C12.5 11.5359 12.2766 11.3125 12 11.3125ZM2.27656 10C2.30781 10 2.33906 9.99688 2.37031 9.99219L4.99844 9.53125C5.02969 9.525 5.05938 9.51094 5.08125 9.4875L11.7047 2.86406C11.7192 2.84961 11.7307 2.83244 11.7385 2.81354C11.7463 2.79463 11.7504 2.77437 11.7504 2.75391C11.7504 2.73344 11.7463 2.71318 11.7385 2.69428C11.7307 2.67538 11.7192 2.65821 11.7047 2.64375L9.10781 0.0453125C9.07813 0.015625 9.03906 0 8.99687 0C8.95469 0 8.91563 0.015625 8.88594 0.0453125L2.2625 6.66875C2.23906 6.69219 2.225 6.72031 2.21875 6.75156L1.75781 9.37969C1.74261 9.46339 1.74804 9.54954 1.77364 9.63067C1.79923 9.71181 1.84421 9.78548 1.90469 9.84531C2.00781 9.94531 2.1375 10 2.27656 10V10Z" fill="white"/>
            </svg>
        </button>
        <button
          class="text-sm ml-1 p-2 rounded bg-red-500 hover:bg-red-700 focus:bg-red-700 text-white cursor-pointer"
          @click.prevent="$emit('destroy', todo.id)">
            <svg width="12" height="13" class="w-4 h-4" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.5 2.25H9.5V1C9.5 0.448438 9.05156 0 8.5 0H3.5C2.94844 0 2.5 0.448438 2.5 1V2.25H0.5C0.223437 2.25 0 2.47344 0 2.75V3.25C0 3.31875 0.05625 3.375 0.125 3.375H1.06875L1.45469 11.5469C1.47969 12.0797 1.92031 12.5 2.45312 12.5H9.54688C10.0813 12.5 10.5203 12.0813 10.5453 11.5469L10.9312 3.375H11.875C11.9438 3.375 12 3.31875 12 3.25V2.75C12 2.47344 11.7766 2.25 11.5 2.25ZM8.375 2.25H3.625V1.125H8.375V2.25Z" fill="white"/>
            </svg>
        </button>
      </div>
    </div>
  `
})

Vue.component('todo-list', {
  data: function() {
    return {
    }
  },
  props: ['todos', 'destroy', 'categories', 'edit', 'finish'],
  template: `
    <div
      class="grid template-auto-fill w-full justify-center mx-auto p-4 gap-3 bg-gray-200"
      v-if='todos.length > 0'>
      <todo
        v-for="todo in todos"
        :todo='todo'
        @destroy="destroy"
        @edit='edit'
        @finish='finish'
        :color="categories[todo.category]"
        :key="todo.id">
      </todo>
    </div>
    <div
      class="w-full h-full text-center flex justify-center items-center text-gray-600 bg-gray-200"
      v-else>
      Nothing here yet.
    </div>
  `
})

let app = new Vue({
  el: '#app',
  data: {
    todos: [],
    editing: null,
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
        data.id = Math.floor(Math.random() * 1000000000);
        data.completed = false;
        this.todos.push(data);
      } else {
        let index = this.todos.findIndex(x => x.id == data.id);
        if (index >= 0) {
          this.$set(this.todos, index, Object.assign({}, this.todos[index], data));
        } else {
          //debugger;
          data.completed = data.completed ?? false; 
          this.todos.push(data);
        }
      }
      this.editing = null;
    },
    submitCat(category) {
      this.$set(this.categories, category.name.toLowerCase(), category.color);
    },
    destroy(id) {
      const index = this.todos.findIndex( el => el.id == id );

      if (index > -1) {
        this.todos.splice(index, 1);
      }
    },
    edit(id) {
      const todo = this.todos.find( el => el.id == id );

      if (todo) {
        this.editing = todo;
      }

    },
    finish(id) {
      const index = this.todos.findIndex( el => el.id == id );

      if (index >= 0) {
        this.todos[index].completed = !this.todos[index].completed;
      }
    },
    filt(name) {
      this.filter = name;
    }
  },
});
