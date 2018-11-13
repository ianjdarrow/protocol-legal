<template>
  <div class="input">
    <label>{{label}}</label>
    <input class="display" :placeholder="placeholder" />
    <input class="actual" :value="value" @keydown.tab="handleEntry" @keydown.enter="handleEntry" @input="handleInput" @focus="handleInput" autocomplete="new-password" @blur="resetSuggestions" />
  </div>
</template>
<script>
export default {
  name: "Autocomplete",
  props: ["value", "searchFunction", "type", "label", "helper"],
  data() {
    return {
      suggestions: [],
      currentSuggestion: 0
    };
  },
  methods: {
    handleInput: function(e) {
      const input = e.target.value;
      this.$emit("input", input);
      if (input.length > 1) {
        this.suggestions = this.searchFunction(input);
      } else {
        this.resetSuggestions();
      }
    },
    handleEntry: function(e) {
      if (this.suggestions.length === 0) return;
      e.preventDefault();
      this.$emit("input", this.suggestions[this.currentSuggestion]);
      this.resetSuggestions();
    },
    resetSuggestions: function() {
      this.suggestions = [];
      this.currentSuggestion = 0;
    }
  },
  computed: {
    placeholder: function() {
      if (this.suggestions.length === 0 || this.value.length == 0) return "";
      const best = this.suggestions[this.currentSuggestion];
      return `${this.value}${best.substring(this.value.length, best.length)}`;
    }
  }
};
</script>
<style lang="scss" scoped>
.actual {
  z-index: 1000;
}
.display {
  background: transparent !important;
  position: absolute;
  border: 1px solid transparent;
  opacity: 0.5;
  z-index: 10000 !important;
  pointer-events: none;
}
</style>
