<template>
  <!-- Child for ManageInvites view – allows adding new users -->
  <div class="invite-form">
    <transition name="invite-form">
      <div class="add-invite mb-1" v-if="show">
        <form @submit.prevent="handleSubmit">
          <div class="input mb-1">
            <label>Email</label>
            <input type="email" v-model="form.email" ref="email">
          </div>
          <div class="input mb-1">
            <label>Name</label>
            <input type="text" v-model="form.name">
          </div>
          <div class="input mb-1">
            <label>GitHub username (optional)</label>
            <input type="text" class="helper" v-model="form.github">
            <span class="helper">@</span>
          </div>
          <button type="submit" class="fullwidth sm" :disabled="!formValid">Send invite!</button>
        </form>
      </div>
    </transition>
  </div>
</template>

<script>
import uuid from "uuid/v4";
import { mapState } from "vuex";

const emailRe = /\S+@\S+\.\S+/;

export default {
  name: "AddInvite",
  props: ["invites", "show"],
  data() {
    return {
      form: {
        email: "",
        github: "",
        name: ""
      },
      loading: false
    };
  },
  methods: {
    handleSubmit: async function() {
      const email = this.form.email.toLowerCase();
      const github = this.form.github.toLowerCase();
      const alreadyAdded = this.invites.filter(
        i => i.email === email || (i.github && i.github === github)
      );
      if (alreadyAdded.length > 0) {
        this.$store.commit("setFlash", "Already invited!");
        this.$emit("setSearch", alreadyAdded[0].email);
        return;
      }
      const payload = {
        ...this.form,
        email: this.form.email.toLowerCase(),
        invitedBy: this.email,
        invited: new Date().toISOString()
      };
      this.loading = true;
      try {
        const result = await this.db.collection("invites").add(payload);
        // result.id has the ID we need
        console.log("Invite code:", result.id);
        this.$store.commit("setFlash", `Invited ${this.form.email}!`);
        setTimeout(() => this.$store.commit("clearFlash"), 2500);
        this.clearForm();
        this.$refs.email.focus();
      } catch (err) {
        console.error(err);
        this.$store.commit(
          "setFlash",
          "Error sending invite! Email ian@protocol.ai and tell him to fix it."
        );
      }
      this.loading = false;
    },
    clearForm: function() {
      this.form = {
        email: "",
        github: "",
        name: ""
      };
    }
  },
  computed: {
    formValid: function() {
      return emailRe.test(this.form.email) && this.form.name;
    },
    ...mapState({
      db: state => state.db,
      email: state => state.email
    })
  }
};
</script>

<style lang="scss" scoped>
.invite-form {
  border-bottom: 1px solid rgba(black, 0.1);
  margin-bottom: 1rem;
}
.add-invite {
  transition: all 0.2s ease-in-out;
  max-height: 14rem;
  overflow: hidden;
}
.invite-form-enter,
.invite-form-leave-to {
  max-height: 0;
}
</style>
