<template>
  <v-col
    cols="12"
    >
        <v-text-field
            label="Input message"
            outlined
            v-model="text"
            @keydown.enter="send"
        ></v-text-field>
    </v-col>
</template>

<script>
    export default {
        data: () => ({
            text: '',
        }),
        methods: {
            send() {
                this.$store.dispatch('sendMessage', { text: this.text, id: this.$store.state.user.id})
                    .then((res) => {
                        this.text = "";
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            }
        },
    }
</script>

<style>

</style>