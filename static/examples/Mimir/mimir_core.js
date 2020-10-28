//////////////////////////////////////////////////////////MIMIR CORE/////////////////////////////////////////////////////////////
 var gameSettings; //= settingsObject();
 
function settingsObject(gameId,diceObjList=[],playerList=["AI","Player1"],isVSAI=false,isMultiplayer=false,isEndGame, WhoMe="Player1", isVersusPlayer=true, isWithVice,isWithVice8, AiRerollDifficulty=5,gametimer=300,currentrollval=1, currentrollmaxval=20,  currentselectrow=0, currentselectedcolumn=0, roundcount=-1, topObjectCount=6,bottomObjectCount=6 , isallowednextaction=true,isnextactionforcurrentplayer=false, isdoreroll= false, gamesetnr=0, movementLogObjectList=[],infotext="Start Game",whosturn="AI",israndomrollaction=false, backgroundimg= "", backgroundmusic="")
{
return {gameId:gameId,diceObjList:diceObjList,playerList:playerList,isVSAI:isVSAI,isMultiplayer:isMultiplayer,isEndGame:isEndGame,WhoMe:WhoMe,isVersusPlayer:isVersusPlayer,isWithVice:isWithVice, isWithVice8:isWithVice8,AiRerollDifficulty:AiRerollDifficulty, gametimer:gametimer,currentrollval:currentrollval,currentrollmaxval:currentrollmaxval,currentselectrow:currentselectrow,topObjectCount:topObjectCount, bottomObjectCount:bottomObjectCount,currentselectedcolumn:currentselectedcolumn,roundcount:roundcount,isallowednextaction:isallowednextaction, isnextactionforcurrentplayer:isnextactionforcurrentplayer,isdoreroll:isdoreroll,gamesetnr:gamesetnr, movementLogObjectList:movementLogObjectList,infotext:infotext, whosturn:whosturn, israndomrollaction:israndomrollaction, backgroundimg: backgroundimg, backgroundmusic:backgroundmusic };
}
function diceObject(id, userid, maxeyes=6, currenteye=1, currentrow=0, currentcolumn=0, imageloc="", soundonclick="")
{
return {id:id, userid:userid, maxeyes:maxeyes, currenteye:currenteye, currentrow:currentrow, currentcolumn:currentcolumn, imageloc: imageloc, soundonclick:soundonclick };
}
function movementLogObject(id,userid, gamenumberaction = 0, maxeyes=6, currenteye=1, currentrow=0, currentcolumn=0, gameround=0, date=null)
{
return {id:id,userid:userid, gamenumberaction:gamenumberaction,maxeyes:maxeyes, currenteye:currenteye, currentrow:currentrow, currentcolumn:currentcolumn, gameround:gameround, date:date }; 
}

function RandomIntegerValue(highestIntVal) {
  return Math.floor((Math.random() * highestIntVal) + 1);
 }


 function TurnHandler(gamesetting )
 {  
if(!gamesetting.isnextactionforcurrentplayer){
 var playercount = gamesetting.playerList.length;
for (i = 0; i < playercount; i++) { 
if(gamesetting.whosturn == gamesetting.playerList[i])
{ 

if(    typeof gamesetting.playerList[i+1] === 'undefined')
{gamesetting.whosturn =gamesetting.playerList[0];  gameSettings.roundcount =(gameSettings.roundcount+1) ;
 }
else{
gamesetting.whosturn =gamesetting.playerList[i+1];
}
    break;
}
}
}else{gamesetting.isnextactionforcurrentplayer=false;}
 }
