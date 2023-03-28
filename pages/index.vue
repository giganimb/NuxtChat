<template>
  <v-layout column justify-center align-center>
    <v-flex xs12 sm8>
      <v-card min-width="400">
        <v-snackbar
          v-model="snackbar"
          :timeout="6000"
          top
          light
        >
          {{ message }}

          <template v-slot:action="{ attrs }">
            <v-btn
              color="red"
              text
              v-bind="attrs"
              @click="snackbar = false"
            >
              Close
            </v-btn>
          </template>
        </v-snackbar>

        <v-card-title>
          <h1>
            Nuxt chat
          </h1>
        </v-card-title>
        <v-card-text>
          <v-form
            ref="form"
            v-model="valid"
            lazy-validation
          >
            <v-text-field
              v-model="name"
              :counter="16"
              :rules="nameRules"
              label="Name"
              required
            ></v-text-field>

            <v-text-field
              v-model="room"
              :rules="roomRules"
              label="Room"
              required
            ></v-text-field>

            <v-btn
              :disabled="!valid"
              color="primary"
              class="mr-4"
              @click="submit"
            >
              Enter room
            </v-btn>

          </v-form>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
  name: 'IndexPage',
  layout: 'empty',
  head: {
    title: 'Welcome to nuxt chat'
  },
  data () {
    return {
      snackbar: false,
      message: '',
      valid: true,
      name: '',
      nameRules: [
        v => !!v || 'Name is required',
        v => (v && v.length <= 16) || 'Name must be less than 16 characters',
      ],
      room: '',
      roomRules: [
        v => !!v || 'Room is required',
      ],
    }
  },
  methods: {
    ...mapMutations(['setUser']),
    submit () {
      this.$refs.form.validate();
      const user = {
        name: this.name,
        room: this.room,
      }

      this.$store.dispatch('joinUser', user)
        .then((res) => {
          this.$router.push('/chat');
        })
        .catch((error) => {
          console.error(error);
        })
    },
  },
  mounted() {
    this.$store.dispatch('initSocketConnection');

    const { message } = this.$route.query;
    if(message === 'noUser') {
      this.message = 'Input data';
    }
    else if( message === 'leftChat' ) {
      this.message = 'You left the room';
    }

    this.snackbar = !!this.message;
  }
}
</script>
