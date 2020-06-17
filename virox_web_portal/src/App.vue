<template>
  <div id="app" class="card">
    <ExperimentForm/>
  </div>
</template>

<script>
//import HelloWorld from './components/HelloWorld.vue'
import ExperimentForm from './components/ExperimentForm.vue'
export default {
  name: 'App',
  components: {
    ExperimentForm
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
