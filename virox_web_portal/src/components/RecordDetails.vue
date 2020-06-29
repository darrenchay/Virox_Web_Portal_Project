<template>
  <div class="card-body container">
    <form id="general-input-form" class="form" @submit.prevent>
      <!-- General record information section -->
      <div id="generalInfo">
        <div class="form-inline row">
          <div class="form-group col-6">
            <label class="mb-3 mr-2" for="inputLOTNO"><strong>LOT NO:</strong></label>
            <input type="input" :disabled="isEditingDisabled" v-model.trim="record.experimentRecord.LOT_NO" class="form-control col-5" id="inputLOTNO"/>
          </div>
          <div class="form-group col-6">
            <label class="mb-3 mr-2" for="inputProjectTitle"><strong>Project Title:</strong></label>
            <input type="text" :disabled="isEditingDisabled" v-model.trim="record.experimentRecord.project_title" class="form-control col-6" id="inputTitle"/>
          </div>
        </div>
        <div class="form-inline row justify-content-center">
          <div class="form-group col-6">
            <label class="mb-3 mr-2" for="inputFormulationDate"><strong>Formulation Date:</strong></label>
            <input type="date" :disabled="isEditingDisabled" v-model="record.experimentRecord.formulation_date" class="form-control" id="inputFormDate" />
          </div>
          <div class="form-group col-6">
            <label class="mb-3 mr-2" for="inputPrepDate"><strong>Preparation Date:</strong></label>
            <input type="date" :disabled="isEditingDisabled" v-model="record.experimentRecord.preparation_date" class="form-control" id="inputPrepDate"/>
          </div>
        </div>
        <div class="form-inline row">
          <div class="form-group col-6">
            <label class="mb-3 mr-2" for="inputPrepBy"><strong>Prepared By:</strong></label>
            <input type="text" :disabled="isEditingDisabled" v-model.trim="record.experimentRecord.prepared_by" class="form-control" id="inputPrepBy"/>
          </div>
          <div class="form-group col-6">
            <label class="mb-3 mr-2" for="inputQuantity"><strong>Quantity:</strong></label>
            <input type="text" :disabled="isEditingDisabled" v-model.trim="record.experimentRecord.quantity" class="form-control" id="inputQuantity"/>
          </div>
        </div>
      </div>

      <!-- Raw Materials Table -->
      <div class="form-group">
        <label for="rmTable"><strong>Raw Materials</strong></label>
        <table class="table table-bordered table-hover table-responsive" id="rmTable">
          <thead class="thead-dark">
            <tr>
              <th v-for="(column, index) in RMColumnNames" :key="index">{{column}}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="RawMat in record.RMList" :key="RawMat.raw_material_id">
              <td v-for="(data, index) in RMColumns" :key="index">
                <input v-if="index != 5" type="text" :disabled="isRMRowDisabled" v-model.trim="RawMat[data]" class="form-control"/>
                <input v-else type="date" :disabled="isRMRowDisabled" v-model.trim="RawMat[data]" class="form-control"/>
                </td>
              <td>
                <button type="button" :disabled="isRMRowDisabled" @click="deleteRM(RawMat)" class="btn btn-danger">Delete</button>
              </td>
            </tr>
            <tr v-show="rmTemplate.showRMTemplate">
              <td>
                <input type="text" v-model.trim="rmTemplate.data.raw_material_name" class="form-control" id="inputRawMat"/>
              </td>
              <td>
                <input type="text" v-model.trim="rmTemplate.data.percentage_w" class="form-control" id="inputw_w"/>
              </td>
              <td>
                <input type="text" v-model.trim="rmTemplate.data.raw_material_lot" class="form-control" id="inputRMlot"/>
              </td>
              <td>
                <input type="text" v-model.trim="rmTemplate.data.AR" class="form-control" id="inputAR"/>
              </td>
              <td>
                <input type="text" v-model.trim="rmTemplate.data.AD" class="form-control" id="inputAD"/>
              </td>
              <td>
                <input type="date" v-model.trim="rmTemplate.data.time_added" class="form-control" id="inputTimeAdded"/>
              </td>
              <td>
                <input type="text" v-model.trim="rmTemplate.data.notes" class="form-control" id="inputRMnotes"/>
              </td>
              <td></td>
            </tr>
            <tr class="table-secondary">
              <td><strong>Total:</strong></td>
              <td><strong>{{record.experimentRecord.total_percentage_w}}</strong></td>
              <td></td>
              <td><strong>{{record.experimentRecord.total_AR}}</strong></td>
              <td><strong>{{record.experimentRecord.total_AD}}</strong></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          </tbody>
        </table>
        <div>
          <button type="button" :disabled="isEditingDisabled" v-show="showAddRM" @click="addRM" class="btn btn-primary mr-2">Add Raw Material</button>
          <button type="button" :disabled="isEditingDisabled" v-show="showEditRMBtn" @click="editRM" class="btn btn-primary">Edit Raw Materials</button>
          <button type="button" v-show="showUpdateRMBtn" @click="updateRM" class="btn btn-success mr-2">Update Raw Materials</button>
          <button type="button" v-show="showSaveRM" @click="saveRM" class="btn btn-success mr-2">Save Raw Material</button>
          <button type="button" v-show="showCancelRM" @click="cancelRM" class="btn btn-secondary">Cancel</button>
        </div>
      </div>

      <!-- Notes and preparation reason section -->
      <div>
        <div class="form-group">
          <label for="notesTextArea"><strong>Notes</strong></label>
          <textarea class="form-control" :disabled="isEditingDisabled" id="notesTextArea" v-model.trim="record.experimentRecord.notes"></textarea>
        </div>
        <div class="form-group">
          <label for="reasonPrepTextArea"><strong>Reason for Preparation</strong></label>
          <textarea class="form-control" :disabled="isEditingDisabled" id="reasonPrepTextArea" v-model.trim="record.experimentRecord.preparation_reason"></textarea>
        </div>
      </div>

      <!-- Hydrogen Peroxide Table -->
      <div class="form-group">
        <label for="h2O2Table">
          <strong>Hydrogen Peroxide</strong>
        </label>
        <table class="table table-bordered table-hover table-responsive" id="h2O2Table">
          <thead class="thead-dark">
            <tr>
              <th v-for="(column, index) in HPColumnNames" :key="index">{{column}}</th>
            </tr>
          </thead>
          <tbody>
          </tbody>
        </table>
      </div>

      <!-- Hydrogen Peroxide Stability Table -->
      <div class="form-group">
        <label for="h2O2StabTable">
          <strong>Hydrogen Peroxide Stability</strong>
        </label>
        <table class="table table-bordered table-hover table-responsive" id="h2O2StabTable">
          <thead class="thead-dark">
            <tr>
              <th v-for="(column, index) in HPColumnNames" :key="index">{{column}}</th>
            </tr>
          </thead>
          <tbody>
          </tbody>
        </table>
      </div>
      

      <button type="submit" v-show="showSubmit" @click="submit" class="btn btn-success mr-2">Save</button>
      <button type="button" v-show="showCancelRecord" @click="cancelRecord" class="btn btn-secondary">Cancel</button>
      <button type="button" v-show="showDeleteRecord" @click="deleteRecord" class="btn btn-danger mr-2">Delete</button>
      <button type="button" v-show="showEditRecord" @click="editRecord" class="btn btn-secondary">Edit</button>
    </form>

  </div>
