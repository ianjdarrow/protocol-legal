<template>
  <div class="invite-container" :key="$route.params.token">
    <div class="logos">
      <a href="https://filecoin.io">
        <img class="logo-s" src="../assets/filecoin.png" />
      </a>
      <a href="https://protocol.ai">
        <img class="logo-l" src="../assets/pl.svg" />
      </a>
    </div>
    <div class="tos">
      <h1>Welcome to the Filecoin private preview! <img class="emoji" src="../assets/party.png" /></h1>
      <hr />
      <p>Thanks for joining us as we work towards the public testnet and launch. We asked you to join because we value your deep expertise and thoughtful approach across a number of problem areas. Above all, we are grateful for your help, critique, PRs, ideas, and questions.</p>
      <p>Once you confirm your participation:</p>
      <ul>
        <li>You’ll be added to the Filecoin Github repo.</li>
        <li>You can provide general discussion, ideas, and feedback
          <a href="https://a.link">here</a>. Security reports go
          <a href="https://a.link">here</a>.</li>
        <li>Please be on the lookout for emails or surveys asking for input on specific topics.</li>
        <li>If the above channels don’t fit a conversation you’d like to have, email
          <a href="mailto:filecoin@protocol.ai">filecoin@protocol.ai</a> at any time.</li>
      </ul>
      <h3>Private preview rules</h3>
      <p>Please review the rules for the private preview.</p>
      <ul>
        <li>I agree not to share any code or information I receive as part of the private preview.</li>
        <li>I agree not to use the Filecoin network to upload or share content that's illegal or violates the IP rights of others. I'll remove any such content if I'm able to do so.</li>
        <li>I agree not to host a generally-accessible file upload service until the private preview ends (when the public testnet launches).</li>
        <li>I agree not to blog, write, tweet, or otherwise publicly discuss the project or my participation until the public testnet launches.</li>
        <li>I understand that I’m being granted access only for testing, collaboration, and feedback, and that there are no uptime or reliability guarantees.</li>
      </ul>
      <p>Your access may be revoked if you violate these rules. If you have any questions, email
        <a href="mailto:legalrequests@protocol.ai">legalrequests@protocol.ai</a>, or feel free to reach out to another Protocol Labs contact.</p>
      <hr class="mt-1 mb-1" />
      <form @submit.prevent="handleSubmit" v-if="invitee.email && !invitee.accepted">
        <div class="input mb-1 mt-1">
          <label>Your GitHub username</label>
          <input type="text" class="helper" v-model="form.github">
          <span class="helper">@</span>
        </div>
        <button type="button" class="sm fullwidth mb-1 agree-button" :class="tosAgreed ? 'active' : ''" @click="tosAgreed = !tosAgreed">I agree to the private preview rules</button>
        <button type="submit" class="fullwidth" :disabled="!formValid">
          Request access
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
const emailRe = /\S+@\S+\.\S+/;

const getGeoData = () => {
  return new Promise(async res => {
    const response = await fetch("https://geoip.tools/v1/json");
    res(response.json());
  });
};

export default {
  name: "home",
  data() {
    return {
      invitee: {},
      form: {
        github: ""
      },
      tosAgreed: false
    };
  },
  async mounted() {
    const token = this.$route.params.token;
    try {
      const invite = await this.db
        .collection("invites")
        .doc(token)
        .get();
      if (!invite.exists) {
        console.log("no such invite");
        this.$store.commit("setFlash", "Bad invite code.");
        return;
      }
      this.invitee = invite.data();
      this.form.github = this.invitee.github;
      if (this.invitee.accepted) {
        this.$store.commit(
          "setFlash",
          "Looks like you already accepted your invite! Email your contact or filecoin@protocol.ai if you think there's an issue."
        );
      }
    } catch (err) {
      console.log(err);
    }
  },
  methods: {
    handleSubmit: async function() {
      const geoData = await getGeoData();
      const result = await this.db
        .collection("invites")
        .doc(this.$route.params.token)
        .update({
          accepted: new Date().toISOString(),
          acceptanceMetadata: geoData
        });
      this.$router.push("/registration-confirmation");
    }
  },
  computed: {
    formValid: function() {
      return this.form.github.length > 1 && this.tosAgreed;
    },
    ...mapState({
      db: state => state.db
    })
  }
};
</script>

<style lang="scss" scoped>
.invite-container {
  padding: 0.5rem;
  max-width: 65ch;
  margin: 0 auto;
  a {
    line-height: 1;
  }
}
.logos {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
}
.logo-s {
  width: 100px;
  height: auto;
  margin-right: 1rem;
}
.logo-l {
  width: 130px;
  height: auto;
  margin-left: 1rem;
}
.tos {
  h1 {
    text-align: center;
    font-weight: 500;
    line-height: 1;
    margin: 0;
    margin-bottom: 0.5rem;
  }
  .emoji {
    height: 1em;
    line-height: 1;
    margin: 0;
    margin-left: 0.25em;
  }
}
.agree-button {
  opacity: 0.5;
  &.active {
    opacity: 1;
    background: #98fb98;
  }
}
</style>
