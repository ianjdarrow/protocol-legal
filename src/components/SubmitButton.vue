<template>
  <div>
    <button class="submit-button fullwidth" :class="step===1 ? 'ready' : ''" type="submit">
      {{messages[step]}}
    </button>
  </div>
</template>
<script>
export default {
  name: "SubmitButton",
  props: ["step"],
  data() {
    return {
      messages: ["Send invite!", "Confirm and send email", "Sent!"]
    };
  }
};
</script>
<style lang="scss" scoped>
@import "../styles/_colors";
.submit-button {
  transition: background 0.2s ease-in-out;
}
.ready {
  background: $green;
}
</style>