function RerollCheckCollector(gameSettings)
{

var RerollCollectorObject = {};

if(gameSettings.israndomrollaction !=true && gameSettings.roundcount >-1)
{ 
  gameSettings.diceObjList.forEach(function(obj) {  
if(gameSettings.whosturn != obj.userid){
  if( typeof RerollCollectorObject["reroll_"+obj.userid] === 'undefined' ){RerollCollectorObject["reroll_"+obj.userid] ="";}

if(gameSettings.currentrollval == obj.currenteye && gameSettings.isdoreroll)
{
 if(RerollCollectorObject["reroll_"+obj.userid] =="")
 {
 RerollCollectorObject["reroll_"+obj.userid] += obj.currentcolumn   

 }
 else
 {
 RerollCollectorObject["reroll_"+obj.userid] +=","+ obj.currentcolumn   

 }
}
  }   
 }); 
  } 
  
 // gameSettings.currentrollval= -1;
 gameSettings.isdoreroll=false;
return RerollCollectorObject;
} 
function AnotherActionCheck(obj, gameSettings)
 {
if(obj.currenteye == obj.maxeyes)
{ 

if(gameSettings.israndomrollaction ==false || gameSettings.isnextactionforcurrentplayer){ //gameSettings.isnextactionforcurrentplayer -> added on 20/06/2019, as a way to alter the default rule of getting the random highest value.
 gameSettings.isnextactionforcurrentplayer=true;
 if(gameSettings.isMultiplayer){
 			document.getElementById("chatboxresponsB").value = (gameSettings.whosturn+" turned a value to it's highest number and is allowed another action.<br>");
 						SendchatMessageB(true);

}else{
 gameSettings.infotext += (gameSettings.whosturn+" turned a value to it's highest number and is allowed another action.<br>");
}}
else
{
	 if(gameSettings.isMultiplayer){
 			document.getElementById("chatboxresponsB").value = (gameSettings.whosturn+" turned a value to it's highest number by random and is not allowed a follow-up turn.<br>");
 						SendchatMessageB(true);

}else{
 gameSettings.infotext += (gameSettings.whosturn+" turned a value to it's highest number by random and is not allowed a follow-up turn.<br>");
}
}
}
else{ gameSettings.isnextactionforcurrentplayer=false;
}
}
function IncreaseCurrentValueByOne(selectedcolumn)
{

gameSettings.currentselectedcolumn=selectedcolumn;
  gameSettings.diceObjList.forEach(function(obj) {  
if(gameSettings.whosturn == obj.userid &&obj.currentcolumn ==selectedcolumn && obj.maxeyes > obj.currenteye ){ 
 obj.currenteye= obj.currenteye+1;
gameSettings.currentrollval=obj.currenteye;
gameSettings.currentrollmaxval=obj.maxeyes;
 gameSettings.infotext += (gameSettings.whosturn+" manual turned column "+obj.currentcolumn+" from "+(obj.currenteye-1).toString()+" to " +obj.currenteye)+"<br>";gameSettings.israndomrollaction=false;
 gameSettings.isallowednextaction=true;
gameSettings.israndomrollaction=false;
 gameSettings.isdoreroll=true; 
AnotherActionCheck(obj, gameSettings);
}   
else if(gameSettings.whosturn == obj.userid &&obj.currentcolumn ==selectedcolumn && obj.maxeyes == obj.currenteye)
{gameSettings.isallowednextaction=false;
 if(gameSettings.isMultiplayer){
 			document.getElementById("chatboxresponsB").value =  (gameSettings.whosturn+" cannot turn a value higher than the maximum value. A reroll is allowed.<br>");
 						SendchatMessageB(true);

}else{
 gameSettings.infotext += (gameSettings.whosturn+" cannot turn a value higher than the maximum value. A reroll is allowed.<br>");}
 
 gameSettings.israndomrollaction=false;
AnotherActionCheck(obj, gameSettings);
 }
 });
 console.log(gameSettings.infotext);
}
function RerollSelectedValue(selectedcolumn)
{
gameSettings.currentselectedcolumn=selectedcolumn;
  gameSettings.diceObjList.forEach(function(obj) {  
if(gameSettings.whosturn == obj.userid &&obj.currentcolumn ==selectedcolumn ){ 
var newrolval =   RandomIntegerValue(obj.maxeyes);
obj.currenteye= newrolval;
gameSettings.currentrollval=newrolval;
gameSettings.currentrollmaxval=obj.maxeyes;
if(gameSettings.isMultiplayer){
 			document.getElementById("chatboxresponsB").value = (gameSettings.whosturn+" random rolled column "+obj.currentcolumn+" to "+gameSettings.currentrollval)+"<br>";
 						SendchatMessageB(true);

}else{ 
gameSettings.infotext += (gameSettings.whosturn+" random rolled column "+obj.currentcolumn+" to "+gameSettings.currentrollval)+"<br>";}
  gameSettings.isallowednextaction=true;
gameSettings.israndomrollaction=true;
 gameSettings.isdoreroll=false;

AnotherActionCheck(obj, gameSettings);

}   
 });
  console.log(gameSettings.infotext);

}

 function VictoryCheck(gamesettings,autorestart)
{

for (i = 0; i < gamesettings.playerList.length; i++) { 
var allObjectsIndividual= 0;
var allMaxedOutObjectsIndividual=0;
var winneruserid=""; 
gamesettings.diceObjList.forEach(function(obj) {  

 
if(obj.userid == gamesettings.playerList[i]){allObjectsIndividual+=1;
   if(obj.maxeyes == obj.currenteye){
  allMaxedOutObjectsIndividual+=1;
 
}
} });

if(allMaxedOutObjectsIndividual == allObjectsIndividual && allMaxedOutObjectsIndividual!=0 )
{winneruserid=gamesettings.playerList[i]; 
if(gameSettings.isMultiplayer){
 			document.getElementById("chatboxresponsB").value = (winneruserid + " is the winner!")+"<br>";
 						SendchatMessageB(true);
	gameSettings.isallowednextaction=false; 	gameSettings.isEndGame=true;  gameSettings.isnextactionforcurrentplayer=false; 
	setTimeout(function(){ 																
 	var r = confirm(("You won!")+" New game (you start - somewhat disadvantageous)?");
if (r == true) {
   ResetGame();allowGet=false;  allowPost=true;
 			document.getElementById("chatboxresponsB").value = (winneruserid + " starts the next game.")+"<br>";
 						SendchatMessageB(true);

   } }, 300);
 	
}else{
	if(gameSettings.isallowednextaction){
		gameSettings.isallowednextaction=false;
gamesettings.infotext += (winneruserid + " is the winner!")+"<br>"; 
}
if(!autorestart    ){
	gameSettings.isallowednextaction=false;setTimeout(function(){ 
 	var r = confirm("New game?");
if (r == true) {
   ResetGame(); } }, 3000); 
} else if($('#radAIVSAI').is(':checked') && autorestart){
	  var elem = document.getElementById('chatboxdata');  elem.scrollTop = elem.scrollHeight;
    var elemB = document.getElementById('divGameLog');  elemB.scrollTop = elemB.scrollHeight;
 ResetGame();
	}
 
}

return false;
}
//gameSettings.infotext += (gamesettings.playerList[i] + " maxed out items: " +  allMaxedOutObjectsIndividual.toString() +" " + allObjectsIndividual.toString())+"<br>";

}
}

function AiBehavior(gameSettings)
{
	if(!gameSettings.isallowednextaction){return;}
	
var callback=true;
gameSettings.diceObjList.reverse().forEach(function(obj) { //reverse because highest value gets checked first. Nota2: normally reverse() once before, but way now it's switching sides each turn, makes it dynamic!

    if(!callback) return false;

	if(gameSettings.whosturn == obj.userid && obj.maxeyes !=  obj.currenteye){//whosturn = startWith AI
var rerollrandomvalue= RandomIntegerValue(obj.maxeyes); 

if((obj.maxeyes-obj.currenteye) >3 && gameSettings.AiRerollDifficulty  >= rerollrandomvalue )
{ 

obj.currenteye= RandomIntegerValue(obj.maxeyes);
gameSettings.currentrollval=obj.currenteye;
gameSettings.currentrollmaxval=obj.maxeyes;
 
gameSettings.infotext += (gameSettings.whosturn+" random rolled column "+obj.currentcolumn+" to "+gameSettings.currentrollval)+"<br>"; 
gameSettings.israndomrollaction=true; gameSettings.isdoreroll=false;  gameSettings.isallowednextaction=true;

AnotherActionCheck(obj, gameSettings);

}
else{obj.currenteye= obj.currenteye+1;gameSettings.currentrollval=obj.currenteye;gameSettings.currentrollmaxval=obj.maxeyes;

 
 if( gameSettings.isMultiplayer)
 {
 			document.getElementById("chatboxresponsB").value =(gameSettings.whosturn+" manual turned column "+obj.currentcolumn+" from "+(obj.currenteye-1).toString()+" to " +obj.currenteye)+"<br>";
 						SendchatMessageB(true);

	 
 }else{ gameSettings.infotext += (gameSettings.whosturn+" manual turned column "+obj.currentcolumn+" from "+(obj.currenteye-1).toString()+" to " +obj.currenteye)+"<br>";
}
gameSettings.israndomrollaction=false; gameSettings.isdoreroll=true;  gameSettings.isallowednextaction=true;

AnotherActionCheck(obj, gameSettings);


}
 
    callback=false;

 
}
});

 //   for (key in routes) {     if (routes.hasOwnProperty(key)) {      console.log(routes[key].maxeyes);      //do more here   }   } FMI:https://stackoverflow.com/questions/18238173/javascript-loop-through-json-array

}


