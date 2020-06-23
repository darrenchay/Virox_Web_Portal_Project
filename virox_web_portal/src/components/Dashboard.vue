<template>
    <div class="container card-body">
        <img alt="Vue logo" class="my-1 mr-2 img-thumbnail center" src="../assets/Virox-Logo.png">
        <form id="general-input-form" class="form" style="margin:0 auto; width:70%" @submit.prevent>
            <div class="form-inline form-group row ">
                <div class="form-group col-auto">
                    <label class="my-1 mr-2" for="inputLOTNO"><strong>LOT NO: </strong></label>
                    <input type="input" :disabled="isDisabled" v-model.trim="record.LOT_NO" class="form-control" id="inputLOTNO">
                </div>
                <div class="form-group col-auto">
                    <label class="my-1 mr-2" for="inputProjectTitle"><strong>Project Title: </strong></label>
                    <input type="text" :disabled="isDisabled" v-model.trim="record.project_title" class="form-control" id="inputProjectTitle">
                </div>
            </div>
            <div class="form-group form-inline row">
                <div class="form-group col-auto">
                    <label class="my-1 mr-2" for="inputFormulationDate"><strong>Formulation Date: </strong></label>
                    <input type="date" :disabled="isDisabled" v-model="record.formulation_date" class="form-control" id="inputFormulationDate">
                </div>
                <div class="form-group col-auto">
                    <label class="my-1 mr-2" for="inputPrepDate"><strong>Preparation Date: </strong></label>
                    <input type="date" :disabled="isDisabled" class="form-control" id="inputPrepDate" v-model="record.preparation_date">
                </div>
            </div>
            <div class="form-group form-inline row">
                <div class="form-group col-auto">
                    <label class="my-1 mr-2" for="inputPrepBy"><strong>Prepared By: </strong></label>
                    <input type="text" :disabled="isDisabled" v-model.trim="record.prepared_by" class="form-control" id="inputPrepBy">
                </div>
                <div class="form-group col-auto">
                    <label class="my-1 mr-2" for="inputQuantity"><strong>Quantity: </strong></label>
                    <input type="text" :disabled="isDisabled" v-model.trim="record.quantity" class="form-control" id="inputQuantity">
                </div>
            </div>

            <br>
            <!-- Raw Materials Table -->
            <div class="form-group">
                <label for="rmTable"><strong>Raw Materials</strong></label>
                <table class="table table-bordered table-hover" id="rmTable">
                    <thead class="thead-dark">
                        <tr>
                            <th v-for="(column, index) in column_name_rm" :key="index">{{column}}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="record in record.raw_materials_list" :key="record.rm_id">
                            <td v-for="(data, index) in columns_rm" :key="index">{{record[data]}}</td>
                        </tr>
                        <tr class="table-secondary">
                            <td><strong>Total:</strong></td>
                            <td><strong>{{record.total_percentage_w}}</strong></td>
                            <td></td>
                            <td><strong>{{record.total_AR}}</strong></td>
                            <td><strong>{{record.total_AD}}</strong></td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr v-show="new_rm.show">
                            <td><input type="text" v-model.trim="new_rm.raw_material" class="form-control" id="inputRawMat"></td>
                            <td><input type="text" v-model.trim="new_rm.w_w" class="form-control" id="inputw_w"></td>
                            <td><input type="text" v-model.trim="new_rm.raw_material_lot" class="form-control" id="inputRMlot"></td>
                            <td><input type="text" v-model.trim="new_rm.AR" class="form-control" id="inputAR"></td>
                            <td><input type="text" v-model.trim="new_rm.AD" class="form-control" id="inputAD"></td>
                            <td><input type="date" v-model.trim="new_rm.time_added" class="form-control" id="inputTimeAdded"></td>
                            <td><input type="text" v-model.trim="new_rm.rm_notes" class="form-control" id="inputRMnotes"></td>
                        </tr>
                    </tbody>
                </table>
                <button type="button" :disabled="isDisabled" v-show="new_rm.addRMbtn" @click="addRawMat" class="btn btn-primary">Add Raw Material</button>
                <button type="button" v-show="new_rm.saveRMbtn" @click="saveRawMat" class="btn btn-success">Save Raw Material</button>
            </div>

            <div class="form-group">
                <label for="notesTextArea"><strong>Notes</strong></label>
                <textarea class="form-control" :disabled="isDisabled" id="notesTextArea" v-model.trim="record.record_notes" rows="3"></textarea>
            </div>
            <div class="form-group">
                <label for="reasonPrepTextArea"><strong>Reason for Preparation</strong></label>
                <textarea class="form-control" :disabled="isDisabled" id="reasonPrepTextArea" v-model.trim="record.preparation_reason" rows="3"></textarea>
            </div>

            <!-- Hydrogen Peroxide Table -->
            <div class="form-group">
                <label for="h2O2Table"><strong>Hydrogen Peroxide</strong></label>
                <table class="table table-bordered table-hover" id="h2O2Table">
                    <thead class="thead-dark">
                        <tr>
                            <th v-for="(column, index) in columns_name_h202" :key="index">{{column}}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="record in record.hydro_per_list" :key="record.hp_id">
                            <td v-for="(data, index) in columns_h202" :key="index">{{record[data]}}</td>
                        </tr>
                        <tr class="table-secondary">
                            <td><strong></strong></td>
                            <td></td>
                            <td><strong></strong></td>
                            <td><strong></strong></td>
                            <td><strong>pH</strong></td>
                            <td><strong>{{record.hydro_per_list[0].PH}}</strong></td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr v-show="newH2O2.show">
                            <td><input type="text" v-model.trim="newH2O2.experiment" class="form-control" id="inputHPExp"></td>
                            <td><input type="text" v-model.trim="newH2O2.N" class="form-control" id="inputHPN"></td>
                            <td><input type="text" v-model.trim="newH2O2.M" class="form-control" id="inputHPM"></td>
                            <td><input type="text" v-model.trim="newH2O2.vol_change" class="form-control" id="inputHPVol"></td>
                            <td><input type="text" v-model.trim="newH2O2.H2O2" class="form-control" id="inputHPHP"></td>
                            <td><input type="text" v-model.trim="newH2O2.accepted_range" class="form-control" id="inputHPAcceptedRange"></td>
                            <td><input type="date" v-model.trim="newH2O2.date" class="form-control" id="inputHPDate"></td>
                            <td><input type="text" v-model.trim="newH2O2.initials" class="form-control" id="inputHPInit"></td>
                        </tr>
                    </tbody>
                </table>
                <button type="button" :disabled="isDisabled" v-show="newH2O2.addHPbtn" @click="addH2O2Record" class="btn btn-primary">Add Hydrogen Peroxide Record</button>
                <button type="button" v-show="newH2O2.saveHPbtn" @click="saveH2O2Record" class="btn btn-success">Save Hydrogen Peroxide Record</button>
            </div>
            
            <!-- Hydrogen Peroxide Stability Table -->
            <div class="form-group">
                <label for="h2O2StabTable"><strong>Hydrogen Peroxide Stability</strong></label>
                <table class="table table-bordered table-hover" id="h2O2StabTable">
                    <thead class="thead-dark">
                        <tr>
                            <th v-for="(column, index) in columns_name_h202" :key="index">{{column}}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="record in record.hydro_per_stab_list" :key="record.hp_id">
                            <td v-for="(data, index) in columns_h202" :key="index">{{record[data]}}</td>
                        </tr>
                        <tr class="table-secondary">
                            <td><strong></strong></td>
                            <td></td>
                            <td><strong></strong></td>
                            <td><strong></strong></td>
                            <td><strong>pH</strong></td>
                            <td><strong>{{record.hydro_per_stab_list[0].PH}}</strong></td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr v-show="newH2O2.showHPStab">
                            <td><input type="text" v-model.trim="newH2O2.experiment" class="form-control" id="inputHPStabExp"></td>
                            <td><input type="text" v-model.trim="newH2O2.N" class="form-control" id="inputHPStabN"></td>
                            <td><input type="text" v-model.trim="newH2O2.M" class="form-control" id="inputHPStabM"></td>
                            <td><input type="text" v-model.trim="newH2O2.vol_change" class="form-control" id="inputHPStabVol"></td>
                            <td><input type="text" v-model.trim="newH2O2.H2O2" class="form-control" id="inputHPStabHP"></td>
                            <td><input type="text" v-model.trim="newH2O2.accepted_range" class="form-control" id="inputHPStabAcceptedRange"></td>
                            <td><input type="date" v-model.trim="newH2O2.date" class="form-control" id="inputHPStabDate"></td>
                            <td><input type="text" v-model.trim="newH2O2.initials" class="form-control" id="inputHPStabInit"></td>
                        </tr>
                    </tbody>
                </table>
                <button type="button" :disabled="isDisabled" v-show="newH2O2.addHPStabbtn" @click="addH2O2StabRecord" class="btn btn-primary">Add Hydrogen Peroxide Stability Record</button>
                <button type="button" v-show="newH2O2.saveHPStabbtn" @click="saveH2O2StabRecord" class="btn btn-success">Save Hydrogen Peroxide Stability Record</button>
            </div>
            
            <button type="submit" v-show="show_save" @click="submit" class="btn btn-success">Save</button>
            <button type="button" v-show="show_cancel" @click="cancel" class="btn btn-secondary">Cancel</button>
            <button type="button" v-show="show_edit" @click="edit" class="btn btn-secondary">Edit</button>
        </form>
        

    </div>


