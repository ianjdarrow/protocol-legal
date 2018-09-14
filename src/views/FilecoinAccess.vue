<template>
  <div class="container">
    <form @submit.prevent="handleSubmit">
      <div class="input">
        <label>Email</label>
        <input type="email" class="mb-1" v-model="form.email" required/>
      </div>
      <div class="input mb-1">
        <label>GitHub username</label>
        <input type="text" class="helper">
        <span class="helper">@</span>
      </div>
      <div class="input mb-1">
        <label>Name</label>
        <input type="text">
      </div>
      <button type="submit" class="fullwidth" :disabled="!formValid">
        Submit request
      </button>
    </form>
  </div>
</template>

<script>
import { mapState } from "vuex";
const emailRe = /\S+@\S+\.\S+/;

export default {
  name: "home",
  data() {
    return {
      form: {
        email: "",
        github: "",
        name: ""
      }
    };
  },
  methods: {
    handleSubmit: function() {
      this.db
        .collection("invites")
        .add({
          email: this.form.email
        })
        .then(docRef => console.log(docRef))
        .catch(err => console.error(err));
      this.email = "";
    }
  },
  computed: {
    formValid: function() {
      return (
        emailRe.test(this.form.email) && this.form.github && this.form.name
      );
    },
    ...mapState({
      // firebase: state => state.firebase,
      db: state => state.db
    })
  }
};
</script>
