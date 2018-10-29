<template>
  <!-- A normal flash, used to display messages -->
  <!-- See `store.js` for usage -->
  <transition name="flash">
    <div class="flash" v-if="flash.active" @click="$store.commit('clearFlash')">
      <p>{{ flash.message }}</p>
      <span class="exit">&times;</span>
    </div>
  </transition>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "Flash",
  computed: {
    ...mapState({
      flash: state => state.flash
    })
  }
};
</script>

<style lang="scss" scoped>
@import "../styles/_colors";
.flash {
  z-index: 1000;
  background: rgba(#222, 0.9);
  color: white;
  padding: 1.5rem;
  box-sizing: border-box;
  width: 100%;
  position: fixed;
  left: 0;
  top: 0;
  transition: all 0.25s ease-in-out;
  display: flex;
  align-items: center;
  justify-content: center;
  p {
    line-height: 1;
    margin: 0;
  }
  .exit {
    position: absolute;
    font-size: 1.5rem;
    right: 0;
    padding: 0.5rem;
    transform: translateY(-1px);
    color: rgba(white, 0.3);
    cursor: pointer;
    &:hover {
      color: white;
    }
  }
}
.flash-enter,
.flash-leave-to {
  top: -5rem;
}
</style>
