<template>
  <!-- the container that renders a list of invites
this is a pure functional component – all the actual rendering happens
in the ManageFilecoinInvites view -->
  <div>
    <Loader v-if="loading" />
    <div v-if="invites.length" class="invites">
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
  props: ["invites", "loading"]
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
</style>
