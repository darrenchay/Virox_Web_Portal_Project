<template>
    <header>
        <section>
            <div class="col1">
                <button type="button" class="btn mr-4" @click="redirect('records')"><h3>Experiment Records</h3></button>
                <button type="button" class="btn btn-outline-secondary" @click="redirect('search')">Search Records</button>
                <ul class="inline">
                    <li><a @click="logout">logout</a></li>
                    <li><a @click="redirect('settings')">settings</a></li>
                </ul>
            </div>
        </section>
    </header>
    
</template>

<script>
    export default {
        methods: {
            logout() {
                this.$store.dispatch('logout');
                // fb.auth.signOut().then(() => {
                //     this.$store.dispatch('clearData')
                //     this.$router.push('/login')
                // }).catch(err => {
                //     console.log(err)
                // })
            },
            redirect(routeName) {
                //console.log(this.$route)
                if(this.$route.name != routeName) {
                    this.$router.push({ name: routeName})
                }
            },
            // search() {
            //     if(this.$route.name != 'search') {
            //         this.$router.push({ name: 'search'})
            //     }
            // }
        }
    }
</script>