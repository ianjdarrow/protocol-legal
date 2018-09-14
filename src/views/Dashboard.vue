<template>
  <div>
    <Nav />
    <div class="container">
      <div class="card clickable" @click="$router.push('/manage-invites')">
        <img class="icon" src="../assets/filecoin.png" />
        <h3>Filecoin early access</h3>
        <span class="caret">&#9656;</span>
      </div>
    </div>
  </div>
</template>

<script>
import Nav from "../components/Nav";
export default {
  name: "Dashboard",
  components: { Nav },
  data() {
    return {
      invites: []
    };
  }
};
</script>

<style lang="scss" scoped>
.icon {
  width: 50px;
  height: auto;
}
.caret {
  position: absolute;
  margin: 0;
  padding: 0;
  line-height: 1;
  right: 1rem;
  top: 50%;
  transform: translateY(-60%);
  font-size: 5rem;
  color: rgba(black, 0.2);
  transition: all 0.13s ease-in-out;
}
.clickable {
  cursor: pointer;
  position: relative;
  transition: all 0.13s ease-in-out;
  &:hover {
    background: rgba(black, 0.02);
    .caret {
      color: rgba(black, 0.8);
    }
  }
}
</style>
