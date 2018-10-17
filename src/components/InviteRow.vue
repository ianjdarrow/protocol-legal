<template>
  <div class="invite-row">
    <div class="left">
      <div>
        <p class="name">{{invite.name}}</p>
        <p class="org">{{invite.organization}}</p>
      </div>
      <div class="icons">
        <div class="icon-row">
          <a v-if="invite.github" :href="`https://github.com/${invite.github}`">
            <img class="github" src="../assets/github.png" /> <span>@{{invite.github}}</span>
          </a>
          <img v-else src="../assets/github.png" class="github disabled" />
        </div>
        <div class="icon-row">
          <a :href="`mailto:${invite.email}`">
            <img class="email" src="../assets/empty-email.svg" /><span>{{ invite.email }}</span>
          </a>
        </div>
      </div>
    </div>
    <div class="right">
      <div class="invite-action muted">
        <div class="check yes" />Invited {{ formatDate(invite.invited)}}
      </div>
      <div class="invite-action" :class="invite.accepted ? 'muted' : ''">
        <div class="check" :class="invite.accepted ? 'yes' : ''" />
        {{ invite.accepted ? `Accepted ${formatDate(invite.accepted)}` : `Has not accepted` }}
      </div>
      <div class="invite-action" v-if="invite.granted || !invite.accepted" :class="invite.granted || !invite.accepted ? 'muted' : ''">
        <div class="check" :class="invite.granted ? 'yes' : ''" />
        {{ invite.granted ? `Added ${ formatDate(invite.granted)}` : 'Not ready for access' }}
      </div>
      <GrantAccessWidget :invite="invite" />
    </div>
    <span class="link">&#9656;</span>
  </div>
</template>

<script>
import format from "date-fns/format";
import GrantAccessWidget from "./GrantAccessWidget";
export default {
  name: "InviteRow",
  props: ["invite"],
  components: {
    GrantAccessWidget
  },
  methods: {
    formatDate: date => format(date, "MMM Do")
  }
};
</script>
<style lang="scss" scoped>
@import "../styles/_colors";
.invite-row {
  position: relative;
  height: 8.5rem;
  flex-basis: 49.7%;
  border-radius: 2px;
  padding: 1rem;
  border: 1px solid rgba(black, 0.1);
  display: flex;
  margin-bottom: 0.5rem;
  p {
    margin: 0;
    line-height: 1.3;
    &.org {
      opacity: 0.75;
    }
  }
  .left {
    flex-basis: 45%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .right {
    flex-basis: 50%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .link {
    position: absolute;
    right: -0.5rem;
    top: 0rem;
    padding: 1rem;
    cursor: pointer;
    color: rgba(black, 0.06);
    font-size: 3rem;
    transition: all 0.2s ease-in-out;
    &:hover {
      color: rgba(black, 0.4);
    }
  }
}
.icons {
  display: flex;
  flex-direction: column;
  padding-top: 1rem;
  a {
    color: $black;
    &:hover {
      text-decoration: none;
    }
  }
  .icon-row {
    display: flex;
    align-items: center;
    font-size: 80%;
    opacity: 0.7;
    &:hover {
      opacity: 1;
    }
    img {
      margin: 0;
      margin-right: 0.5rem;
      flex-basis: 20%;
    }
    img.github {
      height: 1em;
      width: auto;
      &.disabled {
        opacity: 0.2;
        cursor: not-allowed;
      }
    }
    img.email {
      height: 1em;
      width: auto;
    }
    span {
      position: relative;
      display: inline-block;
      transform: translateY(-0.15rem);
    }
  }
}
.invite-action {
  display: flex;
  align-items: center;
  line-height: 1.3;
  margin-bottom: 0.75rem;
  font-weight: 500;
  &.muted {
    opacity: 0.7;
    font-weight: normal;
  }
  &:nth-child(3) {
    margin-bottom: 0;
  }
}
.check {
  width: 0.75rem;
  height: 0.75rem;
  margin-right: 0.5rem;
  border-radius: 2px;
  border: 1px solid rgba(black, 0.3);
  &.yes {
    background: $green;
  }
  &.current {
    background: $black;
  }
}
</style>