function AutoReroll(rerollHandler){
for (i = 0; i < gameSettings.playerList.length; i++) { // Auto reroll: 

 if( typeof rerollHandler["reroll_"+gameSettings.playerList[i]] !== 'undefined'  &&  rerollHandler["reroll_"+gameSettings.playerList[i]]  != "")
 {
 var splitRerollColumns = rerollHandler["reroll_"+gameSettings.playerList[i]].split(",");
 for (r = 0; r < splitRerollColumns.length; r++) 
 { 
 gameSettings.diceObjList.forEach(function(obj) {  
if( obj.userid== gameSettings.playerList[i] && obj.currentcolumn == splitRerollColumns[r] ){
var newrolval  = RandomIntegerValue(obj.maxeyes);
if(gameSettings.isMultiplayer){
 			document.getElementById("chatboxresponsB").value = (gameSettings.playerList[i]+ " had to reroll column "+obj.currentcolumn+ " to the value: "+newrolval)+"<br>";
 						SendchatMessageB(true);

}else{
gameSettings.infotext += (gameSettings.playerList[i]+ " had to reroll column "+obj.currentcolumn+ " to the value: "+newrolval)+"<br>";}
obj.currenteye=parseInt(newrolval);
}

 });
}
 }
} }
 
 function CalculateStartPlayer(gameSettings)
 {
 var playerStartId=RandomIntegerValue(gameSettings.playerList.length );
playerStartId-=1;
 gameSettings.whosturn= gameSettings.playerList[playerStartId];

 }
 ///////////////////////////////////////////////////////////EXAMPLES (GUI)////////////////////////////////////////////////////////
 function displayTime() {
    var str = "";

    var currentTime = new Date()
    var hours = currentTime.getHours()
    var minutes = currentTime.getMinutes()
    var seconds = currentTime.getSeconds()

    if (minutes < 10) {
        minutes = "0" + minutes
    }
    if (seconds < 10) {
        seconds = "0" + seconds
    }
    str += hours + ":" + minutes + ":" + seconds + " ";
    if(hours > 11){
        str += "PM"
    } else {
        str += "AM"
    }
    return str;
}

  function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

var clickCount = 0; 
function CalcOneUpOrRerollAction(selectedcolumn)
{
	
	confirmSound.play(); //added as quick & simple babylon js sound (might remove to keep methode intact in other pojects).
	
 	if(gameSettings.topObjectCount <   selectedcolumn+1 && gameSettings.whosturn==  gameSettings.playerList[0])// Prevent actionclick on other playfield that will be handled as a pass.
	{return;}
else 	if(gameSettings.bottomObjectCount <   selectedcolumn+1 && gameSettings.whosturn==  gameSettings.playerList[1])//FMI: selected column + 1 => index starts at 0, not 1
	{return;}

	
if(typeof gameSettings.whosturn !=="undefined" && !gameSettings.whosturn.startsWith("AI") ){
clickCount+=1;
setTimeout(function(){ CalcOneUpOrRerollActionInject(clickCount,selectedcolumn);clickCount=0; }, 200);
}else{
gameSettings.infotext="<br>It's not your turn.<br>";
   $("#divGameLog").append(gameSettings.infotext);
gameSettings.infotext="";

}
}
 function CalcOneUpOrRerollActionInject(clickCount,selectedcolumn)
 {
	 
	  	  if(gameSettings.isMultiplayer && gameSettings.whosturn != gameSettings.WhoMe && allowPost != true )
		 {$("#divGameLog").append("It's not your turn.<br>");return;} 

 if(clickCount==1){
IncreaseCurrentValueByOne(selectedcolumn);}
else if(clickCount==2){
RerollSelectedValue(selectedcolumn);
}
else{return;} 
if(gameSettings.isallowednextaction){
roundChecks(false);updateGuiValues(); 
  PlayerVSAIDefault();
 
if(gameSettings.isMultiplayer){
  PostProject();}}
 }
 
 function updateGuiValues(isScrollAutoDown=true)
 {
 for (i = 0; i < gameSettings.playerList.length; i++) { 

gameSettings.diceObjList.forEach(function(obj) {  
if(obj.userid==gameSettings.playerList[i]){
	
	
  
  var stringeyeval= obj.currenteye.toString();
  if( stringeyeval.length ==1)
  {
  stringeyeval= "0" + stringeyeval;// pure for the lay-out
  }
    document.getElementById("value_"+ obj.userid+"_"+obj.currentcolumn ).innerHTML  =   stringeyeval;
	
	if(gameSettings.isWithVice && gameSettings.isWithVice8 ){
			if(stringeyeval ==1 && obj.userid==gameSettings.playerList[0]){
	 	$("#image_"+obj.userid.toString()+"_"+obj.currentcolumn.toString()).attr("src",kb6);}
	 else if(stringeyeval ==2 && obj.userid==gameSettings.playerList[0]){
	 	$("#image_"+obj.userid.toString()+"_"+obj.currentcolumn.toString()).attr("src",kb4);}
		else 	if(stringeyeval ==3 && obj.userid==gameSettings.playerList[0]){
	 	$("#image_"+obj.userid.toString()+"_"+obj.currentcolumn.toString()).attr("src",kb3);}
		else 	if(stringeyeval ==4 && obj.userid==gameSettings.playerList[0]){
	 	$("#image_"+obj.userid.toString()+"_"+obj.currentcolumn.toString()).attr("src",kb5);}
		else 	if(stringeyeval ==5 && obj.userid==gameSettings.playerList[0]){
	 	$("#image_"+obj.userid.toString()+"_"+obj.currentcolumn.toString()).attr("src",kb1);}
		else 	if(stringeyeval ==6 && obj.userid==gameSettings.playerList[0]){
	 	$("#image_"+obj.userid.toString()+"_"+obj.currentcolumn.toString()).attr("src",kb8);}
			else 	if(stringeyeval ==7 && obj.userid==gameSettings.playerList[0]){
	 	$("#image_"+obj.userid.toString()+"_"+obj.currentcolumn.toString()).attr("src",kb2);}
		else 	if(stringeyeval ==8 && obj.userid==gameSettings.playerList[0]){
	 	$("#image_"+obj.userid.toString()+"_"+obj.currentcolumn.toString()).attr("src",kb7);}

			if(stringeyeval ==1&& obj.userid==gameSettings.playerList[1]){
	 	$("#image_"+obj.userid.toString()+"_"+obj.currentcolumn.toString()).attr("src",kr2);}
else  if(stringeyeval ==2 && obj.userid==gameSettings.playerList[1]){
	 	$("#image_"+obj.userid.toString()+"_"+obj.currentcolumn.toString()).attr("src",kr8);}
		if(stringeyeval ==3&& obj.userid==gameSettings.playerList[1]){
	 	$("#image_"+obj.userid.toString()+"_"+obj.currentcolumn.toString()).attr("src",kr6);}
			else 	 if(stringeyeval ==4 && obj.userid==gameSettings.playerList[1]){
	 	$("#image_"+obj.userid.toString()+"_"+obj.currentcolumn.toString()).attr("src",kr7);}
			else	if(stringeyeval ==5&& obj.userid==gameSettings.playerList[1]){
	 	$("#image_"+obj.userid.toString()+"_"+obj.currentcolumn.toString()).attr("src",kr1);}
			else 	 if(stringeyeval ==6 && obj.userid==gameSettings.playerList[1]){
	 	$("#image_"+obj.userid.toString()+"_"+obj.currentcolumn.toString()).attr("src",kr4);}
					else	if(stringeyeval ==7&& obj.userid==gameSettings.playerList[1]){
	 	$("#image_"+obj.userid.toString()+"_"+obj.currentcolumn.toString()).attr("src",kr3);}
			else 	 if(stringeyeval ==8 && obj.userid==gameSettings.playerList[1]){
	 	$("#image_"+obj.userid.toString()+"_"+obj.currentcolumn.toString()).attr("src",kr5);}

}
	
else if(gameSettings.isWithVice){
	if(stringeyeval ==1 && obj.userid==gameSettings.playerList[0]){
	 	$("#image_"+obj.userid.toString()+"_"+obj.currentcolumn.toString()).attr("src",kb4);}
		else 	if(stringeyeval ==2 && obj.userid==gameSettings.playerList[0]){
	 	$("#image_"+obj.userid.toString()+"_"+obj.currentcolumn.toString()).attr("src",kb5);}
		else 	if(stringeyeval ==3 && obj.userid==gameSettings.playerList[0]){
	 	$("#image_"+obj.userid.toString()+"_"+obj.currentcolumn.toString()).attr("src",kb8);}
		else 	if(stringeyeval ==4 && obj.userid==gameSettings.playerList[0]){
	 	$("#image_"+obj.userid.toString()+"_"+obj.currentcolumn.toString()).attr("src",kb7);}

			if(stringeyeval ==1 && obj.userid==gameSettings.playerList[1]){
	 	$("#image_"+obj.userid.toString()+"_"+obj.currentcolumn.toString()).attr("src",kr8);}
			else 	 if(stringeyeval ==2 && obj.userid==gameSettings.playerList[1]){
	 	$("#image_"+obj.userid.toString()+"_"+obj.currentcolumn.toString()).attr("src",kr7);}
			else 	 if(stringeyeval ==3 && obj.userid==gameSettings.playerList[1]){
	 	$("#image_"+obj.userid.toString()+"_"+obj.currentcolumn.toString()).attr("src",kr4);}
			else 	 if(stringeyeval ==4 && obj.userid==gameSettings.playerList[1]){
	 	$("#image_"+obj.userid.toString()+"_"+obj.currentcolumn.toString()).attr("src",kr5);}

}
else{
			if(obj.maxeyes ==4){	$("#image_"+obj.userid.toString()+"_"+obj.currentcolumn.toString()).attr("src",d4);}
			else  if(obj.maxeyes ==6){	$("#image_"+obj.userid.toString()+"_"+obj.currentcolumn.toString()).attr("src",d6);}
			else  if(obj.maxeyes ==8){	$("#image_"+obj.userid.toString()+"_"+obj.currentcolumn.toString()).attr("src",d8);}
			else  if(obj.maxeyes ==10){	$("#image_"+obj.userid.toString()+"_"+obj.currentcolumn.toString()).attr("src",d10);}
			else  if(obj.maxeyes ==12){	$("#image_"+obj.userid.toString()+"_"+obj.currentcolumn.toString()).attr("src",d12);}
			else  if(obj.maxeyes ==20){	$("#image_"+obj.userid.toString()+"_"+obj.currentcolumn.toString()).attr("src",d20);}


}

 }
});

  }
  if(isScrollAutoDown) {
  	     var objDiv = $("#divGameLog");
    	 var h = objDiv.get(0).scrollHeight;
    	 objDiv.animate({scrollTop: h});
}
 }
 
