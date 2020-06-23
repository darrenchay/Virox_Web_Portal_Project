<template>
    <div id="recordsPage" class="card">
        <div class="card-head">
        <label for="recordsTable"><strong>Experiment Records</strong></label>
        </div>
        <div class="card-body">
            <table class="table table-bordered table-hover" id="recordsTable">
                <thead class="thead-dark">
                    <tr>
                        <th v-for="(column, index) in column_name" :key="index">{{column}}</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="record in records" :key="record.record_id">
                        <td v-for="(data, index) in columns" :key="index">{{record[data]}}</td>
                        <td><button type="button" @click="showRecord(record.record_id)" class="btn btn-secondary" :id="'record' + record.record_id + 'btn'">Show Record</button></td>
                    </tr>
                </tbody>
            </table>
            <button type="button" @click="createNewRecord" class="btn btn-primary">Create New Record</button>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'Records',
        template: '#recordsPage',
        props: {
        },
        data(){
            return {
                records: [{
                    record_id: 1,
                    LOT_NO: 11111,
                    project_title: "Experiment 5",
                    formulation_date: this.newDate('2020-12-5'),
                    preparation_date: this.newDate('2020-12-15'),
                    prepared_by: "Darren Chay",
                    date_created: this.newDate('2020-10-12'),
                    date_updated: this.newDate('2020-10-12'),
                    },
                    {
                    record_id: 2,
                    LOT_NO: 12345,
                    project_title: "Experiment 2",
                    formulation_date: this.newDate('2020-10-12'),
                    preparation_date: this.newDate('2020-12-15'),
                    prepared_by: "John Doe",
                    date_created: this.newDate('2020-10-12'),
                    date_updated: this.newDate('2020-10-12'),
                    },
                ],
                columns: ['record_id', 'project_title', 'LOT_NO', 'prepared_by', 'formulation_date', 'preparation_date', 'date_created', 'date_updated'],
                column_name: ['#', 'Project Title', 'LOT NO', 'Prepared By', 'Formulation Date', 'Preparation Date', 'Date Created', 'Date Updated'],
            }
        },
        methods:{
            newDate(date) {
                return new Date(date).toISOString().substring(0,10)
            },
            createNewRecord() {
                this.$router.push({ name: 'Dashboard', params: { recordID: 123 }})
            },
            showRecord(record_id) {
                this.$router.push({ name: 'Dashboard', params: { recordID: record_id }})
            }
        }
    }
</script>