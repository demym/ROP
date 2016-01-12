var rooturl="http://localhost:3000"

var wfeobject={};

refreshProjects();

function refreshProjects(){
	
	$.ajax({
                  type: "GET",
                  url: rooturl+"/wfe/list/ropproject",
                  cache: false
                 
                  
                })
				.done(function(data){
					
					console.log(data);
					var html = new EJS({url: 'tpl/ropprojects.ejs'}).render(data.rows);
					$("#page_projects #projects").empty().append(html);
					$("#page_projects #ulprojects").listview();
					
				})
				.fail(function(data){
					
				});
}


function openProject(id) {
    
	$.mobile.loading( 'show');
	
	var moreurl="/new";
	if (id) moreurl="/"+id;
	
	$.ajax({
                  type: "GET",
                  url: rooturl+"/wfe/open/ropproject"+moreurl,
                  cache: false,
                  dataType: "json"
                  
                }).done(function(data){
					
					if (data.error) {
						if (data.error=="true"){
							
							alert("failed")
					$.mobile.loading( 'hide')
					return;
						}
						
					}
					
					console.log(data)
					nest="";
					nestObject(data);
					wfeobject=data;
					
					nest="<div data-role='collapsible' class='colla'><h2>Data</h2><ul id='ulobject' class='ui-listview' data-inset='true'>"+nest+"</ul></div>";
					
					
					
					
					$("#sobject #object").empty().append(nest);
					$("#sobject #object ul").listview();
					$("#sobject #object .colla").collapsible();
					
					var html = new EJS({url: 'tpl/wfe.ejs'}).render(data.wfe);
					$("#sobject #object").append(html)
					html = new EJS({url: 'tpl/ropproject.ejs'}).render(data);
					$("#sobject #wfedoc").empty().append(html).trigger('create');
					console.log(data.doc);
					//alert(nest);
					
					$.mobile.loading( 'hide')
					$.mobile.changePage("#sobject");

				})
				.fail(function(data){
					alert("failed")
					$.mobile.loading( 'hide')
				});
	
	
}


function doAction(object,endstatus){
	console.log(wfeobject)
	$("form.wfedata input").each(function(i){
		var $this=$(this);
		
		if (!wfeobject.doc){
			
			wfeobject.doc={}
		}
		
		wfeobject.doc[$this.attr("id")]=$this.val();
		
		
	})
	$.mobile.loading( 'show');
	
	$.ajax({
                  type: "POST",
                  url: rooturl+"/wfe/doaction/"+endstatus,
                  cache: false,
                  dataType: "json",
				  data: {
					  sdata: JSON.stringify(wfeobject)
					  
				  }
                  
                }).done(function(data){
					
					
					if (data.error) {
						if (data.error=="true"){
							
							alert("failed")
					$.mobile.loading( 'hide')
					return;
						}
						
					}
					
					wfeobject=data;
						nest="";
					nestObject(data);
					
					
					nest="<div data-role='collapsible' class='colla'><h2>Data</h2><ul id='ulobject' class='ui-listview' data-inset='true'>"+nest+"</ul></div>";
					$("#object").empty().append(nest);
					$("#object ul").listview();
					$("#object .colla").collapsible();
					
					var html = new EJS({url: 'tpl/wfe.ejs'}).render(data.wfe);
					$("#object").append(html)
					$.mobile.loading( 'hide')
	
				})
				.fail(function(data){
					alert("failed")
					$.mobile.loading( 'hide')
				});
	
}

var nest=""
function nestObject(obj) {
	
	for (var k in obj) {
			  
			  console.log(k+" isarray: "+toString.call(obj[k]))
			  
			  var done=false;
			  if (toString.call(obj[k]) === '[object Object]')
			  {
				 //element.append("--"+k+"<br>")	
				 
				 nest+="<div data-role='collapsible' style='background: yellow' class='colla'><h2>"+k+"</h2><ul style='border:0px solid black' data-inset='true'>";
				 //nest+="<ion-item style='background: yellow' onclick='toggleGroup(this)'>"+k+"</ion-item><ion-item class='item'><ion-list>"
				 nestObject(obj[k]);
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
				 nestObject(obj[k]);
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