function startDefaultGame(isVersusPlayer=false, isVSAI=false,ObjectCountTop = 6, ObjectCountBottom = 6, isWithVice,isWithVice8){
gameSettings = settingsObject();
gameSettings.topObjectCount=ObjectCountTop;
gameSettings.bottomObjectCount=ObjectCountBottom;
gameSettings.isVersusPlayer=isVersusPlayer;
gameSettings.isVSAI=isVSAI;
gameSettings.isWithVice = isWithVice;
gameSettings.isWithVice8= isWithVice8;
gameSettings.iSEndGame= false;

if(isWithVice)
{
	
				$("#btn3DToggle").hide();// would be too confusing

}
 if(!isVersusPlayer && isVSAI)
 {
 gameSettings.playerList=["AI","AI2"];

 } else  if(isVersusPlayer && !isVSAI)
 {
 gameSettings.playerList=["Player2","Player1"];

 }
 
 
  if(isWithVice && isWithVice8){
	 gameSettings.diceObjList.push(diceObject("ID001",gameSettings.playerList[0],8,1,0,0, kb6,""));

 }
 else if(isWithVice){
	 gameSettings.diceObjList.push(diceObject("ID001",gameSettings.playerList[0],4,1,0,0, kb4,""));

 }else{
gameSettings.diceObjList.push(diceObject("ID001",gameSettings.playerList[0],4,1,0,0,d4,""));
}
if(ObjectCountTop >1){
	 if(isWithVice && isWithVice8){
	 gameSettings.diceObjList.push(diceObject("ID001",gameSettings.playerList[0],8,1,0,1, kb6,""));

 }
 else	if(isWithVice){
		gameSettings.diceObjList.push(diceObject("ID001",gameSettings.playerList[0],4,1,0,1, kb4,""));		
	}else{
gameSettings.diceObjList.push(diceObject("ID001",gameSettings.playerList[0],6,1,0,1,d6,""));
}}
if(ObjectCountTop >2){
	 if(isWithVice && isWithVice8){
	 gameSettings.diceObjList.push(diceObject("ID001",gameSettings.playerList[0],8,1,0,2, kb6,""));

 }
 else		if(isWithVice){
		gameSettings.diceObjList.push(diceObject("ID001",gameSettings.playerList[0],4,1,0,2, kb4,""));		
	}else{

gameSettings.diceObjList.push(diceObject("ID001",gameSettings.playerList[0],8,1,0,2, d8,""));
}}
if(ObjectCountTop >3){
	 if(isWithVice && isWithVice8){
	 gameSettings.diceObjList.push(diceObject("ID001",gameSettings.playerList[0],8,1,0,3, kb6,""));

 }
 else	if(isWithVice){
		gameSettings.diceObjList.push(diceObject("ID001",gameSettings.playerList[0],4,1,0,3, kb4,""));		
	}else{
gameSettings.diceObjList.push(diceObject("ID001",gameSettings.playerList[0],10,1,0,3, d10,""));
}}
if(ObjectCountTop >4){
	 if(isWithVice && isWithVice8){
	 gameSettings.diceObjList.push(diceObject("ID001",gameSettings.playerList[0],8,1,0,4, kb6,""));

 }
 else		if(isWithVice){
		gameSettings.diceObjList.push(diceObject("ID001",gameSettings.playerList[0],4,1,0,4, kb4,""));		
	}else{
gameSettings.diceObjList.push(diceObject("ID001",gameSettings.playerList[0],12,1,0,4, d12,""));
}}
if(ObjectCountTop >5){
	 if(isWithVice && isWithVice8){
	 gameSettings.diceObjList.push(diceObject("ID001",gameSettings.playerList[0],8,1,0,5, kb6,""));

 }
 else		if(isWithVice){
		gameSettings.diceObjList.push(diceObject("ID001",gameSettings.playerList[0],4,1,0,5, kb4,""));		
	}else{
gameSettings.diceObjList.push(diceObject("ID001",gameSettings.playerList[0],20,1,0,5, d20,""));
}}


		if(isWithVice && isWithVice8){gameSettings.diceObjList.push(diceObject("ID002",gameSettings.playerList[1],8,1,0,0, kr2,""));}
	else	if(isWithVice){gameSettings.diceObjList.push(diceObject("ID002",gameSettings.playerList[1],4,1,0,0, kr8,""));
		}else{gameSettings.diceObjList.push(diceObject("ID002",gameSettings.playerList[1],4,1,0,0, d4,""));}
 
if(ObjectCountBottom >1){
	
		if(isWithVice && isWithVice8){gameSettings.diceObjList.push(diceObject("ID002",gameSettings.playerList[1],8,1,0,1, kr2,""));}
	else			if(isWithVice){
		gameSettings.diceObjList.push(diceObject("ID002",gameSettings.playerList[1],4,1,0,1,kr8,""));		
	}else{ 
gameSettings.diceObjList.push(diceObject("ID002",gameSettings.playerList[1],6,1,0,1, d6,""));
}}if(ObjectCountBottom >2){
	
		if(isWithVice && isWithVice8){gameSettings.diceObjList.push(diceObject("ID002",gameSettings.playerList[1],8,1,0,2, kr2,""));}
	else			if(isWithVice){
		gameSettings.diceObjList.push(diceObject("ID002",gameSettings.playerList[1],4,1,0,2,kr8,""));		
	}else{
gameSettings.diceObjList.push(diceObject("ID002",gameSettings.playerList[1],8,1,0,2, d8,""));
	}}if(ObjectCountBottom >3){
		
		if(isWithVice && isWithVice8){gameSettings.diceObjList.push(diceObject("ID002",gameSettings.playerList[1],8,1,0,3, kr2,""));}
	else				if(isWithVice){
		gameSettings.diceObjList.push(diceObject("ID002",gameSettings.playerList[1],4,1,0,3,kr8,""));		
	}else{
gameSettings.diceObjList.push(diceObject("ID002",gameSettings.playerList[1],10,1,0,3, d10,""));
	}}if(ObjectCountBottom >4){
		
		if(isWithVice && isWithVice8){gameSettings.diceObjList.push(diceObject("ID002",gameSettings.playerList[1],8,1,0,4, kr2,""));}
	else				if(isWithVice){
		gameSettings.diceObjList.push(diceObject("ID002",gameSettings.playerList[1],4,1,0,4,kr8,""));		
	}else{
gameSettings.diceObjList.push(diceObject("ID002",gameSettings.playerList[1],12,1,0,4, d12,""));
	}}if(ObjectCountBottom >5){
		
		if(isWithVice && isWithVice8){gameSettings.diceObjList.push(diceObject("ID002",gameSettings.playerList[1],8,1,0,5, kr2,""));}
	else				if(isWithVice){
		gameSettings.diceObjList.push(diceObject("ID002",gameSettings.playerList[1],4,1,0,5,kr8,""));		
	}else{
gameSettings.diceObjList.push(diceObject("ID002",gameSettings.playerList[1],20,1,0,5, d20,""));
	}}


document.getElementById("divGameField").innerHTML="";
   // document.getElementById("divGameLog").innerHTML = "";

 for (i = 0; i < gameSettings.playerList.length; i++) { 

gameSettings.diceObjList.forEach(function(obj) {  
if(obj.userid==gameSettings.playerList[i]){
 
if(obj.userid.startsWith("AI") ){


        document.getElementById("divGameField").innerHTML += '<span class="container"> <img src="'+obj.imageloc+'" alt="dimg" id="image_'+ obj.userid+"_"+obj.currentcolumn +'" style="width:12%;"><span style="  position: relative;  left:-3.5%;" id="value_'+ obj.userid+"_"+obj.currentcolumn +'">'+obj.currenteye.toString()+'</span></span>';

} 
else
{
    document.getElementById("divGameField").innerHTML += '<span class="container">  <img src="'+obj.imageloc+'" alt="dimg" id="image_'+ obj.userid+"_"+obj.currentcolumn +'" style="width:12%;" onclick="CalcOneUpOrRerollAction('+obj.currentcolumn+')");"><span class="gamePawn" style="position:relative; left:-3.5%;" id="value_'+ obj.userid+"_"+obj.currentcolumn +'">'+obj.currenteye.toString()+'</span></span>';

}}

});

 document.getElementById("divGameField").innerHTML +="<br><hr><br>"
 }
CalculateStartPlayer(gameSettings);
}

