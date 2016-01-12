var express = require('express');
var router = express.Router();
var dbs=require("../routes/dbs");
var dbname="s_object";


/*
router.get("/create/:object",function(req,res){
	
	var object=req.params.object;
	var body={};
	if (req.body) body=req.body;
	
	var username="dummyuser";
	var role="dummyrole";
	
	if (body.username) username=body.username;
	if (body.role) role=body.role;
	
	var dbname="objects";  //default dbname for wfe objects
	
	if (body.dbname) dbname=body.dbname; 
	
	var newobj={};
	var today = new Date();
	
	var initStatus="";
	
	getObject(object,function(data){

		
		console.log("got wfe object: ");
		console.log(data)
		
		//get initialstatus
		
		var statuses=data.statuses;
		
		
		for (var i=0; i<statuses.length; i++){
			
			var st=statuses[i];
			var iStatus="";
			if (st.initial){
				if (st.initial) {
				   iStatus=stringToBoolean(st.initial);
				   if (iStatus) initialStatus=st.name;
					
				}
				
			}
			
		}
		
		newobj.wfe={
		s_object: object,
		date_created: today.julian(),
		date_modified: today.julian(),
		user_created: username,
		role_created: role,
		user_modified: username,
		role_modified: role,
		status: initialStatus
		
		
		}
	
		createObject(newobj,function(data) {
		
			res.send(data)
			//res.send("object with id "+data.id+" created");
		
		})
		
		
	})
	
	
	
	
})*/


router.post("/doaction/:actionid",function(req,res){
    
	var newstatus=req.params.actionid;
	var body=req.body;
	console.log(body);
	
	//var b=JSON.parse(body);
	var b=body;
	//console.log(b);
	var wfe=b.wfe;
	var doc=b.doc;
	
	var today = new Date();
	
	var newobj={
		doc: doc,
		wfe: wfe
	}
	newobj.wfe.status=newstatus;
	newobj.wfe.date_modified=today.julian();
	newobj.wfe.user_modified="dummyuser";
	newobj.wfe.role_modified="dummyrole";
	
	getObject(newobj.wfe.s_object,function(err,data){
	
	   console.log(err)
	   console.log(data)
	  if (err){
		  res.send(err);
		  return console.log(err)
		  
	  }
	  newobj.wfe.actions=getAvailableActions(data,newobj.wfe.status,newobj.wfe.role_modified);
	
	  res.render("bopage",{data: newobj});
	  //res.send(newobj);
	});
	//res.send("executing action from "+body.status+" to "+body.nextstatus);
	
	
})

router.get("/open/stoka",function(req,res){
	
	res.send("stok")
	
})

router.get("/open/:object",function(req,res){
	
	var username="dummyuser";
	var role="dummyrole";
	
	
	var docid="";
	var object=req.params.object;
	if (req.query.id) docid=req.query.id;   
	var isAuthorized=true;
	
	
	
	
	if (docid.trim()=="")   //if docid=blank it's a new object
	
	 if (isAuthorized) {   //if user is authorized to create this object
	 
	 var initialStatus="";
	 getObject(object,function(err,data){   //get wfe object properties
		 //console.log("got wfe object "+object+" structure");
		 //console.log(data);
		 
		if (err){
			
			
			
		} 
		 
		if (data.statuses){ 
		 
		 var statuses=data.statuses;
		
		
		for (var i=0; i<statuses.length; i++){
			
			var st=statuses[i];
			var iStatus="";
			if (st.initial){
				if (st.initial) {
				   iStatus=stringToBoolean(st.initial);
				   if (iStatus) initialStatus=st.name;
					
				}
				
			}
			
		}
		
		var today = new Date();
		var newobj={};
		
		newobj.wfe={
		s_object: object,
		date_created: today.julian(),
		date_modified: today.julian(),
		user_created: username,
		role_created: role,
		user_modified: username,
		role_modified: role,
		status: initialStatus
		
		
		}
		
		newobj.wfe.actions=getAvailableActions(data,newobj.wfe.status,newobj.wfe.role_modified);
		
		//console.log("availableactions: ")
		//console.log(newobj.wfe.actions)
		
		//console.log("");
		//console.log(newobj);
	
		/*createObject(newobj,function(data) {
		
			res.send(data)
			//res.send("object with id "+data.id+" created");
		
		})*/
		
	
	
	
	     //res.render("bopage",{data: newobj});
		 res.send(newobj);
		
        } else {
			
	     res.render("notfound"); 		
			
		}		
		 
	});
	
	
	} else 
	{
     res.render("notauthorized");		
		
	}
	
	
})

