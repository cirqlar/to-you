Vue.component('todo-form', {
  data: function() {
    return {
      id: 74,
    }
  },
  template: `
    <div>
      This works :) {{ id }}
    </div>
  `
});

let app = new Vue({
  el: '#app',
  data: {
    message: "We made it!! :D"
  }
});
