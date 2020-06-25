<template>
    <div id="recordsPage" class="card">
        <div class="card-head">
        <label for="recordsTable"><strong>Experiment Records</strong></label>
        </div>
        <div class="card-body">
            <table class="table table-bordered table-hover table-responsive" id="recordsTable">
                <thead class="thead-dark">
                    <tr>
                        <th v-for="(column, index) in column_name" @click="sort(columns[index])" :key="index">{{column}}</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(record, index) in sortedRecords" :key="index">
                        <td v-for="(data) in columns" :key="data">{{record[data]}}</td>
                        <td><button type="button" @click="showRecord(record.record_id)" class="btn btn-secondary" :id="'record' + record.record_id + 'btn'">Show Record</button></td>
                    </tr>
                </tbody>
            </table>
            <button type="button" @click="createNewRecord" class="btn btn-primary">Create New Record</button>
        </div>
    </div>
</template>

<script>
    const axios = require('axios')
    const baseURL = "http://localhost:3000"
    export default {
        name: 'Records',
        template: '#recordsPage',
        props: {
        },
        data(){
            return {
                records: [],
                currentSort: 'record_id',
                currentSortDir: 'asc',
                columns: ['record_id', 'project_title', 'LOT_NO', 'prepared_by', 'formulation_date', 'preparation_date', 'date_created', 'date_updated'],
                column_name: ['#', 'Project Title', 'LOT NO', 'Prepared By', 'Formulation Date', 'Preparation Date', 'Date Created', 'Date Updated'],
            }
        },
        methods:{
            newDate(date) {
                return new Date(date).toISOString().substring(0,10)
            },
            createNewRecord() {
                this.$store.commit('setCurrentRecordID', -1)
                this.$router.push({ name: 'recordDetails' })
            },
            showRecord(record_id) {
                this.$store.commit('setCurrentRecordID', record_id)
                this.$router.push({ name: 'recordDetails'})
            },
            sort:function(col) {
                // if you click the same label twice
                if(this.currentSort === col){
                    this.currentSortDir = this.currentSortDir === 'desc' ? 'asc' : 'desc'
                } else{
                    this.currentSort = col
                    //console.log( 'Col name: ' + col )
                } // end if
                //console.log(this.records)
            }
        },
        computed: {
            sortedRecords: function() {
                var sortedArray = this.records.slice(0)
                //console.log("Sorting by " + this.currentSort + " in a " + this.currentSortDir + " manner")
                sortedArray.sort((a, b) => {
                    let modifier = 1
                    if(this.currentSortDir === 'asc') {
                        modifier = -1
                    } 
                    if (a[this.currentSort] < b[this.currentSort]){
                        return -1 * modifier
                    } else if (a[this.currentSort] > b[this.currentSort]){
                        return -1 * modifier
                    } else {
                        return 0
                    }
                })
                //console.log(sortedArray)
                return sortedArray
            }
        },
        mounted() {
            axios.get(baseURL + '/getRecords').then(response => {
                // JSON responses are automatically parsed.
                console.log(response.data.message)
                //console.log(response.data.records)
                this.records = response.data.records
            }).catch(e => {
                this.errors.push(e)
            })
        } 
    }
</script>