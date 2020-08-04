Vue.component('todo-form', {
  data: function() {
    return {
      id: 74,
      title: "",
    }
  },
  methods: {
    sub() {
      this.$emit('submit', this.todo);
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
      This works :) {{ id }}
      <input v-model="title" type="text"/>
      <input type="submit" value="Submit meeeee"/>
    </form>
  `
});

let app = new Vue({
  el: '#app',
  data: {
    message: "We made it!! :D"
  },
  methods: {
    submit(data) {
      console.log(data)
    }
  },
});