</template>

<script>
export default {
  name: 'ExperimentForm',
  template: '#general-input-form',
  props: {
  },
  data(){
      return {
        show_edit: true,
        show_save: false,
        isDisabled: true,
        show_cancel: false,
        record: {
            LOT_NO: 11111,
            project_title: "Experiment 5",
            formulation_date: this.newDate('2020-12-5'),
            preparation_date: this.newDate('2020-12-15'),
            prepared_by: "Darren Chay",
            quantity: 400,
            date_created: this.getDate(),
            raw_materials_list: [{
                    rm_id: 1,
                    raw_material: "chemical L63",
                    w_w: 11.11,
                    raw_material_lot: " ",
                    AR: 44.44,
                    AD: 44.48,
                    time_added: this.newDate('2020-12-5'),
                    rm_notes: "none"
                },
                {
                    rm_id: 2,
                    raw_material: "H2O2 50% EPA",
                    w_w: 21.11,
                    raw_material_lot: " ",
                    AR: 55.44,
                    AD: 44.48,
                    time_added: this.newDate('2020-12-5'),
                    rm_notes: "none"
                }
            ],
            total_percentage_w: 100.0,
            total_AR: 355.6,
            total_AD: 355.84,
            record_notes: "Take 100g and Test stability in 54C for 2 weeks\nTake 100g and Test stability in 50C for 35 days\nProvide 100g to Sean/Cesar to conduct corrosion testing on Brass.",
            preparation_reason: "To test improved F/T performance and reduce corrosion of the RTU formula while making it fall under our newly filed patents",
            hydro_per_list: [{
                    hp_id: 1,
                    experiment: "Trial 1",
                    N: 0.1000,
                    M: "",
                    vol_change: "",
                    H2O2: 0.1000,
                    PH: 0.870,
                    accepted_range: "~ 0.8%",
                    date: this.newDate('2020-12-5'),
                    initials: "J.K"
                },
                {
                    hp_id: 2,
                    experiment: "Trial 2",
                    N: "",
                    M: "",
                    vol_change: "",
                    H2O2: 0.1000,
                    PH: 0.870,
                    accepted_range: "",
                    date: this.newDate('2020-12-5'),
                    initials: ""
                },
                {
                    hp_id: 3,
                    experiment: "Average",
                    N: "",
                    M: "",
                    vol_change: "",
                    H2O2: 0.1000,
                    PH: 0.870,
                    accepted_range: "",
                    date: "",
                    initials: ""
                }
            ],
            hydro_per_stab_list: [{
                    hp_id: 1,
                    experiment: "Trial 1",
                    N: 0.1000,
                    M: "",
                    vol_change: "",
                    H2O2: 0.1000,
                    PH: 0.870,
                    accepted_range: "~ 0.8%",
                    date: this.newDate('2020-12-5'),
                    initials: "J.K"
                },
                {
                    hp_id: 2,
                    experiment: "Trial 2",
                    N: "",
                    M: "",
                    vol_change: "",
                    H2O2: 0.1000,
                    PH: 0.870,
                    accepted_range: "",
                    date: this.newDate('2020-12-5'),
                    initials: ""
                }
            ]
        },
        columns_rm: ['raw_material', 'w_w', 'raw_material_lot', 'AR', 'AD', 'time_added', 'rm_notes'],
        column_name_rm: ['Raw Material', '%w/w', 'Raw Material lot #', 'AR[gr]', 'AD[gr]', 'Time Added', 'Notes'],
        columns_h202: ['experiment', 'N', 'M', 'vol_change', 'H2O2', 'accepted_range', 'date', 'initials'],
        columns_name_h202: ['Hydrogen Peroxide', 'N', 'Ms [gr]', '∆V (ml)', 'H2O2', 'Accepted Range', 'Date', 'Initials'],
        new_rm: {
            rm_id: '',
            raw_material: '',
            w_w: '',
            raw_material_lot: '',
            AR: '',
            AD: '',
            time_added: '',
            rm_notes: '',
            show: false,
            addRMbtn: true,
            saveRMbtn: false,
        },
        newH2O2: {
            experiment: '',
            N: '',
            M: '',
            vol_change: '',
            H2O2: '',
            accepted_range: '',
            date: '',
            initials: '',
            show: false,
            addHPbtn: true,
            saveHPbtn: false,
            showHPStab: false,
            addHPStabbtn: true,
            saveHPStabbtn: false
        }
      }
  },
  methods:{
      submit() {
          console.log(this.record);
          alert(this.record.LOT_NO + " " + this.record.project_title + " " + this.record.formulation_date + " " + this.record.prepared_by)
          this.show_edit = true
          this.show_cancel = false
      },
      getDate() {
          var today = new Date()
          var curDate = today.getDate() + "/" + (today.getMonth() + 1) + "/" + today.getFullYear() + " " + today.getHours()  + ":" + today.getMinutes() + ":" + today.getSeconds()
          return curDate;
      },
      newDate(date) {
          return new Date(date).toISOString().substring(0,10)
      },
      addRawMat() {
          this.new_rm.show = true
          this.new_rm.addRMbtn = false
          this.new_rm.saveRMbtn = true
      },
      saveRawMat() {
          if (this.new_rm.raw_material.length > 0) {
                this.record.raw_materials_list.push({
                raw_material: this.new_rm.raw_material,
                w_w: this.new_rm.w_w,
                raw_material_lot: this.new_rm.raw_material_lot,
                AR: this.new_rm.AR,
                AD: this.new_rm.AD,
                time_added: this.new_rm.time_added,
                rm_notes: this.new_rm.rm_notes
            })
          }
          this.new_rm.rm_id = ''
          this.new_rm.raw_material = ''
          this.new_rm.w_w = ''
          this.new_rm.raw_material_lot = ''
          this.new_rm.AR = ''
          this.new_rm.AD = ''
          this.new_rm.time_added = ''
          this.new_rm.rm_notes = ''
          this.new_rm.show = false
          this.new_rm.addRMbtn = true
          this.new_rm.saveRMbtn = false
      },
      addH2O2Record() {
        this.newH2O2.show = true
        this.newH2O2.addHPbtn = false
        this.newH2O2.saveHPbtn = true
      },
      saveH2O2Record() {
         if (this.newH2O2.experiment.length > 0) {
                this.record.hydro_per_list.push({
                experiment: this.newH2O2.experiment,
                N: this.newH2O2.N,
                M: this.newH2O2.M,
                vol_change: this.newH2O2.vol_change,
                H2O2: this.newH2O2.H2O2,
                accepted_range: this.newH2O2.accepted_range,
                date: this.newH2O2.date,
                initials: this.newH2O2.initials
            })
          }
          this.newH2O2.experiment = ''
          this.newH2O2.N = ''
          this.newH2O2.M = ''
          this.newH2O2.vol_change = ''
          this.newH2O2.H2O2 = ''
          this.newH2O2.accepted_range = ''
          this.newH2O2.date = ''
          this.newH2O2.initials = ''
        this.newH2O2.show = false
        this.newH2O2.addHPbtn = true
        this.newH2O2.saveHPbtn = false
      },
      addH2O2StabRecord() {
        this.newH2O2.showHPStab = true
        this.newH2O2.addHPStabbtn = false
        this.newH2O2.saveHPStabbtn = true
      },
      saveH2O2StabRecord() {
         if (this.newH2O2.experiment.length > 0) {
                this.record.hydro_per_stab_list.push({
                experiment: this.newH2O2.experiment,
                N: this.newH2O2.N,
                M: this.newH2O2.M,
                vol_change: this.newH2O2.vol_change,
                H2O2: this.newH2O2.H2O2,
                accepted_range: this.newH2O2.accepted_range,
                date: this.newH2O2.date,
                initials: this.newH2O2.initials
            })
          }
          this.newH2O2.experiment = ''
          this.newH2O2.N = ''
          this.newH2O2.M = ''
          this.newH2O2.vol_change = ''
          this.newH2O2.H2O2 = ''
          this.newH2O2.accepted_range = ''
          this.newH2O2.date = ''
          this.newH2O2.initials = ''
        this.newH2O2.showHPStab = false
        this.newH2O2.addHPStabbtn = true
        this.newH2O2.saveHPStabbtn = false
      },
      edit() {
          this.show_save = true
          this.show_edit = false
          this.isDisabled = false
          this.show_cancel = true
      },
      cancel() {
          this.show_save = false
          this.show_edit = true
          this.show_cancel = false
          this.isDisabled = true
      }
  }
}

</script>
