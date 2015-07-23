/* server.js */
var express = require("express");
var session = require("express-session");
var bodyParser = require("body-parser");
var app = express();

//setting view path
app.set("views",__dirname + "/views");
//use ejs engine serve html view
app.engine("html",require("ejs").renderFile);

//session 
app.use(session({secret:"mysecret"}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

var mySession;

app.get("/",function(req, res){
	mySession = req.session;
	if(mySession.login){
		res.redirect("/admin");
	} else{
		res.render("index.html");
	}
});

app.post("/login",function(req,res){
	mySession = req.session;
	mySession.login = req.body.login;
	res.end("success");
});

app.get("/admin",function(req,res){
	mySession = req.session;
	if(mySession.login){
		res.write("<h1>Hi,"+mySession.login+"</h1>");
		res.end("<a href='/logout'>Logout</a>");
	} else {
		res.write("<h1> Please Login...</h1>");
		res.end("<a href='/login'>Login</a>");
	}
});

app.get("/logout",function (req,res) {
	req.session.destroy(function(e){
		if(e){
			console.log(e);
		}else{
			res.redirect("/");
		}
	});	
});

app.listen(8080,function(){
	console.log("sart on 8080");
});

/*index.html*/
<html>
<head>
<title>Session Demo with Express 4.* </title>
<script src="https://code.jquery.com/jquery-2.1.4.js"></script> 
<script>
$(document).ready(function(){
    var login,pass;
    $("#submit").click(function(){
        login=$("#login").val();        
        $.post("http://localhost:8080/login",{login:login,pass:pass},function(data){        
            if(data==='success')           
            {
                window.location.href="/admin";
            }
        });
    });
});
</script>
</head>
<body>
<input type="text" size="40" placeholder="Type your login" id="login"><br />
<input type="button" value="Submit" id="submit">
</body>
</html>
