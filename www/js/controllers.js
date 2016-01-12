angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})



.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('HomepageCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('RopprojectsCtrl', function($scope, $stateParams, Chats,wfe,$state,globals) {
  
  $scope.projects=[];
  
  $scope.refreshProjects=function() {
	  
	   globals.loadingShow();
	   wfe.listObjects("ropproject",function(data){
		   
		   $scope.projects=data.rows;
		   globals.loadingHide();
		   
	   }) 
	  
  }
  
  $scope.openProject=function(id){
	   globals.loadingShow();
	  wfe.openObject("ropproject",id,function(data){
		   
		    globals.loadingHide();
		   $state.go("app.sobject",{data: data})
		   
		   
	   })
	  
	  
  }
})

.controller('AppCtrl', function($scope,wfe,$state,$location,globals) {
	
	$scope.createWfeObject=function() {
		
		globals.loadingShow();
		wfe.createObject("sobject",function(data){
			console.log(data);
			
			if (!data.doc) {
				var doc={};
				data.doc=doc;
			}
			$state.go("app.sobject",{data: data})
			
			globals.loadingHide();
			//$location.path('/wfe/sobject')
			
		})
		
		
	}
	
	
})
.controller('WfeCtrl', function($scope,wfe,$stateParams,globals,$http,$ionicPopup) {
	
	$scope.baseUrl="lib/ion-tree-list/"
	$scope.showdiv=true;
	
	console.log("WfeCtrl") 
	console.log($stateParams.data)
    $scope.alldata=$stateParams.data;
	$scope.wfedata=$stateParams.data.wfe;
	$scope.docdata=$stateParams.data.doc;
	doNestWfe($scope.alldata)
	
	$("div.item-divider").css("cursor","pointer")
	$("div.item-text-wrap").hide();
	

	
	/*$scope.formdata={
		status: $scope.wfedata.status
	}*/
	
	$scope.formdata=$scope.alldata;
	
	
	  $scope.performAction=function(actionid,callback) {
		  
	
		  console.log($scope)
		  
		  var url=globals.rooturl+"/wfe/doaction/"+actionid;
		  var wfe = $scope.alldata.wfe;

	        var fd={
	         doc: $scope.alldata.doc,
	         wfe: $scope.alldata.wfe
	   
	       }
		   globals.loadingShow();
		  $http.post(url,{
			  sdata: JSON.stringify($scope.alldata)
				  
			  
		  })
		  .success(function(data){
			  $scope.formdata=data;
			  globals.loadingHide();  
	          doNestWfe(data); 
			  if (callback) callback(data)
			  globals.toast("Action performed");	  
			  
			 /* $('#element').empty().jsonView(data);
		  $('#element ul').removeClass().css("border","1px solid black").collapsible();*/
	
	//$('#element ul').collapsible("expand");
		  })
		  .error(function(data){
			  globals.loadingHide();  
			  if (callback) callback(data)
			  
		  })
	  }
	
	
	$scope.addVlan=function(){
		if (!$scope.alldata.doc.CustomerInfrastructure) $scope.alldata.doc.CustomerInfrastructure={
			Network: {
				networktype: "",
				vlan: []
			}
		};
		
		var today=new Date();
		var newvlan={
			xid: today.timestamp(),
			portgroup: "pg",
			name: "name",
			address: "address"
			
		}
		
		$scope.alldata.doc.CustomerInfrastructure.Network.vlan.push(newvlan);
		globals.toast("VLAN added")
		
	}
	
 $scope.deleteVlan=function(xid){
	 
	 
  //globals.showActionConfirm();

 
	
  globals.showConfirm("Are you sure you want to delete this VLAN ?",function(){
	   var vlan=$scope.alldata.doc.CustomerInfrastructure.Network.vlan;
		
		
		
		for (var i=0; i<vlan.length; i++){
			var x=vlan[i].xid;
			if (x==xid) vlan.splice(i,1);
			
			
		}
		
		
		
	
		globals.toast("VLAN deleted")
		colog(vlan.length)
	  
  },function() {
	  
  });
		
	
	
		
	
		
		
	}
	


	

	
	
	$scope.addVirtualMachine=function(){
		if (!$scope.alldata.doc.CustomerInfrastructure) $scope.alldata.doc.CustomerInfrastructure={
			Network: {
				networktype: "",
				vlan: []
			},
			RestoreToVirtual: {
				VirtualMachine: []
			}
		};
		
		if (!$scope.alldata.doc.CustomerInfrastructure.RestoreToVirtual) $scope.alldata.doc.CustomerInfrastructure.RestoreToVirtual={
			VirtualMachine: []
		};
		
		var today=new Date();
		var newvm={
			name: today.timestamp(),
			cpu: 1,
			ram: "4"
		}
		
		$scope.alldata.doc.CustomerInfrastructure.RestoreToVirtual.VirtualMachine.push(newvm);
		globals.toast("Virtual Machine added");
		
	}

	
	
})
.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});