</template>

<script>
const axios = require("axios");
const baseURL = "http://localhost:3000";
export default {
  name: "RecordDetails",
  template: "#general-input-form",
  props: {},
  data() {
    return {
      isEditingDisabled: true,
      showSubmit: false,
      showCancelRecord: false,
      showDeleteRecord: true,
      showEditRecord: true, 

      showAddRM: true,
      showSaveRM: false,
      showCancelRM: false,
      isRMRowDisabled: true,
      showEditRMBtn: true,
      showUpdateRMBtn: false,

      record: {
        experimentRecord: {},
        RMList: [],
        HPList: [],
        HPStabilityList: []
      },
      RMColumns: ["raw_material_name", "percentage_w", "raw_material_lot", "AR", "AD", "time_added", "notes"],
      RMColumnNames: ["Raw Material", "%w/w", "Raw Material lot #", "AR[gr]", "AD[gr]", "Time Added", "Notes"],
      HPColumns: ["experiment_name", "N", "M", "vol_change", "H2O2", "accepted_range", "date", "initials"],
      HPColumnNames: ["Hydrogen Peroxide", "N", "Ms [gr]", "∆V (ml)", "H2O2", "Accepted Range", "Date", "Initials" ],
      rmTemplate: {
        data: {
          raw_material_name: "",
          percentage_w: "",
          raw_material_lot: "",
          AR: "",
          AD: "",
          time_added: "",
          notes: "",
        },
        showRMTemplate: false,
      }
    };
  },
  methods: {
    //Record handlers
    submit() {
      postRequest(baseURL + "/updateExperimentRecord", this.record);
      this.cancelRecord();
    },
    cancelRecord() {
      this.isEditingDisabled = true,
      this.showSubmit = false,
      this.showEditRecord = true,
      this.showCancelRecord = false,
      this.showDeleteRecord = true
      this.cancelRM();
    },
    deleteRecord() {
      let resp = confirm("Are you sure you want to delete this record?"); 
      if(resp == true) {
        axios.get(baseURL + "/deleteRecord?id=" + this.$store.state.currentRecordID).then(response => {
          alert('The record has been successfully deleted');
          console.log(response);
          this.$router.push({ name: 'records' });
        });
      } 
    }, 
    editRecord() {
      this.isEditingDisabled = false,
      this.showSubmit = true,
      this.showEditRecord = false,
      this.showCancelRecord = true,
      this.showDeleteRecord = false
    },

    //Raw Material handlers
    addRM() {
      this.showSaveRM = true,
      this.showAddRM = false,
      this.showCancelRM = true
      this.showEditRMBtn = false;
      this.rmTemplate.showRMTemplate = true;
    },
    saveRM() {
      if(this.rmTemplate.data.raw_material_name.length > 0) {
        //Building JSON object to send
        let record = {
          experimentRecord: {
            record_id: this.record.experimentRecord.record_id
          }, 
          RMList: []
        };
        record.RMList.push(this.rmTemplate.data);

        postRequest(baseURL + '/addRawMaterial', record);
        /* axios.get(baseURL + '/getRawMaterial?=' + this.$store.state.currentRecordID).then( response => {
          this.record.raw_materials_list = response.data.raw_materials_list;
          console.log(response.data.message);
        }); */
        //Updating RMList
        axios.get(baseURL + "/getRecord?id=" + this.$store.state.currentRecordID).then(response => {
          console.log("record ID: " + this.$store.state.currentRecordID + ", " + response.data.message);
          //this.record = response.data.records;
          this.record.RMList = response.data.records.RMList;
          this.formatRecord();
          //console.log(this.record);
        });
      }
      
      this.cancelRM();
    },
    cancelRM() {
      this.showSaveRM = false,
      this.showAddRM = true,
      this.showCancelRM = false
      this.rmTemplate.showRMTemplate = false;
      this.rmTemplate = resetTemplate(this.rmTemplate);
      
      this.isRMRowDisabled = true;
      this.showEditRMBtn = true;
      this.showUpdateRMBtn = false;
    },
    editRM() {
      this.isRMRowDisabled = false;
      this.showEditRMBtn = false;
      this.showAddRM = false,
      this.showUpdateRMBtn = true;
      this.showCancelRM = true;
    },
    deleteRM: function(rawMat) {
      console.log(rawMat);
    },
    updateRM(){
      this.cancelRM();
    },

    //Converts all the dates in record from string to date format  
    formatRecord() {
      this.record.experimentRecord.formulation_date = newDate(this.record.experimentRecord.formulation_date);
      this.record.experimentRecord.preparation_date = newDate(this.record.experimentRecord.preparation_date);
      this.record.RMList.forEach(element => {
        if (element.time_added !== null) {
          element.time_added = newDate(element.time_added);
        }
        element.isRowDisabled = true;
        element.editRMBtn = true;
        element.deleteRMBtn = true;
        element.updateRMBtn = false;
        element.cancelRMBtn = false;
      });
      this.record.HPList.forEach(element => {
        if (element.date !== null) {
          element.date = newDate(element.date);
        }
        element.isRowDisabled = true;
      });
      this.record.HPStabilityList.forEach(element => {
        if (element.date !== null) {
          element.date = newDate(element.date);
        }
        element.isRowDisabled = true;
      });
    },
  },
  beforeCreate() {
    axios.get(baseURL + "/getRecord?id=" + this.$store.state.currentRecordID).then(response => {
        console.log("record ID: " + this.$store.state.currentRecordID + ", " + response.data.message);
        this.record = response.data.records;
        this.record.experimentRecord = response.data.records.experimentRecord[0];
        this.formatRecord();
        console.log(this.record);

        //Enable editing for new records
        if (this.record.experimentRecord.LOT_NO == "") {
          this.editRecord();
        }
    });
  },
  computed: {
    calculateTotals: function() {
      let currW_WTotal = 0, currARTotal = 0, currADTotal = 0, record = {};  
      this.record.RMList.forEach(rawMat => {
        currW_WTotal += rawMat.percentage_w;
        currARTotal += rawMat.AR;
        currADTotal += rawMat.AD;
      });
      console.log(currW_WTotal);
      record.experimentRecord.total_percentage_w = currW_WTotal;
      record.experimentRecord.total_AR = currARTotal;
      record.experimentRecord.total_AD = currADTotal;
      return record;
    }
  }
};

/** Helper functions **/

//POST request
function postRequest(url, record) {
  axios({
    method: "post",
    url: url,
    data: {
      record: record
    }
  }).then(response => {
    console.log(response.data.message);
  });
}

//Converts a string to a date object
function newDate(date) {
  if (date != "") {
    return new Date(date).toISOString().substring(0, 10);
  } else {
    return "";
  }
}

function resetTemplate(template){
  Object.keys(template).forEach(key => {
    template[key] = "";
  });
  return template;
}
</script>