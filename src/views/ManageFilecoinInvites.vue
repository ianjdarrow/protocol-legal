<template>
  <!-- State container and some layout for the main invite list view -->
  <div>
    <Nav/>
    <div class="container">
      <h2 class="mt-1">
        Filecoin invites
        <span v-if="!loading" class="muted light tag" @click="addEmailsToClipboard">
          <span v-if="filteredInvites.length < invites.length">{{filteredInvites.length}} /</span>
          {{ invites.length }}
        </span>
      </h2>
      <button
        class="sm fullwidth mb-1"
        @click="toggleShow"
      >{{ show ? 'Hide form' : 'Add new user' }}</button>
      <AddInvite :show="show" :invites="invites" v-on:setSearch="setSearch"/>
      <div class="utility-row pb-1">
        <div class="filters">
          <div class="pills">
            <button
              class="sm pill"
              :class="filter === 'all' ? 'active' : ''"
              @click="updateFilter('all')"
            >All</button>
            <button
              class="sm pill"
              :class="filter === 'pending' ? 'active' : ''"
              @click="updateFilter('pending')"
            >Pending</button>
            <button
              class="sm pill"
              :class="filter === 'waiting' ? 'active' : ''"
              @click="updateFilter('waiting')"
            >Needs access</button>
            <button
              class="sm pill"
              :class="filter === 'onboard' ? 'active' : ''"
              @click="updateFilter('onboard')"
            >Onboarded</button>
            <button
              class="sm pill"
              :class="filter === 'mine' ? 'active' : ''"
              @click="updateFilter('mine')"
            >Mine</button>
          </div>
        </div>
        <div class="input search">
          <label>Search (name, company...)</label>
          <input v-model="search" @keydown="deriveFilteredInvites" @keydown.escape="search = ''">
          <span class="clear-search" :hidden="search.length === 0" @click="search=''">&times;</span>
        </div>
      </div>
      <RenderInvites :invites="paginatedInvites" :loading="loading"/>
      <div class="pagination" v-if="filteredInvites.length > resultsPerPage">
        <span @click="setPage(0)" :class="currentPage > 0 ? 'active' : 'inactive'">&lt;&lt;</span>
        <span
          @click="setPage(currentPage - 1)"
          :class="currentPage > 0 ? 'active' : 'inactive'"
        >&lt;</span>
        <span>{{ currentPage + 1 }}/{{ Math.ceil(filteredInvites.length / resultsPerPage) }}</span>
        <span
          @click="setPage(currentPage + 1)"
          :class="currentPage < totalPages - 1 ? 'active' : 'inactive'"
        >></span>
        <span
          @click="setPage(totalPages - 1)"
          :class="currentPage < totalPages - 1 ? 'active' : 'inactive'"
        >>></span>
      </div>
      <div class="pagination muted" v-else>End of results</div>
      <input class="off-page" ref="copy" v-model="emailList">
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { levenshteinDistance, normalizedLevDistance } from "../lib/strings";

import Nav from "../components/Nav";
import AddInvite from "../components/AddInvite";
import RenderInvites from "../components/RenderInvites";

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
      resultsPerPage: 8,
      currentPage: 0,
      loading: true,
      unsub: null
    };
  },
  async mounted() {
    // handles real-time updates
    this.unsub = this.$store.state.db
      .collection("invites")
      .onSnapshot(updates => {
        // firestore gives you a nice "added, modified, renewed" field that
        // lets us cleanly work with our local cache
        // the entire collection is "added" once at initial load
        if (updates.docChanges().length === 0) return (this.loading = false);
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
  beforeDestroy() {
    this.unsub();
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
    setPage: function(page) {
      if (page < this.currentPage) this.currentPage = Math.max(page, 0);
      if (page > this.currentPage)
        this.currentPage = Math.min(page, this.totalPages - 1);
    },
    addEmailsToClipboard: function() {
      this.$refs.copy.select();
      try {
        if (this.filteredInvites.length === 0) throw new Error();
        if (document.execCommand("copy")) {
          this.$store.commit("setFlash", `Copied current emails to clipboard`);
        } else {
          throw new Error();
        }
      } catch (e) {
        this.$store.commit("setFlash", "Error copying emails!");
      } finally {
        setTimeout(() => this.$store.commit("clearFlash"), 2000);
      }
    },
    // this is a horrible hack. i had surprising issues getting Vue to
    // re-render a computed property when the filter function changed.
    // so, we update what's basically duplicated and derived
    // state directly, which is a really gross and non-FP approach.
    // would love to fix.

    deriveFilteredInvites: function() {
      const search = this.search.toLowerCase();
      const initial = this.invites.filter(i => {
        switch (this.filter) {
          case "pending":
            return i.invited && !i.accepted;
          case "waiting":
            return i.accepted && !i.granted;
          case "onboard":
            return i.granted;
          case "mine":
            return i.invitedBy.email === this.user.email;
          default:
            return true;
        }
      });
      const start = this.currentPage * this.resultsPerPage;
      if (search.length < 2) {
        this.filteredInvites = initial.sort(
          (a, b) => new Date(b.invited) - new Date(a.invited)
        );
      } else {
        this.filteredInvites = initial.filter(i => {
          return (
            i.email.toLowerCase().indexOf(search) >= 0 ||
            i.name.toLowerCase().indexOf(search) >= 0 ||
            (i.github && i.github.toLowerCase().indexOf(search) >= 0) ||
            (i.organization &&
              i.organization.toLowerCase().indexOf(search) >= 0)
          );
        });
      }
    },
    updateFilter: function(f) {
      this.filter = f;
      this.deriveFilteredInvites();
      this.currentPage = 0;
    }
  },
  computed: {
    paginatedInvites: function() {
      const start = this.currentPage * this.resultsPerPage;
      return this.filteredInvites.slice(start, start + this.resultsPerPage);
    },
    totalPages: function() {
      return Math.ceil(this.filteredInvites.length / this.resultsPerPage);
    },
    emailList: function() {
      return this.filteredInvites.map(i => i.email).join(", ");
    },
    ...mapState({
      db: state => state.db,
      user: state => state.user
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
    top: 0.125em;
    color: rgba(black, 0.2);
    &:hover {
      color: #222;
      cursor: pointer;
    }
  }
}
.pagination {
  display: flex;
  justify-content: center;
  font-family: monospace;
  margin-top: 1rem;
  span {
    padding: 0.5rem;
  }
  span.active {
    cursor: pointer;
    opacity: 0.7;
    &:hover {
      opacity: 1;
    }
  }
  span.inactive {
    opacity: 0.25;
  }
}
span.tag {
  background: rgba(black, 0.11);
  border: 1px solid rgba(black, 0.18);
  min-width: 4rem;
  text-align: center;
  margin-left: 0.5rem;
  padding: 0.35rem 1rem 0.35rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.9rem;
  position: relative;
  display: inline-block;
  transform: translateY(-2px);
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  &:hover {
    opacity: 0.7;
  }
}
input.off-page {
  position: absolute;
  top: -100%;
}
</style>
