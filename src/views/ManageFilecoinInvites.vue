<template>
  <!-- State container and some layout for the main invite list view -->
  <div>
    <Nav />
    <div class="container">
      <div class="utility-row pb-1">
        <button @click="toggleShow">
          {{ show ? 'Hide form' : 'Invite new user' }}
        </button>
        <div class="filters">
          <div class="pills mr-1">
            <button class="sm pill" :class="filter === 'all' ? 'active' : ''" @click="updateFilter('all')">All</button>
            <button class="sm pill" :class="filter === 'pending' ? 'active' : ''" @click="updateFilter('pending')">Pending</button>
            <button class="sm pill" :class="filter === 'waiting' ? 'active' : ''" @click="updateFilter('waiting')">Waiting</button>
          </div>
          <div class="input search">
            <label>Search</label>
            <input v-model="search" @input="deriveFilteredInvites">
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
      filteredInvites: [],
      search: "",
      filter: "all",
      loading: true
    };
  },
  async mounted() {
    // handles real-time updates, poorly. other connected clients will get new
    // documents, but not updates to existing documents.
    // this is a really gross way to do this. we should probably move it to a
    // separate vuex module and handle it at the application level. and also
    // take time to better understand firestore's update model.
    this.$store.state.db.collection("invites").onSnapshot(updates => {
      if (updates) {
        updates.forEach(update => {
          const data = update.data();
          const idx = this.invites.findIndex(el => el.id === update.id);
          if (idx === -1) {
            this.invites.push({
              ...data,
              id: update.id
            });
          } else {
            for (let k in Object.keys(data)) {
              if (this.invites[idx][k] === data[k]) continue;
              this.invites[idx][k] === data[k];
            }
          }
        });
        this.loading = false;
      }
      this.deriveFilteredInvites();
    });
  },
  methods: {
    toggleShow: function() {
      const show = !this.show;
      this.show = show;
      window.localStorage.showInviteForm = show;
    },

    // this is a horrible hack. i had surprising issues getting Vue to
    // re-render a computed property when the filter function changed.
    // so, we update state directly, which is a really gross and
    // non-FP approach. would love to fix.

    deriveFilteredInvites: function() {
      const search = this.search.toLowerCase();
      const initial = this.invites.filter(i => {
        if (this.filter === "all") return true;
        if (this.filter === "pending") return i.invited && !i.accepted;
        if (this.filter === "waiting") return i.accepted && !i.granted;
      });
      if (search.length === 0) {
        this.filteredInvites = initial.sort(
          (a, b) => new Date(b.invited) - new Date(a.invited)
        );
        return;
      }
      this.filteredInvites = initial
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
    updateFilter: function(f) {
      this.filter = f;
      this.deriveFilteredInvites();
    }
  },
  computed: {
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
  @media (max-width: 600px) {
    display: inline;
  }
}
.filters {
  display: flex;
  flex-basis: 75%;
  justify-content: flex-end;
  align-items: center;
  @media (max-width: 600px) {
    width: 100%;
  }
}
.pills {
  display: flex;
  justify-content: center;
}
.search {
  flex-basis: 33%;
  @media (max-width: 600px) {
    width: 400px !important;
    input {
      width: 100%;
    }
  }
}
</style>
