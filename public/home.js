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
      window.location.href = "Feast-Infect.html";
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

    //check data fields are filled
    if(checkDataFields() == false) { return; } 
        
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    
    //login user in firebase
    firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;

        if(errorCode == 'auth/wrong-password') {
          alert("Invalid Password");
        }else {

          //attempt to create new user
          firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            if (errorCode == 'auth/weak-password') {
              alert('Password provided is too weak');
            }
            else if (errorCode == 'auth/email-already-in-use') {
              alert('E-mail is already registered to user');
            }
  
          });
        }
    });
  
}