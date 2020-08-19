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
        <div id="resultsTable" class="table-responsive" v-show="receivedSearchResults">
            <table v-if="record.length > 0" class="table table-bordered table-hover">
                <thead class="thead-dark">
                    <tr v-if="currentSelected == 'Experiment Record' ">
                        <th v-for="(column, index) in recordColumnNames" :key="index">{{column}}</th>
                    </tr>
                    <tr v-else-if="currentSelected == 'Raw Materials'">
                        <th v-for="(column, index) in RMColumnNames" :key="index">{{column}}</th>
                    </tr>
                    <tr v-else-if="currentSelected == 'Hydrogen Peroxide Data' || currentSelected == 'Hydrogen Peroxide Stability Data'">
                        <th v-for="(column, index) in HPColumnNames" :key="index">{{column}}</th>
                    </tr>
                </thead>
                <tbody v-if="currentSelected == 'Experiment Record'">
                    <tr v-for="(record, index) in record" :key="index">
                        <td v-for="(data, index) in recordColumns" :key="index">{{record[data]}}</td>
                    </tr>
                </tbody>
                <tbody v-else-if="currentSelected == 'Raw Materials'">
                    <tr v-for="(record, index) in record" :key="index">
                        <td v-for="(data, index) in RMColumns" :key="index">{{record[data]}}</td>
                    </tr>
                </tbody>
                <tbody v-else-if="currentSelected == 'Hydrogen Peroxide Data' || currentSelected == 'Hydrogen Peroxide Stability Data'">
                    <tr v-for="(record, index) in record" :key="index">
                        <td v-for="(data, index) in HPColumns" :key="index">{{record[data]}}</td>
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
                currentSelected: "",

                RMColumnNames: ["Experiment Record ID", "Raw Material", "%w/w", "Raw Material lot #", "AR[gr]", "AD[gr]", "Time Added"],
                RMColumns: ["experiment_record_id","raw_material_name", "percentage_w", "raw_material_lot", "ar", "ad", "time_added"],

                HPColumnNames: ["Experiment Record ID", "H202 Type", "Hydrogen Peroxide", "N", "Ms [gr]", "∆V (ml)", "H2O2", "Accepted Range", "Date", "Initials" ],
                HPColumns: ["experiment_record_id", "hp_type", "experiment_name", "n", "m", "vol_change", "h2o2", "accepted_range", "date", "initials"],

                recordColumnNames: ["Record ID", 'Project Title', 'LOT NO', 'Prepared By', 'Formulation Date', 'Preparation Date', 'Quantity', 'Total %w/w', 'Total AR', 'Total AD', 'H202 Average', 'H202 Stability Average', 'Date Created', 'Date Updated'],
                recordColumns: ['record_id', 'project_title', 'lot_no', 'prepared_by', 'formulation_date', 'preparation_date', 'quantity', 'total_percentage_w', 'total_ar', 'total_ad', 'hp_h2o2_avg', 'hp_stab_h2o2_avg', 'date_created', 'date_updated'],
                
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

                    this.currentSelected = this.selectedType;

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
                if (this.selected.includes("pr") || this.selected.includes("name") || this.selected.includes("date") || this.selected.includes("time") || this.selected.includes("initials") || this.selected.includes("accepted") || this.selected.includes("_lot")) {
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