var admin = require("firebase-admin");

var serviceAccount = require("../myprojectjs-41393-firebase-adminsdk-83y2f-cb5a81d704.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://myprojectjs-41393.firebaseio.com",
});

var db = admin.database();
module.exports = db;