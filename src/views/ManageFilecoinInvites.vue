<template>
  <div>
    <Nav />
    <div class="container">
      <div class="utility-row pb-1">
        <button @click="toggleShow">
          {{ show ? 'Hide form' : 'Invite new user' }}
        </button>
        <div>
          <div class="input search">
            <label>Filter</label>
            <input v-model="search">
          </div>
        </div>
      </div>
      <AddInvite :show="show" :invites="invites" />
      <RenderInvites :invites="filteredInvites" :loading="loading" />
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Nav from "../components/Nav";
import AddInvite from "../components/AddInvite";
import RenderInvites from "../components/RenderInvites";

const levenshteinDistance = (s, t) => {
  if (!s.length) return t.length;
  if (!t.length) return s.length;

  return (
    Math.min(
      levenshteinDistance(s.substr(1), t) + 1,
      levenshteinDistance(t.substr(1), s) + 1,
      levenshteinDistance(s.substr(1), t.substr(1)) + (s[0] !== t[0] ? 1 : 0)
    ) + 1
  );
};

export default {
  name: "ManageFilecoinInvites",
  components: { Nav, AddInvite, RenderInvites },
  data() {
    return {
      show: window.localStorage.showInviteForm === "false" ? false : true,
      invites: [],
      search: "",
      loading: true
    };
  },
  mounted() {
    this.updateInviteList();
    this.$store.state.db.collection("invites").onSnapshot(updates => {
      console.log(updates);
      if (updates) {
        updates.forEach(update => {
          const data = update.data();
          console.log(update);
          for (let i = 0; i < this.invites.length; i++) {
            if (this.invites[i].id == update.id) return;
          }
          this.invites.push({
            ...data,
            id: data.id
          });
        });
      }
    });
  },
  methods: {
    updateInviteList: async function() {
      const invites = await this.db.collection("invites").get();
      invites.forEach(i => {
        const data = i.data();
        this.invites.push({
          ...data,
          id: i.id
        });
      });
      this.loading = false;
    },
    toggleShow: function() {
      const show = !this.show;
      this.show = show;
      window.localStorage.showInviteForm = show;
    }
  },
  computed: {
    filteredInvites: function() {
      const search = this.search.toLowerCase();
      if (search.length === 0) return this.invites;
      return this.invites.filter(i => {
        return (
          i.email.indexOf(search) >= 0 ||
          i.github.indexOf(search) >= 0 ||
          i.name.indexOf(search) >= 0
        );
      });
    },
    ...mapState({
      db: state => state.db
    })
  }
};
</script>

<style lang="scss" scoped>
.utility-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.search {
  flex-basis: 33%;
  input {
    // position: relative;
    // transform: translateY(-0.6rem);
  }
}
</style>
