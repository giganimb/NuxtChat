<template>
    <div class="c-wrap">
        <div class="c-chat" ref="block">
            <Message
                v-for="msg in messages" :key="msg.text"
                :name="msg.name"
                :text="msg.text"
                :owner="msg.id === user.id"/>
        </div>
        <div class="c-form">
            <ChatForm/>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import Message from '../components/Message.vue';
import ChatForm from '../components/ChatForm.vue';

    export default {
        head() {
            return {
                title: `Room ${this.user.room}`
            }
        },
        middleware: ['chat'],
        components: { Message, ChatForm },
        computed: mapState(['user', 'messages']),
        watch: {
            messages() {
                setTimeout(() => {
                    this.$refs.block.scrollTop = this.$refs.block.scrollHeight;
                })
            }
        }
    }
</script>

<style scoped>
.c-wrap {
    height: 100%;
    position: relative;
    overflow: hidden;
}

.c-chat {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 80px;
    padding: 1rem;
    overflow-y: auto;
}

.c-form {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 1rem;
    height: 100px;
    background: lightgray;
    margin-bottom: 1px;
}
</style>