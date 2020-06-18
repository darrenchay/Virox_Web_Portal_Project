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
            quantity: 400
        }
      }
  },
  methods:{
      submit() {
          console.log(this.record);
          alert(this.record.LOT_NO + " " + this.record.project_title + " " + this.record.formulation_date + " " + this.record.prepared_by)
      }
  }
}

</script>
