import {Alert} from './dialogs.js';
import {myCookie} from './cookie_file.js';
import {showNoNetwork} from './reusable.js';
document.getElementById('login_user').addEventListener('submit', loginUser);
let loader = document.getElementById('loader');

function loginUser(e){
    e.preventDefault();

    loader.style.display = 'block';
    let email_address = document.getElementById('email_address').value;
    let password = document.getElementById('password').value;
    const data = {email_address, password};

    fetch('https://carpooling-ride-my-way.herokuapp.com/api/v1/auth/login/', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-type': 'application/json'
        },
        cache: 'no-cache',
        body: JSON.stringify(data)
    })
        .then((res) => res.json())
        .then(result => {
            if(result.status === 'success'){
                myCookie.setCookie('auth_token', result.auth_token, 2);
                window.location.href = 'index.html';
            }
            else{
                loader.style.display = 'none';
                Alert.render('Incorrect email address or password');
            }
            
        })
        .catch(() => {
            showNoNetwork(loader);
        });
}