function ResetGame()
{gameSettings.isallowednextaction=true;
gameSettings.isEndGame=false;

			if(gameSettings.isMultiplayer){
			for (var i = 0; i < gameSettings.diceObjList.length; i++) {
				 gameSettings.diceObjList[i].currenteye=1;}			$(".gamePawn").html("01");return; }
			

		  startDefaultGame(gameSettings.isVersusPlayer,gameSettings.isVSAI,gameSettings.topObjectCount,gameSettings.bottomObjectCount,gameSettings.isWithVice,gameSettings.isWithVice8);

	  if($('#radVSAI').is(':checked')) {   
 PlayerVSAIDefault();}
else   if($('#radVSPlayer').is(':checked')) {   
 PlayerVSPlayerPassPlay();
  }
else   if($('#radAIVSAI').is(':checked')) {  
  AIvsAIDemoTest();  
 }

}
function roundChecks(autorestart=true )
{


VictoryCheck(gameSettings,autorestart);


//Custom code:
if(gameSettings.infotext.indexOf("winner") >-1)
{

 
  $("#divGameLog").append(gameSettings.infotext+"<hr>");
gameSettings.infotext="";

 
return;
}

var rerollHandler = RerollCheckCollector(gameSettings);
 AutoReroll(rerollHandler); 


  $("#divGameLog").append(gameSettings.infotext );
gameSettings.infotext="";

 }
