<template>
  <div class="card-body container">
    <form id="general-input-form" class="form" @submit.prevent>
      <!-- General record information section -->
      <div id="generalInfo">
        <div class="form-inline row">
          <div class="form-group col-6">
            <label class="mb-3 mr-2" for="inputLOTNO"><strong>LOT NO:</strong></label>
            <input type="input" :disabled="isEditingDisabled" v-model.trim="record.experimentRecord.lot_no" class="form-control col-5" id="inputLOTNO"/>
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
                <input v-else type="date" :disabled="isRMRowDisabled" v-model.trim="RawMat[data]" class="form-control col-sm"/>
                </td>
              <td>
                <button type="button" :disabled="isRMRowDisabled" @click="deleteRM(RawMat)" class="btn btn-danger">Delete</button>
              </td>
            </tr>
            <tr v-show="showRMTemplate">
              <td>
                <input type="text" v-model.trim="rmTemplate.raw_material_name" class="form-control" id="inputRawMat"/>
              </td>
              <td>
                <input type="text" v-model.trim="rmTemplate.percentage_w" class="form-control" id="inputw_w"/>
              </td>
              <td>
                <input type="text" v-model.trim="rmTemplate.raw_material_lot" class="form-control" id="inputRMlot"/>
              </td>
              <td>
                <input type="text" v-model.trim="rmTemplate.ar" class="form-control" id="inputAR"/>
              </td>
              <td>
                <input type="text" v-model.trim="rmTemplate.ad" class="form-control" id="inputAD"/>
              </td>
              <td>
                <input type="date" v-model.trim="rmTemplate.time_added" class="form-control" id="inputTimeAdded"/>
              </td>
              <td>
                <input type="text" v-model.trim="rmTemplate.notes" class="form-control" id="inputRMnotes"/>
              </td>
              <td></td>
            </tr>
            <tr class="table-secondary">
              <td><strong>Total:</strong></td>
              <!-- <td><strong>{{record.experimentRecord.total_percentage_w}}</strong></td> -->
              <td><strong>{{totalW}}</strong></td>
              <td></td>
              <td><strong>{{totalAR}}</strong></td>
              <td><strong>{{totalAD}}</strong></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          </tbody>
        </table>
        <div>
          <button type="button" :disabled="isEditingDisabled" v-show="showAddRM" @click="addRM" class="btn btn-primary mr-2">Add Raw Material</button>
          <button type="button" :disabled="isEditingDisabled" v-show="showEditRMBtn" @click="editRM" class="btn btn-info">Edit Raw Materials</button>
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
        <label for="HPTable">
          <strong>Hydrogen Peroxide</strong>
        </label>
        <table class="table table-bordered table-hover table-responsive" id="HPTable">
          <thead class="thead-dark">
            <tr>
              <th v-for="(column, index) in HPColumnNames" :key="index">{{column}}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="HP in record.HPList" :key="HP.hp_id">
              <td v-for="(data, index) in HPColumns" :key="index">
                <input v-if="index != 6" type="text" :disabled="isHPRowDisabled" v-model.trim="HP[data]" class="form-control"/>
                <input v-else type="date" :disabled="isHPRowDisabled" v-model.trim="HP[data]" class="form-control"/>
              </td>
              <td>
                <button type="button" :disabled="isHPRowDisabled" @click="deleteHP(HP)" class="btn btn-danger">Delete</button>
              </td>
            </tr>
            <tr v-show="showHPTemplate">
              <td>
                <input type="text" v-model.trim="hpTemplate.experiment_name" class="form-control"/>
              </td>
              <td>
                <input type="text" v-model.trim="hpTemplate.n" class="form-control"/>
              </td>
              <td>
                <input type="text" v-model.trim="hpTemplate.m" class="form-control"/>
              </td>
              <td>
                <input type="text" v-model.trim="hpTemplate.vol_change" class="form-control"/>
              </td>
              <td>
                <input type="text" v-model.trim="hpTemplate.h2o2" class="form-control"/>
              </td>
              <td>
                <input type="text" v-model.trim="hpTemplate.accepted_range" class="form-control"/>
              </td>
              <td>
                <input type="date" v-model.trim="hpTemplate.date" class="form-control"/>
              </td>
              <td>
                <input type="text" v-model.trim="hpTemplate.initials" class="form-control"/>
              </td>
              <td></td>
            </tr>
            <tr class="table-secondary">
              <td> <strong></strong> </td>
              <td></td>
              <td> <strong></strong> </td>
              <td><strong></strong></td>
              <td><strong>pH</strong></td>
              <td><strong><input type="text" :disabled="isHPRowDisabled" v-model.trim="HP_PH" class="form-control"/></strong></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          </tbody>
        </table>
        <div>
          <button type="button" :disabled="isEditingDisabled" v-show="showAddHP" @click="addHP" class="btn btn-primary mr-2">Add Hydrogen Peroxide Data</button>
          <button type="button" :disabled="isEditingDisabled" v-show="showEditHPBtn" @click="editHP" class="btn btn-info">Edit Hydrogen Peroxide Data</button>
          <button type="button" v-show="showUpdateHPBtn" @click="updateHP" class="btn btn-success mr-2">Update Hydrogen Peroxide Data</button>
          <button type="button" v-show="showSaveHP" @click="saveHP" class="btn btn-success mr-2">Save Hydrogen Peroxide Data</button>
          <button type="button" v-show="showCancelHP" @click="cancelHP" class="btn btn-secondary">Cancel</button>
        </div>
      </div>

      <!-- Hydrogen Peroxide Stability Table -->
      <div class="form-group">
        <label for="HPStabTable">
          <strong>Hydrogen Peroxide Stability</strong>
        </label>
        <table class="table table-bordered table-hover table-responsive" id="HPStabTable">
          <thead class="thead-dark">
            <tr>
              <th v-for="(column, index) in HPColumnNames" :key="index">{{column}}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="HPStab in record.HPStabilityList" :key="HPStab.hp_id">
              <td v-for="(data, index) in HPColumns" :key="index">
                <input v-if="index != 6" type="text" :disabled="isHPStabRowDisabled" v-model.trim="HPStab[data]" class="form-control"/>
                <input v-else type="date" :disabled="isHPStabRowDisabled" v-model.trim="HPStab[data]" class="form-control"/>
              </td>
              <td>
                <button type="button" :disabled="isHPStabRowDisabled" @click="deleteHPStab(HPStab)" class="btn btn-danger">Delete</button>
              </td>
            </tr>
            <tr v-show="showHPStabTemplate">
              <td>
                <input type="text" v-model.trim="hpTemplate.experiment_name" class="form-control"/>
              </td>
              <td>
                <input type="text" v-model.trim="hpTemplate.n" class="form-control"/>
              </td>
              <td>
                <input type="text" v-model.trim="hpTemplate.m" class="form-control"/>
              </td>
              <td>
                <input type="text" v-model.trim="hpTemplate.vol_change" class="form-control"/>
              </td>
              <td>
                <input type="text" v-model.trim="hpTemplate.h2o2" class="form-control"/>
              </td>
              <td>
                <input type="text" v-model.trim="hpTemplate.accepted_range" class="form-control"/>
              </td>
              <td>
                <input type="date" v-model.trim="hpTemplate.date" class="form-control"/>
              </td>
              <td>
                <input type="text" v-model.trim="hpTemplate.initials" class="form-control"/>
              </td>
              <td></td>
            </tr>
            <tr class="table-secondary">
              <td> <strong></strong> </td>
              <td></td>
              <td> <strong></strong> </td>
              <td><strong></strong></td>
              <td><strong>pH</strong></td>
              <td><strong><input type="text" :disabled="isHPStabRowDisabled" v-model.number="HPStab_PH" class="form-control"/></strong></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          </tbody>
        </table>
        <div>
          <button type="button" :disabled="isEditingDisabled" v-show="showAddHPStab" @click="addHPStab" class="btn btn-primary mr-2">Add Hydrogen Peroxide Stability Data</button>
          <button type="button" :disabled="isEditingDisabled" v-show="showEditHPStabBtn" @click="editHPStab" class="btn btn-info">Edit Hydrogen Peroxide Stability Data</button>
          <button type="button" v-show="showUpdateHPStabBtn" @click="updateHPStab" class="btn btn-success mr-2">Update Hydrogen Peroxide Stability Data</button>
          <button type="button" v-show="showSaveHPStab" @click="saveHPStab" class="btn btn-success mr-2">Save Hydrogen Peroxide Stability Data</button>
          <button type="button" v-show="showCancelHPStab" @click="cancelHPStab" class="btn btn-secondary">Cancel</button>
        </div>
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

