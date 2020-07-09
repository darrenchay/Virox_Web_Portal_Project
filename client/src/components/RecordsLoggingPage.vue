<template>
    <div id="recordsPage" class="card">
        <div class="card-head">
            <label for="recordsTable"><strong>Experiment Records</strong></label>
        </div>
        <div class="card-body">
            <table class="table table-bordered table-hover table-responsive" data-pagination="true"  id="recordsTable">
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
            <nav>
                <paginate
                    :page-count="pageCount"
                    :margin-pages="1"
                    :click-handler="paginateCallback"
                    :prev-text="'&laquo'"
                    :next-text="'&raquo'"
                    :container-class="'pagination'"
                    :page-class="'page-item'">
                </paginate>
            </nav>


            <button type="button" @click="createNewRecord" class="btn btn-primary">Create New Record</button>
        </div>
    </div>
</template>

<script>
    const axios = require('axios');
    const Paginate = require('vuejs-paginate');
    //const baseURL = "/API";
    const baseURL = "http://localhost:3000/API";
    export default {
        name: 'Records',
        template: '#recordsPage',
        props: {
        },
        data(){
            return {
                pageCount: 0,
                records: [],
                currentSort: 'record_id',
                currentSortDir: 'asc',
                columns: ['record_id', 'project_title', 'LOT_NO', 'prepared_by', 'formulation_date', 'preparation_date', 'date_created', 'date_updated'],
                column_name: ['#', 'Project Title', 'LOT NO', 'Prepared By', 'Formulation Date', 'Preparation Date', 'Date Created', 'Date Updated'],
            }
        },
        components: {
            Paginate
        },
        methods:{
            newDate(date) {
                return new Date(date).toISOString().substring(0,10)
            },
            createNewRecord() {
                let record = {
                    experimentRecord: {
                        LOT_NO: 11111,
                        project_title: "",
                        formulation_date: "1/1/11",
                        preparation_date: "1/1/11",
                        prepared_by: "",
                        quantity: 0,
                        total_percentage_w: 0,
                        total_AR: 0,
                        total_AD: 0,
                        notes: "",
                        preparation_reason: "",
                        observations: ""
                    }
                };
                axios({
                    method: 'post',
                    url: baseURL + '/addExperimentRecord',
                    data: {
                        record: record
                    }
                }).then((response) => {
                    this.$store.commit('setCurrentRecordID', response.data.id)
                    this.$router.push({ name: 'recordDetails'})
                    console.log(response.data.message)
                });
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
                    console.log( 'Col name: ' + col )
                } // end if
                //console.log(this.records)
            },
            paginateCallback(pageNum) {
                axios.get(baseURL + '/getRecords?page=' + pageNum).then(response => {
                console.log(response.data.message)
                this.records = response.data.records;
                //this.pageCount = response.data.pageCount;
            }).catch(e => {
                this.errors.push(e)
            });
            }
        },
        computed: {
            sortedRecords: function() {
                var sortedArray = this.records.slice(0);
                console.log("Sorting by " + this.currentSort + " in a " + this.currentSortDir + " manner")
                sortedArray.sort((a, b) => {
                    let modifier = -1;
                    if(this.currentSortDir === 'asc') {
                        modifier = 1;
                    } 
                    if (a[this.currentSort] < b[this.currentSort]){
                        return -1 * modifier
                    } else if (a[this.currentSort] > b[this.currentSort]){
                        return 1 * modifier
                    } else {
                        return 0
                    }
                })
                //console.log(sortedArray)
                return sortedArray
            }
        },
        mounted() {
            axios.get(baseURL + '/getRecords?page=1').then(response => {
                console.log(response.data.message)
                console.log(response.data);
                this.records = response.data.records;
                this.pageCount = response.data.pageCount;
            }).catch(e => {
                this.errors.push(e)
            })
        } 
    }
</script>