function AIvsAIDemoTest()
{
 
setInterval(function(){
	
	if(!gameSettings.isallowednextaction){return;}
	
gameSettings.infotext="";

TurnHandler(gameSettings);
 
gameSettings.infotext += ("<br>Who's turn: " + gameSettings.whosturn)+" | Round: " + gameSettings.roundcount+" | "+displayTime()+"<br>"; 
 $("#divGameLog").append(gameSettings.infotext );
gameSettings.infotext=""; 


if(gameSettings.whosturn.startsWith("AI")) {
AiBehavior(gameSettings);
   $("#divGameLog").append(gameSettings.infotext);
gameSettings.infotext="";
 
}
roundChecks(true);
 

updateGuiValues(false);
gameSettings.movementLogObjectList.push(movementLogObject((gameSettings.movementLogObjectList.length-1).toString(),gameSettings.whosturn, (gameSettings.movementLogObjectList.length-1).toString(), gameSettings.currentrollmaxval,gameSettings.currentrollval, gameSettings.currentrow, gameSettings.currentcolumn, gameSettings.roundcount, displayTime()));
console.log(JSON.stringify(gameSettings.movementLogObjectList[gameSettings.movementLogObjectList.length-1]));

}, 20);}


function PlayerVSAIDefault()
{  if(!gameSettings.isallowednextaction){return;}
gameSettings.infotext="";

TurnHandler(gameSettings);
 gameSettings.infotext += ("<br>Who's turn: " + gameSettings.whosturn)+" | Round: " + gameSettings.roundcount+" | "+displayTime()+"<br>"; 
   $("#divGameLog").append(gameSettings.infotext);
gameSettings.infotext="";

if(gameSettings.whosturn.startsWith("AI")) {
setTimeout(function(){  

AiBehavior(gameSettings);
if(!gameSettings.isallowednextaction){return;}
   $("#divGameLog").append(gameSettings.infotext);
gameSettings.infotext="";
roundChecks(false);
updateGuiValues();
gameSettings.movementLogObjectList.push(movementLogObject((gameSettings.movementLogObjectList.length-1).toString(),gameSettings.whosturn, (gameSettings.movementLogObjectList.length-1).toString(), gameSettings.currentrollmaxval,gameSettings.currentrollval, gameSettings.currentrow, gameSettings.currentcolumn, gameSettings.roundcount, displayTime()));
console.log(JSON.stringify(gameSettings.movementLogObjectList[gameSettings.movementLogObjectList.length-1]));

PlayerVSAIDefault(); }
, 2000);
}
 

if(!gameSettings.whosturn.startsWith("AI")) {
roundChecks(false);
updateGuiValues();
gameSettings.movementLogObjectList.push(movementLogObject((gameSettings.movementLogObjectList.length-1).toString(),gameSettings.whosturn, (gameSettings.movementLogObjectList.length-1).toString(), gameSettings.currentrollmaxval,gameSettings.currentrollval, gameSettings.currentrow, gameSettings.currentcolumn, gameSettings.roundcount, displayTime()));
console.log(JSON.stringify(gameSettings.movementLogObjectList[gameSettings.movementLogObjectList.length-1]));
}
  }
function PlayerVSPlayerPassPlay()
{ 
gameSettings.infotext="";

TurnHandler(gameSettings);
if(gameSettings.isMultiplayer){
 			document.getElementById("chatboxresponsB").value = ("<br>Who's turn: " + gameSettings.whosturn)+" | Round: " + gameSettings.roundcount+" | "+displayTime()+"<br>";
 						SendchatMessageB(true);

}else{ 

gameSettings.infotext += ("<br>Who's turn: " + gameSettings.whosturn)+" | Round: " + gameSettings.roundcount+" | "+displayTime()+"<br>";
   $("#divGameLog").append(gameSettings.infotext);
gameSettings.infotext="";}
 roundChecks(false);
updateGuiValues();
gameSettings.movementLogObjectList.push(movementLogObject((gameSettings.movementLogObjectList.length-1).toString(),gameSettings.whosturn, (gameSettings.movementLogObjectList.length-1).toString(), gameSettings.currentrollmaxval,gameSettings.currentrollval, gameSettings.currentrow, gameSettings.currentcolumn, gameSettings.roundcount, displayTime()));
console.log(JSON.stringify(gameSettings.movementLogObjectList[gameSettings.movementLogObjectList.length-1]));
 
  }
////////////////startDefaultGame(true);//false voor AI vs AI
///////////////////////AIvsAIDemoTest();
////////////////////////////////PlayerVSAIDefault();
//////////////////////=> check Mimir_Neo.html


 var customDiceId= 0;
function addDiceObjectToSandbox(){
 var dObj= '<div id="spanIndividualDiceObject_'+customDiceId.toString()+'" style="border-color:black;   border-style: solid;  border-width:2px;width:80%;padding:1%;"> <u>Object '+customDiceId+' </u><label style="color:red;float:right;" onclick="document.getElementById(\'spanIndividualDiceObject_'+customDiceId.toString()+'\').remove();"> X </label><br>      Player Id:    <input type="number" id="txtPlayerIdDice_'+customDiceId.toString()+'" value="2" min="1" max="4"><br>      Max Eye:    <input type="number" id="txtMaxEyesDice_'+customDiceId.toString()+'" value="4" min="1" max="20"><br>      Current Eye:    <input type="number" id="txtCurrentEyesDice_'+customDiceId.toString()+'" value="4" min="1" max="20"><br>      Current Row:    <input type="number" id="txtCurrentRowDice_'+customDiceId.toString()+'" value="0" min="0" ><br>     Current Column:    <input type="number" id="txtCurrentColumnDice_'+customDiceId.toString()+'" value="0" min="0"  ><br>'+
 ' Image:    <input type="text" id="txtImageDice_'+customDiceId.toString()+'" value="https://upload.wikimedia.org/wikipedia/commons/b/b6/Playing_card_heart_3.svg"    ><br>      Sound on Click:'+
    '<input type="text" id="txtSoundDice_'+customDiceId.toString()+'" value="https://ccrma.stanford.edu/~jos/wav/harpsi-cs.wav"   >    </span>    </span></div>'
customDiceId+=1;

   $("#divHoldDiceData").append(dObj);
}

