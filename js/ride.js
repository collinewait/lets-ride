import {siteHeaders, goToLogin, showNoNetwork, noContentFound, displayTableData, displayNumberTakenAndGiven} from './reusable.js';
import {Alert} from './dialogs.js';

document.getElementById('add_ride_form').addEventListener('submit', addRide);
let loader = document.getElementById('loader');

function addRide(e){
    loader.style.display = 'block';
    e.preventDefault();

    let departure_location = document.getElementById('departure_location').value,
        destination = document.getElementById('destination').value,
        departure_date = document.getElementById('departure_date').value,
        departure_time = document.getElementById('departure_time').value,
        number_of_passengers = parseInt(document.getElementById('no_of_passengers').value);

    let data = {departure_location, destination, departure_date, departure_time,
        number_of_passengers};

    fetch('https://carpooling-ride-my-way.herokuapp.com/api/v1/rides/', {
        method: 'POST',
        headers: siteHeaders,
        cache: 'no-cache',
        body: JSON.stringify(data)
    })
        .then((res) => res.json())
        .then((data) => {
            if(data.message === 'Ride added successfully'){
                loader.style.display = 'none';
                Alert.render('Ride added successfully');
            }else if(data.message === 'Ride already exists'){
                loader.style.display = 'none';
                Alert.render('Ride already exists');
            }else{
                goToLogin();
            }
        } )
        .catch(() => {
            showNoNetwork(loader);
        });

}

document.getElementById('all_rides_button').addEventListener('click', getRidesTaken);

function getRidesTaken(){
    loader.style.display = 'block';
    fetch('https://carpooling-ride-my-way.herokuapp.com/api/v1/user/requests', {
        headers: siteHeaders
    })
        .then((res) => res.json())
        .then((data) => {
            const message = 'Requests retrieved successfully';
            if(data.message === message){
                let numberOfRidesTakenMessage = null;
                if(data.requests.length > 0){
                    let ridesTaken = [];
                    data.requests.forEach(ride => {
                        ridesTaken.push(
                            {
                                'driver_name': ride.driver_name,
                                'ride_id': ride.ride_id,
                                'taken_given': 'Taken'
                            });
                    });
                    numberOfRidesTakenMessage = `<p>Number of Rides Taken: ${data.requests.length}</p>`;
                    displayNumberTakenAndGiven('no_of_rides_taken', numberOfRidesTakenMessage);
                    getRidesGiven(ridesTaken);
                }else{
                    numberOfRidesTakenMessage = '<p>Number of Rides Taken: 0</p>';
                    displayNumberTakenAndGiven('no_of_rides_taken', numberOfRidesTakenMessage);
                    getRidesGiven([]);
                }
            }else{
                goToLogin();
            }
            
        })
        .catch(() => {
            showNoNetwork(loader);
        });
}

function getRidesGiven(ridesTaken){
    let ridedsMessage = document.getElementById('rides_taken_given_message');
    let ridesDiv =  document.getElementById('taken_given_div');
    fetch('https://carpooling-ride-my-way.herokuapp.com/api/v1/user/rides', {
        headers: siteHeaders
    })
        .then((res) => res.json())
        .then((data) => {
            const message = 'results retrieved successfully';
            if(data.message === message){
                let numberOfRidesGivenMessage = null;
                if(data.rides.length > 0){
                    let ridesGiven = [];
                    data.rides.forEach(ride => {
                        ridesGiven.push({
                            'driver_name': ride.driver_name,
                            'ride_id': ride.ride_id,
                            'taken_given': 'Given'
                        });
                    });
                    let rides = [...ridesTaken, ...ridesGiven];
                    numberOfRidesGivenMessage = `<p>Number of Rides Given: ${data.rides.length}</p>`;
                    displayNumberTakenAndGiven('no_of_rides_given', numberOfRidesGivenMessage); 
                    displayToUser(rides);
                }else if(ridesTaken.length > 0){
                    numberOfRidesGivenMessage = '<p>Number of Rides Given: 0</p>';
                    displayNumberTakenAndGiven('no_of_rides_given', numberOfRidesGivenMessage); 
                    displayToUser(ridesTaken);
                }else{
                    numberOfRidesGivenMessage = '<p>Number of Rides Given: 0</p>';
                    displayNumberTakenAndGiven('no_of_rides_given', numberOfRidesGivenMessage); 
                    noContentFound(loader, ridesDiv, ridedsMessage, 'You have not Given or Taken rides yet');
                }
            }else{
                goToLogin();
            }
            
        })
        .catch(() => {
            showNoNetwork(loader);
        });
}

function displayToUser(ridesTakenAndGiven){
    let ridesDiv =  document.getElementById('taken_given_div');
    let tableData = '';
    ridesTakenAndGiven.forEach(ride => {
        tableData += `
        <tr>
            <td>${ride.driver_name}</td>
            <td>${ride.ride_id}</td>
            <td>${ride.taken_given}</td>
        </tr>
        `;
    });
    displayTableData(loader, 'rides_tbody', tableData, ridesDiv);
}

