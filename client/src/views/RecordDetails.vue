<template>
  <div class="card-body container">
    <transition name="fade">
      <div v-if="performingRequest" class="loading">
          <p>Loading...</p>
      </div>
    </transition>
    <div class="alert alert-success alert-dismissible fade" v-show="showSuccess" :class="{'show': showSuccess}" role="alert">
      <strong>Success!</strong> Changes saved successfully.
      <button type="button" class="close" @click="showSuccess=false" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <form id="general-input-form" class="form needs-validation" @submit.prevent novalidate>
      <!-- Button suite -->
      <div class="mb-3">
        <button type="submit" v-show="showSubmit" @click="submit" class="btn btn-success mr-2">Save Changes</button>
        <button type="button" v-show="showCancelRecord" @click="cancelRecord" class="btn btn-secondary">Cancel</button>
        <button type="button" v-show="showDeleteRecord" @click="deleteRecord" class="btn btn-danger mr-2">Delete</button>
        <button type="button" v-show="showEditRecord" @click="editRecord" class="btn btn-secondary">Edit</button>
      </div>
      <hr>
      <!-- General record information section -->
      <div id="generalInfo">
        <div class="form-inline row">
          <div class="form-group col-6">
            <label class="mb-3 mr-2" for="inputLOTNO"><strong>LOT NO:</strong></label>
            <input type="input" :disabled="isEditingDisabled" :class="{'is-invalid': isLotNoInvalid}" v-model.trim="record.experimentRecord.lot_no" class="form-control col-5" id="inputLOTNO" required/>
            <small class="invalid-feedback" v-show="isLotNoInvalid">
                Please enter a valid LOT NO.
            </small>
          </div>
          <div class="form-group col-6">
            <label class="mb-3 mr-2" for="inputProjectTitle"><strong>Project Title:</strong></label>
            <input type="text" :disabled="isEditingDisabled" :class="{'is-invalid': isTitleInvalid}" v-model.trim="record.experimentRecord.project_title" class="form-control col-6" id="inputTitle"/>
            <small class="invalid-feedback" v-show="isTitleInvalid">
                Field cannot be blank.
            </small>
          </div>
        </div>
        <div class="form-inline row justify-content-center">
          <div class="form-group col-6">
            <label class="mb-3 mr-2" for="inputFormulationDate"><strong>Formulation Date:</strong></label>
            <input type="date" :class="{'is-invalid': isFormDateInvalid}" :disabled="isEditingDisabled" v-model="record.experimentRecord.formulation_date" class="form-control" id="inputFormDate" />
            <small class="invalid-feedback" v-show="isFormDateInvalid">
                Please enter a valid formulation date.
            </small>
          </div>
          <div class="form-group col-6">
            <label class="mb-3 mr-2" for="inputPrepDate"><strong>Preparation Date:</strong></label>
            <input type="date" :class="{'is-invalid': isPrepDateInvalid}" :disabled="isEditingDisabled" v-model="record.experimentRecord.preparation_date" class="form-control" id="inputPrepDate"/>
            <small class="invalid-feedback" v-show="isPrepDateInvalid">
                Please enter a valid preparation date.
            </small>
          </div>
        </div>
        <div class="form-inline row">
          <div class="form-group col-6">
            <label class="mb-3 mr-2" for="inputPrepBy"><strong>Prepared By:</strong></label>
            <input type="text" :class="{'is-invalid': isPrepByInvalid}" :disabled="isEditingDisabled" v-model.trim="record.experimentRecord.prepared_by" class="form-control" id="inputPrepBy"/>
            <small class="invalid-feedback" v-show="isPrepByInvalid">
                Field cannot be blank.
            </small>
          </div>
          <div class="form-group col-6">
            <label class="mb-3 mr-2" for="inputQuantity"><strong>Quantity:</strong></label>
            <input type="text" :class="{'is-invalid': isQuantityInvalid}" :disabled="isEditingDisabled" v-model.trim="record.experimentRecord.quantity" class="form-control" id="inputQuantity"/>
            <small class="invalid-feedback" v-show="isQuantityInvalid">
                Please enter a valid quantity.
            </small>
          </div>
        </div>
      </div>
      <hr>
      <!-- Raw Materials Table -->
      <div class="form-group">
        <label for="rmTable"><strong>Raw Materials</strong></label>
        <div class="table-scrollable">
          <table v-if="record.RMList.length > 0 || showRMTemplate" class="table table-bordered table-hover table-responsive" id="rmTable">
            <thead class="thead-dark">
              <tr>
                <th v-for="(column, index) in RMColumnNames" :key="index">{{column}}</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="RawMat in record.RMList" :key="RawMat.raw_material_id">
                <td v-for="(data, index) in RMColumns" :key="index">
                  <input v-if="index == 3" type="text" readonly v-model.trim="RawMat[data]" class="form-control"/>
                  <input v-else-if="index == 5" type="date" :readonly="isRMRowDisabled" v-model.trim="RawMat[data]" class="form-control"/>
                  <input v-else type="text" :readonly="isRMRowDisabled" v-model.trim="RawMat[data]" class="form-control col-sm"/>
                </td>
                <td>
                  <button type="button" :disabled="isRMRowDisabled" @click="deleteRow(RawMat, 0)" class="btn btn-danger">Delete</button>
                </td>
              </tr>
              <tr v-show="showRMTemplate">
                <td>
                  <input type="text" :class="{'is-invalid': isRMNameInvalid}" v-model.trim="rmTemplate.raw_material_name" class="form-control" id="inputRawMat"/>
                  <small class="invalid-feedback" v-show="isRMNameInvalid">
                      Field cannot be empty.
                  </small>
                </td>
                <td>
                  <input type="text" :class="{'is-invalid': isPercentWInvalid}" v-model.trim="rmTemplate.percentage_w" class="form-control" id="inputw_w"/>
                  <small class="invalid-feedback" v-show="isPercentWInvalid">
                      Field cannot be empty.
                  </small>
                </td>
                <td>
                  <input type="text" v-model.trim="rmTemplate.raw_material_lot" class="form-control" id="inputRMlot"/>
                </td>
                <td>
                  <input type="text" :class="{'is-invalid': isARInvalid}" v-model.trim="rmTemplate.ar" class="form-control" id="inputAR"/>
                  <small class="invalid-feedback" v-show="isARInvalid">
                      Field cannot be empty.
                  </small>
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
        </div>
        <div>
          <button type="button" :disabled="isEditingDisabled" v-show="showAddRM" @click="addRM" class="btn btn-primary mr-2">Add Raw Material</button>
          <button type="button" v-if="record.RMList.length > 0" :disabled="isEditingDisabled" v-show="showEditRMBtn" @click="editRM" class="btn btn-info">Edit Raw Materials</button>
          <button type="button" v-show="showUpdateRMBtn" @click="updateRows(0)" class="btn btn-success mr-2">Update Raw Materials</button>
          <button type="button" v-show="showSaveRM" @click="saveRM" class="btn btn-success mr-2">Save Raw Material</button>
          <button type="button" v-show="showCancelRM" @click="cancelRM(true)" class="btn btn-secondary">Cancel</button>
        </div>
      </div>
      <transition name="fade">
        <p v-if="showSaveSuccessfulRM" style="color: #1abc9c">Changes saved successfully</p>
        <p v-else-if="errorMsgRM" style="color: red">Make sure all Raw material and %w/w columns are not empty and properly formatted before saving</p>
      </transition>
      <hr>

      <!-- Notes and preparation reason section -->
      <div>
        <div class="form-group">
          <label for="notesTextArea"><strong>Sample Preparation Notes</strong></label>
          <textarea class="form-control" :disabled="isEditingDisabled" id="notesTextArea" v-model.trim="record.experimentRecord.notes"></textarea>
        </div>
        <div class="form-group">
          <label for="reasonPrepTextArea"><strong>Reason for Preparation</strong></label>
          <textarea class="form-control" :disabled="isEditingDisabled" id="reasonPrepTextArea" v-model.trim="record.experimentRecord.preparation_reason"></textarea>
        </div>
        <div class="form-group">
          <label for="obsTextArea"><strong>Observation Notes</strong></label>
          <textarea class="form-control" :disabled="isEditingDisabled" id="obsTextArea" v-model.trim="record.experimentRecord.observations"></textarea>
        </div>
      </div>
      <hr>

      <!-- Hydrogen Peroxide Table -->
      <div class="form-group">
        <label for="HPTable">
          <strong>Hydrogen Peroxide</strong>
        </label>
        <table v-if="record.HPList.length > 0 || showHPTemplate" class="table table-bordered table-hover table-responsive" id="HPTable">
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
                <button type="button" :disabled="isHPRowDisabled" @click="deleteRow(HP, 1)" class="btn btn-danger">Delete</button>
              </td>
            </tr>
            <tr v-show="showHPTemplate">
              <td>
                <input type="text" :class="{'is-invalid': isHPNameInvalid}" v-model.trim="hpTemplate.experiment_name" class="form-control"/>
                <small class="invalid-feedback" v-show="isHPNameInvalid">
                    Field cannot be empty.
                </small>
              </td>
              <td>
                <input type="text" :class="{'is-invalid': isNInvalid}" v-model.trim="hpTemplate.n" class="form-control"/>
                <small class="invalid-feedback" v-show="isNInvalid">
                    All 3 fields cannot be empty.
                </small>
              </td>
              <td>
                <input type="text" :class="{'is-invalid': isNInvalid}" v-model.trim="hpTemplate.m" class="form-control"/>
                <small class="invalid-feedback" v-show="isNInvalid">
                    All 3 fields cannot be empty.
                </small>
              </td>
              <td>
                <input type="text" :class="{'is-invalid': isNInvalid}" v-model.trim="hpTemplate.vol_change" class="form-control"/>
                <small class="invalid-feedback" v-show="isNInvalid">
                    All 3 fields cannot be empty.
                </small>
              </td>
              <td>
                <input type="text" :class="{'is-invalid': isH2O2Invalid}" v-model.trim="hpTemplate.h2o2" class="form-control"/>
                <small class="invalid-feedback" v-show="isH2O2Invalid">
                    Field cannot be empty.
                </small>
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
            <tr v-if="record.HPList.length > 0" class="table-secondary">
              <td><strong>PH</strong></td>
              <td><strong><input type="text" :disabled="isHPRowDisabled" v-model.trim="record.experimentRecord.hp_ph" class="form-control"/></strong></td>
              <td></td>
              <td><strong>Average H2O2</strong></td>
              <td><strong>{{averageHP}}</strong></td>
              <td><strong><input type="text" placeholder="Notes" :disabled="isHPRowDisabled" v-model.trim="record.experimentRecord.hp_ph_accepted_range" class="form-control"/></strong></td>
              <td></td>
              <td><strong>S.G</strong></td>
              <td><strong><input type="text" :disabled="isHPRowDisabled" v-model.number="record.experimentRecord.sg" class="form-control"/></strong></td>
            </tr>
          </tbody>
        </table>
        <div>
          <button type="button" :disabled="isEditingDisabled" v-show="showAddHP" @click="addHP" class="btn btn-primary mr-2">Add Hydrogen Peroxide Data</button>
          <button type="button"  v-if="record.HPList.length > 0" :disabled="isEditingDisabled" v-show="showEditHPBtn" @click="editHP" class="btn btn-info">Edit Hydrogen Peroxide Data</button>
          <button type="button" v-show="showUpdateHPBtn" @click="updateRows(1)" class="btn btn-success mr-2">Update Hydrogen Peroxide Data</button>
          <button type="button" v-show="showSaveHP" @click="saveHP(1, record.experimentRecord.hp_ph)" class="btn btn-success mr-2">Save Hydrogen Peroxide Data</button>
          <button type="button" v-show="showCancelHP" @click="cancelHP(true)" class="btn btn-secondary">Cancel</button>
        </div>
      </div>
      <transition name="fade">
        <p v-if="showSaveSuccessfulHP" style="color: #1abc9c">Changes saved successfully</p>
        <p v-else-if="errorMsgHP" style="color: red">Make sure all Hydrogen Peroxide, either one of N, Ms, or ∆V columns and H202 columns are not empty and properly formatted before saving</p>
      </transition>
      <hr>
      <!-- Hydrogen Peroxide Stability Table -->
      <div class="form-group">
        <label for="HPStabTable">
          <strong>Hydrogen Peroxide Stability</strong>
        </label>
        <table v-if="record.HPStabilityList.length > 0 || showHPStabTemplate" class="table table-bordered table-hover table-responsive" id="HPStabTable">
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
                <button type="button" :disabled="isHPStabRowDisabled" @click="deleteRow(HPStab, 2)" class="btn btn-danger">Delete</button>
              </td>
            </tr>
            <tr v-show="showHPStabTemplate">
              <td>
                <input type="text" :class="{'is-invalid': isHPNameInvalid}" v-model.trim="hpTemplate.experiment_name" class="form-control"/>
                <small class="invalid-feedback" v-show="isHPNameInvalid">
                    Field cannot be empty.
                </small>
              </td>
              <td>
                <input type="text" :class="{'is-invalid': isNInvalid}" v-model.trim="hpTemplate.n" class="form-control"/>
                <small class="invalid-feedback" v-show="isNInvalid">
                    All 3 fields cannot be empty.
                </small>
              </td>
              <td>
                <input type="text" :class="{'is-invalid': isNInvalid}" v-model.trim="hpTemplate.m" class="form-control"/>
                <small class="invalid-feedback" v-show="isNInvalid">
                    All 3 fields cannot be empty.
                </small>
              </td>
              <td>
                <input type="text" :class="{'is-invalid': isNInvalid}" v-model.trim="hpTemplate.vol_change" class="form-control"/>
                <small class="invalid-feedback" v-show="isNInvalid">
                    All 3 fields cannot be empty.
                </small>
              </td>
              <td>
                <input type="text" :class="{'is-invalid': isH2O2Invalid}" v-model.trim="hpTemplate.h2o2" class="form-control"/>
                <small class="invalid-feedback" v-show="isH2O2Invalid">
                    Field cannot be empty.
                </small>
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
            <tr v-if="record.HPStabilityList.length > 0" class="table-secondary">
              <td><strong>PH</strong></td>
              <td><strong><input type="text" :disabled="isHPStabRowDisabled" v-model.number="record.experimentRecord.hp_stab_ph" class="form-control"/></strong></td>
              <td></td>
              <td><strong>Average H2O2</strong></td>
              <td><strong>{{averageHPStab}}</strong></td>
              <!-- <td><strong><input type="text" :disabled="isHPRowDisabled" v-model.number="record.experimentRecord.hp_stab_h2o2_avg" class="form-control"/></strong></td> -->
              <td><strong><input type="text" placeholder="Notes" :disabled="isHPStabRowDisabled" v-model.trim="record.experimentRecord.hp_stab_ph_accepted_range" class="form-control"/></strong></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          </tbody>
        </table>
        <div>
          <button type="button" :disabled="isEditingDisabled" v-show="showAddHPStab" @click="addHPStab" class="btn btn-primary mr-2">Add Hydrogen Peroxide Stability Data</button>
          <button type="button"  v-if="record.HPStabilityList.length > 0" :disabled="isEditingDisabled" v-show="showEditHPStabBtn" @click="editHPStab" class="btn btn-info">Edit Hydrogen Peroxide Stability Data</button>
          <button type="button" v-show="showUpdateHPStabBtn" @click="updateRows(2)" class="btn btn-success mr-2">Update Hydrogen Peroxide Stability Data</button>
          <button type="button" v-show="showSaveHPStab" @click="saveHP(2, record.experimentRecord.hp_stab_ph)" class="btn btn-success mr-2">Save Hydrogen Peroxide Stability Data</button>
          <button type="button" v-show="showCancelHPStab" @click="cancelHPStab(true)" class="btn btn-secondary">Cancel</button>
        </div>
      </div>
      <transition name="fade">
        <p v-if="showSaveSuccessfulHPStab" style="color: #1abc9c">Changes saved successfully</p>
        <p v-else-if="errorMsgHPStab" style="color: red">Make sure all Hydrogen Peroxide, either one of N, Ms, or ∆V columns and H202 columns are not empty and properly formatted before saving</p>
      </transition>
      
    </form>

  </div>
