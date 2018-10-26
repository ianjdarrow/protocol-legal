<template>
  <!-- The page displayed after a user accepts the terms of service -->
  <div class="flex">
    <div class="invite-card">
      <img class="rocket" src="../assets/invites/invite-confirmation.png">
      <img class="filecoin-logo" src="../assets/invites/filecoin-logo-color.svg">
      <div class="content">
        <h1>Request confirmed!</h1>
        <hr />
        <p>We're excited you're joining the Filecoin private preview. Expect GitHub access within 48 hours.</p>
        <a href="https://filecoin.io">
          <button class="filecoin mt-1">OK</button>
        </a>
      </div>
      <div class="bottom-border" />
    </div>
  </div>
</template>
<style lang="scss" scoped>
@import "../styles/_colors";
$padding: 2.5rem;
.flex {
  background: rgb(132, 92, 235);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  height: 100vh;
  justify-content: center;
  align-items: center;
  min-height: 500px;
}
.invite-card {
  border-radius: 2px;
  box-sizing: border-box;
  overflow: hidden;
  padding: $padding;
  background: $bg;
  position: relative;
  width: 100%;
  max-width: 800px;
  height: 66%;
  max-height: 480px;
  box-shadow: 0 4px 8px rgba(black, 0.13);
  @media (max-width: 600px) {
    height: 85%;
    max-height: none;
  }
}
.rocket {
  position: absolute;
  width: 60%;
  height: auto;
  right: 0;
  top: 0;
  @media (max-width: 600px) {
    width: 100%;
  }
}
.filecoin-logo {
  position: absolute;
  width: 30%;
  height: auto;
  left: $padding;
  top: $padding;
  @media (max-width: 600px) {
    display: none;
  }
}
.content {
  position: absolute;
  bottom: 10%;
  hr {
    width: 80px;
    height: 3px;
    background: $filecoin;
  }
  p {
    font-size: 125%;
    max-width: 38ch;
  }
  @media (max-width: 600px) {
    bottom: $padding;
    p {
      font-size: 100%;
    }
  }
}
.bottom-border {
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 100%;
  height: 8px;
  background: linear-gradient(to right, rgb(72, 31, 142), rgb(0, 226, 231));
}
</style>
