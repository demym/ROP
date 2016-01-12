angular.module('starter.services', [])



.factory('globals', function($http,$ionicLoading,$ionicPopup,$ionicActionSheet) { 
   var globalsService={};
   
   globalsService.rooturl="http://localhost:3000";
   //globalsService.rooturl="http://192.168.1.107:3000";
   
   globalsService.loadingShow = function() {
    $ionicLoading.show({
      template: 'Loading...'
    });
  };
  globalsService.loadingHide = function(){
    $ionicLoading.hide();
  };
  
  globalsService.toast=function(text){
	  $ionicLoading.show({ template: text, noBackdrop: true, duration: 1000 });
	  
  }
  
  
  globalsService.showConfirm = function(text,yes,no) {
   var confirmPopup = $ionicPopup.confirm({
     title: 'Confirm',
     template: text
   });

   confirmPopup.then(function(res) {
     if(res) {
       yes();
     } else {
       no();
     }
   });
 };

 
  globalsService.showActionConfirm=function() {
	  
	 var hideSheet = $ionicActionSheet.show({
     buttons: [
       { text: '<b>Share</b> This' },
       { text: 'Move' }
     ],
     destructiveText: 'Delete',
     titleText: 'Modify your album',
     cancelText: 'Cancel',
     cancel: function() {
          // add cancel code..
        },
     buttonClicked: function(index) {
       return true;
     }
   });
  
	  
	  
  };
 
   return globalsService; 
})
.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'img/ben.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'img/max.png'
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'img/adam.jpg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'img/perry.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'img/mike.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
})
.factory('wfe', function(globals,$http) {
	
	var wfeService = {};
 wfeService.createObject=function(objname,callback){
 
   var url=globals.rooturl+"/wfe/open/"+objname+"/new";
   
   $http.get(url)
            .success(function(data) {
				
				console.log(data);
				callback(data);
				
	  
			})
			.error(function(data){
				
				console.log(data);
				callback(data);
				
	  
			})

}

wfeService.openObject=function(objname,id,callback){
 
   var url=globals.rooturl+"/wfe/open/"+objname+"/"+id;
   
   $http.get(url)
            .success(function(data) {
				
				console.log(data);
				callback(data);
				
	  
			})
			.error(function(data){
				
				console.log(data);
				callback(data);
				
	  
			})

}

wfeService.listObjects=function(objname,callback){
 
   var url=globals.rooturl+"/wfe/list/"+objname;
   
   $http.get(url)
            .success(function(data) {
				
				console.log(data);
				callback(data);
				
	  
			})
			.error(function(data){
				
				console.log(data);
				callback(data);
				
	  
			})
   /*
   $.ajax({
        url: url,
        cache: false,
        processData: false,
        contentType: false,
        type: 'GET',
        success: function (data) {
		   $("div.content").html(data);
            // do something with the result
        }
    });
    */
}

	
	
	return wfeService;
});
