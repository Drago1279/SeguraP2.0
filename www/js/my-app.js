// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

var app = new Framework7({
    // App root element
    root: '#app',
    // App Name
    name: 'My App',
    // App id
    id: 'com.myapp.test',
    // Enable swipe panel
    panel: {
      swipe: 'left',
    },
    // Add default routes
    routes: [
      {path: '/index/',         url:'index.html',},
      {path: '/registro/',      url:'registro.html',},
      {path: '/ayuda/',         url:'ayuda.html',},
      {path: '/Seguridad/',     url:'Seguridad.html',},
      {path: '/Usuario/',       url:'Usuario.html',},
      {path: '/Ingreso/',       url:'Ingreso.html',},
    ]
    // ... other parameters
  });

var mainView = app.views.create('.view-main');
var db = firebase.firestore();
var coleccionUsuarios = db.collection("usuarios");
var coleccionSeguridad = db.collection('Seguridad');
var ConsoleGeo = "";
var GeolocaIntervalo = "";
var map, platform;
var pos, latitud, longitud;


// Handle Cordova Device Ready Event
$$(document).on('deviceready', function() {
    console.log("Iniciando SeguraP");
    consultarLocalStorage();
});

// Option 1. Using one 'page:init' handler for all pages
$$(document).on('page:init', function (e) {
    // Do something here when page loaded and initialized
    console.log(e);
})

// Option 2. Using live 'page:init' event handlers for each page
$$(document).on('page:init', '.page[data-name="index"]', function (e) {
    console.log("");
    clearInterval(ConsoleGeo);
    console.log('Deteniendo console.log Geo ubic')
    clearInterval(GeolocaIntervalo);
    console.log('Deteniendo Geo Localizador')
    $$('#Ajustes').on('click', fnAjustes);
    $$('#BotonUsuario').on('click', fnUsuario);
    $$('#BotonSeguridad').on('click', fnSeguridad);
})
$$(document).on('page:init', '.page[data-name="registro"]', function (e) {
    console.log('Redireccionando a Registro');
    clearInterval(ConsoleGeo);
    console.log('Deteniendo console.log Geo ubic')
    clearInterval(GeolocaIntervalo);
    console.log('Deteniendo Geo Localizador')
    $$('#loginEnviar').on('click', fnloginOnly);
    $$('.SeleccionUsSeg').on('click', function(){
        console.log('Activando TU')
        $$('.SeguraP').on('click', function () {
            ususeg = this.id
            c= ususeg[1]
            d= ususeg[2]
            if (d == 1) {
                console.log("d = "+d);
                $$('#C00').val("Usuario");
            } else {
                console.log('d = '+d);
                $$('#C00').val("Seguridad");
            }
        });
    })
})
$$(document).on('page:init', '.page[data-name="ayuda"]', function (e) {
    console.log('Redireccionando a PANIC');
    fnGeolocalizacion()
    fnSMS()
    $$('#VuelvePantAnt').on('click', fnVueltaUsuario);
    $$('#AceptarVuelta').on('click', fnAceptarVuelta);
    GeolocaIntervalo = setInterval(function() {fnGeolocalizacion();},10000)
    ConsoleGeo = setInterval(function() {console.log("Geo ubic.");}, 10000)
})
$$(document).on('page:init', '.page[data-name="Seguridad"]', function (e) {
    console.log('Redireccionando a Seguridad');
    $$('#CerrarUsuario').on('click', fnCerrarUsuario)
})
$$(document).on('page:init', '.page[data-name="Usuario"]', function (e) {
    console.log('Redireccionando Usuario');
    $$('#BotonPanico').on('click', fnPanico);
    $$('#VuelvePantAnt2').on('click', fnVueltaAIndex);
    clearInterval(ConsoleGeo);
    console.log('Deteniendo console.log Geo ubic')
    clearInterval(GeolocaIntervalo);
    console.log('Deteniendo Geo Localizador')
})
$$(document).on('page:init', '.page[data-name="Ingreso"]', function (e) {
    console.log('Redireccionando a Ingreso');
    $$('#VuelveInicio').on('click', fnVuelveInicio)
    $$('#AceptarUsuario').on('click', fnAceptarUsu)
    clearInterval(ConsoleGeo);
    console.log('Deteniendo console.log Geo ubic')
    clearInterval(GeolocaIntervalo);
    console.log('Deteniendo Geo Localizador')
})





