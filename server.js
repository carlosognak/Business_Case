const axios = require('axios');
const express = require('express')

const app = express()
const bodyparse = require('body-parser');
const { json } = require('express');
const port = 8000
const key = 'AIzaSyBrRh0NjtrSopoOrG-4_W3OP0nmzSDQK-M'
app.use(bodyparse.json())

app.post('/api/get_distance_and_time', async(req,res,next)=> {
    try {
        var lat1 = req.body.start[0].lat
        var lon1 = req.body.start[0].lng
        var lat2 = req.body.end[0].lat
        var lon2 = req.body.end[0].lng

        var done1 = null
        var done2 = null
        var done3 = null
        var done4 = null
        // To convert degrees to radian
        function degTorad(degrees) {
          return degrees * Math.PI / 180;
        };
        // To get distance in Km
        function getDistance(lat1, lon1, lat2, lon2) {
          var earthRadium = 6371

          var dLat = degTorad(lat2-lat1)
          var dLon = degTorad(lon2-lon1)

          lat1 = degTorad(lat1)
          lat2 = degTorad(lat2)

          var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
          
          var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
          
          return earthRadium * c
        }

        // Here i call the function to get the distance in km
        var dist = getDistance(lat1,lon1,lat2,lon2)

        // to get the country
        await axios.all([
          axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat1},${lon1}&result_type=country&key=${key}`),
          axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat2},${lon2}&result_type=country&key=${key}`),
          axios.get(`https://maps.googleapis.com/maps/api/timezone/json?location=${lat1},${lon1}&timestamp=1331161200&key=${key}`),
          axios.get(`https://maps.googleapis.com/maps/api/timezone/json?location=${lat2},${lon2}&timestamp=1331161200&key=${key}`)
        ])
        .then(async([data1,data2,data3,data4]) => {
           done1 =  data1
           done2 =  data2
           done3 =  data3
           done4 =  data4

        })
        // build my result json value  
        var o = {} // empty Object
        var key1 = 'start';
        var key2 = 'end'
        var key3 = 'distance'
        var key4 = 'time_diff'
        
         //calcul the timezome
         var tz1 = done3.data.rawOffset/3600
         if(tz1<0){
           tz1 = "GMT"+tz1
         }else{
           tz1 = "GMT+"+tz1
         }
        var d1 = {
          country:  done1.data["results"][0].formatted_address,
          timezone: tz1 ,
          location: req.body.start
        };
        //calcul the timezome
        var tz2 = done4.data.rawOffset/3600
        if(tz2<0){
          tz2 ="GMT"+tz2
        }else{
          tz2 = "GMT+"+tz2
        }
        var d2 = {
          country:  done2.data["results"][0].formatted_address,
          timezone: tz2,
          location: req.body.end
        };
        var d3 = {
          value: parseInt(dist.toFixed(0)),
          units: req.body.units
        };
        var d4 = {
          value: (done4.data.rawOffset/3600)-(done3.data.rawOffset/3600),
          units: "hours"
        };

        o[key1]= d1
        o[key2]= d2
        o[key3]= d3
        o[key4]= d4
        res.json(o)
        
    } catch (error) {
        next(error) 
    }
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))