<template>
  <!-- Granted access state turns out to be a little complicated. This widget pulls it out of RenderInvites -->
  <div>
    <button v-if="showInvite" class="sm" @click="indicateAccessGranted">I did it</button>
    <span v-if="showDate">{{ formatted(invite.granted) }}</span>
    <span v-if="showDash" class="muted">-</span>
    <span v-if="showUndo" class="undo" @click.prevent="handleUndo">undo</span>
    <span v-if="done">Done</span>
  </div>
</template>
<script>
import { mapState } from "vuex";
import format from "date-fns/format";
export default {
  name: "GrantAccessWidget",
  props: ["invite"],
  data() {
    return {
      showUndo: false,
      done: false
    };
  },
  methods: {
    indicateAccessGranted: async function() {
      await this.db
        .collection("invites")
        .doc(this.invite.id)
        .update({
          granted: new Date().toISOString()
        });
      this.showUndo = true;
      setTimeout(() => {
        this.showUndo = false;
        this.done = true;
      }, 3000);
    },
    handleUndo: async function() {
      await this.db
        .collection("invites")
        .doc(this.invite.id)
        .update({
          granted: null
        });
      this.showUndo = false;
    },
    formatted: function(date) {
      return format(date, "YYYY.MM.DD");
    }
  },
  computed: {
    showInvite: function() {
      return (
        this.invite.accepted &&
        !(this.invite.granted || this.showUndo || this.done)
      );
    },
    showDate: function() {
      return this.invite.granted;
    },
    showDash: function() {
      return !(this.showInvite || this.showDate || this.showUndo || this.done);
    },
    ...mapState({
      db: state => state.db
    })
  }
};
</script>
<style lang="scss" scoped>
.muted {
  color: rgba(black, 0.5);
}
.undo {
  color: rgba(red, 0.7);
}
</style>
