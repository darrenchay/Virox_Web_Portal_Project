<template>
    <header>
        <section>
            <div class="col1">
                <button type="button" class="btn" @click="redirect"><h3>Experiment Records</h3></button>
                <ul class="inline">
                    <li><a @click="logout">logout</a></li>
                </ul>
            </div>
        </section>
    </header>
    
</template>

<script>
    const fb = require('../firebaseConfig.js')

    export default {
        methods: {
            logout() {
                fb.auth.signOut().then(() => {
                    this.$store.dispatch('clearData')
                    this.$router.push('/login')
                }).catch(err => {
                    console.log(err)
                })
            },
            redirect() {
                //console.log(this.$route)
                if(this.$route.name != 'records') {
                    this.$router.push({ name: 'records'})
                }
            }
        }
    }
</script>