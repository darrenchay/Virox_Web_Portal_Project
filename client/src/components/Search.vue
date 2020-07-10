<template>
    <div class="card-body"> 
        <div class="input-group mb-3">
            <div class="input-group-prepend">
                <label class="input-group-text" for="searchFilter">Choose search filter</label>
            </div>

            <select class="custom-select" name="searchFilter" id="searchFilter" @change="setSelected($event)" v-model="selected" required>
                <!-- <option>search filter</option> -->
                <optgroup label="Experiment Record">
                    <option v-for="(column, index) in searchExpList" :key="index" :value="column">{{searchFilter.experiment_records[column]}}</option>
                </optgroup>
                <optgroup label="Raw Materials">
                    <option v-for="(column, index) in searchRMList" :key="index" :value="column">{{searchFilter.RMList[column]}}</option>
                </optgroup>
                <optgroup label="Hydrogen Peroxide Data">
                    <option v-for="(column, index) in searchHPList" :key="index" :value="column">{{searchFilter.HPList[column]}}</option>
                </optgroup>
                <optgroup label="Hydrogen Peroxide Stability Data">
                    <option v-for="(column, index) in searchHPStabList" :key="index" :value="column">{{searchFilter.HPStabList[column]}}</option>
                </optgroup>
            </select>
            
            <input type="text" class="form-control" v-model.trim="searchInput">
            <button type="button" class="btn" @click="search"><span class="fas fa-search"></span></button>
        </div>

        <div id="resultsTable" v-show="receivedSearchResults">
            <table v-if="record.length > 0" class="table table-bordered table-hover table-responsive">
                <thead class="thead-dark">
                    <tr>
                        <th v-for="column in Object.keys(record[0])" :key="column">{{column}}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(record, index) in record" :key="index">
                        <td v-for="(data, index) in Object.values(record)" :key="index">{{data}}</td>
                    </tr>
                </tbody>
            </table>

            <label v-else>No results found</label>
        </div>
    </div>
    
</template>