function GenerateCustomGame()
{
for (i = 0; i < customDiceId; i++) {  
gameSettings.diceObjList.push(diceObject("ID"+document.getElementById("txtPlayerIdDice_"+i.toString() ).value,document.getElementById("txtPlayerIdDice_"+i.toString() ).value,document.getElementById("txtMaxEyesDice_"+i.toString() ).value,document.getElementById("txtCurrentEyesDice_"+i.toString() ).value,document.getElementById("txtCurrentRowDice_"+i.toString() ).value,document.getElementById("txtCurrentColumnDice_"+i.toString() ).value,document.getElementById("txtImageDice_"+i.toString() ).value,document.getElementById("txtSoundDice_"+i.toString() ).value));


}

}

function startGame(){
	
	$("#chatboxresponsB").hide();
		$("#chatboxrespons").hide();
				$("#btnconfirmchatmessage").hide();
		$("#btnconfirmchatmessageB").hide();


		     ambientSound = new BABYLON.Sound("ambientMusic", "static/examples/Mimir/static/audio/spacesound.wav", scene, null, { loop: true, autoplay: true,   spatialSound: true  });//REF: https://doc.babylonjs.com/how_to/playing_sounds_and_music
			 		     confirmSound = new BABYLON.Sound("ambientMusic", "static/examples/Mimir/static/audio/spaceconfirm.wav", scene, null, { loop: false, autoplay: true });

var topCount= parseInt($("#txtTopCount").val());
var bottomCount= parseInt($("#txtBottomCount").val());

   if($('#radVSAI').is(':checked')) {   
startDefaultGame(true,true,topCount,bottomCount,$('#chVice').is(':checked'), $('#chVice8').is(':checked')); 
 PlayerVSAIDefault();}
else   if($('#radVSPlayer').is(':checked')) {   
startDefaultGame(true,false,topCount,bottomCount,$('#chVice').is(':checked'), $('#chVice8').is(':checked')); PlayerVSPlayerPassPlay();
  }
else   if($('#radAIVSAI').is(':checked')) {   
startDefaultGame(false,true,topCount,bottomCount,$('#chVice').is(':checked'), $('#chVice8').is(':checked')); 
AIvsAIDemoTest();
 }

isGameLaunched=true;// ref: engine.js (babylon js)
}




//multiplayer


function addTextToLog(text)
{
  $("#divGameLog").append(text);
 
}
 var lastChatEntry="";
var lastGetContent="";
var lastPostData;

var chatFeedTimer=0;
 var pname ="GAME_MASTER";
var allowGet= false;
var allowPost= false;
var isAdmin=true;
var admincode="";

function LaunchNewMultiGame()
{ isAdmin=true;
allowGet=false; allowPost=false;

			     ambientSound = new BABYLON.Sound("ambientMusic", "static/audio/spacesound.wav", scene, null, { loop: true, autoplay: true,   spatialSound: true  });//REF: https://doc.babylonjs.com/how_to/playing_sounds_and_music
			 		     confirmSound = new BABYLON.Sound("ambientMusic", "static/audio/spaceconfirm.wav", scene, null, { loop: false, autoplay: true });

	var topCount= parseInt($("#txtTopCount").val());
var bottomCount= parseInt($("#txtBottomCount").val());
 startDefaultGame(true,false,topCount,bottomCount,$('#chVice').is(':checked'), $('#chVice8').is(':checked')); 
 
						  gameSettings.WhoMe=gameSettings.playerList[1];//pname;
 						  gameSettings.isMultiplayer=true;
						  
 if(typeof $("#lblAdminCode").html() != "undefined")  
{
 
admincode=$("#lblAdminCode").text();
gameSettings. gameId=admincode;

 

	  if(gameSettings.whosturn != gameSettings.WhoMe )
		 {PostProject(); addTextToLog("<i>Player 2 is on the move.</i><br>"); allowGet=true;  allowPost=false;lastPostData="";}else{addTextToLog("<i>You are on the move.</i><br>");allowGet=false;  allowPost=true;lastPostData="";}
 	 $("#spanConfig").prepend(" <small style='position:absolute;margin-left:100px;   '>Share code: &nbsp;<input style='max-width:100px; overflow:scroll;' type='text' class='' readonly='true' id='txtShareCodeMain' name='txtShareCodeMain' value='"+admincode+"'/></small> ");

}

allowPost= true;PostProject(true);
			MultiplayerInterval();

}
function launchGuestMultiplayer( )
{
$("#btnReset").hide();
isAdmin=false;
allowGet=true; allowPost=false;

   var person = prompt("Hi, what is your name (returning to session, take the previous name)?", "Player_"+RandomIntegerValue(100000).toString());

if (person != null && person != "") {
   pname = person;
WhoText = "("+person+") ";

		     ambientSound = new BABYLON.Sound("ambientMusic", "static/examples/Mimir/static/audio/spacesound.wav", scene, null, { loop: true, autoplay: true,   spatialSound: true  });//REF: https://doc.babylonjs.com/how_to/playing_sounds_and_music
			 		     confirmSound = new BABYLON.Sound("ambientMusic", "static/examples/Mimir/static/audio/spaceconfirm.wav", scene, null, { loop: false, autoplay: true });
 

 if(typeof $("#txtJoinGame").html() != "undefined")  
{ 
admincode=$("#txtJoinGame").val();GetNonTurnContent(true);

}
  	

  			$.get("/Join2D"+admincode+"?"+encodeURIComponent(pname), function( data ) {
 			document.getElementById("chatboxresponsB").value =person+ " joins the game as Player 2.\n";
 						SendchatMessageB(true);
allowGet=true; 
 						 //timely GET call here
 

 			});

 document.getElementById('divGameStartModal').style.display = 'none';}else{return;}
}
function GetNonTurnContent(isLaunchPvPContent)
{
	if(allowGet){
    			$.get("/Get2D"+admincode, function( data ) {
			
			 if(lastGetContent === data || typeof data == "NONE"){return;}
		 	else{lastGetContent=data;}
 			var jsonData = JSON.parse(data);
 				if(isLaunchPvPContent)
																{
							 startDefaultGame(true,false,jsonData.topObjectCount,jsonData.bottomObjectCount,jsonData.isWithVice,  jsonData.isWithVice8   ); 
//PlayerVSPlayerPassPlay();
 						  gameSettings.WhoMe=jsonData.playerList[0];//pname;
gameSettings. gameId=admincode;
									  gameSettings.isMultiplayer=true;			MultiplayerInterval();


																}
			  gameSettings.whosturn=jsonData.whosturn;		  
			  
			  gameSettings.isEndGame=jsonData.isEndGame;	

			 	  gameSettings.diceObjList=jsonData.diceObjList;
				  	  gameSettings.playerList=jsonData.playerList;
					  	  gameSettings.isVSAI=jsonData.isVSAI;
						    	  gameSettings.isWithVice=jsonData.isWithVice;
								  	  gameSettings.isWithVice8=jsonData.isWithVice8;
									  	  gameSettings.gametimer=jsonData.gametimer;
										  	  gameSettings.currentrollval=jsonData.currentrollval;
											  	  gameSettings.currentrollmaxval=jsonData.currentrollmaxval;
												  	  gameSettings.currentselectrow=jsonData.currentselectrow;
												  gameSettings.currentselectedcolumn=jsonData.currentselectedcolumn; 													  
													  	  gameSettings.roundcount=jsonData.roundcount;
														  	  gameSettings.topObjectCount=jsonData.topObjectCount
															  	  gameSettings.bottomObjectCount=jsonData.bottomObjectCount 
																  gameSettings.isallowednextaction=jsonData.isallowednextaction;
																  gameSettings.isnextactionforcurrentplayer=jsonData.isnextactionforcurrentplayer
																  	  gameSettings.isdoreroll= jsonData.isdoreroll
															gameSettings.gamesetnr=jsonData.gamesetnr;
														gameSettings. movementLogObjectList=jsonData.movementLogObjectList;
															  gameSettings.infotext=jsonData.infotext;
 																  gameSettings.israndomrollaction=jsonData.israndomrollaction;
																  gameSettings.backgroundimg= jsonData.backgroundimg;														  
																  gameSettings.backgroundmusic=jsonData.backgroundmusic;
																  
														 	  if(gameSettings.whosturn == gameSettings.WhoMe )
																	{allowGet=false;
																setTimeout(function(){ allowPost=true;}, 300);lastPostData="";
																addTextToLog("<i>It's your turn!</i><br>");} 
																
																if(gameSettings.isEndGame){	 
   setTimeout(function(){ResetGame(); }, 300);allowGet=true;  allowPost=false }
															
																  updateGuiValues();
   
  });// Get
}}
function PostProject(isWithoutNotice)
{
    if(lastPostData != gameSettings  ){
		lastPostData  = Object.assign({}, gameSettings, {});
 try{
   var xhttp = new XMLHttpRequest();   
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
  			setTimeout(function(){//allowGet=true;
			console.log(gameSettings);
																			 	  if(gameSettings.whosturn != gameSettings.WhoMe )
																	{ 	allowPost=false;setTimeout(function(){allowGet=true;}, 300);
																if(!isWithoutNotice){lastPostData="";
																addTextToLog("<i>Your turn ended.</i><br>");}} 

			}, 500);

     }
  }; 
  xhttp.open("POST", "Post2D", true); 
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
xhttp.send(JSON.stringify(gameSettings));  
} catch(err){console.log(err);}
  }
}


