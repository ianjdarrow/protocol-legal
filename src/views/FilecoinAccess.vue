<template>
  <!-- The page displayed to users who receive a filecoin invite -->
  <div class="invite-container">
    <div class="top-section">
      <div class="left">
        <img class="logo-top" src="../assets/invites/filecoin-logo-color.svg">
        <h1>Welcome to the
          <br>Filecoin private preview!
        </h1>
        <hr>
        <p>Thanks for joining us as we work towards the public testnet and launch. We asked you to join because we value your deep expertise and thoughtful approach across a number of problem areas. Above all, we are grateful for your help, critique, PRs, ideas, and questions.</p>
      </div>
      <div class="right">
        <img class="illustration-top" src="../assets/invites/invite-tos-top.png">
      </div>
    </div>
    <div class="bottom-section">
      <div class="left">
        <img ref="rules" class="side-image" src="../assets/invites/invite-tos-side.png">
      </div>
      <div class="right">
        <h1>Private preview rules</h1>
        <span class="muted subtext">Check to agree</span>
        <hr>
        <ul>
          <li>
            <input type="checkbox" id="check1" v-model="checks[0]" class="styled-checkbox">
            <label
              for="check1"
            >I agree not to share any code or information I receive as part of the private preview.</label>
          </li>
          <li>
            <input type="checkbox" id="check2" v-model="checks[1]" class="styled-checkbox">
            <label
              for="check2"
            >I agree not to use the Filecoin network to upload or share content that's illegal or violates the IP rights of others. I'll remove any such content if I'm able to do so.</label>
          </li>
          <li>
            <input type="checkbox" id="check3" v-model="checks[2]" class="styled-checkbox">
            <label
              for="check3"
            >I agree not to host a generally-accessible file upload service until the private preview ends (when the public testnet launches).</label>
          </li>
          <li>
            <input type="checkbox" id="check4" v-model="checks[3]" class="styled-checkbox">
            <label
              for="check4"
            >I agree to report any security vulnerabilities I discover and not to abuse them in a way that creates a bad experience for other testers.</label>
          </li>
          <li>
            <input type="checkbox" id="check5" v-model="checks[4]" class="styled-checkbox">
            <label
              for="check5"
            >I agree not to blog, write, tweet, or otherwise publicly discuss the project or my participation until the public testnet launches.</label>
          </li>
          <li>
            <input type="checkbox" id="check6" v-model="checks[5]" class="styled-checkbox">
            <label
              for="check6"
            >I understand that I’m being granted access only for testing, collaboration, and feedback, and that there are no uptime or reliability guarantees.</label>
          </li>
        </ul>
        <p>
          Your access may be revoked if you violate these rules. If you have any questions, email
          <a
            href="mailto:legalrequests@protocol.ai"
          >legalrequests@protocol.ai</a>, or feel free to reach out to another Protocol Labs contact.
        </p>
      </div>
    </div>
    <div class="footer">
      <h1>Get your access!</h1>
      <hr>
      <form @submit.prevent="handleSubmit">
        <div class="input mb-1 mt-1">
          <label>Your GitHub username</label>
          <input type="text" class="helper" v-model="form.github" ref="github">
          <span class="helper">@</span>
        </div>
        <button
          type="submit"
          class="filecoin"
        >{{invitee.email ? 'Agree and submit' : 'Invalid invite code'}}</button>
      </form>
    </div>
    <div class="bottom-border"/>
  </div>
</template>

<script>
import { mapState } from "vuex";
const emailRe = /\S+@\S+\.\S+/;

const getGeoData = () => {
  return new Promise(async res => {
    const response = await fetch("https://ipinfo.io/json");
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
      checks: [false, false, false, false, false, false]
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
        this.$store.commit(
          "setFlash",
          "Invalid invite code! Email your Protocol Labs contact if you think this is an error."
        );
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
      if (!this.invitee.email) {
        this.$store.commit("setFlash", "You don't have a valid invite code.");
        return;
      }
      if (!this.formValid) {
        if (!this.checks.every(c => c)) {
          this.$store.commit(
            "setFlash",
            "Please agree to the rules by checking each box."
          );
          this.$refs.rules.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });
          return;
        }
        if (this.form.github.length < 2) {
          this.$store.commit("setFlash", "Please enter your GitHub username.");
          this.$refs.github.focus();
          return;
        }
      }
      const geoData = await getGeoData();
      const result = await this.db
        .collection("invites")
        .doc(this.$route.params.token)
        .update({
          github: this.form.github,
          accepted: new Date().toISOString(),
          acceptanceMetadata: geoData
        });
      this.$router.push("/registration-confirmation");
    }
  },
  computed: {
    formValid: function() {
      return this.form.github.length > 1 && this.checks.every(c => c);
    },
    ...mapState({
      db: state => state.db
    })
  }
};
</script>

<style lang="scss" scoped>
@import "../styles/_colors";
h1 {
  font-size: 2.5rem;
  @media (max-widthh: 640px) {
    font-size: 2rem;
  }
}
.invite-container {
  padding: 1rem;
  box-sizing: border-box;
  overflow: hidden;
  font-size: 125%;
}
.top-section {
  display: flex;
  position: relative;
  min-height: 32rem;
  @media (max-width: 640px) {
    display: block;
  }
  .left {
    padding-top: 112px;
    flex-basis: 65%;
    @media (min-width: 1000px) {
      margin-left: calc(35vw - 350px);
    }
    @media (max-width: 700px) {
      padding-top: 140px;
    }
    p {
      max-width: 50ch;
    }
    .logo-top {
      position: absolute;
      width: 30%;
      max-width: 300px;
      top: 0;
    }
  }
  .right {
    img {
      position: absolute;
      top: -1rem;
      right: -1rem;
      width: 65%;
      max-width: 650px;
      pointer-events: none;
    }
  }
}
.bottom-section {
  display: flex;
  justify-content: flex-end;
  position: relative;
  h1 {
    margin: 0;
  }
  span {
    position: absolute;
    transform: translateY(-0.33rem);
    font-size: 80%;
    font-style: italic;
  }
  @media (max-width: 800px) {
    display: block;
    padding-top: 60px;
  }
  ul {
    list-style-type: none;
    margin-left: 2rem;
    li {
      padding-bottom: 1rem;
      label:before {
        position: absolute;
        transform: translate(-2rem, 0.5rem);
      }
      label:after {
        position: absolute;
        transform: translate(-2rem, 0.3rem) rotate(45deg);
      }
    }
  }
  .left {
    @media (max-width: 800px) {
      display: none;
    }
    img {
      position: absolute;
      top: -3rem;
      left: -1rem;
      width: 45%;
      max-width: 640px;
      pointer-events: none;
    }
  }
  .right {
    flex-basis: 55%;
    max-width: 45ch;
    @media (min-width: 1000px) {
      margin-right: calc(35vw - 350px);
    }
    @media (max-width: 800px) {
      max-width: 55ch;
    }
  }
}
.footer {
  max-width: 800px;
  margin: 0 auto;
  padding-top: 100px;
  padding-bottom: 160px;
  text-align: center;
  hr {
    margin: 0 auto;
    margin-bottom: 2rem;
  }
  button {
    float: right;
    @media (max-width: 640px) {
      width: 100%;
    }
  }
}
hr {
  width: 80px;
  height: 3px;
  background: $filecoin;
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
}
.bottom-border {
  margin-left: -50rem;
  margin-right: -50rem;
  margin-bottom: -1rem;
  bottom: 0;
  height: 12px;
  background: linear-gradient(to right, rgb(72, 31, 142), rgb(0, 226, 231));
}
</style>
