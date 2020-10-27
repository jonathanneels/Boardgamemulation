	  var isNextMessageAllowed=true;
  	function SendchatMessage()
		{   
		if(!isNextMessageAllowed){return}
		isNextMessageAllowed=false;
		setTimeout(function(){ 	isNextMessageAllowed=true; }, 1000);
		
		var dateSend= currentDateTime().toString();
	//	var residuDate = dateSend.split(":"); > .replace(":"+residuDate[residuDate.length-1],"") 

		$.get((" /chat"+admincode+"?"+encodeURIComponent("["+dateSend.replace(dateSend.substring(0,2),"")+ "] "+ pname+": "+document.getElementById("chatboxrespons").value)).trim(), function( data ) {
   document.getElementById("chatboxrespons").value = "";
   var convData = decodeURIComponent(data);
 $( "#chatboxdata" ).html( convData );
  		 if(lastScrollHeightchat != $('#chatboxdata')[0].scrollHeight){
                 $('#chatboxdata').scrollTop($('#chatboxdata')[0].scrollHeight); 
				  lastScrollHeightchat= $('#chatboxdata')[0].scrollHeight;
				} });}
				 $("#chatboxrespons").keyup(function(event){
    if(event.keyCode == 13){
       SendchatMessage();
    }
});

function sceneSerializer()
{isPreventPointerAction=true;
try{
  var serializedall = BABYLON.SceneSerializer.Serialize(scene);
serializedall.AdminCode=admincode;
serializedall.posttime=currentDateTime();
serializedall.script=$("#txtaBoardScript").val();
serializedall.info=$("#projectinfo").val();
serializedall.playerturn=   playerturn;
serializedall.maxplayer=              $("#txtPLayerCount").val();
serializedall.gravity= isWithPhysics;
serializedall.endTurnSoundFile= endTurnSoundFile;
serializedall.piecedropSoundFile= piecedropSoundFile;
serializedall.ambientMusicFile= ambientMusicFile;
serializedall.publicserver= $('#chPublicServer').is(':checked');
serializedall.projectname= $("#txtProjectName").val();
serializedall.isCloneOnLoad=  $('#chCloneOnLoad').is(':checked');
serializedall.timesCloneOnLoad=        $("#txtCloneOnLoad").val();


var convDrawings=JSON.stringify(linesListInfo);
serializedall.linesobjectinfo = convDrawings;

isPreventPointerAction=false;

//handle eval custom objects in script. Not posting as a native element.
  for (let f = serializedall.meshes.length-1; f >  0; f--) {
 
 if(serializedall.meshes[f].name.indexOf("icosphere") >-1 || serializedall.meshes[f].id.indexOf("icosphere") >-1  )// this needs to be enhanched for custom eval objects!!! for future reference (see demo d&d_totemic.bgem
 {  
	   serializedall.meshes.splice(f, 1);

 } 
}



return  serializedall;}  catch(err){linesListInfo.pop(); clearDrawing()}

}
function postProject(serializedata) {

if(restoreDefaultScene ==""){
restoreDefaultScene=serializedata;}
try{
  var xhttp = new XMLHttpRequest(); //REF:https://www.w3schools.com/xml/tryit.asp?filename=tryajax_post &  https://stackoverflow.com/questions/39519246/make-xmlhttprequest-post-using-json
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
   //   document.getElementById("demo").innerHTML += this.responseText+"-"+currentDateTime()+"<br>";// added += instead of = 
	//  postProject(serializedata);
	//  downloadScene();no loop!
	countAdminCheckin=timerBeforeAdminCheckin-20;
	console.log("admin checkin");
    }
  };
 
//

  xhttp.open("POST", "postProject", true);
  
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
xhttp.send( serializedata);//{ "email": "hello@user.com", "response": { "name": "Tester" } }));
}  catch(err){linesListInfo.pop();clearDrawing()}
  //xhttp.send();
}

function postMeshes()
{if(isMeshesPostAllowed  ){//|| isAdmin){ 
isMeshesPostAllowed=false;
isPreventPointerAction=true;
try{
    var serializedMeshes =sceneSerializer();//var serializedMeshes = BABYLON.SceneSerializer.Serialize(scene);
  var onlyMeshes=serializedMeshes.meshes;
onlyMeshes[0].AdminCode=admincode;
onlyMeshes[0].posttime=currentDateTime();
onlyMeshes[0].playerId=userId;
//onlyMeshes[0].playerturn=   playerturn;
 var convDrawings=JSON.stringify(linesListInfo);
onlyMeshes[0].linesobjectinfo = convDrawings;
 
 
  var xhttp = new XMLHttpRequest();   
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
	isPreventPointerAction=false;

     }
  };
  
 
  xhttp.open("POST", "postMeshes", true);
  
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
xhttp.send(JSON.stringify(onlyMeshes)); //{ "email": "hello@user.com", "response": { "name": "Tester" } }));
} catch(err){linesListInfo.pop();clearDrawing(); }
setTimeout(function(){ isMeshesPostAllowed=true; }, 500);

