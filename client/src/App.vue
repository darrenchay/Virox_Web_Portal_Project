<template>
  <div id="app" class="container-fluid" style="width: 90%;">
    <Navigation v-if="showNav"></Navigation>
    <div class="card">
      <router-view/>
    </div>
    <footer class="footer">
      <div class="container">
        <div class="row">
          <span class="text-muted">Virox Web Portal </span>
          <hr>
          <span class="text-muted">Darren Chay Loong</span>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import Navigation from '@/components/Navigation.vue'
  export default {
    components: {
      Navigation
    },
    computed: {
      ...mapState(['userProfile']),
      showNav() {
        // console.log(this.userProfile)
        return Object.keys(this.userProfile).length > 0
      }
    }
  }
</script>

<style>

</style>
