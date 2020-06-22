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
            <button type="submit" @click="submit" class="btn btn-primary">Save</button>
        </form>
        <table class="table">
            <thead>
                <tr>
                    <th v-for="(column, index) in column_name" :key="index">{{column}}</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="record in record.raw_materials_list" :key="record.rm_id">
                    <td v-for="(data, index) in columns" :key="index">{{record[data]}}</td>
                </tr>
            </tbody>
        </table>

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
            ]
        },
        columns: ['raw_material', 'w_w', 'raw_material_lot', 'AR', 'AD', 'time_added', 'rm_notes'],
        column_name: ['Raw Material', '%w/w', 'Raw Material lot #', 'AR[gr]', 'AD[gr]', 'Time Added', 'Notes']
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
      }
  }
}

</script>
