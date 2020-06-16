'use strict'
const { ipcRenderer } = require('electron');

// Define a new component called todo-item
Vue.component('record-item', {
    props: ['records'],
    template: '<li>{{ record.project_title }}</li>'
})
  
var showRecordList = new Vue({
  el: '#recordList',
  data: {
    records: this.test
  },
  
  methods: {
    test: function() {
      return [
        { record_id: 0, project_title: 'Vegetables' },
        { record_id: 1, project_title: 'Cheese' },
        { record_id: 2, project_title: 'Whatever else humans are supposed to eat' }
      ]
      /* console.log("testing");
      ipcRenderer.on('show-records', function(event, records) {
        console.log(records);
      }); */
    }
  }
});
