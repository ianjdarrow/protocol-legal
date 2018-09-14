<template>
  <div>
    <div class="invite-header">
      <span class="email">Email</span>
      <span class="github">Github</span>
      <span class="name">Name</span>
      <span class="invited">Invited</span>
      <span class="accepted">Accepted</span>
      <span class="granted">Granted</span>
      <span class="options"></span>
    </div>
    <Loader v-if="loading" />
    <div v-else v-for="invite in invites" class="invite-list" :key="invite.id">
      <span class="email">{{ invite.email }}</span>
      <span class="github" :class="invite.github ? '' : 'muted'">{{ invite.github || "-" }}</span>
      <span class="name" :class="invite.name ? '' : 'muted'">{{ invite.name || "-" }}</span>
      <span class="invited" :class="invite.invited ? '' : 'muted'">{{ formatted(invite.invited) || "-" }}</span>
      <span class="accepted" :class="invite.accepted ? '' : 'muted'">{{ invite.accepted || "-" }}</span>
      <span class="granted" :class="invite.granted ? '' : 'muted'">{{ invite.granted || "-" }}</span>
      <span class="options"></span>
    </div>
  </div>
</template>

<script>
import format from "date-fns/format";
import Loader from "../components/Loader";
export default {
  name: "RenderInvites",
  components: { Loader },
  props: ["invites", "loading"],
  methods: {
    formatted: function(date) {
      return format(date, "YYYY.MM.DD");
    }
  }
};
</script>

<style lang="scss" scoped>
.invite-header,
.invite-list {
  display: flex;
  padding-left: 5px;
  padding-right: 5px;
  .email {
    flex-basis: 20%;
  }
  .github {
    flex-basis: 20%;
  }
  .name {
    flex-basis: 20%;
  }
  .invited {
    flex-basis: 11%;
  }
  .accepted {
    flex-basis: 11%;
  }
  .granted {
    flex-basis: 11%;
  }
  .options {
    flex-basis: 7%;
  }
}
.invite-header {
  font-weight: bold;
}
.invite-list {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  border: 1px solid transparent;
  &:hover {
    background: rgba(black, 0.02);
    border: 1px solid rgba(black, 0.1);
    cursor: pointer;
  }
}
.muted {
  color: rgba(black, 0.4) !important;
}
</style>
