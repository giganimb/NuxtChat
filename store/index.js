import axios from 'axios';
import io from 'socket.io-client';

const socketWrapper = {
    socket: null,
}

export const state = () => ({
    user: {},
    messages: [],
    users: [],
})

export const mutations = {
    setUser(state, user) {
        state.user = user;
    },
    clearData(state) {
        state.user = {};
        state.messages = [];
        state.users = [];
    },
    addMessage(state, message) {
        state.messages.push(message);
    },
    updateUsers(state, users) {
        state.users = users;
    }
}

export const actions = {
    async initSocketConnection({ commit }, data) {
        await axios.get('/api/init')
        .then(resp => {
            socketWrapper.socket = io();
            socketWrapper.socket.on("connect", () => {
                console.log('ClientIO connected'); 
            });

            socketWrapper.socket.on("newMessage", (msg) => {
                console.log('Message: ', msg); 
                commit('addMessage', msg);
            });

            socketWrapper.socket.on("updateUsers", (users) => {
                commit('updateUsers', users);
            });

            socketWrapper.socket.on("disconnect", (reason) => {
                if(reason === "io server disconnect"){
                    socketWrapper.socket.connect();
                }

                console.log('ClientIO disconnected'); 
            });
        })
    },

    async joinUser({ commit }, user) {
        await socketWrapper.socket.emit('userJoined', user, (data) => {
            if(typeof data === 'string') {
              console.error(data);
            }
            else{
              user.id = data.userId;
              commit('setUser', user);
            }
        });
    },

    async sendMessage({ commit }, msgData) {
        await socketWrapper.socket.emit('createMessage', {
            text: msgData.text,
            id: msgData.id,
        }, data => {
            if(typeof data === 'string') {
                console.error(data);
            }
        });
    },
    
    async leaveChat({commit}, id){
        await socketWrapper.socket.emit('userLeft', id, () => {
        });
    }
}