var storage = window.localStorage;
var email = "drago1279@hotmail.com";
var clave = "123456";
var usuario = { "email": "", "clave": "" };
var seguridad = { "email": "", "clave": "" };
var usuarioLocal, claveLocal;
storage.setItem("email", email)
storage.setItem("clave", clave)

function fnUsuario() {
    console.log('Iniciando Usuario');
    mainView.router.navigate('/Usuario/');
}
function fnSeguridad() {
    console.log('Iniciando Seguridad');
    mainView.router.navigate('/Ingreso/');
}
function consultarLocalStorage() {
    console.log('Consultando Usuario');

    email = storage.getItem("email");
    clave = storage.getItem("clave");

    if (email!="" && clave!="") {
        LoguearseConLocal(email, clave);
        mainView.router.navigate('/Usuario/');
    } else {
        mainView.router.navigate('/registro/');
        // no tengo datos en local storage. HACER ALGO...
    }
}
function LoguearseConLocal(u,c ){
        console.log("loguearseconlocal, u+c"+u+c)
        //Se declara la variable huboError (bandera)
        var huboError = 0;     
        firebase.auth().signInWithEmailAndPassword(u, c)
            .catch(function(error){
    //Si hubo algun error, ponemos un valor referenciable en la variable huboError
                huboError = 1;
                var errorCode = error.code;
                var errorMessage = error.message;
                console.error(errorMessage);
                console.log(errorCode);
            })
            .then(function(){   
    //En caso de que esté correcto el inicio de sesión y no haya errores, se dirige a la siguiente página
                if(huboError == 0){
                    // login ok....
                    console.log("login ok");
                }
            }); 
    };
