<template>
  <div>
    <Nav />
    <div class="container">
      <div class="utility-row pb-1">
        <button @click="toggleShow">
          {{ show ? 'Hide form' : 'Invite new user' }}
        </button>
        <div class="filters">
          <div class="pills mr-1">
            <button class="sm pill active">All</button>
            <button class="sm pill active">Pending</button>
            <button class="sm pill active">Waiting</button>
          </div>
          <div class="input search">
            <label>Search</label>
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
      if (updates) {
        updates.forEach(update => {
          const data = update.data();
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
      if (search.length === 0) {
        return this.invites.sort(
          (a, b) => new Date(b.invited) - new Date(a.invited)
        );
      }
      return this.invites
        .filter(i => {
          return (
            i.email.indexOf(search) >= 0 ||
            i.github.indexOf(search) >= 0 ||
            i.name.indexOf(search) >= 0
          );
        })
        .sort(
          (a, b) =>
            levenshteinDistance(a, search) > levenshteinDistance(b, search)
        );
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
.filters {
  display: flex;
  flex-basis: 75%;
  justify-content: flex-end;
  align-items: center;
}
.pills {
  display: flex;
  justify-content: center;
}
.search {
  flex-basis: 33%;
  input {
    // position: relative;
    // transform: translateY(-0.6rem);
  }
}
</style>
