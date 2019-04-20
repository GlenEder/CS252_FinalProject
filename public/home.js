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


function checkDataFields() {
    //check for empty fields
    let name = document.getElementById("username");
    let pass = document.getElementById("password");
    if(name.value == "" || pass.value == "") {
        window.alert("All entry fields must be filled");
        return false;
    }

    return true;
}

function login() {
    let name = document.getElementById("username");
    let pass = document.getElementById("password");

    //check data fields are filled
    if(checkDataFields() == false) { return; } 
        
    console.log("Loggin in: "+ name.value);

    //get users from database
    let users = database.ref("users");
    let keys = Object.keys(users);

    for(var i = 0; i < keys.length; i++) {

    }

}