//const baseURL = "https://virox-server.herokuapp.com/api";
const baseURL = "http://localhost:3000/API"
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

      isHPRowDisabled: true,
      showAddHP: true,
      showSaveHP: false,
      showCancelHP: false,
      showEditHPBtn: true,
      showUpdateHPBtn: false,

      isHPStabRowDisabled: true,
      showAddHPStab: true,
      showSaveHPStab: false,
      showCancelHPStab: false,
      showEditHPStabBtn: true,
      showUpdateHPStabBtn: false,

      HP_PH: 0,
      HPStab_PH: 0,

      record: {
        experimentRecord: {},
        RMList: [],
        HPList: [],
        HPStabilityList: []
      },

      RMColumns: ["raw_material_name", "percentage_w", "raw_material_lot", "ar", "ad", "time_added", "notes"],
      RMColumnNames: ["Raw Material", "%w/w", "Raw Material lot #", "AR[gr]", "AD[gr]", "Time Added", "Notes"],
      HPColumns: ["experiment_name", "n", "m", "vol_change", "h2o2", "accepted_range", "date", "initials"],
      HPColumnNames: ["Hydrogen Peroxide", "N", "Ms [gr]", "∆V (ml)", "H2O2", "Accepted Range", "Date", "Initials" ],

      rmTemplate: {
        raw_material_name: "",
        percentage_w: null,
        raw_material_lot: null,
        ar: null,
        ad: null,
        time_added: "",
        notes: "",
      },
      showRMTemplate: false,

      hpTemplate: {
        experiment_name: "",
        n: "",
        m: "",
        vol_change: "",
        h2o2: "",
        accepted_range: "",
        date: "",
        initials: "",
        ph: "",
      },
      showHPTemplate: false,
      showHPStabTemplate: false,
      
      cachedRecord: {},
      tempRMList: [],
    };
  },
  methods: {
    //Record handlers
    submit() {
      postRequest(baseURL + "/updateExperimentRecord", this.record);
      this.isEditingDisabled = true,
      this.showSubmit = false,
      this.showEditRecord = true,
      this.showCancelRecord = false,
      this.showDeleteRecord = true
      this.cancelRM();
      this.cancelHP();
      this.cancelHPStab();
    },
    cancelRecord() {
      this.isEditingDisabled = true,
      this.showSubmit = false,
      this.showEditRecord = true,
      this.showCancelRecord = false,
      this.showDeleteRecord = true
      this.cancelRM();
      this.cancelHP();
      this.cancelHPStab();
      this.record.experimentRecord = Object.assign({}, this.cachedRecord); //Revert changes
    },
    deleteRecord() {
      let resp = confirm("Are you sure you want to delete this record?"); 
      if(resp == true) {
        axios.get(baseURL + "/deleteRecord?id=" + this.$store.state.currentRecordID).then(response => {
          alert('The record has been successfully deleted');
          console.log(response.data.message);
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
      this.cachedRecord = { ...this.record.experimentRecord}; //Create a cached version to revert changes on cancel
    },

    //Raw Material handlers
    addRM() {
      this.showSaveRM = true,
      this.showAddRM = false,
      this.showCancelRM = true
      this.showEditRMBtn = false;
      this.showRMTemplate = true;
    },
    saveRM() {
      if(this.rmTemplate.raw_material_name.length > 0) {
        //Building JSON object to send
        let record = {
          experimentRecord: {
            record_id: this.record.experimentRecord.record_id
          }, 
          RMList: []
        };
        /* Object.values(this.rmTemplate).forEach(element => {
          if(element !== "") {
            record.RMList[0][element] = element;
          }
        }) */
        if(this.rmTemplate.percentage_w === "") {
          this.rmTemplate.percentage_w = 0; 
        }
        if(this.rmTemplate.raw_material_lot === "") {
          this.rmTemplate.raw_material_lot = 0; 
        }
        if(this.rmTemplate.ad === "") {
          this.rmTemplate.ad = null; 
        }
        if(this.rmTemplate.ar === "") {
          this.rmTemplate.ar = null; 
        }
        if(this.rmTemplate.time_added === "") {
          this.rmTemplate.time_added = null; 
        }
        record.RMList.push(this.rmTemplate);
        console.log(record.RMList);

        //Running ajax calls
        axios({
          method: "post",
          url: baseURL + '/addRawMaterial',
          data: {
            record: record
          }
        }).then(response => {
          console.log(response.data.message);
          let JSONData = {
            tableName: 'RAW_MATERIALS',
            identifiers: {
                experiment_record_id: this.$store.state.currentRecordID,
            }
          }
          axios.get(baseURL + '/getData', {
            params: {
              data: JSON.stringify(JSONData)
            }
          }).then( response => {
            this.record.RMList = response.data.rows;
            this.formatRecord();
            this.cancelRM();  
            console.log(response.data.message);
            postRequest(baseURL + "/updateExperimentRecord", this.record); //Update date update field
          });
          //Updating RMList
          /* axios.get(baseURL + '/getRawMaterial?id=' + this.$store.state.currentRecordID).then( response => {
            this.record.RMList = response.data.RMList;
            this.formatRecord();
            this.cancelRM();  
            console.log(response.data.message);
            postRequest(baseURL + "/updateExperimentRecord", this.record); //Update date update field
          }); */
        });
      }
    },
    cancelRM() {
      this.showSaveRM = false,
      this.showAddRM = true,
      this.showCancelRM = false

      this.isRMRowDisabled = true;
      this.showEditRMBtn = true;
      this.showUpdateRMBtn = false;

      this.showRMTemplate = false;
      Object.keys(this.rmTemplate).forEach(key => {
        this.rmTemplate[key] = "";
      });
      /* this.record.RMList.forEach(function (RM) {
        this.tempRMList.push(Object.assign({}, RM));
      }); */
      //this.record.RMList = this.tempRMList; //TOFIX
    },
    editRM() {
      this.isRMRowDisabled = false;
      this.showEditRMBtn = false;
      this.showAddRM = false,
      this.showUpdateRMBtn = true;
      this.showCancelRM = true;
      /* this.record.RMList.forEach(function (RM) {
        this.tempRMList.push(Object.assign({}, RM));
      });
      console.log(this.tempRMList);
      console.log("real records: ")
      console.log(this.record.RMList); */
    },
    deleteRM: function(rawMat) {
      let resp = confirm("Are you sure you want to delete this record?"); 
      let id = rawMat.raw_material_id;
      if(resp == true) {
        axios({
          method: "post",
          url: baseURL + '/deleteRawMaterial',
          data: {
            record: id
          }
        }).then(response => {
          console.log(response.data.message);
          //Updating RMList
          axios.get(baseURL + '/getRawMaterial?id=' + this.$store.state.currentRecordID).then( response => {
            this.record.RMList = response.data.RMList;
            this.formatRecord();
            this.cancelRM();  
            console.log(response.data.message);
            postRequest(baseURL + "/updateExperimentRecord", this.record); //Update date update field
          });
        });
      }
    },
    updateRM(){
      console.log(this.record.RMList);
      axios({
          method: "post",
          url: baseURL + '/updateRawMaterial',
          data: {
            record: this.record
          }
        }).then(response => {
          console.log(response.data.message);
          //Updating RMList
          axios.get(baseURL + '/getRawMaterial?id=' + this.$store.state.currentRecordID).then( response => {
            this.record.RMList = response.data.RMList;
            console.log(this.record.RMList);
            this.formatRecord();
            this.cancelRM();  
            console.log(response.data.message);
            postRequest(baseURL + "/updateExperimentRecord", this.record); //Update date update field
          });
        });
    },

    //HP handlers
    addHP() {
      this.showSaveHP = true,
      this.showAddHP = false,
      this.showCancelHP = true
      this.showEditHPBtn = false;
      this.showHPTemplate = true;
    },
    saveHP() {
      if(this.hpTemplate.experiment_name.length > 0) {
        //Building JSON object to send
        let HPRecord = {
          experiment_record_id: this.record.experimentRecord.record_id,
          hp_type : 1,
          experiment_name: this.hpTemplate.experiment_name,
          n: this.hpTemplate.n,
          m: this.hpTemplate.m,
          vol_change: this.hpTemplate.vol_change,
          h2o2: this.hpTemplate.h2o2,
          ph: this.HP_PH,
          accepted_range: this.hpTemplate.accepted_range,
          date: this.hpTemplate.date,
          initials: this.hpTemplate.initials
        }
        if(HPRecord.date === "") {
          HPRecord.date = null;
        }
        /* let record = {
          experimentRecord: {
            record_id: 
          }, 
          HPList: [],
          HPStabilityList: []
        };
        record.HPList.push(this.hpTemplate); */
        axios({
          method: "post",
          url: baseURL + '/addHP',
          data: {
            HPRecord: HPRecord
          }
        }).then(response => {
          console.log(response.data.message);
          let JSONData = {
            tableName: 'HYDROGEN_PEROXIDE_DATA',
            identifiers: {
                experiment_record_id: this.$store.state.currentRecordID,
                hp_type: 1
            }
          }
          axios.get(baseURL + '/getData', {
            params: {
              data: JSON.stringify(JSONData)
            }
          }).then( response => {
            this.record.HPList = response.data.rows;
            this.formatRecord();
            this.cancelHP();  
            console.log(response.data.message);
            postRequest(baseURL + "/updateExperimentRecord", this.record); //Update date update field
          });
          /* //Updating HPList
          axios.get(baseURL + '/getHP?id=' + this.$store.state.currentRecordID).then( response => {
            this.record.HPList = response.data.HPList;
            this.formatRecord();
            this.cancelHP();  
            console.log(response.data.message);
            postRequest(baseURL + "/updateExperimentRecord", this.record); //Update date update field
          }); */
        });
      } else {
        this.cancelHP();
      }
    },
    cancelHP() {
      this.showSaveHP = false,
      this.showAddHP = true,
      this.showCancelHP = false

      this.isHPRowDisabled = true;
      this.showEditHPBtn = true;
      this.showUpdateHPBtn = false;

      this.showHPTemplate = false;
      Object.keys(this.hpTemplate).forEach(key => {
        this.hpTemplate[key] = "";
      });
    },
    editHP() {
      this.isHPRowDisabled = false;
      this.showEditHPBtn = false;
      this.showAddHP = false,
      this.showUpdateHPBtn = true;
      this.showCancelHP = true;
    },
    deleteHP: function(HP) {
      let resp = confirm("Are you sure you want to delete this record?"); 
      let id = HP.hp_id;
      //console.log(id);
      if(resp == true) {
        axios({
          method: "post",
          url: baseURL + '/deleteHP',
          data: {
            record: id
          }
        }).then(response => {
          console.log(response.data.message);
          //Updating HPList
          axios.get(baseURL + '/getHP?id=' + this.$store.state.currentRecordID).then( response => {
            this.record.HPList = response.data.HPList;
            this.formatRecord();
            this.cancelHP();  
            console.log(response.data.message);
            postRequest(baseURL + "/updateExperimentRecord", this.record); //Update date update field
          });
        });
      } 
    },
    updateHP(){
      //Update the PH of each HP record
      this.record.HPList.forEach(HP => {
        HP.ph = this.HP_PH;
      });
      axios({
          method: "post",
          url: baseURL + '/updateHP',
          data: {
            record: this.record
          }
        }).then(response => {
          console.log(response.data.message);
          //Updating HPList
          axios.get(baseURL + '/getHP?id=' + this.$store.state.currentRecordID).then( response => {
            this.record.HPList = response.data.HPList;
            this.formatRecord();
            console.log(response.data.message);
            postRequest(baseURL + "/updateExperimentRecord", this.record); //Update date update field
          });
          this.cancelHP();  
        });
    },

    //HP stability handlers
    addHPStab() {
      this.showSaveHPStab = true,
      this.showAddHPStab = false,
      this.showCancelHPStab = true
      this.showEditHPStabBtn = false;
      this.showHPStabTemplate = true;
    },
    saveHPStab() {
      if(this.hpTemplate.experiment_name.length > 0) {
        //Building JSON object to send
        let HPRecord = {
          experiment_record_id: this.record.experimentRecord.record_id,
          hp_type : 2,
          experiment_name: this.hpTemplate.experiment_name,
          n: this.hpTemplate.n,
          m: this.hpTemplate.m,
          vol_change: this.hpTemplate.vol_change,
          h2o2: this.hpTemplate.h2o2,
          ph: this.HPStab_PH,
          accepted_range: this.hpTemplate.accepted_range,
          date: this.hpTemplate.date,
          initials: this.hpTemplate.initials
        }
        if(HPRecord.date === "") {
          HPRecord.date = null;
        }
        /* let record = {
          experimentRecord: {
            record_id: this.record.experimentRecord.record_id
          }, 
          HPList: [],
          HPStabilityList: []
        };
        record.HPStabilityList.push(this.hpTemplate); */

        axios({
          method: "post",
          url: baseURL + '/addHP',
          data: {
            HPRecord: HPRecord
          }
        }).then(response => {
          console.log(response.data.message);
          let JSONData = {
            tableName: 'HYDROGEN_PEROXIDE_DATA',
            identifiers: {
                experiment_record_id: this.$store.state.currentRecordID,
                hp_type: 2
            }
          }
          axios.get(baseURL + '/getData', {
            params: {
              data: JSON.stringify(JSONData)
            }
          }).then( response => {
            this.record.HPStabilityList = response.data.rows;
            this.formatRecord();
            this.cancelHPStab();  
            console.log(response.data.message);
            postRequest(baseURL + "/updateExperimentRecord", this.record); //Update date update field
          });
          //Updating HPStabilityList
          /* axios.get(baseURL + '/getHPStab?id=' + this.$store.state.currentRecordID).then( response => {
            this.record.HPStabilityList = response.data.HPStabilityList;
            this.formatRecord();
            this.cancelHPStab();  
            console.log(response.data.message);
            postRequest(baseURL + "/updateExperimentRecord", this.record); //Update date update field
          }); */
        });
      } else {
        this.cancelHPStab();
      }
    },
    cancelHPStab() {
      this.showSaveHPStab = false,
      this.showAddHPStab = true,
      this.showCancelHPStab = false

      this.isHPStabRowDisabled = true;
      this.showEditHPStabBtn = true;
      this.showUpdateHPStabBtn = false;

      this.showHPStabTemplate = false;
      Object.keys(this.hpTemplate).forEach(key => {
        this.hpTemplate[key] = "";
      });
    },
    editHPStab() {
      this.isHPStabRowDisabled = false;
      this.showEditHPStabBtn = false;
      this.showAddHPStab = false,
      this.showUpdateHPStabBtn = true;
      this.showCancelHPStab = true;
    },
    deleteHPStab: function(HPStab) {
      let resp = confirm("Are you sure you want to delete this record?"); 
      let id = HPStab.hp_id;
      //console.log(id);
      if(resp == true) {
        axios({
          method: "post",
          url: baseURL + '/deleteHP',
          data: {
            record: id
          }
        }).then(response => {
          console.log(response.data.message);
          //Updating HPStabilityList
          axios.get(baseURL + '/getHPStab?id=' + this.$store.state.currentRecordID).then( response => {
            this.record.HPStabilityList = response.data.HPStabilityList;
            this.formatRecord();
            this.cancelHPStab();  
            console.log(response.data.message);
            postRequest(baseURL + "/updateExperimentRecord", this.record); //Update date update field
          });
        });
      } 
    },
    updateHPStab(){
      this.record.HPStabilityList.forEach(HPStab => {
        HPStab.ph = this.HPStab_PH;
      });
      axios({
          method: "post",
          url: baseURL + '/updateHP',
          data: {
            record: this.record
          }
        }).then(response => {
          console.log(response.data.message);
          //Updating HPStabilityList
          axios.get(baseURL + '/getHPStab?id=' + this.$store.state.currentRecordID).then( response => {
            this.record.HPStabilityList = response.data.HPStabilityList;
            this.formatRecord();
            console.log(response.data.message);
            postRequest(baseURL + "/updateExperimentRecord", this.record); //Update date update field
          });
          this.cancelHPStab();  
        });
    },


    //Converts all the dates in record from string to date format  
    formatRecord() {
      this.record.experimentRecord.formulation_date = newDate(this.record.experimentRecord.formulation_date);
      this.record.experimentRecord.preparation_date = newDate(this.record.experimentRecord.preparation_date);
      this.record.RMList.forEach(element => {
        if (element.time_added !== null) {
          element.time_added = newDate(element.time_added);
        }
      });
      this.record.HPList.forEach(element => {
        if (element.date !== null) {
          element.date = newDate(element.date);
        }
      });
      this.record.HPStabilityList.forEach(element => {
        if (element.date !== null) {
          element.date = newDate(element.date);
        }
      });
    },
    calculatetotalW: function() {
      let newTotal = this.record.RMList.reduce(function(a, c) {
        return a + Number(c.percentage_w);
      }, 0);
      this.record.experimentRecord.total_percentage_w = newTotal.toFixed(2);
      //console.log(this.record.experimentRecord.total_percentage_w);
      return newTotal.toFixed(2);
    },
    calculateTotalAD: function() {
      let newTotal = this.record.RMList.reduce(function(a, c) {
        return a + Number(c.ad);
      }, 0);
      this.record.experimentRecord.total_ad = newTotal.toFixed(3);
      return newTotal.toFixed(3);
    },
    calculateTotalAR: function() {
      let newTotal = this.record.RMList.reduce(function(a, c) {
        return a + Number(c.ar);
      }, 0);
      this.record.experimentRecord.total_ar = newTotal.toFixed(3);
      return newTotal.toFixed(3);
    }
  },
  beforeCreate() {
    axios.get(baseURL + "/getRecord?id=" + this.$store.state.currentRecordID).then(response => {
        console.log("record ID: " + this.$store.state.currentRecordID + ", " + response.data.message);
        //console.log(response.data);
        this.record = response.data.records;
        this.record.experimentRecord = response.data.records.experimentRecord;
        this.formatRecord();
        console.log(this.record);
        //console.log("record:");
        //console.log(this.record.experimentRecord.preparation_reason);
        //console.log("cached:");
        //console.log(this.cachedRecord.preparation_reason);
        if(this.record.HPList.length > 0) {
          this.HP_PH = this.record.HPList[0].ph;
        }

        if(this.record.HPStabilityList.length > 0) {
          this.HPStab_PH = this.record.HPStabilityList[0].ph;
        }

        //Enable editing for new records
        if (this.record.experimentRecord.lot_no == "") {
          this.editRecord();
        }
    });
  },
  computed: {
    totalW: function() {
      return this.calculatetotalW();
    },
    totalAR: function() {
      return this.calculateTotalAR();
    },
    totalAD: function() {
      return this.calculateTotalAD();
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
    return response.data;
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
</script>