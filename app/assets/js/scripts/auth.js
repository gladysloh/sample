var firebaseConfig = {
  apiKey: "AIzaSyBs4LMLTdHcsbuO0CmvsYBOPZKbFvSG4Jg",
  authDomain: "quposandbox.firebaseapp.com",
  databaseURL: "https://quposandbox.firebaseio.com",
  projectId: "quposandbox",
  storageBucket: "quposandbox.appspot.com",
  messagingSenderId: "162273818315",
  appId: "1:162273818315:web:c093b27bc0b6faa9f6cd4e",
  measurementId: "G-8GE2B2Z14N"
};

firebase.initializeApp(firebaseConfig);

var auth = firebase.auth();
var db = firebase.firestore();

var CRM = db.collection("CRM");
let dbEmail = '',
  dbUid = '';

firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    dbUid = user.uid;
    dbEmail = user.email;
    console.log("Active User: " + dbUid);

    var loggedUser = db.collection("CRM").doc(dbUid);

    loggedUser.get().then(function (doc) {
      if (doc.exists) {
        var role = doc.data().role;
        console.log(role);

        if(role == 1){
          $(".nav-em").css("display", "block");
          localStorage.setItem('userRole', '1');

        }else if(role == 0){
          $(".nav-em").css("display", "block");
          $(".nav-admin").css("display", "block");
          localStorage.setItem('userRole', '0');
        }
      
      } else {
        console.log("No such document!");
        signOut();
      }
    }).catch(function (error) {
      console.log("Error getting document:", error);
    });

    $("#login").remove();
    $("#current-user-name").html("User Name");
    $("#current-user-email").html(dbEmail);

  } else {
    // No user is signed in.
    console.log("Not signed In ");
    $(".login-function").remove();
    $("#authModal").modal()

  }
});

function signUp() {
  var username = document.getElementById('userName').value;
  var email = document.getElementById('email').value;
  var password = document.getElementById('password').value;
  var confirmPassword = document.getElementById('confirmPassword').value;

  if (email.length < 4) {
    document.getElementById("error-msg-signup").innerHTML = 'Please enter an email address.';
    return;
  }
  if (password.length < 4) {
    document.getElementById("error-msg-signup").innerHTML = 'Password too short, please enter a password.';
    return;
  }
  if (password != confirmPassword) {
    document.getElementById("error-msg-signup").innerHTML = 'Passwords are not the same';
    return;
  }

  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(function (cred) {
      var userid = cred.user.uid;
      alert("Signed up: " + email);

      db.collection("CRM").doc(userid)
        .set({
          email: email,
          password: password,
          username: username,
          role: 1
        })
        .then(function () {
          console.log("Document written with ID: ", userid);
          window.location.href = 'index.html';
        })
        .catch(function (error) {
          alert("Error adding document: ", error);
        });

    }).catch(function (error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;

      if (errorCode == 'auth/weak-password') {
        document.getElementById("error-msg-signup").innerHTML = 'Password is too weak, at least 6 characters';

      } else if (errorCode == "auth/email-already-in-use") {
        document.getElementById("error-msg-signup").innerHTML = 'Email already in use.';
      }
      else {
        document.getElementById("error-msg-signup").innerHTML = errorMessage;
      }
      console.log(error);
    });
}

function signIn() {
  if (firebase.auth().currentUser) {
    firebase.auth().signOut();
  } else {
    var userEmail = document.getElementById("email").value;
    var userPassword = document.getElementById("password").value;

    if (userEmail.length < 4) {
      document.getElementById("error-msg").innerHTML = 'Please enter an email address.';
      //document.getElementById("email").style.borderColor = "red";
      return;
    }
    if (userPassword.length < 4) {
      document.getElementById("error-msg").innerHTML = 'Please enter a password.';
      //document.getElementById("password").style.borderColor = "red";
      return;
    }
    // Sign in with email and pass.
    firebase.auth().signInWithEmailAndPassword(userEmail, userPassword)
      .then(function () {
        window.location.href = 'index.html';

      }).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode === 'auth/wrong-password') {
          //alert('Wrong password.');
          document.getElementById("error-msg").innerHTML = 'Wrong Password';
        } else if (errorCode === "auth/user-not-found") {
          //alert('No User Found');
          document.getElementById("error-msg").innerHTML = 'No user found';
        } else {
          alert(errorMessage);
        }
        console.log(error);
      });
    // [END authwithemail]
  }
}

function signOut() {
  auth.signOut();
  localStorage.removeItem('userRole');
}

function goToLogin(a) {
  var locateLogin = 'login.html';
  locateaLogin = a.getAttribute("login");
  location.href = locateLogin;
}

function getUserDetails(uid) {
  console.log("user, " + uid);
  var docRef = CRM.doc(uid);
  docRef.get().then(function (doc) {
    if (doc.exists) {
      console.log("Document data:", doc.data());
    } else {

      console.log("No such document!");
    }
  }).catch(function (error) {
    console.log("Error getting document:", error);
  });
}

