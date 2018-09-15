<template>
  <transition name="flash">
    <div class="flash" v-if="flash.active">
      <p>{{ flash.message }}</p>
      <span class="exit" @click="$store.commit('clearFlash')">&times;</span>
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
  border: 5px solid $black;
  background: #f2f2f2;
  padding: 1rem;
  box-sizing: border-box;
  width: 100%;
  max-width: 640px;
  left: 50%;
  transform: translateX(-50%);
  position: fixed;
  top: 1rem;
  transition: all 0.25s ease-in-out;
  display: flex;
  align-items: center;
  p {
    line-height: 1;
    margin: 0;
  }
  .exit {
    position: absolute;
    right: 0;
    padding: 0.75rem;
    color: rgba(black, 0.3);
    cursor: pointer;
    &:hover {
      color: $black;
    }
  }
}
.flash-enter,
.flash-leave-to {
  top: -5rem;
}
</style>
