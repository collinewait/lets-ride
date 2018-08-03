import {goToLogin} from './reusable.js';
class CustomAlert{

    render(dialog_message){
        let dialogoverlay = document.getElementById('dialogoverlay');
        let dialogbox = document.getElementById('dialogbox');
        dialogoverlay.style.display = 'block';
        dialogbox.style.display = 'block';
        document.getElementById('dialogboxhead').innerHTML = 'Acknowledge this message';
        document.getElementById('dialogboxbody').innerHTML = dialog_message;
        const button = document.createElement('button');
        button.id = 'ok_button';
        button.innerHTML = 'OK';
        button.addEventListener('click', () => Alert.ok(dialog_message));
        document.getElementById('dialogboxfoot').appendChild(button);
    }

    ok(dialog_message){
        let button = document.getElementById('ok_button');
        let message = 'You have successfully registered. You can login';
        if(dialog_message === message){
            goToLogin();
        }else{
            button.parentNode.removeChild(button);
            document.getElementById('dialogbox').style.display = 'none';
            document.getElementById('dialogoverlay').style.display = 'none';
        }
        
    }

}
export let Alert = new CustomAlert();