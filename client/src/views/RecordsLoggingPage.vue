<template>
    <div id="recordsPage" class="card-body container">
        <transition name="fade">
            <div v-if="performingRequest" class="loading">
                <p>Loading...</p>
            </div>
        </transition>

        <!-- Experiment Records table -->
        <label for="recordsTable"><strong>Experiment Records</strong></label>
        <div class="table-responsive">
            <table class="table table-hover" data-pagination="true" id="recordsTable">
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
        </div>
        <!-- Pagination -->
        <nav>
            <paginate
                :page-count="pageCount"
                :margin-pages="0"
                :click-handler="paginateCallback"
                :prev-text="'&laquo'"
                :next-text="'&raquo'"
                :container-class="'pagination'"
                :page-class="'page-item'"
                :page-link-class="'page-link-item'"
                :prev-class="'ignore prev-item'"
                :prev-link-class="'prev-link-item'"
                :next-class="'ignore next-item'"
                :next-link-class="'next-link-item'">
            </paginate>
        </nav>

        <button type="button" @click="createNewRecord" class="btn btn-primary">Create New Record</button>
    </div>
</template>

<script>
    const axios = require('axios');
    const Paginate = require('vuejs-paginate');
    const baseURL = "http://localhost:3000/API";
    export default {
        name: 'Records',
        template: '#recordsPage',
        props: {
        },
        data(){
            return {
                performingRequest: false,
                pageCount: 0,
                records: [],
                currentSort: 'record_id',
                currentSortDir: 'asc',
                columns: ['record_id', 'project_title', 'lot_no', 'prepared_by', 'formulation_date', 'preparation_date', 'date_created', 'date_updated'],
                column_name: ['#', 'Project Title', 'LOT NO', 'Prepared By', 'Formulation Date', 'Preparation Date', 'Date Created', 'Date Updated'],
            }
        },
        components: {
            Paginate
        },
        methods:{
            createNewRecord() {
                let JSONData = {
                    tableName: 'EXPERIMENT_RECORDS',
                    // Dummy data when creating new record
                    data: [{
                        LOT_NO: 11111,
                        project_title: "",
                        formulation_date: "2000-1-11",
                        preparation_date: "2000-1-11",
                        prepared_by: "",
                        quantity: 0,
                        total_percentage_w: 0,
                        total_AR: 0,
                        total_AD: 0,
                    }]
                }
                axios({
                    method: 'post',
                    url: baseURL + '/addData',
                    data: {
                        data: JSONData
                    }
                }).then((response) => {
                    console.log(response.data.rows);
                    this.$store.commit('setCurrentRecordID', response.data.rows[0].record_id);
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
                } 
                //console.log(this.records)
                // console.log(this.sortedRecords[0]);
            },
            paginateCallback(pageNum) {
                this.performingRequest = true;
                axios.get(baseURL + '/getRecords?page=' + pageNum).then(response => {
                    console.log(response.data)
                    this.records = response.data.records;
                    this.pageCount = response.data.pageCount;
                    // Formatting dates
                    this.records.forEach(record => {
                        record.formulation_date = formatDate(record.formulation_date, 2);
                        record.preparation_date = formatDate(record.preparation_date, 2);
                        record.date_created = formatDate(record.date_created, 1);
                        record.date_updated = formatDate(record.date_updated, 1);
                    })
                    //this.pageCount = response.data.pageCount;
                    this.performingRequest = false;
                }).catch(e => {
                    this.errors.push(e)
                });
            }
        },
        computed: {
            sortedRecords: function() {
                var sortedArray = this.records.slice(0);
                //console.log("Sorting by " + this.currentSort + " in a " + this.currentSortDir + " manner")
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
            this.paginateCallback(1);
        } 
    }

function formatDate(date, type) {
    if(type == 1) {
        return new Date(date).toString().substring(3, 21);
    } else {
        return new Date(date).toString().substring(3, 15);
    }
}
</script>