var nest=""
/*
function nestObject(obj) {
	
	for (var k in obj) {
			  
			  console.log(k+" isarray: "+toString.call(obj[k]))
			  
			  
			  if (toString.call(obj[k]) === '[object Object]')
			  {
				 //element.append("--"+k+"<br>")	
				 
				 //nest+="<li style='background: yellow'>"+k+"<ul style='border:1px solid black'>";
				 nest+="<ion-item style='background: yellow' onclick='toggleGroup(this)'>"+k+"</ion-item><ion-item class='item'><ion-list>"
				 nestObject(obj[k]);
				 nest+="</ion-list></ion-item>"
                // element.append("<demytree  items='subitem'></demytree>") 				 
				  
			  } else {
				  
				  //nest+="<li style='background: cyan'>"+k+": "+obj[k]+"</li>";
				  nest+="<ion-item class='item'><label>"+k+"</label><input type=text placeholder='"+k+"' value='"+obj[k]+"' /></ion-item>";
				  //element.append(k+"-"+scope.items[k]+"<br>")	
				  
			  }
			 
			  
			 
			 
		 }	
			
	
	
	
}
*/
function nestObjectJQM(obj) {
	
	console.log("nestobjectjqm")
	for (var k in obj) {
			  
			  console.log(k+" isarray: "+toString.call(obj[k]))
			  
			  var done=false;
			  if (toString.call(obj[k]) === '[object Object]')
			  {
				 //element.append("--"+k+"<br>")	
				 
				 nest+="<div data-role='collapsible' style='background: yellow' class='colla'><h2>"+k+"</h2><ul style='border:0px solid black' data-inset='true'>";
				 //nest+="<ion-item style='background: yellow' onclick='toggleGroup(this)'>"+k+"</ion-item><ion-item class='item'><ion-list>"
				 nestObjectJQM(obj[k]);
				 nest+="</ul></div>"
				 //nest+="</ion-list></ion-item>"
                // element.append("<demytree  items='subitem'></demytree>") 				 
				  done=true;
			  }

              if (toString.call(obj[k]) === '[object Array]')	

			  {
				 //element.append("--"+k+"<br>")	
				 
				 nest+="<div data-role='collapsible' style='background: yellow' class='colla'><h2>"+k+"</h2><ul style='border:0px solid black' data-inset='true'>";
				 //nest+="<ion-item style='background: yellow' onclick='toggleGroup(this)'>"+k+"</ion-item><ion-item class='item'><ion-list>"
				 nestObjectJQM(obj[k]);
				 nest+="</ul></div>"
				 //nest+="</ion-list></ion-item>"
                // element.append("<demytree  items='subitem'></demytree>") 				 
				  done=true;
			  }				  

			  if (!done)
			  {
				  
				  nest+="<li style='background: cyan'><label>"+k+"</label><input type=text value='"+obj[k]+"'/></li>";
				  //nest+="<ion-item class='item'><label>"+k+"</label><input type=text placeholder='"+k+"' value='"+obj[k]+"' /></ion-item>";
				  //element.append(k+"-"+scope.items[k]+"<br>")	
				  
			  }
			 
			  
			 
			 
		 }	
			
	
	
	
}


function toggleGroup(obj) {
	
	$(obj).next("ion-item").toggle();
	
	
	
	
}

function toggleCard(obj){
	var ediv=$(obj).closest("div.card");
	var cdiv=ediv.find("div.item-text-wrap");
	cdiv.toggle();
	
}

function doNestWfe(data) {
	 nest="";
	nestObjectJQM(data);
	nest="<div class='colla'><h2>ObjectView</h2><ul>"+nest+"</ul></div>";
	//console.log(nest)
	$("#object").html(nest);
	$("#object .colla").bind("click",function() {
		$(this).find("ul").toggle();
		
	})
	
}



Date.prototype.timestamp = function() {
   var yyyy = this.getFullYear().toString();
   var MM = (this.getMonth()+1).toString(); // getMonth() is zero-based
   var dd  = this.getDate().toString();
   var hh = this.getHours();
   var mm = this.getMinutes();
   var ss = this.getSeconds();
   var ms = this.getMilliseconds();
   
   var n=2;
   var jdate=yyyy+padZeros(MM,n)+padZeros(dd,n)+padZeros(hh,n)+padZeros(mm,n)+padZeros(ss,n)+padZeros(ms,3);
   console.log("jdate: "+jdate);
   
   //var jdate=yyyy+(MM[1]?MM:"0"+MM[0]) + (dd[1]?dd:"0"+dd[0]) + (hh[1]?hh:"0"+hh[0]) + (mm[1]?mm:"0"+mm[0]) + (ss[1]?ss:"0"+ss[0]);
   return jdate; // padding
  };
  

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


var debugActive=true;
function colog(txt){
	if (!debugActive) return;
	console.log(txt);
	
}
