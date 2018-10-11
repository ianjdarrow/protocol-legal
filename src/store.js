import Vue from "vue";
import Vuex from "vuex";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

Vue.use(Vuex);

// not sensitive at all, intended for client-side use
const config = {
  apiKey: "AIzaSyACQqUJp0l9GOeUqPLYXftH2sujbCxkCi8",
  authDomain: "protocol-legal-1535392151520.firebaseapp.com",
  databaseURL: "https://protocol-legal-1535392151520.firebaseio.com",
  projectId: "protocol-legal-1535392151520",
  storageBucket: "protocol-legal-1535392151520.appspot.com",
  messagingSenderId: "891039701560"
};

export default new Vuex.Store({
  state: {
    firebase: null,
    db: null,
    provider: null,
    loading: true,
    user: {},
    flash: {
      active: false,
      message: ""
    }
  },
  mutations: {
    setFirebase(state, firebase) {
      state.firebase = firebase;
    },
    setProvider(state, provider) {
      state.provider = provider;
    },
    setDb(state, db) {
      state.db = db;
    },
    setLoadingTrue(state) {
      state.loading = true;
    },
    setLoadingFalse(state) {
      state.loading = false;
    },
    setUser(state, user) {
      state.user = user;
    },
    setFlash(state, message) {
      state.flash = {
        active: true,
        message
      };
    },
    clearFlash(state) {
      state.flash = {
        active: false,
        message: ""
      };
    },
    logout(state) {
      state.user = {};
    }
  },
  actions: {
    async initializeApp(context) {
      // set up main firebase connection
      await firebase.initializeApp(config);
      context.commit("setFirebase", firebase);
      // set up auth provider
      const provider = new firebase.auth.GoogleAuthProvider();
      firebase.auth().onAuthStateChanged(user => {
        if (user && user.email)
          context.commit("setUser", {
            email: user.email,
            name: user.displayName
          });
        else context.commit("logout");
      });
      context.commit("setProvider", provider);
      // set up DB
      const db = firebase.firestore();
      db.settings({
        timestampsInSnapshots: true
      });
      context.commit("setDb", db);
      context.commit("setLoadingFalse");
    }
  }
});
