<template>
  <!-- The login page for PL users -->
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
    handleSignin: async function() {
      const user = this.firebase.auth().currentUser;
      const re = /^.*@protocol.ai$/;
      if (user && re.test(user.email)) {
        return this.$router.push("/dashboard");
      }
      try {
        const result = await this.firebase
          .auth()
          .signInWithPopup(this.provider);
        const email = result.user.email;
        if (!re.test(email)) throw new Error("Must be a protocol.ai email");
        this.$store.commit("setEmail", email);
        this.$router.push("/dashboard");
      } catch (err) {
        console.error(err);
        this.$store.commit(
          "setFlash",
          "Please log in with a valid @protocol.ai email address"
        );
      }
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
