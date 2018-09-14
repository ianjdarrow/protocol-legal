<template>
  <div class="container login">
    <img class="logo" src="../assets/pl.svg" />
    <div>
      <button @click="handleSignin">Sign in</button>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "Login",
  methods: {
    handleSignin: function() {
      const user = this.firebase.auth().currentUser;
      const re = /^.*@protocol.ai$/;
      if (user && re.test(user.email)) {
        return this.$router.push("/dashboard");
      }
      this.firebase
        .auth()
        .signInWithPopup(this.provider)
        .then(result => {
          this.$store.commit("setEmail", result.user.email);
          this.$router.push("/dashboard");
        })
        .catch(error => console.error(error));
    }
  },
  computed: {
    ...mapState({
      firebase: state => state.firebase,
      provider: state => state.provider
    })
  }
};
</script>

<style lang="scss" scoped>
div.login {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 500px;
}
img.logo {
  width: 200px;
  height: auto;
}
</style>