<script>
    const axios = require('axios');
    //const baseURL = "https://virox-server.herokuapp.com/api";
    const baseURL = "http://localhost:3000/API";
    export default {
        data() {
            return {
                searchInput: "Enter search item",
                searchFilter: {
                    experiment_records: {
                        record_id: 'Record ID',
                        lot_no: 'Lot No',
                        project_title: 'Project Title',
                        prepared_by: 'Prepared By',
                        quantity: 'Quantity',
                        total_percentage_w: 'Total %w/w',
                        total_ad: 'Total AD',
                        total_ar: 'Total AR',
                    },
                    RMList: {
                        //experiment_record_id: 'Experiment record',
                        raw_material_name: 'Raw Material Name',
                        raw_material_lot: 'Raw Material Lot',
                        percentage_w: '%w/w',
                        ad: 'AD',
                        ar: 'AR',
                        time_added: 'Time Added',
                    },
                    HPList: {
                        //experiment_record_id: 'Experiment record',
                        experiment_name: 'Experiment Name',
                        n: 'Nitrogen',
                        m: 'Ms [Gr]',
                        vol_change: 'Volume Change (ml)',
                        h2o2: 'H2O2',
                        ph: 'PH',
                        accepted_range: 'Accepted Range',
                        date: 'Date',
                        initials: 'Initials',
                    },
                    HPStabList: {
                        //experiment_record_id: 'Experiment record',
                        experiment_name: 'Experiment Name',
                        n: 'Nitrogen',
                        m: 'Ms [Gr]',
                        vol_change: 'Volume Change (ml)',
                        h2o2: 'H2O2',
                        ph: 'PH',
                        accepted_range: 'Accepted Range',
                        date: 'Date',
                        initials: 'Initials',
                    }
                },
                selected: "Choose Filter",
                selectedType: "",
                searchName: "",
                record: [],
                receivedSearchResults: false
                
            }
        },
        methods: {
            search() {
                let JSONData = {
                    tableName: '',
                    identifiers: {                   
                    }
                }
                JSONData.identifiers[this.searchName] = this.formatSearchValue();
                //let formattedSearch = this.formatSearchValue();
                //let searchItem = {name: this.selected, value: formattedSearch};
                if(this.selectedType == "Experiment Record") {
                    JSONData.tableName = 'EXPERIMENT_RECORDS';
                } else if (this.selectedType == "Raw Materials") {
                    JSONData.tableName = 'RAW_MATERIALS';
                } else if (this.selectedType == "Hydrogen Peroxide Data") {
                    JSONData.tableName = 'HYDROGEN_PEROXIDE_DATA';
                    JSONData.identifiers.hp_type = 1;
                } else if (this.selectedType == "Hydrogen Peroxide Stability Data") {
                    JSONData.tableName = 'HYDROGEN_PEROXIDE_DATA';
                    JSONData.identifiers.hp_type = 2;
                }
                console.log(JSONData);
                axios.get(baseURL + '/getData', {
                    params: {
                        data: JSON.stringify(JSONData)
                    }
                }).then(response => {
                        console.log(response.data.message);
                        //console.log(response.data.records);
                        this.record = response.data.rows;
                        this.receivedSearchResults = true;
                        console.log(this.record);
                })

                /* if(this.selectedType == "Experiment Record") {
                    axios.get(baseURL + '/searchRecords', {
                        params: {
                            search: JSON.stringify(searchItem)
                        }
                    })
                    .then(response => {
                        console.log(response.data.message);
                        //console.log(response.data.records);
                        this.record = response.data.records.experimentRecord;
                        this.receivedSearchResults = true;
                        console.log(this.record);
                    });
                } else if (this.selectedType == "Raw Materials") {
                    axios.get(baseURL + '/searchRawMaterials', {
                        params: {
                            search: JSON.stringify(searchItem)
                        }
                    })
                    .then(response => {
                        console.log(response.data.message);
                        this.record = response.data.records.RMList;
                        this.receivedSearchResults = true;
                        console.log(this.record);
                    });
                } else if (this.selectedType == "Hydrogen Peroxide Data") {
                    axios.get(baseURL + '/searchHP', {
                        params: {
                            search: JSON.stringify(searchItem)
                        }
                    })
                    .then(response => {
                        console.log(response.data.message);
                        this.record = response.data.records;
                        this.receivedSearchResults = true;
                        console.log(this.record);
                    });
                } else if (this.selectedType == "Hydrogen Peroxide Stability Data") {
                    axios.get(baseURL + '/searchHPStab', {
                        params: {
                            search: JSON.stringify(searchItem)
                        }
                    })
                    .then(response => {
                        console.log(response.data.message);
                        this.record = response.data.records;
                        this.receivedSearchResults = true;
                        console.log(this.record);
                    });
                }       */          
            },
            setSelected: function(event) {
                //setting the selected type of dropdown
                // 1. Get the selected index
                const index = event.target.selectedIndex;
                //console.log(index);
                //Object.keys(event.target.selectedIndex)[index]
                // 2. Find the selected option
                const option = event.target.options[index];
                this.searchName = option.value;
                // 3. Select the parent element (optgroup) for the selected option
                const optgroup = option.parentElement;
                const recordType = optgroup.getAttribute('label');
                this.selectedType = recordType;
            },
            formatSearchValue() {
                console.log(this.selected);
                if (this.selected.includes("pr") || this.selected.includes("name") || this.selected.includes("date") || this.selected.includes("time") || this.selected.includes("initials") || this.selected.includes("accepted")) {
                    console.log('formatting');
                    return "'" + this.searchInput + "'";
                } else {
                    return this.searchInput;
                }
            }
        },
        computed: {
            searchExpList: function() {
                return Object.keys(this.searchFilter.experiment_records);
            },
            searchRMList: function() {
                return Object.keys(this.searchFilter.RMList);
            },
            searchHPList: function() {
                return Object.keys(this.searchFilter.HPList);
            },
            searchHPStabList: function() {
                return Object.keys(this.searchFilter.HPStabList);
            }

        }
    }
</script>

<style>
.dropdown-submenu {
    position: relative;
  }
  
  .dropdown-submenu>a:after {
    content: "\f0da";
    float: right;
    border: none;
    font-family: 'FontAwesome';
  }
  
  .dropdown-submenu>.dropdown-menu {
    top: 0;
    left: 100%;
    margin-top: 0px;
    margin-left: 0px;
  }
</style>