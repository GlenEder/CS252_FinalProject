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


//handle user logged in
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      window.alert("User logged in");
    } else {
      // No user is signed in.
    }
  });


function checkDataFields() {
    //check for empty fields
    let email = document.getElementById("email");
    let pass = document.getElementById("password");
    if(email.value == "" || pass.value == "") {
        window.alert("All entry fields must be filled");
        return false;
    }

    return true;
}

function login() {
    let email = document.getElementById("email");
    let pass = document.getElementById("password");

    //check data fields are filled
    if(checkDataFields() == false) { return; } 
        
    //create user in firebase
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;

        window.alert("Error creating user in firebase");
        console.log(errorCode);
        console.log(errorMessage);
        
      });
}