<template>
  <!-- The page displayed to users who receive a filecoin invite -->
  <div class="invite-container" :key="$route.params.token">
    <img class="logo-top" src="../assets/invites/filecoin-logo-color.svg" />
    <img class="illustration-top" src="../assets/invites/invite-tos-top.png" />
    <div class="tos">
      <h1>Welcome to the</h1>
      <h1>Filecoin private preview!</h1>
      <hr />
      <p>Thanks for joining us as we work towards the public testnet and launch. We asked you to join because we value your deep expertise and thoughtful approach across a number of problem areas. Above all, we are grateful for your help, critique, PRs, ideas, and questions.</p>
      <div class="rules">
        <img class="side-image" src="../assets/invites/invite-tos-side.png" />
        <div class="content">
          <h1 ref="rules">Private preview rules</h1>
          <span class="muted subtext">Check to agree</span>
          <hr />
          <ul>
            <li>
              <input type="checkbox" id="check1" v-model="checks[0]" class="styled-checkbox" />
              <label for="check1">I agree not to share any code or information I receive as part of the private preview.</label>
            </li>
            <li>
              <input type="checkbox" id="check2" v-model="checks[1]" class="styled-checkbox" />
              <label for="check2">I agree not to use the Filecoin network to upload or share content that's illegal or violates the IP rights of others. I'll remove any such content if I'm able to do so.</label></li>
            <li>
              <input type="checkbox" id="check3" v-model="checks[2]" class="styled-checkbox" />
              <label for="check3">I agree not to host a generally-accessible file upload service until the private preview ends (when the public testnet launches).</label></li>
            <li>
              <input type="checkbox" id="check4" v-model="checks[3]" class="styled-checkbox" />
              <label for="check4">I agree not to blog, write, tweet, or otherwise publicly discuss the project or my participation until the public testnet launches.</label></li>
            <li>
              <input type="checkbox" id="check5" v-model="checks[4]" class="styled-checkbox" />
              <label for="check5">I understand that I’m being granted access only for testing, collaboration, and feedback, and that there are no uptime or reliability guarantees.</label></li>
          </ul>
          <p>Your access may be revoked if you violate these rules. If you have any questions, email
            <a href="mailto:legalrequests@protocol.ai">legalrequests@protocol.ai</a>, or feel free to reach out to another Protocol Labs contact.</p>
        </div>
      </div>
      <div class="footer">
        <h1>Get your access!</h1>
        <hr />
        <form @submit.prevent="handleSubmit">
          <div class="input mb-1 mt-1">
            <label>Your GitHub username</label>
            <input type="text" class="helper" v-model="form.github" ref="github">
            <span class="helper">@</span>
          </div>
          <button type="submit" class="filecoin">
            Agree and submit
          </button>
        </form>
      </div>
    </div>
    <div class="bottom-border" />
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
      checks: [false, false, false, false, false]
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
        // this.$router.push('/');
        // this.$store.commit("setFlash", "Invalid invite code");
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
      // const geoData = await getGeoData();
      const result = await this.db
        .collection("invites")
        .doc(this.$route.params.token)
        .update({
          accepted: new Date().toISOString()
          // acceptanceMetadata: geoData
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
hr {
  width: 80px;
  height: 3px;
  background: $filecoin;
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
}
.invite-container {
  padding: 1rem;
  padding-top: 320px;
  max-width: 1200px;
  margin: 0 auto;
  a {
    line-height: 1;
  }
  .illustration-top {
    position: absolute;
    right: 0;
    top: 0;
    width: 60%;
  }
  .logo-top {
    position: absolute;
    width: 24%;
    top: 3rem;
  }
  @media (max-width: 600px) {
    .illustration-top {
      width: 100%;
    }
    .logo-top {
      display: none;
    }
  }
}
.tos {
  h1 {
    font-weight: 500;
    font-size: 3rem;
    line-height: 1;
    margin: 0;
    margin-bottom: 0.5rem;
    @media (max-width: 600px) {
      font-size: 2rem;
    }
  }
  p,
  li {
    font-size: 135%;
    max-width: 55ch;
    @media (max-width: 600px) {
      font-size: 120%;
    }
  }
}
.rules {
  padding-top: 100px;
  padding-bottom: 100px;
  display: flex;
  justify-content: flex-end;
  @media (max-width: 600px) {
    padding-top: 60px;
    padding-bottom: 60px;
  }
  .side-image {
    position: absolute;
    left: 0;
    transform: translateY(-50px);
    height: auto;
    width: 50vw;
    max-width: 600px;
    @media (max-width: 1000px) {
      transform: none;
    }
    @media (max-width: 800px) {
      display: none;
    }
  }
  .content {
    width: 50vw;
    padding-left: 1rem;
    box-sizing: border-box;
    li {
      list-style-type: none;
      position: relative;
      label::before {
        position: absolute;
        transform: translate(-2rem, 0.55rem);
      }
      label::after {
        position: absolute;
        transform: translate(-2rem, 0.3rem) rotate(45deg);
      }
    }
    h1 {
      margin-bottom: 2rem;
    }
    span.subtext {
      position: absolute;
      transform: translateY(-2rem);
      font-style: italic;
    }
    @media (max-width: 800px) {
      width: auto;
      padding-left: 0;
    }
  }
}
.footer {
  padding-bottom: 150px;
  max-width: 800px;
  margin: 0 auto;
  h1 {
    text-align: center;
  }
  hr {
    margin-left: auto;
    margin-right: auto;
  }
  input {
    border-radius: 0;
    border: none;
    background: transparent;
    border-bottom: 1px solid rgba(black, 0.3);
    &:focus {
      border: none;
      border-bottom: 1px solid rgba(black, 0.7);
    }
  }
  button.filecoin {
    margin: 0 auto;
    margin-top: 2rem;
    display: block;
  }
}
.bottom-border {
  margin-left: -2rem;
  margin-right: -2rem;
  margin-bottom: -1rem;
  bottom: 0;
  height: 12px;
  background: linear-gradient(to right, rgb(72, 31, 142), rgb(0, 226, 231));
}
</style>