</template>

<script>
const axios = require("axios");
const baseURL = "http://localhost:3000/API"

export default {
  name: "RecordDetails",
  template: "#general-input-form",
  props: {},
  data() {
    return {
      performingRequest: true,
      showSuccess: false,
      showSaveSuccessfulRM: false,
      showSaveSuccessfulHPStab: false,
      showSaveSuccessfulHP: false,
      errorMsgRM: false,
      errorMsgHP: false,
      errorMsgHPStab: false,

      isEditingDisabled: true,
      showSubmit: false,
      showCancelRecord: false,
      showDeleteRecord: true,
      showEditRecord: true, 
      isLotNoInvalid: false,
      isTitleInvalid: false,
      isFormDateInvalid: false,
      isPrepDateInvalid: false,
      isPrepByInvalid: false,
      isQuantityInvalid: false,

      showAddRM: true,
      showSaveRM: false,
      showCancelRM: false,
      isRMRowDisabled: true,
      showEditRMBtn: true,
      showUpdateRMBtn: false,
      isRMNameInvalid: false,
      isPercentWInvalid: false,
      isARInvalid: false,

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

      isHPNameInvalid: false,
      isNInvalid: false,
      isH2O2Invalid: false,

      record: {
        experimentRecord: {},
        RMList: [],
        HPList: [],
        HPStabilityList: []
      },

      watchedQuantity: 0,

      RMColumns: ["raw_material_name", "percentage_w", "raw_material_lot", "ar", "ad", "time_added", "notes"],
      RMColumnNames: ["Raw Material", "%w/w", "Raw Material lot #", "AR[gr]", "AD[gr]", "Time Added", "Notes"],
      HPColumns: ["experiment_name", "n", "m", "vol_change", "h2o2", "accepted_range", "date", "initials"],
      HPColumnNames: ["Hydrogen Peroxide", "N", "Ms [gr]", "∆V (ml)", "H2O2", "Accepted Range", "Date", "Initials" ],

      rmTemplate: {
        raw_material_name: "",
        percentage_w: "",
        raw_material_lot: "",
        ar: "",
        ad: "",
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
      tempList: []
    };
  },
  methods: {
    //Record handlers
    submit() {
      this.checkValidityRecord();
      if(this.isAllValid) {
        postRequest(baseURL + "/updateData", new Array(this.record.experimentRecord), 'EXPERIMENT_RECORDS', {});
        this.calculateAR();
        this.cancelRecord(false)
        this.showSuccess = true;
        setTimeout( () => {
          this.showSuccess = false
        }, 3000);

      }
    },
    cancelRecord(revertCached) {
      this.isEditingDisabled = true,
      this.showSubmit = false,
      this.showEditRecord = true,
      this.showCancelRecord = false,
      this.showDeleteRecord = true

      this.cancelRM(false);
      this.cancelHP(false);
      this.cancelHPStab(false);
      if(revertCached) {
        this.record.experimentRecord = Object.assign({}, this.cachedRecord); //Revert changes
      }
      this.checkValidityRecord();
    },
    deleteRecord() {
      let resp = confirm("Are you sure you want to delete this record?"); 
      if(resp == true) {
        postRequest(baseURL + "/deleteData", new Array(this.record.experimentRecord), 'EXPERIMENT_RECORDS', {record_id: this.$store.state.currentRecordID});
        alert('The record has been successfully deleted');
        this.$router.push({ name: 'records' });
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
      this.checkValidityRM();
      if(this.isRMValid) {
        let record = [];

        //TO REMOVE AND REPLACE WITH VALIDATION
        if(this.rmTemplate.percentage_w === "") {
          this.rmTemplate.percentage_w = 0; 
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
        record.push(this.rmTemplate);
        record[0]['experiment_record_id'] = this.$store.state.currentRecordID;

        this.postGetRequest(baseURL + '/addData', record, 'RAW_MATERIALS', 0, {});
      }
    },
    cancelRM(revertCached) {
      this.showSaveRM = false,
      this.showAddRM = true,
      this.showCancelRM = false

      this.isRMRowDisabled = true;
      this.showEditRMBtn = true;
      this.showUpdateRMBtn = false;

      this.showRMTemplate = false;
      this.isRMNameInvalid = false;
      this.isPercentWInvalid = false;
      this.isARInvalid = false;

      Object.keys(this.rmTemplate).forEach(key => {
        this.rmTemplate[key] = "";
      });

      if(revertCached) {
        //Reverting changes
        if(this.tempList.length > 0) {
          this.record.RMList = this.tempList;
        }
      }      
    },
    editRM() {
      this.isRMRowDisabled = false;
      this.showEditRMBtn = false;
      this.showAddRM = false,
      this.showUpdateRMBtn = true;
      this.showCancelRM = true;

      //Caching RMList
      this.tempList = [];
      for(var i = 0; i < this.record.RMList.length; i++) {
        this.tempList.push({...this.record.RMList[i]});
      }
      console.log(this.tempList);
    },

    //HP handlers
    addHP() {
      this.showSaveHP = true,
      this.showAddHP = false,
      this.showCancelHP = true
      this.showEditHPBtn = false;
      this.showHPTemplate = true;
    },
    cancelHP(revertCached) {
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

      // Revert cached changes if cancelling and not updating
      if(revertCached) {
        if(this.tempList.length > 0) {
          this.record.HPList = this.tempList;
          this.record.experimentRecord.hp_ph_accepted_range = this.tempNotes;
          this.record.experimentRecord.sg = this.tempSG;
          this.record.experimentRecord.hp_ph = this.tempPH;
        }
      }
    },
    editHP() {
      this.isHPRowDisabled = false;
      this.showEditHPBtn = false;
      this.showAddHP = false,
      this.showUpdateHPBtn = true;
      this.showCancelHP = true;

      //Caching HPList data
      this.tempList = [];
      this.tempPH = this.record.experimentRecord.hp_ph;
      this.tempNotes = this.record.experimentRecord.hp_ph_accepted_range;
      this.tempSG = this.record.experimentRecord.sg;
      for(var i = 0; i < this.record.HPList.length; i++) {
        this.tempList.push({...this.record.HPList[i]});
      }
    },

    //HP stability handlers
    addHPStab() {
      this.showSaveHPStab = true,
      this.showAddHPStab = false,
      this.showCancelHPStab = true
      this.showEditHPStabBtn = false;
      this.showHPStabTemplate = true;
    },
    cancelHPStab(revertCached) {
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


      // Revert cached changes if cancelling and not updating
      if(revertCached) {
        if(this.tempList.length > 0) {
          this.record.HPStabilityList = this.tempList;
          this.record.experimentRecord.hp_stab_ph_accepted_range = this.tempNotes;
          this.record.experimentRecord.hp_stab_ph = this.tempPH;
        }
      }
    },
    editHPStab() {
      this.isHPStabRowDisabled = false;
      this.showEditHPStabBtn = false;
      this.showAddHPStab = false,
      this.showUpdateHPStabBtn = true;
      this.showCancelHPStab = true;

      //Caching HPStabilityList
      this.tempPH = this.record.experimentRecord.hp_stab_ph;
      this.tempNotes = this.record.experimentRecord.hp_stab_ph_accepted_range;
      this.tempList = [];
      for(var i = 0; i < this.record.HPStabilityList.length; i++) {
        this.tempList.push({...this.record.HPStabilityList[i]});
      }
    },

    saveHP(type, ph) {
      this.checkValidityHP();
      if(this.isHPValid) {
        //Building JSON object to send
        let HPRecord = {
          experiment_record_id: this.record.experimentRecord.record_id,
          hp_type: type,
          experiment_name: this.hpTemplate.experiment_name,
          n: this.hpTemplate.n,
          m: this.hpTemplate.m,
          vol_change: this.hpTemplate.vol_change,
          h2o2: this.hpTemplate.h2o2,
          ph: ph,
          accepted_range: this.hpTemplate.accepted_range,
          date: this.hpTemplate.date,
          initials: this.hpTemplate.initials
        }
        if(HPRecord.date === "") {
          HPRecord.date = null;
        }
        if(HPRecord.m === "") {
          HPRecord.m = null;
        }
        if(HPRecord.vol_change === "") {
          HPRecord.vol_change = null;
        }

        let record = [HPRecord];
        this.postGetRequest(baseURL + '/addData', record, 'HYDROGEN_PEROXIDE_DATA', type, {});
      }
    },
    deleteRow: function(data, type) {
      let resp = confirm("Are you sure you want to delete this record?"); 
      if(resp == true) {
        if(type == 0) {
          this.postGetRequest(baseURL + '/deleteData', [], 'RAW_MATERIALS', 0, {raw_material_id: data.raw_material_id});
        } else {
          this.postGetRequest(baseURL + '/deleteData', [], 'HYDROGEN_PEROXIDE_DATA', type, {hp_id: data.hp_id});
        }
      } 
    },
    updateRows(type){
      if(type == 0) {
        // Updating Raw materials
        console.log(this.record.RMList)
        this.postGetRequest(baseURL + '/updateData', this.record.RMList, 'RAW_MATERIALS', 0, {});
      } else if(type == 1) {
        // Updating Hydrogen peroxide
        this.record.HPList.forEach(HP => {
          // Update the PH of each HP record
          HP.ph = this.record.experimentRecord.hp_ph;
        });
        this.postGetRequest(baseURL + '/updateData', this.record.HPList, 'HYDROGEN_PEROXIDE_DATA', type, {});
      } else {
        // Updating Hydrogen peroxide stability
        this.record.HPStabilityList.forEach(HPStab => {
          // Update the PH of each HP record
          HPStab.ph = this.record.experimentRecord.hp_stab_ph;
        });
        this.postGetRequest(baseURL + '/updateData', this.record.HPStabilityList, 'HYDROGEN_PEROXIDE_DATA', type, {});
      }
      
    },

    // Performs a post request then a get request
    postGetRequest(url, data, tableName, type, identifiers) {
      let getIdentifiers = {};
      getIdentifiers['experiment_record_id'] = this.$store.state.currentRecordID;
      if(type == 1) {
        getIdentifiers['hp_type'] = 1
      } else if (type == 2) {
        getIdentifiers['hp_type'] = 2
      }
      axios({
          method: "post",
          url: url,
          data: {
            data: createJSONObject(tableName, data, identifiers)
          }
        }).then(response => {
          console.log(response.data.message);
          axios.get(baseURL + '/getData', {
            params: {
              data: JSON.stringify(createJSONObject(tableName, [], getIdentifiers)),
              page: 1
            }
          }).then( response => {
            if(type == 0) {
              this.record.RMList = response.data.rows;
              this.formatRecord();
              this.cancelRM(false);
              this.calculateAR();
              this.showSaveSuccessfulRM = true;
              setTimeout(() => {
                  this.showSaveSuccessfulRM = false
              }, 3000)
            } else if (type == 1) {
              this.record.HPList = response.data.rows;
              this.formatRecord();
              this.cancelHP(false);
              this.showSaveSuccessfulHP = true;
              setTimeout(() => {
                  this.showSaveSuccessfulHP = false
              }, 3000)
            } else if (type == 2) {
              this.record.HPStabilityList = response.data.rows;
              this.formatRecord();
              this.cancelHPStab(false);
              this.showSaveSuccessfulHPStab = true;
              setTimeout(() => {
                  this.showSaveSuccessfulHPStab = false
              }, 3000)
            }
            console.log(response.data.message);
            postRequest(baseURL + "/updateData", new Array(this.record.experimentRecord), 'EXPERIMENT_RECORDS', {}); //To update current date
          });
        }).catch( err => {
          console.log(err)
          if (type == 0) {
            this.errorMsgRM = true
            setTimeout(() => {
              this.errorMsgRM = false
            }, 5000)
          } else if (type == 1) {
            this.errorMsgHP = true
            setTimeout(() => {
              this.errorMsgHP = false
            }, 5000)
          } else {
            this.errorMsgHPStab = true
            setTimeout(() => {
              this.errorMsgHPStab = false
            }, 5000)
          }
          
        });
    },
    //Converts all the dates in record from string to date format  
    formatRecord() {
      this.record.experimentRecord.formulation_date = formatDate(this.record.experimentRecord.formulation_date);
      this.record.experimentRecord.preparation_date = formatDate(this.record.experimentRecord.preparation_date);
      this.record.RMList.forEach(element => {
        if (element.time_added !== null) {
          element.time_added = formatDate(element.time_added);
        }
        // console.log(element.percentage_w);
        // console.log(this.record.experimentRecord.quantity);
        // element.ar = this.record.experimentRecord.quantity/100 * element.percentage_w;
        // console.log(element);
      });
      this.record.HPList.forEach(element => {
        if (element.date !== null) {
          element.date = formatDate(element.date);
        }
      });
      this.record.HPStabilityList.forEach(element => {
        if (element.date !== null) {
          element.date = formatDate(element.date);
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
    },
    checkValidityRecord() {
      if(this.record.experimentRecord.lot_no === "" || this.record.experimentRecord.lot_no === 11111) {
        this.isLotNoInvalid = true;
        this.isAllValid = false;
      } else {
        this.isLotNoInvalid = false;
      }
      if(this.record.experimentRecord.project_title === "") {
        this.isTitleInvalid = true;
        this.isAllValid = false;
      } else {
        this.isTitleInvalid = false;
      }
      if(this.record.experimentRecord.formulation_date === "") {
        this.isFormDateInvalid = true;
        this.isAllValid = false;
      } else {
        this.isFormDateInvalid = false;
      }
      if(this.record.experimentRecord.preparation_date === "") {
        this.isPrepDateInvalid = true;
        this.isAllValid = false;
      } else {
        this.isPrepDateInvalid = false;
      }
      if(this.record.experimentRecord.prepared_by === "") {
        this.isPrepByInvalid = true;
        this.isAllValid = false;
      } else {
        this.isPrepByInvalid = false;
      }
      if(this.record.experimentRecord.quantity === "" || this.record.experimentRecord.quantity <= 0 ) {
        this.isQuantityInvalid = true;
        this.isAllValid = false;
      } else {
        this.isQuantityInvalid = false;
      }
      if(!this.isLotNoInvalid && !this.isTitleInvalid && !this.isFormDateInvalid && !this.isPrepDateInvalid && !this.isPrepByInvalid && !this.isQuantityInvalid) {
        this.isAllValid = true;
      }
    },
    checkValidityRM() {
      //console.log(this.rmTemplate);
      if(this.rmTemplate.raw_material_name === "") {
        this.isRMNameInvalid = true;
        this.isRMValid = false;
      } else {
        this.isRMNameInvalid = false;
      }
      if(this.rmTemplate.percentage_w === "") {
        this.isPercentWInvalid = true;
        this.isRMValid = false;
      } else {
        this.isPercentWInvalid = false;
      }
      if(this.rmTemplate.ar === "") {
        this.isARInvalid = true;
        this.isRMValid = false;
      } else {
        this.isARInvalid = false;
      }
      if(!this.isRMNameInvalid && !this.isPercentWInvalid && !this.isARInvalid) {
        this.isRMValid = true;
      }
    },
    checkValidityHP() {
      //console.log(this.rmTemplate);
      if(this.hpTemplate.experiment_name === "") {
        this.isHPNameInvalid = true;
        this.isHPValid = false;
      } else {
        this.isHPNameInvalid = false;
      }
      if(this.hpTemplate.n === "" && this.hpTemplate.m === "" && this.hpTemplate.vol_change === "") {
        this.isNInvalid = true;
        this.isHPValid = false;
      } else {
        this.isNInvalid = false;
      }
      if(this.hpTemplate.h2o2 === "") {
        this.isH2O2Invalid = true;
        this.isHPValid = false;
      } else {
        this.isH2O2Invalid = false;
      }
      if(!this.isHPNameInvalid && !this.isNInvalid && !this.isH2O2Invalid) {
        this.isHPValid = true;
      }
    },
    calculateAR() {
      this.record.RMList.forEach(element => {
        // console.log(element.percentage_w);
        // console.log(this.record.experimentRecord.quantity);
        let newAR = this.record.experimentRecord.quantity + element.percentage_w;
        element.ar = newAR.toFixed(3);
      });
    },
    getAvgHP() {
      let totalH2O2 = 0
      this.record.HPList.forEach(element => {
        totalH2O2 += element.h2o2;
      })
      let length = this.record.HPList.length;
      if(length > 0){
        return (totalH2O2/length).toFixed(3);
      } else {
        return 0;
      }
    },
    getAvgHPStab() {
      let totalH2O2 = 0
      this.record.HPStabilityList.forEach(element => {
        totalH2O2 += element.h2o2;
      })
      let length = this.record.HPStabilityList.length;
      if(length > 0){
        return (totalH2O2/length).toFixed(3);
      } else {
        return 0;
      }
    }
  },
  beforeCreate() {
    this.performingRequest = true;
    axios.get(baseURL + "/getRecord?id=" + this.$store.state.currentRecordID).then(response => {
        console.log("record ID: " + this.$store.state.currentRecordID + ", " + response.data.message);
        //console.log(response.data);
        this.record = response.data.records;
        this.record.experimentRecord = response.data.records.experimentRecord;
        this.formatRecord();
        this.calculateAR();
        console.log(this.record);
        //Enable editing for new records
        if (this.record.experimentRecord.lot_no == "") {
          this.editRecord();
        }
        this.watchedQuantity = this.record.experimentRecord.quantity;
        this.performingRequest = false;
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
    },
    averageHP: function() {
      return this.getAvgHP();
    },
    averageHPStab: function() {
      return this.getAvgHPStab();
    }
  },
};

/** Helper functions **/

//POST request
function postRequest(url, data, tableName, identifiers) {
  axios({
    method: "post",
    url: url,
    data: {
      data: createJSONObject(tableName, data, identifiers)
    }
  }).then(response => {
    console.log(response.data.message);
    return response.data;
  }).catch(error => {
    console.log(error);
    alert(error.message);
  });
}

//Converts a string to a date object
function formatDate(date) {
  if (date != "") {
    return new Date(date).toISOString().substring(0, 10);
  } else {
    return "";
  }
}

function createJSONObject(tableName, data, identifiers) {
  // console.log("creating JSON object")
  // Creating a copy of the data to be sent
  let dataToSend = [];
  for(var i = 0; i < data.length; i++) {
    dataToSend.push({...data[i]});
  }
  // console.log("ORIGINAL DATA: ")
  // console.log(data)
  dataToSend.forEach(element => {
    // Converting all "" to nulls
    Object.keys(element).forEach(variable => {
      if(element[variable] === "") {
        element[variable] = null;
        // console.log("for element: " + element.experiment_name)
        // console.log(variable)
        // console.log(element[variable])
      }
    })
    // console.log(element)
  })
  // console.log("COPY DATA: ")
  // console.log(dataToSend)

  let JSONData = {
    tableName: tableName,
    identifiers: identifiers,
    data: dataToSend
  };
  // console.log(JSONData);
  return JSONData;
}
</script>
