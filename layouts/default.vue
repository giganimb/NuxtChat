<template>
  <v-app app>
    <v-navigation-drawer app v-model="drawer" mobile-breakpoint="650">
      <v-list subheader>
      <v-subheader>Room users</v-subheader>

      <v-list-item
        v-for="u in users"
        :key="u.id"
      >
        <v-list-item-content>
          <v-list-item-title>{{ u.name }}</v-list-item-title>
        </v-list-item-content>

        <v-list-item-icon>
          <v-icon :color="u.id === user.id ? 'deep-purple accent-4' : 'grey'">
            mdi-message-outline
          </v-icon>
        </v-list-item-icon>
      </v-list-item>
    </v-list>
    </v-navigation-drawer>
    <v-app-bar app>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-btn icon @click="exit">
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
      <v-toolbar-title>Room {{ this.user.room }} chat</v-toolbar-title>
    </v-app-bar>
    <v-main>
      <div style="height: 100%">
        <nuxt></nuxt>
      </div>
    </v-main>
  </v-app>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'DefaultLayout',
  data: () => ({
    drawer: true,
  }),
  computed: mapState(['user', 'users']),
  methods: {
    exit() {
      this.$store.dispatch('leaveChat', this.user.id)
        .then((res) => {
          this.$router.push('/?message=leftChat');
          this.$store.commit('clearData');
        })
        .catch((error) => {
          console.error(error);
        })
    }
  },
}
</script>
