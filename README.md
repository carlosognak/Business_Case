# Business_Case
Objective:
Write an API to return, the country and timezone info
geo locations.
We use node.js / express and google maps APIs. 
Please send us your code in GitHub or GitLab.

# Example Request - 
URL: <baseurl>/api/get_distance_and_time
Type: POST 
Payload: JSON
    {
    start: { lat: 33.58831, lng: -7.61138 },
    end: { lat: 35.6895, lng: 139.69171 },
    units: "metric"
    }
    
    
    
Expected Response for above request -

Payload: JSON
{
start: {
country: "Morocco",
timezone: "GMT+1",
location: { lat: 33.58831, lng: -7.61138 }
},
end: {
country: "Japan",
timezone: "GMT+9",
location: { lat: 35.6895, lng: 139.69171 }
},
distance: {
value: 11593,
units: "km"
},
time_diff: {
value: 8,
units: "hours"
}
}
