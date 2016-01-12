var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');

//routes definition

var dbs=require("./routes/dbs");
var wfe=require("./routes/wfe");

var appname="WFESAMPLEAPP01";
var appversion="0.0.0";


//view engine

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');



app.get('/', function (req, res) {
  res.render("index",{
	  appname: appname
  });	
  //res.send('Welcome to '+appname+" "+appversion);
});
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended : false
}));

//route to routes


app.use("/wfe",wfe)

app.get("/adolfo",function(req,res){
	
	
	res.send("adolfo")
	
	
})
//app.use('/users', users);






var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('WFE app listening at port %s', port);
});