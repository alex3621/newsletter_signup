const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

//allows use of static/custom stylesheets of your own on a server
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.listen(process.env.PORT || 3000, function(){
    console.log("server running on 3000");
});

app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res){
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;


    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };
    
    const jsonString = JSON.stringify(data);

    const url= "https://us21.api.mailchimp.com/3.0/lists/7b98ea9f72"

    const options = {
        method: "POST",
        auth: "alexlin:092f92b7b56ef96e0719a72e2eddd610-us21"
    }

    const request = https.request(url, options, function(response){
        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        }
        else {
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", function(data){
            console.log(JSON.parse(data));
        })
    })

    request.write(jsonString);
    request.end();

});

app.post("/failure", function(req, res){
    res.redirect("/");
});

//audience id
//7b98ea9f72
//API key
//092f92b7b56ef96e0719a72e2eddd610-us21