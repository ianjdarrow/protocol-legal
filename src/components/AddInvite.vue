<template>
  <!-- Child for ManageInvites view – allows adding new users -->
  <div class="invite-form">
    <transition name="invite-form">
      <div class="add-invite mb-1" v-if="show">
        <form @submit.prevent="handleSubmit">
          <div class="input mb-1">
            <label>Name</label>
            <input type="text" v-model="form.name" ref="name">
          </div>
          <div class="input mb-1">
            <label>Email</label>
            <input type="email" v-model="form.email">
          </div>
          <div class="input mb-1">
            <label>GitHub username (optional)</label>
            <input type="text" class="helper" v-model="form.github">
            <span class="helper">@</span>
          </div>
          <Autocomplete class="mb-1" v-model="form.organization" :searchFunction="searchOrganizations" label="Organization (optional)" />
          <SubmitButton :step="step" />
        </form>
      </div>
    </transition>
  </div>
</template>

<script>
import uuid from "uuid/v4";
import { mapState } from "vuex";
import { levenshteinDistance } from "../lib/strings";
import Autocomplete from "./Autocomplete";
import SubmitButton from "./SubmitButton";

const emailRe = /\S+@\S+\.\S+/;

export default {
  name: "AddInvite",
  props: ["invites", "show"],
  components: { Autocomplete, SubmitButton },
  data() {
    return {
      form: {
        name: "",
        email: "",
        organization: "",
        github: ""
      },
      loading: false,
      step: 0
    };
  },
  methods: {
    searchOrganizations: function(search) {
      search = search.toLowerCase();
      return this.allOrganizations
        .filter(i => i.toLowerCase().indexOf(search) == 0)
        .sort(
          (a, b) =>
            levenshteinDistance(b, search) > levenshteinDistance(a, search)
        )
        .slice(0, 3);
    },
    handleSubmit: async function() {
      if (this.step === 0) {
        const email = this.form.email.toLowerCase();
        const github = this.form.github.toLowerCase();
        const alreadyAdded = this.invites.filter(
          i => i.email === email || (i.github && i.github === github)
        );
        if (alreadyAdded.length > 0) {
          this.$store.commit("setFlash", "Already invited!");
          this.$emit("setSearch", alreadyAdded[0].email);
          this.step = 0;
          return;
        }
        this.step++;
        setTimeout(() => {
          if (this.step === 1) this.step = 0;
        }, 5000);
        return;
      }
      if (this.step === 1) {
        const payload = {
          ...this.form,
          email: this.form.email.toLowerCase(),
          invitedBy: this.user,
          invited: new Date().toISOString()
        };
        this.loading = true;
        try {
          const result = await this.db.collection("invites").add(payload);
          this.$store.commit("setFlash", `Invited ${this.form.email}!`);
          setTimeout(() => this.$store.commit("clearFlash"), 2500);
          this.clearForm();
          this.$refs.name.focus();
        } catch (err) {
          console.error(err);
          this.$store.commit(
            "setFlash",
            "Error sending invite! You may not have permission. Email ian@protocol.ai if you think this is an error."
          );
        }
        this.loading = false;
        this.step = 2;
        setTimeout(() => (this.step = 0), 2000);
      }
    },
    clearForm: function() {
      this.form = {
        email: "",
        github: "",
        name: "",
        organization: ""
      };
    }
  },
  computed: {
    allOrganizations: function() {
      return Array.from(
        new Set(
          this.invites.filter(i => i.organization).map(i => i.organization)
        )
      );
    },
    formValid: function() {
      return emailRe.test(this.form.email) && this.form.name;
    },
    ...mapState({
      db: state => state.db,
      user: state => state.user
    })
  },
  watch: {
    show: function() {
      if (this.show) return setTimeout(() => this.$refs.name.focus(), 150);
    }
  }
};
</script>

<style lang="scss" scoped>
.invite-form {
}
.add-invite {
  transition: all 0.2s ease-in-out;
  max-height: 19.1rem;
  overflow: hidden;
}
.invite-form-enter,
.invite-form-leave-to {
  max-height: 0;
}
</style>
