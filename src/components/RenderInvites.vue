<template>
  <!-- the container that renders a list of invites
this is a pure functional component – all the actual rendering happens
in the ManageFilecoinInvites view -->
  <div>
    <div class="no-results" v-if="!loading && invites.length === 0">No results</div>
    <Loader v-if="loading" />
    <div v-else class="invites">
      <InviteRow v-for="invite in invites" :invite="invite" :key="invite.id" />
    </div>
  </div>
</template>

<script>
import format from "date-fns/format";
import Loader from "../components/Loader";
import GrantAccessWidget from "../components/GrantAccessWidget";
import InviteRow from "../components/InviteRow";

export default {
  name: "RenderInvites",
  components: { Loader, GrantAccessWidget, InviteRow },
  props: ["invites", "loading"],
  methods: {
    formatted: function(date) {
      const formatted = format(date, "YYYY.MM.DD");
      if (formatted == "Invalid Date") return "-";
      return formatted;
    }
  }
};
</script>

<style lang="scss" scoped>
.invites {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  @media (max-width: 800px) {
    display: block;
  }
}
.invite-header,
.invite-list {
  display: flex;
  padding-left: 5px;
  padding-right: 5px;
  .github {
    flex-basis: 18%;
  }
  .name {
    flex-basis: 20%;
  }
  .invited {
    flex-basis: 13%;
  }
  .accepted {
    flex-basis: 13%;
  }
  .granted {
    flex-basis: 13%;
  }
  .options {
    flex-basis: 0%;
  }
  @media (max-width: 600px) {
    .email {
      flex-basis: 60%;
    }
    .github {
      flex-basis: 40%;
    }
    .name,
    .invited,
    .accepted,
    .granted,
    .options {
      display: none;
    }
  }
}
.invite-list {
  box-sizing: border-box;
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
.no-results {
  text-align: left;
  padding-left: 5px;
  padding-top: 1rem;
  color: rgba(black, 0.4);
  font-style: italic;
}
</style>
