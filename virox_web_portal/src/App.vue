<template>
  <div id="app" class="container">
    <Navigation v-if="currentUser"></Navigation>
    <div class="card">
      <router-view/>
    </div>
    <footer class="footer">
      <div class="container">
        <span class="text-muted">Virox Web Portal</span>
        <br>
        <span class="text-muted">Darren Chay Loong</span>
      </div>
    </footer>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import Navigation from './components/Navigation.vue'
  export default {
    components: {Navigation},
    computed: {
      ...mapState(['currentUser'])
    }
    }
</script>

<style>

</style>
