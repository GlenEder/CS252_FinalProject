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
console.log(firebase);


// Get a reference to the database service
var database = firebase.database();


function login() {
    let name = document.getElementById("username");
    let pass = document.getElementById("password");

    let nullFields = false;

    //check for empty fields
    if(name.value == "" || pass.value == "") {
        document.getElementById("loginError").innerHTML = "All Fields Must Be Filled";
    }
    else {
        console.log("Username: " + name.value + ", Password: " + pass.value);
    }
}