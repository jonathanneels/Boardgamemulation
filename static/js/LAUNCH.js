	//	if(isWithPhysics){
	        scene.enablePhysics(); //} for walls
 

/////////////////////:///important running and starting: //////
	$( document ).ready(function() {
	groundObject();  

			$.get(" /directoryitems/images/board", function( data ) {
var boards = data.split("<br>");
for (i = 0; i < boards.length; i++) { 
if(boards[i]==="blanco.png"){continue;}
$('#selBoard').append($('<option>', {value:boards[i], text:boards[i]}));
}
//load after previous get has been completed;
			$.get(" /directoryitems/images/textures", function( data ) {
var texs = data.split("<br>");
for (i = 0; i < texs.length; i++) { 
if(texs[i] == "blanco.png"){continue;}
$('#selObjTexture').append($('<option>', {value:texs[i], text:texs[i]}));
$('#selObjTexturesideB').append($('<option>', {value:texs[i], text:texs[i]}));

	}
	
				$.get(" /directoryitems/audio/sounds", function( data ) {
var texs = data.split("<br>");
for (i = 0; i < texs.length; i++) { 

$('#selEndTurn').append($('<option>', {value:texs[i], text:texs[i]}));
$('#selPieceRelease').append($('<option>', {value:texs[i], text:texs[i]}));

	}
				$.get(" /directoryitems/audio/music", function( data ) {
var texs = data.split("<br>");
for (i = 0; i < texs.length; i++) { 

$('#selBackgroundMusic').append($('<option>', {value:texs[i], text:texs[i]}));
 
	}
});
});
	
	
	
	
});
 
});
admincode =$("#lblAdminCode").text();
  $("#lbladmincode").text("Connection code: " + admincode  );

if($("#lblisAdmin").text() === "true"){ 
isAdmin=true; isActivePlayer= true;
pname=userId=playerturn="Game Master";$("#txtProjectName").val(admincode); $("#lblPlayerTurn").text("Player turn: " + userId  );

if((window.location.href).indexOf("?") > -1)//Ex.:https://stackoverflow.com/questions/13669472/window-location-indexof-not-working-in-javascript &  https://192.168.1.2:8002/adminpage?static/examples/Project_3d8bdbec-5482-4bdf-a4e1-f7eecd644b0d.bgem
{ 
var prepropjLink ="/"+window.location.href.split("?")[1];
            if (confirm('Public game (people can join the game)?')) {
                document.getElementById("chPublicServer").checked = true;
            }  
else{document.getElementById("chPublicServer").checked = false;}

$("#txtProjectName").val(          window.location.href.split("?")[1].replace("static/examples/","").replace(".bgem","").replace("ScrumbleStones/Bronnen/Boardgameemulator/","") +"_"+currentDateTime());

    $.get(prepropjLink, function(contents) {//Ex (same domain): https://192.168.1.2:8002/adminpage?static/examples/Project_7fdf1794-b80e-4953-9ac9-4852aa0cff52.bgem
 //console.log(contents);
var convertedProjectToJson=JSON.parse(contents);
 //console.log( convertedProjectToJson);
 	  	var strScene = JSON.stringify(convertedProjectToJson);  
handleJSONsaveFileByNewObjects(strScene); 

setTimeout(function(){ //eval(JSONfeedbackdata.script);
document.getElementById("chLaunchServer").checked = true;
setScenePublic();}, 10000); //=> timeout after script

$(".admincontrol").toggle();
opencopycode();
    },'text');

}

$("#chatboxrespons").val("%0A=> Launch game; check top-right 'offline',%0Await 10 secs(green).%0A%0AShare the connection-code\n(click/see center page).%0A%0A");
SendchatMessage();

}
else{
$(".admincontrol").hide();
$("#btnAdminToggle").hide();

isAdmin=false;
isActivePlayer= false;
isMeshesGetAllowed= false;
var randomname="player_" + getRndInteger(0,10000).toString();
  pname = prompt("Your playername?\nP.S.:Choose the same name as last if you a rejoining a game.", randomname);

if (pname == null || pname.trim() == "") {
 // console.log("User cancelled the prompt.");
 userId=  pname=randomname ;//"anonymous"
} 

else {
 userId=pname;
 // name has been set
}

$("#chatboxrespons").val("=> entered the game.");
SendchatMessage();

// load client here!!
var convertedProjectToJson=JSON.parse($("#lblProjectContent").text());
//$("#lblAdminCode").remove();
console.log( convertedProjectToJson);
//BABYLON.SceneLoader.Load("test", convertedProjectToJson, engine, scene);
	//setTimeout(function(){
	  	var strScene = JSON.stringify(convertedProjectToJson); // https://www.babylonjs-playground.com/#558RAP#6
handleJSONsaveFileByNewObjects(strScene);
$("#lblProjectContent").remove();
$("#lblisAdmin").remove();

		//console.log(convertedProjectToJson.meshes[6]);
	//	BABYLON.SceneLoader.ImportMesh('', '', "data:"+JSON.stringify(convertedProjectToJson.meshes[6]), scene) 
	//}, 3000);
	     document.getElementById("chLaunchServer").checked = true;
		$("#lblOnOffStatus").html(  '<span style="color:green"> Online</span>');
 }

 
 		$.get("addorgetplayer"+admincode+"?"+ userId, function( data ) {
			countPostGetMeshesAction=0;
		isMeshesGetAllowed= true;

 // added player to list
});

isUpdateMeshesInteractableList=true;
});
