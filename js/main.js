function openDriverAction(event, driverAction) {
    
    // Declare all variables
    let i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName('tabcontent');
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = 'none';
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName('tablinks');
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(' active', '');
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(driverAction).style.display = 'block';
    event.className += ' active';

    registerServiceWorker();
}

let offersTab = document.getElementById('defaultOpen'),
    requestsTab = document.getElementById('requests_button'),
    addRideTab = document.getElementById('add_ride_button'),
    allRidesTab = document.getElementById('all_rides_button');

offersTab.addEventListener('click', () => openDriverAction(offersTab, 'view_offers'));
offersTab.click();
requestsTab.addEventListener('click', () => openDriverAction(requestsTab, 'view_requests'));
addRideTab.addEventListener('click', () => openDriverAction(addRideTab, 'add_ride'));
allRidesTab.addEventListener('click', () => openDriverAction(allRidesTab, 'all_rides'));

function registerServiceWorker(){
    if(!navigator.serviceWorker) return;

    navigator.serviceWorker.register('./sw.js').then(() => {
        console.log('Registration worked!');
    }).catch(() => {
        console.log('Registration failed!');
    });
}

// Get the header
let header = document.getElementById('myMenu');

// Get the offset position of the navbar
let sticky = header.offsetTop;


// When the user scrolls the page, execute myFunction 
window.onscroll = () => {
    // Add the sticky class to the header when you reach its scroll position. Remove "sticky" when you leave the scroll position
    if (window.pageYOffset > sticky) {
        header.classList.add('sticky');
    } else {
        header.classList.remove('sticky');
    }
};