return true;
} 
return false;
} 
function getMeshes()
{	       
if(isMeshesGetAllowed ){ 
var handledMeshes=[];
var isWithNewMeshes=false;// newMeshes=[];

	$.get("/activeplayer"+admincode , function( data ) {
	playerturn=decodeURI(data).trim();
			$("#lblPlayerTurn").text("Player turn: " + playerturn  );

//     playerturn = decodeURI(items[0].playerturn); => extra get to be certain.
if(  userId.trim() === playerturn.trim() && !isActivePlayer )//|| (isAdmin &&  $('#chTurnControl').is(':checked')))
{
isActivePlayer=true;
	if(!isYourTurnRegistered)
{  $("#chatboxrespons").val("My turn"); 
SendchatMessage(); isYourTurnRegistered=true;	
	if( endTurnSound !== undefined && endTurnSound !== "undefined" && endTurnSound !== null){ 
			  endTurnSound.stop(); 
				  endTurnSound.play();  
				  }}
} 
else{isActivePlayer=false;}

//scene.physicsEnabled= false;
			$.get("/getMeshes"+admincode, function( data ) {
			
			if(lastGetContent === data){return;}
			else{lastGetContent=data;}
			
			if(data === "NONE"){return;}
var items = JSON.parse(data);




 if(items[0].playerId==userId){return;}



for (i = 0; i < items.length; i++) { 
if(items[i] === undefined || items[i].name === undefined ){continue;}


			 if( items[i].name.indexOf("lines") >-1)
		 {  // handled by itself
   continue;
		 }
	/*	 if (i ==0)
		 { 
 handleLines(items[i]);
 		 continue;
		 }*/

		 if(items[i].name=="wall" ||items[i].name=="board" || items[i].name.indexOf("Torus_")>-1|| items[i].name.indexOf("Box_")>-1|| items[i].name.indexOf("skyBox")>-1)
		 {
		 continue;
		 }
var mesh= scene.getMeshByID(items[i].id);
								if(mesh === null ||mesh === undefined || mesh === "undefined")
								{ isWithNewMeshes=true;//newMeshes.push(items[i]);
								break;;} else{handledMeshes.push(items[i].id);}

if(mesh.position ===items[i].position){continue;}

//console.log(mesh.position +"-"+items[i].position);
//  console.log(mesh.rotationQuaternion +"-"+items[i].rotationQuaternion);
          mesh.position = (new BABYLON.Vector3(items[i].position[0], items[i].position[1],items[i].position[2]));//, 1, BABYLON.Space.local ) ;
		  if(items[i].rotationQuaternion !== undefined  && items[i].position  !== "undefined" && items[i].position  !== null){
  mesh.rotationQuaternion = new BABYLON.Quaternion(items[i].rotationQuaternion[0], items[i].rotationQuaternion[1],items[i].rotationQuaternion[2],items[i].rotationQuaternion[3]);
}
if(items[i].rotation !== undefined && items[i].position  !== "undefined" && items[i].position  !== null) {
  mesh.rotation = new BABYLON.Vector3(items[i].rotation[0], items[i].rotation[1],items[i].rotation[2]);
}
if( items[i].materialId !== undefined){
 mesh.material = scene.getMaterialByID(items[i].materialId);
}
  }

 

// new meshes
if(isWithNewMeshes)
{
    $.get("getproject"+ admincode, function(contents) {   
 var convertedProjectToJson=JSON.parse(contents);
 //console.log( convertedProjectToJson);
 	  	var strScene = JSON.stringify(convertedProjectToJson);  
handleJSONsaveFileByNewObjects(strScene); 
    },'text');
}
			// handleMeshesAfterJSONConvert(newMeshes);

// handle deleted items:
 		 scene.meshes.forEach(function(e) {
		  
		  if(e.name=="wall" ||e.name=="board" || e.name.indexOf("Torus_")>-1|| e.name.indexOf("Box_")>-1|| e.name.indexOf("skyBox")>-1)
		 {
		 return false;
		 }
		 if(!handledMeshes.includes(e.id))
		 {
		  for (g = 0; g <  e.getChildMeshes().length; g++) {
  e.getChildMeshes()[g].setEnabled (false);
 e.getChildMeshes()[g].dispose();
  }
   if(    e.parent !== undefined &&   e.parent !== null &     e.parent !== "undefined"){
     e.parent.setEnabled (false);
e.parent.dispose();
}else{
  e.setEnabled (false);
 e.dispose();}
		 }
		 
});
 handleLines(items[0]);//handled last, while test (in case of faulty lines).

});

});	/*	if(isWithPhysics){

	         scene.enablePhysics(); 
}*/
return true;
}
return false}
function RemovePlayer()
{
if(!isAdmin || playerturn == userId)
{return;}
$.get("/removeplayer"+admincode+"?"+playerturn, function( data ) {
// he/she's gone.
endTurn();
});
}
function endTurn()
{
if(!isAdmin && playerturn != userId)
{ return;
}
var getactiveplayer= userId;
if(isAdmin && playerturn != userId && $('#chTurnControl').is(':checked'))
{
getactiveplayer = $("#lblPlayerTurn").text().replace("Player turn:","").trim();
}
			$.get("/playerturn"+admincode+"?"+getactiveplayer, function( data ) {
			if(data.trim() !== userId.trim()){
			isMeshesGetAllowed=false; countPostGetMeshesAction=0;
	if(!isAdmin || !$('#chTurnControl').is(':checked')){isActivePlayer=false;}
 			     playerturn = decodeURI(data); 
			$("#lblPlayerTurn").text("Player turn: " + playerturn  );
		/*	$("#chatboxrespons").val("My turn");*/

		isMeshesPostAllowed=true;	postMeshes();	
isMeshesGetAllowed=true;
			}
					if(endTurnSound !== undefined && endTurnSound !== "undefined" && endTurnSound !== null){
				  endTurnSound.stop(); 
				  endTurnSound.play();
isYourTurnRegistered=false;
				  }

			});

}


