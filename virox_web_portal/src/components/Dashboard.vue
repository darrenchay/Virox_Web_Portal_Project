<template>
    <div class="container card-body">
        <img alt="Vue logo" class="my-1 mr-2 img-thumbnail" src="../assets/Virox-Logo.png">
        <form id="general-input-form" class="form" style="margin:0 auto; width:70%" @submit.prevent>
            <div class="form-inline form-group row ">
                <div class="form-group col-auto">
                    <label class="my-1 mr-2" for="inputLOTNO"><strong>LOT NO: </strong></label>
                    <input type="input" v-model.trim="record.LOT_NO" class="form-control" id="inputLOTNO">
                </div>
                <div class="form-group col-auto">
                    <label class="my-1 mr-2" for="inputProjectTitle"><strong>Project Title: </strong></label>
                    <input type="text" v-model.trim="record.project_title" class="form-control" id="inputProjectTitle">
                </div>
            </div>
            <div class="form-group form-inline row">
                <div class="form-group col-auto">
                    <label class="my-1 mr-2" for="inputFormulationDate"><strong>Formulation Date: </strong></label>
                    <input type="date" v-model="record.formulation_date" class="form-control" id="inputFormulationDate">
                </div>
                <div class="form-group col-auto">
                    <label class="my-1 mr-2" for="inputPrepDate"><strong>Preparation Date: </strong></label>
                    <input type="date" class="form-control" id="inputPrepDate" v-model="record.preparation_date">
                </div>
            </div>
            <div class="form-group form-inline row">
                <div class="form-group col-auto">
                    <label class="my-1 mr-2" for="inputPrepBy"><strong>Prepared By: </strong></label>
                    <input type="text" v-model.trim="record.prepared_by" class="form-control" id="inputPrepBy">
                </div>
                <div class="form-group col-auto">
                    <label class="my-1 mr-2" for="inputQuantity"><strong>Quantity: </strong></label>
                    <input type="text" v-model.trim="record.quantity" class="form-control" id="inputQuantity">
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
                    </tbody>
                </table>
                <button type="button" @click="addRawMat" class="btn btn-primary">Add Raw Material</button>
            </div>

            <div class="form-group">
                <label for="notesTextArea"><strong>Notes</strong></label>
                <textarea class="form-control" id="notesTextArea" v-model.trim="record.record_notes" rows="3"></textarea>
            </div>
            <div class="form-group">
                <label for="reasonPrepTextArea"><strong>Reason for Preparation</strong></label>
                <textarea class="form-control" id="reasonPrepTextArea" v-model.trim="record.preparation_reason" rows="3"></textarea>
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
                    </tbody>
                </table>
                <button type="button" @click="addH2O2Record" class="btn btn-primary">Add Hydrogen Peroxide Record</button>
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
                    </tbody>
                </table>
                <button type="button" @click="addH2O2StabRecord" class="btn btn-primary">Add Hydrogen Peroxide Stability Record</button>
            </div>
            
            <button type="submit" @click="submit" class="btn btn-success">Save</button>
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
        record: {
            LOT_NO: 11111,
            project_title: "Experiment 5",
            formulation_date: new Date('2020-12-5').toISOString().substring(0,10),
            preparation_date: new Date('2020-10-12').toISOString().substring(0,10),
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
                    time_added: new Date('2020-10-25').toISOString().substring(0,10),
                    rm_notes: "none"
                },
                {
                    rm_id: 2,
                    raw_material: "H2O2 50% EPA",
                    w_w: 21.11,
                    raw_material_lot: " ",
                    AR: 55.44,
                    AD: 44.48,
                    time_added: new Date('2020-10-12').toISOString().substring(0,10),
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
                    date: new Date('2020-10-12').toISOString().substring(0,10),
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
                    date: new Date('2020-10-12').toISOString().substring(0,10),
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
                    date: new Date('2020-10-12').toISOString().substring(0,10),
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
                    date: new Date('2020-10-12').toISOString().substring(0,10),
                    initials: ""
                }
            ]
        },
        columns_rm: ['raw_material', 'w_w', 'raw_material_lot', 'AR', 'AD', 'time_added', 'rm_notes'],
        column_name_rm: ['Raw Material', '%w/w', 'Raw Material lot #', 'AR[gr]', 'AD[gr]', 'Time Added', 'Notes'],
        columns_h202: ['experiment', 'N', 'M', 'vol_change', 'H2O2', 'accepted_range', 'date', 'initials'],
        columns_name_h202: ['Hydrogen Peroxide', 'N', 'Ms [gr]', '∆V (ml)', 'H2O2', 'Accepted Range', 'Date', 'Initials'],
      }
  },
  methods:{
      submit() {
          console.log(this.record);
          alert(this.record.LOT_NO + " " + this.record.project_title + " " + this.record.formulation_date + " " + this.record.prepared_by)
      },
      getDate() {
          var today = new Date()
          var curDate = today.getDate() + "/" + (today.getMonth() + 1) + "/" + today.getFullYear() + " " + today.getHours()  + ":" + today.getMinutes() + ":" + today.getSeconds()
          return curDate;
      },
      addRawMat() {

      },
      addH2O2Record() {

      },
      addH2O2StabRecord() {

      }
  }
}

</script>
