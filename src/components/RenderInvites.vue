<template>
  <!-- the container that renders a list of invites
this is a pure functional component – all the actual rendering happens
in the ManageFilecoinInvites view -->
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
    <div class="no-results" v-if="!loading && invites.length === 0">No results</div>
    <Loader v-if="loading" />
    <div v-else>
      <div v-for="invite in paginatedInvites" class="invite-list" :key="invite.id">
        <span class="email">{{ invite.email }}</span>
        <span class="github">
          <a :href="`https://github.com/${invite.github}`" v-if="invite.github">
            {{ `@${invite.github}` }}
          </a>
          <span class="muted" v-else>-</span>
        </span>
        <span class="name" :class="invite.name ? '' : 'muted'">{{ invite.name || "-" }}</span>
        <span class="invited" :class="invite.invited ? '' : 'muted'">{{ formatted(invite.invited) || "-" }}</span>
        <span class="accepted" :class="invite.accepted ? '' : 'muted'">{{ formatted(invite.accepted) || "-" }}</span>
        <span class="granted">
          <GrantAccessWidget :invite="invite" />
        </span>
        <span class="options"></span>
      </div>
      <div class="pagination" v-if="invites.length > pageLength"><input type="number" min="1" v-model="currentPage" class="page-input"> / {{ Math.ceil(invites.length / pageLength) }}</div>
    </div>
  </div>
</template>

<script>
import format from "date-fns/format";
import Loader from "../components/Loader";
import GrantAccessWidget from "../components/GrantAccessWidget";

export default {
  name: "RenderInvites",
  components: { Loader, GrantAccessWidget },
  props: ["invites", "loading"],
  data() {
    return {
      pageLength: 8,
      currentPage: 1
    };
  },
  methods: {
    formatted: function(date) {
      const formatted = format(date, "YYYY.MM.DD");
      if (formatted == "Invalid Date") return "-";
      return formatted;
    }
  },
  computed: {
    paginatedInvites: function() {
      const current = this.currentPage || 1;
      const startPosition = this.pageLength * (current - 1);
      return this.invites.slice(startPosition, startPosition + this.pageLength);
    }
  },
  watch: {
    currentPage: function() {
      if (this.currentPage < 0) return (this.currentPage = 1);
      const max = this.invites.length / this.pageLength;
      if (this.currentPage > max) return (this.currentPage = max);
      return (this.currentPage = Math.floor(this.currentPage));
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
    flex-basis: 23%;
  }
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
.invite-header {
  font-weight: bold;
  padding-bottom: 0.5rem;
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
.pagination {
  font-family: monospace;
}
.page-input {
  width: 3em;
  text-align: center;
}
</style>
