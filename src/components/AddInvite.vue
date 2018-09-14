<template>
  <div class="invite-form">
    <transition name="invite-form">
      <div class="add-invite mb-1" v-if="show">
        <form @submit.prevent="handleSubmit">
          <div class="input mb-1">
            <label>Email</label>
            <input type="email" v-model="form.email">
          </div>
          <div class="input mb-1">
            <label>Name (optional)</label>
            <input type="text" v-model="form.name">
          </div>
          <div class="input mb-1">
            <label>GitHub username (optional)</label>
            <input type="text" class="helper" v-model="form.github">
            <span class="helper">@</span>
          </div>
          <button type="submit" class="fullwidth sm">Send invite!</button>
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
      }
    };
  },
  methods: {
    handleSubmit: async function() {
      const email = this.form.email.toLowerCase();
      const github = this.form.github.toLowerCase();
      const alreadyAdded =
        this.invites.filter(i => i.email === email || i.github === github)
          .length > 0;
      if (alreadyAdded) {
        console.log("already exists");
        return;
      }
      const payload = {
        ...this.form,
        email: this.form.email.toLowerCase(),

        invited: new Date().toISOString()
      };
      try {
        const result = await this.db.collection("invites").add(payload);
      } catch (err) {
        console.error(err);
      }
    }
  },
  computed: {
    inputValid: function() {
      return emailRe.test(this.form.email);
    },
    ...mapState({
      db: state => state.db
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
