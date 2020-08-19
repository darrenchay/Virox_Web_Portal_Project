<template>
    <div class="card-body"> 
        <form class="needs-validation" novalidate @submit.prevent>
        <div class="input-group mb-3">
            <div class="input-group-prepend">
                <label class="input-group-text" for="searchFilter">Choose search filter</label>
            </div>

            <!-- Search Filter -->
            <select class="custom-select" :class="{'is-invalid': isFilterInvalid}" name="searchFilter" id="searchFilter" @change="setSelected($event)" v-model="selected" required>
               <!--  <option disabled selected>Search Filter</option> -->
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
            
            <!-- Search Item -->
            <input type="text" class="form-control" :class="{'is-invalid': isInputInvalid}" placeholder="Enter Search Item" v-model.trim="searchInput" required>
            <button type="button" class="btn" @click="search"><span class="fas fa-search"></span></button>
            
            <!-- Invalid Feedbacks -->
            <small v-if="isBothInvalid" class="invalid-feedback" v-show="isBothInvalid">
                Please select a search filter and enter a search item.
            </small>
            <small v-else-if="isInputInvalid" class="invalid-feedback" v-show="isInputInvalid">
                Please enter a search item.
            </small>
            <small v-else-if="isFilterInvalid" class="invalid-feedback" v-show="isFilterInvalid">
                Please select a search filter.
            </small>
        </div>
            <p v-show="isInvalidFormat" style="color: red">Error: Search item incorrectly formatted.</p>
        </form>

        <!-- Results Table -->
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
    const baseURL = "https://virox-server.herokuapp.com/api";
    //const baseURL = "http://localhost:3000/API";
    export default {
        data() {
            return {
                searchInput: "",
                isFilterInvalid: false,
                isInputInvalid: false,
                isBothInvalid: false,
                isInvalidFormat: false,
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
                selected: "",
                selectedType: "",
                searchName: "",
                record: [],
                receivedSearchResults: false
                
            }
        },
        methods: {
            search() {
                //console.log("'" + this.selected + "' -- '" + this.searchInput + "'");
                if(this.checkValidity()) {
                    this.isFilterInvalid = false;
                    this.isInputInvalid = false;

                    // Building search data 
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

                    // Running Query
                    axios.get(baseURL + '/getData', {
                        params: {
                            data: JSON.stringify(JSONData)
                        }
                    }).then(response => {
                            console.log(response.data.message);
                            this.record = response.data.rows;
                            this.isInvalidFormat = false;
                            
                            //Formats any dates in search results
                            this.record.forEach(row => {
                                Object.keys(row).forEach(key => {
                                    if(key.includes('date') || key.includes('time')) {
                                        row[key] = formatDate(row[key]);
                                    }
                                })
                            })
                            this.receivedSearchResults = true;
                            //console.log(this.record);
                    }).catch(err => {
                        // Improper format was probably inputted if it catches an error
                        console.log(err);
                        this.receivedSearchResults = false;
                        this.isInvalidFormat = true;
                    }) 
                }
            },
            setSelected: function(event) {
                //setting the selected type of dropdown
                // 1. Get the selected index
                const index = event.target.selectedIndex;
                // 2. Find the selected option
                const option = event.target.options[index];
                this.searchName = option.value;
                // 3. Select the parent element (optgroup) for the selected option
                const optgroup = option.parentElement;
                const recordType = optgroup.getAttribute('label');
                this.selectedType = recordType;
            },

            // formats any values that must be in string format by adding quotes in the beginning and the end 
            formatSearchValue() {
                console.log(this.selected);
                if (this.selected.includes("pr") || this.selected.includes("name") || this.selected.includes("date") || this.selected.includes("time") || this.selected.includes("initials") || this.selected.includes("accepted")) {
                    return "'" + this.searchInput + "'";
                } else {
                    return this.searchInput;
                }
            },
            checkValidity() {
                // Checking if both are not selected
                if(this.selected === "" && this.searchInput === "") {
                    this.isFilterInvalid = true;
                    this.isInputInvalid = true;
                    this.isBothInvalid = true;
                    return false;
                }
                // Checking if filter was selected
                if(this.selected === "") {
                    this.isBothInvalid = false;
                    this.isInputInvalid = false;
                    this.isFilterInvalid = true;
                    return false;
                }
                // Checking if search item was input
                if (this.searchInput === "") {
                    this.isBothInvalid = false;
                    this.isInputInvalid = true;
                    this.isFilterInvalid = false;
                    return false;
                } 
                return true;
            }
        },
        computed: {
            // Converts list of search filters into the filter names
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

// Formats date to the appropriate format
function formatDate(date) {
    return new Date(date).toString().substring(3, 21);
}
</script>