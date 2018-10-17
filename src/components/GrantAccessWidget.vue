<template>
  <div>
    <button v-if="invite.accepted && !invite.granted" class="sm fullwidth" @click="indicateAccessGranted">Needs GitHub access</button>
    <transition name="toast">
      <div class="undoToast" v-if="showUndo" @click="showUndo=false">
        Thanks for adding @{{ oldInvite.github }} on GitHub!<button class="sm white ml-1" @click.stop="handleUndo">Oops - I didn't</button>
        <span class="exit">&times;</span>
      </div>
    </transition>
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
      oldInvite: null,
      timeout: null
    };
  },
  methods: {
    indicateAccessGranted: async function() {
      this.oldInvite = this.invite;
      await this.db
        .collection("invites")
        .doc(this.invite.id)
        .update({
          granted: new Date().toISOString(),
          grantedBy: this.user
        });
      this.showUndo = true;
      this.timeout = setTimeout(() => {
        this.showUndo = false;
      }, 7000);
    },
    handleUndo: async function() {
      await this.db
        .collection("invites")
        .doc(this.oldInvite.id)
        .update({
          granted: null,
          grantedBy: null
        });
      this.showUndo = false;
      clearTimeout(this.timeout);
    },
    formatted: function(date) {
      return format(date, "YYYY.MM.DD");
    }
  },
  computed: {
    showInvite: function() {
      return this.invite.accepted && !this.invite.granted;
    },
    ...mapState({
      db: state => state.db,
      user: state => state.user
    })
  }
};
</script>
<style lang="scss" scoped>
.muted {
  color: rgba(black, 0.5);
}
.undoToast {
  z-index: 1000;
  color: white;
  text-align: center;
  position: fixed;
  font-weight: 300;
  bottom: 0;
  left: 0;
  width: 100vw;
  padding: 1rem;
  background: rgba(#222, 0.9);
  transition: all 0.2s ease-in-out;
  span.exit {
    position: absolute;
    bottom: -0.5rem;
    right: 0;
    opacity: 0.5;
    font-size: 2rem;
    padding: 1rem;
    cursor: pointer;
    &:hover {
      opacity: 1;
    }
  }
}
.toast-enter,
.toast-leave-to {
  bottom: -3rem;
}
</style>
