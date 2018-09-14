<template>
  <span class="loader">
    <span>.</span>
    <span>.</span>
    <span>.</span>
  </span>
</template>

<style lang="scss" scoped>
// cool loader courtest of superdupersumus,
// https://codepen.io/xwildeyes/pen/KpqVzN
@keyframes blink {
  0% {
    opacity: 0.2;
  }
  20% {
    opacity: 1;
  }
  100% {
    opacity: 0.2;
  }
}

.loader span {
  font-size: 5rem;
  margin: 0;
  line-height: 0;
  animation-name: blink;
  animation-duration: 1.4s;
  animation-iteration-count: infinite;
  animation-fill-mode: both;
}

.loader span:nth-child(2) {
  animation-delay: 0.2s;
}

.loader span:nth-child(3) {
  animation-delay: 0.4s;
}
</style>
