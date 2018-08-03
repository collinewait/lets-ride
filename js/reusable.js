import {myCookie} from './cookie_file.js';
import {Alert} from './dialogs.js';

export const siteHeaders = {
    'Accept': 'application/json',
    'Content-type': 'application/json',
    'auth_token': myCookie.getCookie('auth_token')
};

export function goToLogin(){
    return window.location.href = 'login.html';
}

export function showNoNetwork(loadingSpinner){
    loadingSpinner.style.display = 'none';
    Alert.render('No network, Please try again.');
}

export function noContentFound(loadingSpinner, contentDiv, messageDisplay, message){
    loadingSpinner.style.display = 'none';
    contentDiv.style.display = 'none';
    messageDisplay.innerHTML = message;
    messageDisplay.style.display = 'block';
}

export function displayTableData(loadingSpinner, tBodyId, tableRows, tableDiv){
    loadingSpinner.style.display = 'none';
    document.getElementById(tBodyId).innerHTML = tableRows;
    tableDiv.style.display = 'block';
}

export function displayNumberTakenAndGiven(divId, message){
    document.getElementById(divId).innerHTML = message;
}
