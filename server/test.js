const axios = require('axios');
const baseURL = "http://localhost:3000/API";
(function () {
    let JSONData = {
        //tableName: 'EXPERIMENT_RECORDS',
        //tableName: 'RAW_MATERIALS',
        tableName: 'HYDROGEN_PEROXIDE_DATA',
        /* identifiers: {
            experiment_record_id: 4
        }, */
        /* data: [{
            record_id: 1,
            lot_no: 1628,
            project_title: "new testing update",
            formulation_date: "2020-12-5",
            preparation_date: "2020-12-5",
            prepared_by: "Not Jack",
            quantity: 300,
            notes: "Take 100g and Test stability in 54C for 2 weeks\nTake 100g and Test stability in 50C for 35 days\nProvide 100g to Sean/Cesar to conduct corrosion testing on Brass.",
            preparation_reason: "To test improved F/T performance and reduce corrosion of the RTU formula while making it fall under our newly filed patents",
            observations: "",
            total_percentage_w: 100.0,
            total_ar: 355.6,
            total_ad: "355.84",
            date_created: "2020-12-5",
            date_updated: "2020-12-5"
        }] */
        /* data: [{
            raw_material_id: 1,
            experiment_record_id: 4,
            raw_material_name: "updated chemical name",
            percentage_w: 55.11,
            raw_material_lot: '1412-G',
            ar: 34.44,
            ad: 57.48,
            time_added: "2020-12-5",
            notes: "updated test",
            date_created: "2020-12-5",
            date_updated: "2020-12-5"
        }, {
            raw_material_id: 29,
            experiment_record_id: 4,
            raw_material_name: "update test L63",
            percentage_w: 22.22,
            raw_material_lot: "404-F",
            ar: 44.44,
            ad: 44.48,
            time_added: "2020-12-5",
            notes: "new updated test",
            date_created: "2020-12-5",
            date_updated: "2020-12-5"
        }] */
        data: [{
            hp_id: 8,
            //hp_type: 1,
            //experiment_record_id: 4,
            experiment_name: "UPDATE",
            n: 0.1000,
            m: null,
            vol_change: null,
            h2o2: 0.1000,
            ph: 0.870,
            accepted_range: "~ 0.8%",
            date: "2020-12-5",
            initials: "D.C",
            date_created: "2020-12-5",
            date_updated: "2020-12-5"
        },
        {
            hp_id: 9,
            //hp_type: 1,
            //experiment_record_id: 4,
            experiment_name: "UPDATE 2",
            n: 0.1000,
            m: null,
            vol_change: null,
            h2o2: 0.1000,
            ph: 0.870,
            accepted_range: "~ 0.8%",
            date: "2020-12-5",
            initials: "D.C",
            date_created: "2020-12-5",
            date_updated: "2020-12-5"
        }]
    }
    /* axios.get(baseURL + '/addData', {
        params: {
            data: JSON.stringify(JSONData)
        }
    }).then(response => {
        console.log(response.data);
        //postRequest(baseURL + "/updateExperimentRecord", this.record); //Update date update field
    }).catch((error) => {
        console.log(error.message);
    }); */

    axios({
        method: "post",
        url: baseURL + '/updateData',
        data: {
          data: JSONData
        }
      }).then(response => {
        console.log(response.data);
        return response.data;
      }).catch(error => {
          console.log(error.message);
      });
})();