function setScenePublic()
{
if(!isAdmin){return;}
setTimeout(function(){
if( $('#chLaunchServer').is(':checked')){
  var serializedall = sceneSerializer();
  	      var jsdata = JSON.stringify(serializedall);
		  						var isBlokPost=false;
								var isPublicServerChecked=$('#chPublicServer').is(':checked');
			$.get("/PublicGamesList", function( data ) {// get to server required, no respons, is offine nevertheless.
			var gameNameList= data.split("\n");
				  for (var game in gameNameList) {
				  if(!isPublicServerChecked){break;}
 				  if(gameNameList[game.trim()] == $("#txtProjectName").val().trim())
				  {isBlokPost=true;
				  alert("Projectname is already found on the server.\nPlease rename your project if you want to set it public.");
				  break;
				  }  
						} 
 		  
		  
		  
if(  isBlokPost){	     document.getElementById("chLaunchServer").checked = false;return;}
// console.log(serializedall);
 postProject(jsdata);
 endTurn();// if admin is only, he remains starter, otherwise the first other one in the line is.
  postMeshes() ;  
$("#lblOnOffStatus").html(  '<span style="color:green"> Online</span>');
		  });
  } 
  else{$("#lblOnOffStatus").html(  '<span style="color:red"> Offline</span>');}
  
  }, 2000);

}
 function downloadScene() { 

 var projname = $("#txtProjectName").val();//prompt("Projectname?", "Project_"+admincode+".bgem");

if (projname == null || projname.trim() == "") {
projname="Project_"+admincode+".bgem";
}  
 else{
projname=projname.toString().replace(".bgem","") +".bgem";// when player doesn't create a correct extension file.
 } 
 
 
  var serializedall = sceneSerializer(); 
 	      var jsdata = JSON.stringify(serializedall);

// console.log(serializedall);
// postProject(jsdata);
 // postMeshes() ; 
  
      var a = document.createElement("a");//REF: https://stackoverflow.com/questions/34156282/how-do-i-save-json-to-local-text-file
    var file = new Blob([jsdata], {type: 'text/plain'});
    a.href = URL.createObjectURL(file);
    a.download = projname;//"Project_"+admincode+".bgem";
    a.click();
 }
  function  uploadScene() {//REF:https://www.w3schools.com/jsref/tryit.asp?filename=tryjsref_fileupload_files
  
restoreDefaultScene="";

  var x = document.getElementById("btnLoadProject");
   if ('files' in x) {
    if (x.files.length == 0) {
      txt = "Select one or more files.";
    } else {
	var feedbackdata="";
 x.files[0].text().then(t => handleJSONsaveFileByNewObjects(t))//https://stackoverflow.com/questions/14446447/how-to-read-a-local-text-file
	  
	  
	  
    }
  } 
  else {
    if (x.value == "") {
      txt += "Select a file.";
    } else {
      txt += "The files property is not supported by your browser!";
      txt  += "<br>The path of the selected file: " + x.value; // If the browser does not support the files property, it will return the path of the selected file instead. 
    }
  }
updateProjectOnServer();
 }