document.getElementById('requests_button').addEventListener('click', getUserRideOffers);

function getUserRideOffers(){
    loader.style.display = 'block';
    let requestMessage = document.getElementById('ride_request_message');
    let requestsDiv = document.getElementById('requests_div');
    requestMessage.style.display = 'none'; 
    fetch('https://carpooling-ride-my-way.herokuapp.com/api/v1/user/rides', {
        headers: siteHeaders
    })
        .then((res) => res.json())
        .then((data) => {
            const message = 'results retrieved successfully';
            if(data.message === message){
                if(data.rides.length > 0){
                    let rideOptions = '';
                    let rideNumber = 0;
                    data.rides.forEach(ride => {
                        rideOptions += `
                            <option value=${ride.ride_id}>Ride ${rideNumber += 1}</option>
                        `;
                    });
                    displayTableData(loader, 'ride_offer', rideOptions, requestsDiv);
                    getRideRequests();
                    
                }else{
                    const displayMessage = 'You have not offered rides yet. Requests can not be made.';
                    noContentFound(loader, requestsDiv, requestMessage, displayMessage);
                }
            }else{
                goToLogin();
            }
            
        })
        .catch(() => {
            showNoNetwork(loader);
        });
}

let selectElement = document.getElementById('ride_offer');
selectElement.addEventListener('change', getRideRequests);

function getRideRequests(){
    loader.style.display = 'block';
    let requestMessage = document.getElementById('ride_request_message');
    let requestsDiv = document.getElementById('requests_div');
    requestMessage.style.display = 'none'; 
    fetch(`https://carpooling-ride-my-way.herokuapp.com/api/v1/users/rides/${selectElement.value}/requests`, {
        headers: siteHeaders
    })
        .then((res) => res.json())
        .then((data) => {
            const message = 'result retrieved successfully';
            if(data.message === message){
                if(data.requests.length > 0){
                    let RequestRows = '';
                    data.requests.forEach(request => {
                        RequestRows += `
                            <tr>
                                <td>${request.passenger_name}</td>
                                <td>${request.request_status}</td>
                                <td>
                                    <button type="button" data-acceptid="${request.request_id}" data-acceptrid = "${request.ride_id}" class="accept">Accept</button>
                                </td>
                                <td>
                                    <button type="button" data-rejectid="${request.request_id}" data-rejectrid = "${request.ride_id}" class="reject">Reject</button>
                                </td>
                            </tr>
                        `;
                    });
                    displayTableData(loader, 'ride_requests', RequestRows, requestsDiv);
                    activateButtons('accept');
                    activateButtons('reject');
                }else{
                    noContentFound(loader, requestsDiv, requestMessage, 'No requests made on the ride yet.');
                }
            }else{
                goToLogin();
            }
        })
        .catch(() => {
            showNoNetwork(loader);
        });
}

function acceptRjectRequest(rideId, requestId, data){
    loader.style.display = 'block';
    fetch(`https://carpooling-ride-my-way.herokuapp.com/api/v1/users/rides/${rideId}/requests/${requestId}`, {
        method: 'PUT',
        headers: siteHeaders,
        cache: 'no-cache',
        body: JSON.stringify(data)
    })
        .then((res) => res.json())
        .then(result => {
            if(result){
                if(data.request_status === 'Accepted'){
                    loader.style.display = 'none';
                    Alert.render('Request accepted successfully');
                }else{
                    loader.style.display = 'none';
                    Alert.render('Request rejected successfully');
                }
            }else{
                goToLogin();
            }
            
        })
        .catch(() => {
            showNoNetwork(loader);
        });
}

function activateButtons(buttonAction){
    const acceptRejectButtons = document.getElementsByClassName(buttonAction);
    let data = {};
    [].forEach.call(acceptRejectButtons, (acceptRejectButton) => {
        acceptRejectButton.addEventListener('click', () => {
            if (acceptRejectButton.dataset.acceptid){
                data = {
                    'request_status': 'Accepted'
                };
                acceptRjectRequest(acceptRejectButton.dataset.acceptrid, acceptRejectButton.dataset.acceptid, data);
            }else{
                data = {
                    'request_status': 'Rejected'
                };
                acceptRjectRequest(acceptRejectButton.dataset.rejectrid, acceptRejectButton.dataset.rejectid, data);
            }
        });
    });
}

document.getElementById('log_out').addEventListener('click', logoutUser);

function logoutUser(e){
    e.preventDefault();
    loader.style.display = 'block';
    fetch('https://carpooling-ride-my-way.herokuapp.com/api/v1/users/logout', {
        method: 'POST',
        headers: siteHeaders,
        cache: 'no-cache'
    })
        .then((res) => res.json())
        .then(data => {
            const message = 'You are logged out successfully';
            if(data.message === message){
                loader.style.display = 'none';
                goToLogin();
            }else{
                loader.style.display = 'none';
                goToLogin();
            }
            
        })
        .catch(() => {
            showNoNetwork(loader);
        });

}