function MultiplayerInterval(){

	window.setInterval(function() {
  var elem = document.getElementById('chatboxdata');  elem.scrollTop = elem.scrollHeight;
    var elemB = document.getElementById('divGameLog');  elemB.scrollTop = elemB.scrollHeight;



   if(gameSettings.isMultiplayer){
 
 GetNonTurnContent(); 

   
   chatFeedTimer+=1;
if(chatFeedTimer >= 1){chatFeedTimer=0;// ok 1x 3s atm => do note, longer wait, delays in text feedback

  //CHAT////
 
  $.get( "/chat"+admincode+"?", function( data ) {
 var splitData=decodeURIComponent(data).split("\n");
 console.log(splitData);
 var filtData= splitData.filter(v=>v!=''); 
  if(filtData.length >0){
    var filtDataString = filtData.join("<br>").trim()+"<br>";
  if(lastChatEntry !=filtDataString){
   addTextToLog(filtDataString.replace(lastChatEntry,""));
   lastChatEntry=filtDataString;
  }
  
  }
 });
  }}
    
  }, 3000);}
      
		  var isNextMessageAllowed=true;
  	function SendchatMessage(isWithoutTimeInfo)
		{   
		if(!isNextMessageAllowed){return}
		isNextMessageAllowed=false;
		setTimeout(function(){ 	isNextMessageAllowed=true; }, 1000);
		var dateSend= displayTime() ;
	//	var residuDate = dateSend.split(":"); > .replace(":"+residuDate[residuDate.length-1],"") 
	var sendString="";
	if(!isWithoutTimeInfo){
			  sendString=(" /chat"+admincode+"?"+encodeURIComponent("["+dateSend+ "] "+ pname+": "+document.getElementById("chatboxrespons").value)).trim();

	}
	else{
			  sendString=(" /chat"+admincode+"?"+encodeURIComponent( document.getElementById("chatboxrespons").value)).trim();

		
	}
		$.get( sendString, function( data ) {
   document.getElementById("chatboxrespons").value = "";
   //var convData = decodeURI(data);
   		   });}
 		
   	function SendchatMessageB(isWithoutTimeInfo)
		{   
		if(!isNextMessageAllowed){return}
		isNextMessageAllowed=false;
		setTimeout(function(){ 	isNextMessageAllowed=true; }, 1000);

		var dateSend= displayTime() ;
	//	var residuDate = dateSend.split(":"); > .replace(":"+residuDate[residuDate.length-1],"") 

	var sendString="";
	if(!isWithoutTimeInfo){
			  sendString=(" /chat"+admincode+"?"+encodeURIComponent("["+dateSend + "] "+ pname+": "+document.getElementById("chatboxresponsB").value)).trim();

	}
	else{
			  sendString=(" /chat"+admincode+"?"+encodeURIComponent( document.getElementById("chatboxresponsB").value)).trim();

		
	}
		$.get( sendString, function( data ) {
   document.getElementById("chatboxresponsB").value = "";
    		   });}
				 $("#chatboxrespons").keyup(function(event){
    if(event.keyCode == 13){
       SendchatMessage();
    }
});
				 $("#chatboxresponsB").keyup(function(event){
    if(event.keyCode == 13){
       SendchatMessageB();
    }
});