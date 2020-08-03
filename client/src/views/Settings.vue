<template>
  <section id="settings">
    <div class="col1">
      <h3>Settings</h3>
      <p>Update your profile</p>

      <transition name="fade">
        <p v-if="showSuccess" class="success">Profile updated</p>
        <p v-if="showResetPassword" class="success">Successfully sent email to reset password</p>
      </transition>

      <form @submit.prevent>
        <label for="name">Name</label>
        <input v-model.trim="name" type="text" :placeholder="userProfile.name" id="name" />
        <button @click="resetPassword()" id="password" class="btn btn-info">Reset Password</button>
        <br>

        <button @click="updateProfile()" class="button">Update Profile</button>
      </form>
    </div>
  </section>
</template>

<script>
import { mapState } from 'vuex'
const fb = require('../firebaseConfig.js')

export default {
  data() {
    return {
      name: '',
      title: '',
      showSuccess: false,
      showResetPassword: false
    }
  },
  computed: {
    ...mapState(['userProfile'])
  },
  methods: {
    updateProfile() {
        this.$store.dispatch('updateProfile', {
            name: this.name !== '' ? this.name : this.userProfile.name,
        })

        this.name = ''
        this.showSuccess = true

        setTimeout(() => {
            this.showSuccess = false
        }, 2000)
    },
    resetPassword() {
        this.performingRequest = true
        fb.auth.sendPasswordResetEmail(this.userProfile.email).then(() => {
            this.showResetPassword = true;
            setTimeout(() => {
                this.showResetPassword = false;
            }, 5000);
        }).catch(err => {
            console.log(err)
            this.performingRequest = false
            this.errorMsg = err.message
        })
    },
  }
}
</script>