function fnAceptarUsu() {
    console.log('Ingresar a Seguridad');
    var emailDelUser = $$('#lNombre2').val();
    var passDelUser = $$('#loginPass').val();

    firebase.auth().signInWithEmailAndPassword(emailDelUser, passDelUser)
      .then((userCredential) => {
        // Signed in
        var user = userCredential.user;
        console.log("Bienvenid@!!! " + emailDelUser);
        mainView.router.navigate('/Seguridad/');
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.error(errorCode);
        console.error(errorMessage);
    });
}
function fnAjustes() {
    console.log("Iniciando ajustes")
    mainView.router.navigate('/registro/');
}
function fnPanico() {
    console.log('Boton Panico');
    mainView.router.navigate('/ayuda/');
}
function fnSMS() {
    console.log("Iniciando SMS")
    var app = {
    sendSms: function() {
        var number = 3471516205 /*document.getElementById('nCelular').value.toString();*/ /* iOS: ensure number is actually a string */
        var message = "HELP";
        console.log("number=" + number + ", message= " + message);
    //CONFIGURATION
        var options = {
            replaceLineBreaks: false, // true to replace \n by a new line, false by default
            android: {
                intent: 'INTENT'  // send SMS with the native android SMS messaging
                //intent: '' // send SMS without opening any other app, require : android.permission.SEND_SMS and android.permission.READ_PHONE_STATE
            }
        };
        var success = function () { alert('Message sent successfully'); };
        var error = function (e) { alert('Message Failed:' + e); };
        sms.send(number, message, options, success, error);
    }
    };
}
function fnGeolocalizacion() {
    console.log('Iniciando Geoloca');
    var onSuccess = function(position) {
        // $$('#mapContainer').html();
        alert('Latitude: '          + position.coords.latitude          + '\n' +
              'Longitude: '         + position.coords.longitude         + '\n' +
              'Altitude: '          + position.coords.altitude          + '\n' +
              'Accuracy: '          + position.coords.accuracy          + '\n' +
              'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
              'Heading: '           + position.coords.heading           + '\n' +
              'Speed: '             + position.coords.speed             + '\n' +
              'Timestamp: '         + position.timestamp                + '\n');
    };
    // onError Callback receives a PositionError object
    function onError(error) {
        alert('code: '    + error.code    + '\n' +
              'message: ' + error.message + '\n');
    }
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
}
function fnVueltaUsuario() {
    console.log("Abrir popover para Volver");
}
function fnVueltaAIndex() {
    console.log('Vuelve a index')
    mainView.router.navigate('/index/');
}
function fnVuelveInicio() {
    console.log('Vuelve a index')
    mainView.router.navigate('/index/');
}
function fnAceptarVuelta() {
    console.log('Aceptar');
    if (clave == $$('#passVuelta').val()) {
        console.log('Cerrar popover y pasar a index');
        $$('#BotonInv').click();
        mainView.router.navigate('/Usuario/');
        } else {
        $$('#errorPass').html("Error Contraseña").addClass('text-color-red text-align-center');
        setTimeout(function() {$$('#BotonInv').click();},2000)
    }
}
function fnEnviar() {
    console.log('Login');
}
function fnCerrarUsuario() {
    console.log('Cerrar Usuario');
    //var logOut = () => {   //function fnCerrarUsuario() {
    //    var user = firebase.auth().currentUser;
    //    if (user) {
            firebase.auth().signOut()
                .then(() => {
                    console.log('Cerrar sesión');
                    mainView.router.navigate('/Ingreso/');
                })
                .catch((error) => {
                    console.log('error '+error);
                });
    //    } else {
    //        console.log('Error' + user);
    //    }
//    }
}
function fnloginOnly() {
/*  tomar los datos del formulario
    servicio de auth
        --> base de datos
            --> gracias!*/
    nombre = $$('#lNombre').val();
    apellido = $$('#lApellido').val();
    email = $$('#lEmail').val();
    password =  $$('#lPass').val();
    valPass = $$('#valPass').val();
    direccion = $$('#nDireccion').val();
    celular = $$('#nCelular').val();
    tipoUsuario = $$('#C00').val();
    if (tipoUsuario == "Usuario") {
        if (password == valPass) {
        console.log("Coleccion Usuarios  "+nombre, apellido, email, celular, direccion, tipoUsuario);
            firebase.auth().createUserWithEmailAndPassword(email, password)
              .then((userCredential) => {
                // Usuario creado. Agregar datos a la base de datos
                var datosUsuario = {
                    nombre: nombre,
                    apellido: apellido,
                    direccion: direccion,
                    celular: celular,
                    tipoUsuario: tipoUsuario,
                }
                coleccionUsuarios.doc(email).set(datosUsuario)
                    .then(function() {     // .then((docRef) => {
                      console.log("BD OK!");
                    mainView.router.navigate('/Usuario/');
                    })
                    .catch(function(error) {     // .catch((error) => {
                      console.log("Error: " + error);
                    });
            })
              .catch((error) => {   // error en AUTH
                var errorCode = error.code;
                var errorMessage = error.message;

                console.error(errorCode);
                console.error(errorMessage);

                if (errorCode == "auth/email-already-in-use") {
                    console.error("El mail ya esta usado");
                    $$('#msgError').html("El mail ya esta en uso");
                }
              });
        } else { console.error("Contraseña Desigual");
                $$('#msgErrorCelu').html("Por favor coloque una contraseña igual");
        }
    } else {
        if (password == valPass) {
        console.log("Coleccion Seguridad  "+nombre, apellido, email, celular, direccion, tipoUsuario);
            firebase.auth().createUserWithEmailAndPassword(email, password)
              .then((userCredential) => {
                // Usuario creado. Agregar datos a la base de datos
                var datosSeguridad = {
                    nombre: nombre,
                    apellido: apellido,
                    direccion: direccion,
                    celular: celular,
                    tipoUsuario: tipoUsuario,
                }
                coleccionSeguridad.doc(email).set(datosSeguridad)
                    .then(function() {     // .then((docRef) => {
                      console.log("BD OK!");
                    mainView.router.navigate('/index/');
                    })
                    .catch(function(error) {     // .catch((error) => {
                      console.log("Error: " + error);
                    });
            })
              .catch((error) => {   // error en AUTH
                var errorCode = error.code;
                var errorMessage = error.message;

                console.error(errorCode);
                console.error(errorMessage);

                if (errorCode == "auth/email-already-in-use") {
                    console.error("El mail ya esta usado");
                    $$('#msgError').html("El mail ya esta en uso");
                }
              });
        } else { console.error("Contraseña Desigual");
                $$('#msgErrorCelu').html("Por favor coloque una contraseña igual");
        }
    }
}