<template>
  <div>
    <Nav />
    <div class="container">
      <div>
        <h2 class="mt-1"><span class="muted link" @click="$router.push('/manage-invites')">Filecoin invites ></span><span v-if="!loading"> {{invite.name}}</span></h2>
        <div v-if="loading">
          <Loader />
        </div>
        <div v-else>
          <p>Invited by {{invite.invitedBy.name}} on {{formatDate(invite.invited)}}</p>
          <p v-if="invite.acceptanceMetadata">
            Accepted on {{formatDate(invite.accepted)}} in {{ invite.acceptanceMetadata.city }}, {{ invite.acceptanceMetadata.region }}, {{ invite.acceptanceMetadata.country }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import format from "date-fns/format";
import Nav from "../components/Nav";
import Loader from "../components/Loader";
export default {
  name: "InviteDetail",
  components: { Nav, Loader },
  async mounted() {
    const id = this.$route.params.id;
    this.unsub = this.$store.state.db
      .collection("invites")
      .doc(id)
      .onSnapshot(doc => {
        const data = { ...doc.data(), id: doc.id };
        this.invite = data;
        this.loading = false;
      });
  },
  beforeDestroy() {
    this.unsub();
  },
  data() {
    return {
      invite: {},
      loading: true,
      unsub: null
    };
  },
  methods: {
    formatDate: date => format(date, "MMM Do")
  }
};
</script>
