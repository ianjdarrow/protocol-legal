<template>
  <div class="container">
    <div class="nav">
      <img class="logo" src="../assets/pl.svg" @click="$router.push('/dashboard')" />
      <div class="right">
        <button class="sm" @click="handleSignOut">Log out</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "Nav",
  methods: {
    handleSignOut: function() {
      this.firebase
        .auth()
        .signOut()
        .then(() => this.$router.push("/login"));
    }
  },
  computed: {
    ...mapState({
      firebase: state => state.firebase
    })
  }
};
</script>

<style lang="scss" scoped>
@import "../styles/_colors";
.nav {
  // height: 60px;
  border-bottom: 1px solid rgba(black, 0.1);
  padding-bottom: 20px !important;
  box-sizing: border-box;
  position: relative;
  padding: 10px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.logo {
  height: 60px;
  width: auto;
  position: absolute;
  left: -7.5px;
  cursor: pointer;
  &:hover {
    opacity: 0.7;
  }
  // transform: translateY(7.5px);
}
</style>
