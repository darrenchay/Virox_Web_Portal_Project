<template>
  <div id="app" class="card">
    <nav class="nav nav-pills">
      <a class="nav-item nav-link active" href="/records">Experiment Records</a>
    </nav>
    <router-view/>
    <!-- <ExperimentForm/> -->
  </div>
</template>

<script>
  export default {
        
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
