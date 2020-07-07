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

        <div id="resultsTable">
            <table class="table table-bordered table-hover table-responsive">
                <thead class="thead-dark">
                    <tr>
                        <th v-for="column in Object.keys(record)" :key="column">{{column}}</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td></td>
                        <td></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    
</template>

<script>
    const axios = require('axios');
    //const baseURL = "/API";
    const baseURL = "http://localhost:3000/API";
    export default {
        data() {
            return {
                searchInput: "Enter search item",
                searchFilter: {
                    experiment_records: {
                        record_id: 'record ID',
                        LOT_NO: 'Lot No'
                    },
                    RMList: {
                        raw_material_name: 'Raw Material Name',
                        raw_material_lot: 'Raw Material Lot',
                        time_added: 'Time Added',
                        notes: 'notes'
                    },
                    HPList: {
                        experiment_name: 'Experiment Name',
                        N: 'Nitrogen',
                        vol_change: 'Volume Change',
                        initials: 'Initials',
                    },
                    HPStabList: {
                        experiment_name: 'Experiment Name (Stability)',
                        N: 'Nitrogen',
                        vol_change: 'Volume Change',
                        initials: 'Initials',
                    }
                },
                selected: "Choose Filter",
                selectedType: "",
                record: []
                
            }
        },
        methods: {
            search() {
                console.log("searching " + this.searchInput);
                console.log(this.selected);
                let searchItem = {name: this.selected, value: this.searchInput};
                if(this.selectedType == "Experiment Record") {
                    axios.get(baseURL + '/searchRecords', {
                        params: {
                            search: JSON.stringify(searchItem)
                        }
                    })
                    .then(response => {
                        console.log(response.data.message);
                        //console.log(response.data.records);
                        this.record = response.data.records.experimentRecord;
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
                        console.log(this.record);
                    });
                } else if (this.selectedType == "Hydrogen Peroxide Data") {
                    console.log("here")
                    axios.get(baseURL + '/searchHP', {
                        params: {
                            search: JSON.stringify(searchItem)
                        }
                    })
                    .then(response => {
                        console.log(response.data.message);
                        this.record = response.data.records;
                        console.log(this.record);
                    });
                } else if (this.selectedType == "Hydrogen Peroxide Stability Data") {
                    console.log("not here")
                    axios.get(baseURL + '/searchHPStab', {
                        params: {
                            search: JSON.stringify(searchItem)
                        }
                    })
                    .then(response => {
                        console.log(response.data.message);
                        this.record = response.data.records;
                        console.log(this.record);
                    });
                }                
            },
            setSelected: function(event) {
                //setting the selected type of dropdown
                // 1. Get the selected index
                const index = event.target.selectedIndex;
                // 2. Find the selected option
                const option = event.target.options[index];
                // 3. Select the parent element (optgroup) for the selected option
                const optgroup = option.parentElement;
                const recordType = optgroup.getAttribute('label');
                this.selectedType = recordType;
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