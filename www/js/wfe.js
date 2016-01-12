

function getField(obj){
 var fname=obj.id;
 var retvalue="";
 if (data.doc[fname]) retvalue=data.doc[fname]; 
 return retvalue;
}

function createObject(){
 
   var url="wfe/open/sobject";
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

}

var rooturl="http://localhost:3000";

function doAction(toStatus)
{
  //document.getElementById("nextstatus").value=toStatus;
  var url="/wfe/doaction/"+toStatus;
  document.wfe.action=rooturl+url;
  document.wfe.method="POST";
 // document.wfe.submit();
  
 
    var wfe = $("form#wfe").serializeObject();
	console.log(wfe);
	 var doc = $("input[wfe-data]").serializeObject();
	 var fd={
	   doc: doc,
	   wfe: wfe
	   
	 }
	console.log(fd);
    $.ajax({
        url: url,
		contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(fd),
		//dataType: "json",
        type: 'POST',
        success: function (data) {
		   alert("success")
		   
		  
		   
		   var html=data;
           $("div.content").html(html);
		   
        }
    });
}

jQuery.fn.serializeObject = function()
{
   var o = {};
   var a = this.serializeArray();
   $.each(a, function() {
       if (o[this.name]) {
           if (!o[this.name].push) {
               o[this.name] = [o[this.name]];
           }
           o[this.name].push(this.value || '');
       } else {
           o[this.name] = this.value || '';
       }
   });
   return o;
};
