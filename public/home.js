// Initialize Firebase
var config = {
    apiKey: "AIzaSyBaDeefOtZNxxFXvacoXIMBGZB_S8a_HIc",
    authDomain: "feastinfest.firebaseapp.com",
    databaseURL: "https://feastinfest.firebaseio.com",
    projectId: "feastinfest",
    storageBucket: "",
    messagingSenderId: "118729444601"
};
firebase.initializeApp(config);


// Get a reference to the database service
let database = firebase.database();
let ref = database.ref('users');


function login() {
    let name = document.getElementById("username");
    let pass = document.getElementById("password");
    let error = document.getElementById("loginError");

    let nullFields = false;

    //check for empty fields
    if(name.value == "" || pass.value == "") {
        document.getElementById("loginError").innerHTML = "All Fields Must Be Filled";
    }
    else {
        console.log("Username: " + name.value + ", Password: " + pass.value);

        let userExists = false;

        //get user data
        ref.on('value', function(data) {

        
            let users = data.val();
            if(users != null) {
                let keys = Object.keys(users);

                //check for username already in database
                for(var i = 0; i < keys.length; i++) {
                    let k = keys[i];
                    let currName = users[k].name;
                    if(currName == name.value) {
                        userExists = true;

                        //if password is correct, login
                        if(users[k].password == pass.value) {
                            users[k].online = true;
                        }

                        break;
                    }
                }
            }

            if(userExists == false) {

                console.log("Creating new user");
    
                let data = {
                    name: name.value,
                    password: pass.value,
                    online: true
                }
                ref.push(data);
            }

        }, function(err) {
            console.log(err);
        })

        
    }
}