router.get('/list/:object/:what', function(req, res) {
	
	var format="json";
	var object=req.params.object.toLowerCase().trim();
	var what=req.params.what.toLowerCase().trim();
	if (req.query.format) format=req.query.format;
	
	var retrows=[];
	
	dbs.list(dbname,function(data){
	 
        for (var i=0; i<data.rows.length; i++)
		{
		 var row=data.rows[i];
         var doc=row.doc;
         var objname=doc.name.toLowerCase().trim();
         if (objname==object){
			
            var whatarr=doc[what];
			
			for (var j=0; j<whatarr.length; j++){
				var wrow=whatarr[j];
				//console.log("pushing "+wrow)
				retrows.push(wrow);
				
			}
			 
			 
		 } 		 
			
		}
		
		//res.send(retrows);
		res.send(transform_res(retrows,format));
		
	})
   
});


function createObject(obj,callback){
	
	console.log("createObject");
	callback(obj);
	
}

function getObject(object,callback){  //gets WFE object structure
	
	console.log("getObject "+object);
	var retvalue={};
	
	dbs.list(dbname,function(err,data){
		
		if (err){
			console.log("error !");
		   callback(err,null);
		   return console.log(err.message);
		}
	 
        for (var i=0; i<data.rows.length; i++)
		{
		 var row=data.rows[i];
         var doc=row.doc;
         var objname=doc.name.toLowerCase().trim();
         if (objname==object){
			
            retvalue=doc;
			
			
			 
			 
		 } 		 
			
		}
		
		//res.send(retrows);
		callback(null,retvalue);
		
	})
	
	
}

function getAvailableActions(wfe,status,role) {
	
	console.log("getavailableactions from status "+status+" for role "+role);
	//console.log(wfe);
	var actions=wfe.actions;
	var availableactions=[];
	
	for (var i=0; i<actions.length; i++) {
		
		var act=actions[i];
		//console.log(act);
		var startstatus=act.startstatus;
		if (startstatus==status){
			
			availableactions.push(act);
		}
	}
	
	
	//console.log("availableactions:")
	//console.log(availableactions)
	
	return availableactions;
	
}


function transform_res(data,format){
	var retvalue="";
	var headers=[];
	
	if (format=="json") retvalue=data;
	
	if (format=="html") {
		var htm=""
		for (var i=0; i<data.length; i++){
			htm+="<tr>";
			var row=data[i];
			var doc=row;
			//console.log(doc);
			for (var key in doc){
				htm+="<td>"+doc[key]+"</td>"
				if (i==0) headers.push(key);
				
			}
			htm+="</tr>"
			
			
		}
		var headhtm="<tr>"
		for (var x=0; x<headers.length; x++){
			headhtm+="<th><b>"+headers[x]+"</b></th>"
		}
		headhtm+="</tr>"
		htm="<table border=1 width=100%>"+headhtm+htm+"</table>";
		retvalue=htm;
		
		
	}
	
	console.log(retvalue)
	return retvalue;
}


Date.prototype.julian = function() {
   var yyyy = this.getFullYear().toString();
   var MM = (this.getMonth()+1).toString(); // getMonth() is zero-based
   var dd  = this.getDate().toString();
   var hh = this.getHours();
   var mm = this.getMinutes();
   var ss = this.getSeconds();
   
   var n=2;
   var jdate=yyyy+padZeros(MM,n)+padZeros(dd,n)+padZeros(hh,n)+padZeros(mm,n)+padZeros(ss,n);
   console.log("jdate: "+jdate);
   
   //var jdate=yyyy+(MM[1]?MM:"0"+MM[0]) + (dd[1]?dd:"0"+dd[0]) + (hh[1]?hh:"0"+hh[0]) + (mm[1]?mm:"0"+mm[0]) + (ss[1]?ss:"0"+ss[0]);
   return jdate; // padding
  };
  
  
 function padZeros(theNumber, max) {
    var numStr = String(theNumber);
    
    while ( numStr.length < max) {
        numStr = '0' + numStr;
    }
    
    return numStr;
}
	
	 function getNormalDate(data)
	{
	 //data=data.substring(0,8);
	 //console.log("getNormalDate "+data);
	 var retvalue=data.substring(6)+data.substring(3,5)+data.substring(0,2);
	 
	 return retvalue;
	
	}
 
function stringToBoolean(string){
    switch(string.toLowerCase().trim()){
        case "true": case "yes": case "1": return true;
        case "false": case "no": case "0": case null: return false;
        default: return Boolean(string);
    }
}


module.exports = router;