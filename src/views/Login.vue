<template>
  <!-- The login page for PL users -->
  <div class="container login">
    <img class="logo" src="../assets/pl.svg">
    <div class="media">
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
        const route = this.$route.query.redirect
          ? this.$route.query.redirect
          : "/dashboard";
        return this.$router.push(route);
      }
      try {
        const result = await this.firebase
          .auth()
          .signInWithPopup(this.provider);
        const email = result.user.email;
        const name = result.user.displayName;
        if (!re.test(email)) throw new Error("Must be a protocol.ai email");
        this.$store.commit("setUser", { email, name });
        this.$router.push("/dashboard");
      } catch (err) {
        console.error(err);
        this.$store.commit(
          "setFlash",
          "Error logging you in. Did you provide a valid @protocol.ai email address?"
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
  min-height: 100vh;
  button {
    width: 150px;
    margin-top: -10px;
  }
}
img.logo {
  width: 180px;
  height: auto;
}
h2 {
  text-align: center;
  margin-top: 60px;
  margin-bottom: 20px;
  font-weight: 500;
  line-height: 1.6;
}
ul {
  /* text-align: center; */
  font-size: 1.1rem;
}
</style>
