<template>
  <!-- State container and some layout for the main invite list view -->
  <div>
    <Nav />
    <div class="container">
      <button class="sm fullwidth mb-1" @click="toggleShow">
        {{ show ? 'Hide form' : 'Add new user' }}
      </button>
      <AddInvite :show="show" :invites="invites" v-on:setSearch="setSearch" />
      <div class="utility-row pb-1">
        <div class="filters">
          <div class="pills">
            <button class="sm pill" :class="filter === 'all' ? 'active' : ''" @click="updateFilter('all')">All</button>
            <button class="sm pill" :class="filter === 'pending' ? 'active' : ''" @click="updateFilter('pending')">Pending</button>
            <button class="sm pill" :class="filter === 'waiting' ? 'active' : ''" @click="updateFilter('waiting')">Needs access</button>
            <button class="sm pill" :class="filter === 'onboard' ? 'active' : ''" @click="updateFilter('onboard')">Onboarded</button>
          </div>
        </div>
        <div class="input search">
          <label>Search (name, company...)</label>
          <input v-model="search" @input="deriveFilteredInvites">
          <span class="clear-search" :hidden="search.length === 0" @click="search=''">&times;</span>
        </div>
      </div>
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
    // handles real-time updates
    this.$store.state.db.collection("invites").onSnapshot(updates => {
      // firestore gives you a nice "added, modified, renewed" field that
      // lets us cleanly work with our local cache
      // the entire collection is "added" once at initial load
      updates.docChanges().forEach(change => {
        const data = { ...change.doc.data(), id: change.doc.id };
        if (change.type === "added") {
          this.invites.push(data);
        }
        // not a new item – so we will be manipulating an existing item
        const itemIndex = this.invites.findIndex(item => item.id === data.id);

        if (change.type === "modified") {
          this.invites[itemIndex] = data;
        }
        if (change.type === "removed") {
          this.invites.splice(itemIndex, 1);
        }
        this.deriveFilteredInvites();
        this.loading = false;
      });
    });
  },
  methods: {
    toggleShow: function() {
      const show = !this.show;
      this.show = show;
      window.localStorage.showInviteForm = show;
    },
    setSearch: function(search) {
      this.search = search;
    },

    // this is a horrible hack. i had surprising issues getting Vue to
    // re-render a computed property when the filter function changed.
    // so, we update what's basically duplicated and derived
    // state directly, which is a really gross and non-FP approach.
    // would love to fix.

    deriveFilteredInvites: function() {
      const search = this.search.toLowerCase();
      const initial = this.invites.filter(i => {
        if (this.filter === "all") return true;
        if (this.filter === "pending") return i.invited && !i.accepted;
        if (this.filter === "waiting") return i.accepted && !i.granted;
        if (this.filter === "onboard") return i.granted;
      });
      if (search.length < 2) {
        this.filteredInvites = initial.sort(
          (a, b) => new Date(b.invited) - new Date(a.invited)
        );
        return;
      }
      this.filteredInvites = initial
        .filter(i => {
          return (
            i.email.toLowerCase().indexOf(search) >= 0 ||
            i.name.toLowerCase().indexOf(search) >= 0 ||
            (i.github && i.github.toLowerCase().indexOf(search) >= 0) ||
            (i.organization &&
              i.organization.toLowerCase().indexOf(search) >= 0)
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
  },
  watch: {
    search: function() {
      this.deriveFilteredInvites();
    }
  }
};
</script>

<style lang="scss" scoped>
.utility-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  @media (max-width: 800px) {
    display: block;
  }
}
.filters {
  display: flex;
  flex-basis: 49.7%;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  padding-top: 1.25rem;
  max-height: 3rem;
  border: 1px solid rgba(black, 0.1);
  border-radius: 2px;
  @media (max-width: 800px) {
    border: none;
  }
}
.pills {
  display: flex;
  justify-content: center;
}
.search {
  flex-basis: 49.7%;
  @media (max-width: 600px) {
    flex-basis: 100%;
    input {
      width: 100%;
    }
  }
  .clear-search {
    position: absolute;
    font-size: 1.5em;
    // padding: 0.5em;
    right: 0.25em;
    top: -0.25em;
    color: rgba(black, 0.2);
    &:hover {
      color: #222;
      cursor: pointer;
    }
  }
}
</style>
