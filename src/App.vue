<template>
  <div id="app" v-if="$store.state.loading === false">
    <Flash />
    <router-view/>
  </div>
  <div v-else>Loading...</div>
</template>

<script>
import "normalize.css";
import Typography from "typography";
import githubTheme from "typography-theme-github";
import Loader from "./components/Loader";
import Flash from "./components/Flash";
const typography = new Typography(githubTheme);
typography.injectStyles();
export default {
  name: "App",
  components: {
    Loader,
    Flash
  },
  mounted() {
    this.$store.dispatch("initializeApp");
  }
};
</script>


<style lang="scss">
@import "./styles/main.scss";
</style>
