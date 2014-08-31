function millisecondsToTime(milli)
{
      var milliseconds = milli % 1000;
      var seconds = Math.floor((milli / 1000) % 60);
      var minutes = Math.floor((milli / (60 * 1000)) % 60);

      return minutes + ":" + seconds + "." + milliseconds;
}
var stopper=
{
  start: function ()
  {
    this.startDate=new Date();
    this.getCurrentDate();
    this.step=100;
    var stopper=this;
    this.timer=setInterval(function ()
    {
      stopper.getCurrentDate();
    },this.step);
  },
  stop: function ()
  {
    clearInterval(this.timer);
  },
  getCurrentDate: function ()
  {
      //console.log(this.startDate);
      
    this.currentDate=new Date();
    this.time=this.currentDate-this.startDate;
    this.printTime(this.time);
    
  },
  printTime: function (time)
  {
      
    var msecs=time%1000;
    time=Math.floor(time/1000);
    var secs=time%60;
    time=Math.floor(time/60);
    var mins=time%60;
    time=Math.floor(time/60);
    var hours=time;
    document.getElementById("timer").innerHTML=hours+":"+mins+":"+secs;
    
    
    //console.log("idő: "+hours+":"+mins+":"+secs+"."+msecs);
  }
};



//global variables
var parent = document.getElementById('canvas-container');
var container = document.getElementById('main-view');
var homeView = document.getElementById('home-view');
var homeViewControllers = document.getElementById('HomeViewControllers');
var settings = document.getElementById('settings-view');
var main = document.getElementById('main-id');
var winWIDTH = window.innerWidth;
var boxWIDTH = window.innerWidth-20;
var winHEIGHT = window.innerHeight;
var boxHEIGHT = window.innerHeight-60;
var bW = Math.floor(window.innerWidth / 15)-5;
var bH = Math.floor((window.innerHeight-90) / 10)-5;
if (bW > bH) bW = bH;
var GameType = 'hero';
var GameLevel = 6;
var GameSpeed = 100;
var GameScore = 0;
var GameCombo = 0;
var boxColumns = 10;
var boxRows = 10;
//var sForm = document.getElementById('settingForm');
var facebookLoginBox = true;
var allBrickets = new Array();
//var ctx = main.getContext("2d");

var player = {
      name: "Vendég",
      id: 0,
      fid: 0,
      score: 0,
      time: "",
      lastTime: 0
};

var cords = {
	lbDiv: '',
	color:'',
	x: 0,
	y: 0,
	id: 0
};

var gl = null;
var gNum = 0;
			
var boxItemNum = 100;



var lastboxItemNum = boxItemNum;
		
    var Game = {
      init: function(){
            if (facebookLoginBox) {
              
            } 
            Game.start();
            
      },
      start: function(){
            Game.cButton("startHeroBtn", "HERO", "", "", "", "", Game.goView, 'startBtn', homeViewControllers);
            Game.cButton("startSasBtn", "SASSZEM", "", "", "", "", Game.goView, 'startBtn', homeViewControllers);
            Game.cButton("homeBtn", "Home", "0px", "0px", "", "", Game.goView, 'controllBtn', container);
            Game.cButton("settingsBtn", "Settings", "0px", "", "", "0px", Game.goView, 'settingsBtn', homeView);
            Game.cButton("settingsBtn", "Settings", "0px", "", "", "0px", Game.goView, 'settingsBtn', container);
            Game.cButton("homeBtn", "Home", "0px", "0px", "", "", Game.goView, 'controllBtn', settings);
            Game.cButton("startBtn", "Game", "0px", "", "", "0px", Game.goView, 'controllBtn', settings);
            Game.hText("score", "Score:", "h2", "70px", "10px", "gameScore", container);
            Game.hText("level", "Level: <span>1</span>", "h2", "70px", "45%", "gameScore", container);
            Game.hText("levelText", "Level: <span>1</span>", "h2", "50%", "20%", "levelText", container);
            Game.hText("timer", "00:00:00", "h2", "70px", "75%", "gameScore", container);
            $("#welcomeMessage").insertBefore(document.getElementById("startSasBtn"));
            Game.defaultData();
            Game.updateSettings();
            
            Game.getDB();
            
            //demoMode();
      },
      restart: function(){
      			window.location.reload()
    	},
      share: function(){
      			postToFeed();
            return false;
    	},
        cButton: function(id, text, top, left, bottom, right, eventName, className, parent)
        {
	      
       	
          var newButton = document.createElement('button');
          newButton.innerHTML = text;
          if (left!="") { newButton.style.left = left; }
          if (top!="") { newButton.style.top = top; }
		  if (bottom!="") { newButton.style.bottom = bottom; }
		  if (right!="") { newButton.style.right = right; }
          newButton.id = id;
          newButton.style.zIndex = "97";
          newButton.className = className;
          newButton.addEventListener("click", eventName);
          if (className == "startBtn")
          {
            parent.insertBefore(newButton, parent.firstChild);
          } else {
            parent.appendChild(newButton);
          }
		},
		hText: function(id, text, type, top, left, className, parent)
		{
			
			var newText = document.createElement(type);
			newText.id = id;
			newText.style.top = top;
			newText.style.left = left;
			newText.style.position = "absolute";
			if (id!="levelText") { 
				newText.style.zIndex = 9;
			} 
			newText.className = className;
			newText.innerHTML = text;
			parent.appendChild(newText);
		
		},
    hDialog: function(id, text, type, top, left, className, parent)
		{
			
			var newText = document.createElement(type);
			newText.id = id;
			newText.style.top = top;
			newText.style.left = left;
			newText.style.position = "absolute";
			newText.className = className;
			newText.innerHTML = text;
			parent.appendChild(newText);
		
		},
		cBrick: function(id, x, y, color, num, isDisplay)
		{
                     if (bW > bH) bW = bH;
                     
			var newBrick = document.createElement('div');
			newBrick.style.top = (y*bH)+"px";
			newBrick.style.left = (x*bW)+"px";
			newBrick.style.width = (bW-3)+"px";
			newBrick.style.height = (bH-3)+"px";
                        //newBrick.style.height = (bH-3)+"px";
			newBrick.className = "bricket color"+color+"";
			newBrick.id = id;
			newBrick.style.display = 'block';
			newBrick.addEventListener("click", clickBrick, false);
			main.appendChild(newBrick);
			
		},
		goView: function(e)
		{
		 var left = 0
  		 var currPos = String(parent.className);
  		 var toPos = 0;
		 
  		 if ((e.target.id == "startSasBtn" || e.target.id == "startHeroBtn") && currPos.match(/homeView/g))
  		 {
			
                        
                        parent.className = "container gameView";
                        parent.style.marginLeft = -(winWIDTH)+"px";
			if (timer) {
                            stopper.stop();
                        }
                        stopper.start();
                        
  		 	toPos = 1;
  		 		if (e.target.id == "startSasBtn") {
                                        
                                        Game.updateSettings(true);
  		 			GameType = "sas";
		  		 	Game.buildPlacc(false);
  		 		} else {
  		 			
					Game.updateSettings(true);
	  		 		GameType = "hero";	
		  		 	Game.buildPlacc(true);
  		 		}
  		 	
  		 }
  		  if (e.target.id == "settingsBtn" && currPos.match(/homeView/g))
  		 {
  		 	toPos = 2;
  		 	parent.className = "container settingsView";
            parent.style.marginLeft = -(2*winWIDTH)+"px";
            
  		 	Game.updateSettings();
  		 }

  		 if (e.target.id == "homeBtn" && currPos.match(/gameView/g))
  		 {
  		 	toPos = -1;
                        
			parent.className = "container homeView";
                        parent.style.marginLeft = "0px";
  		 }
  		 if (e.target.id == "settingsBtn" && currPos.match(/gameView/g))
  		 {
  		 	toPos = 1;
			parent.className = "container settingsView";
                        parent.style.marginLeft = -(2*winWIDTH)+"px";
                        
  		 	Game.updateSettings();
  		 }
  		 
  		 if (e.target.id == "startBtn" && currPos.match(/settingsView/g))
  		 {
  		 	toPos = -1;
			parent.className = "container gameView";
      parent.style.marginLeft = -(winWIDTH)+"px";
  		 	Game.updateSettings();
  		 	Game.buildPlacc(false);
  		 }
  		 if (e.target.id == "homeBtn" && currPos.match(/settingsView/g))
  		 {
  		 	toPos = -2;
			parent.className = "container homeView";
      parent.style.marginLeft = "0px";
  		 	Game.updateSettings();
  		 }
  		
		},
		makeRnd: function()
		{
			if (GameType == 'hero')
			{
				var randomnumber=Math.floor(Math.random()*GameLevel);
			} else {
				var randomnumber=Math.floor(Math.random()*4);
			}
			return randomnumber;
		},
		getBrick: function(coords) {
			
                        
                        
			if (coords.x >= 0 && coords.y >= 0 && coords.x < boxRows && coords.y < boxColumns)
			{
				if (document.getElementById("brick_"+coords.x+"_"+coords.y))
				{
					return document.getElementById("brick_"+coords.x+"_"+coords.y);
				}
			}
			return false;
		},
		gravity: function() {
			var isFallen = false;
			var gravityItems = [];
			var rowItems = [];
			var iNum = 0;
			var row = boxRows;
			var col = boxColumns;			
			
                        for (var x = 0; x < row-1; x++)
				{
                                for (var y = 0; y < col ; y++)
                                {
                                    //console.log(Game.getBrick({x: x, y: y}));
                                    
                                    
					if ( Game.getBrick({x: x, y: y}) && Game.getBrick({x: x+1, y: y}) == false) {
                                                
						Game.getBrick({x: x, y: y}).style.top = parseInt(Game.getBrick({x: x, y: y}).style.top)+Number(bH)+'px';			
						Game.getBrick({x: x, y: y}).id = "brick_"+(x+1)+"_"+y;
						isFallen = true;
					}		
					
				}		

			}
				
			if (isFallen)
			{
				Game.gravity();
			} 
			
		},
		slide: function() {
			var row = Number(boxRows);
			var col = Number(boxColumns);	
			var rowItems = new Array();
                                
			var isSlide = false;						
				
					for( var c = 1; c < col; c++)
					{
					if (Game.getBrick({x: (row-1), y: c}) && Game.getBrick({x: (row-1), y: (c-1)}) == false)
						{
							for (var r=0; r < col; r++)
							{
								if (Game.getBrick({x: r, y: c}))
								{
                                                                    rowItems.push({x: r, y: c});
								}
							}						
						}
					}
				
				if (rowItems.length > 0)
				{
					for (var i in rowItems)
					{
						Game.getBrick({x: (rowItems[i].x), y: (rowItems[i].y) }).style.left = parseInt(Game.getBrick({x: (rowItems[i].x), y: (rowItems[i].y) }).style.left) - Number(bW) + "px";
						Game.getBrick({x: (rowItems[i].x), y: (rowItems[i].y) }).id = "brick_"+(rowItems[i].x)+"_"+(rowItems[i].y-1);
						isSlide = true;
					}
				}
				if (isSlide)
				{
				Game.slide();
				}
		},
		checkBrick: function(coords) {

			var deleteItems = {};
			var dNum = 0;
			if (Game.getBrick({x: coords.x - 1, y: coords.y}) && Game.getBrick({x: coords.x - 1, y: coords.y}).className == coords.color) {
				dNum+=1;
				deleteItems = {x: coords.x - 1, y: coords.y};
			}
			if (Game.getBrick({x: coords.x, y: coords.y - 1}) && Game.getBrick({x: coords.x, y: coords.y - 1}).className == coords.color) {
				dNum+=1;
				deleteItems = {x: coords.x , y: coords.y - 1};
			}
			if (Game.getBrick({x: coords.x + 1, y: coords.y}) && Game.getBrick({x: coords.x + 1, y: coords.y}).className == coords.color) {
				dNum+=1;
				deleteItems = {x: coords.x + 1, y: coords.y};
			}
			if (Game.getBrick({x: coords.x, y: coords.y + 1}) && Game.getBrick({x: coords.x, y: coords.y + 1}).className == coords.color) {
				dNum+=1;
				deleteItems = {x: coords.x, y: coords.y + 1};
			}
			
			GameCombo = dNum;
				
				if(dNum === 0) {
					return false;
				} else if ( dNum >= 2) {
					return true;
				} else {
					if (coords.tried) {
						return false;
					} else {
						deleteItems.color = coords.color;
						deleteItems.tried = true;
						return Game.checkBrick(deleteItems);
					}
				}
		
		},
		getCords: function(div){
		var cords = {
			x: 0,
			y: 0,
			color: "",
			tried: false
			};
			if (!div.id) {
				return false;
			}
			var attrib = (div.id).split("_");
			cords.x = parseInt(attrib[1]);
			cords.y = parseInt(attrib[2]);
			cords.color = div.className;

		return cords;
		},
		checkLevel: function(){
			allBrickets = main.getElementsByTagName("div");
			if (allBrickets.length == 100) return true;
			//console.log("all"+allBrickets.length);
			for(var n in allBrickets)
			{
			if (Game.getCords(allBrickets[n]))
			//console.log(Game.testBrick(Game.getCords(allBrickets[n])));
			
				if (Game.checkBrick(Game.getCords(allBrickets[n])))
				{
					return true;
				}

			}

			return false;
		},
		deleteBrick: function(coords){

			var color = Game.getBrick({x: coords.x, y: coords.y}).className;
						
			var cNum = 0;
					var step = function (coordsin) {
						var gb;
						cNum++;
						gb = Game.getBrick({x: coordsin.x, y: coordsin.y});
							
						if (gb && gb.className === color) {
							main.removeChild(Game.getBrick({x: coordsin.x, y: coordsin.y}));			
							GameScore = Number(GameScore)+ 1 ;
							step({x: coordsin.x - 1, y: coordsin.y});
							step({x: coordsin.x, y: coordsin.y - 1});
							step({x: coordsin.x + 1, y: coordsin.y});
							step({x: coordsin.x, y: coordsin.y + 1});
						}
					};
					step(coords);
					
				Game.gravity();
				Game.slide();;
				GameCombo = cNum;
		},
		defaultData: function() {
			if (typeof(Storage)!=="undefined") {
				GameType = 'hero';
				GameLevel = 10;
				GameSpeed = 100;
				GameScore = 0;
				GameCombo = 0;
				boxColumns = 6;
				boxRows = 6;
				bW = Math.floor(boxWIDTH/Number(boxColumns));
				bH = Math.floor((boxHEIGHT-55)/Number(boxRows));
                                if (bW > bH) bW = bH;

			} else {
				Game.debug(428, "Sorry! No web storage support..");
			}
		},
		getDB: function() {
      
			var db = openDatabase('gamedata', '1.0', 'Kocska DB', 2 * 1024 * 1024);
			db.transaction(function (tx) {  
			   tx.executeSql('CREATE TABLE IF NOT EXISTS SCORES (id unique, name, fid, score, date, time)');
			   //tx.executeSql('DROP TABLE SCORES');
			});
			
			db.transaction(function (tx) {
			   tx.executeSql('SELECT * FROM SCORES order by score desc, time asc limit 10 ', [], function (tx, results) {
			   var len = results.rows.length, i;
			   
		   		
			   for (i = 0; i < len; i++){
            var n = i+1;
            var table = document.getElementById("scoreTable");
            
            console.log(n+" / "+results.rows.item(i).name+" / "+results.rows.item(i).score);
            
            var lastRow = table.rows.length;
            var row=table.insertRow(lastRow);
            var cell1=row.insertCell(0);
            var cell2=row.insertCell(1);
            var cell3=row.insertCell(2);
            var cell4=row.insertCell(3);
            cell1.innerHTML="<b>"+n+".</b>";
            cell2.innerHTML=results.rows.item(i).name;
            cell3.innerHTML=results.rows.item(i).score;
            cell4.innerHTML=results.rows.item(i).time;
            player.id = n+1;

			   }
				 }, null);
			});
			
			
		},
		levelUpText: function(text){
			levelText.innerHTML =  "Level: <span>" + text + "</span>";
			levelText.className = levelText.className + " active";
			
			setTimeout(function(){levelText.className = "levelText";},1000);
			
			
			
		},
		updateSettings: function(getNewData){
                    $(".main").css({width: winWIDTH+"px", height: winHEIGHT+"px"});
                    $(".container").css({width: (3*winWIDTH)+"px"});
                    $(".views").css({width: winWIDTH+"px", height: winHEIGHT+"px"});
                    $(".gameView").css({marginLeft: - winWIDTH+"px"});
                    $("#HomeViewControllers").css({marginTop: (winHEIGHT/3)+"px"});
                    
                    $(".game-view").css({width: boxColumns*bW+"px", margin: "50px auto"});
                    
                    
			if (getNewData)
			{
			bW = Math.floor(boxWIDTH/Number(boxColumns));
			bH = Math.floor((boxHEIGHT-55)/Number(boxRows));
                        if (bW > bH) bW = bH;
			} 
			    main.innerHTML = "";
			    
		},
		buildPlacc: function(levelup, rows, cols)
		{
		
                
			var row = Number(boxRows);
			var col = Number(boxColumns);
			
			if (levelup === true)
			{
					for (var i=0; i<row; i++)
					{
						for (var j = 0; j <col; j++)
						{
							
							if (!Game.getBrick({x: i, y: j}))
							{
							Game.cBrick('brick_'+i+'_'+j, j, i, Game.makeRnd(), i, false);
							}
						}
					}
				
			} else {
				
				for (var i=0; i<row; i++)
				{
					for (var j = 0; j < col; j++)
					{
                                            
                                            
                                            Game.cBrick('brick_'+i+'_'+j, j, i, Game.makeRnd(), i, false);
					}
				}
			
			}
		},
		debug: function(line, text){
			var d = new Date();
			var time=d.toLocaleString();
			//debug.innerHTML += time + "-" + line + ": " + text + "\r\n";
      console.log(time + "-" + line + ": " + text);
		
		return false;
		}
		
	};
	
	
	
  function clickBrick(e){
                    
                    
			var attrib = $(this).attr('id').split("_");
			var elemNum = main.getElementsByTagName("div");
			var newLevel = false;
			cords.y = parseInt(attrib[2]);
			cords.x = parseInt(attrib[1]);
			cords.color = this.className; 
			var klicked = true;		
				
				
				if (Game.checkBrick(cords))
				{
					Game.deleteBrick(cords);
				}
				if (GameScore > 0) {
            GameScore = Number(GameScore) + Number(GameCombo);
            player.score = GameScore;
            player.time = document.getElementById("timer").innerHTML;
        }
				
				$("#score").html("Score: <span>"+GameScore+"</span>");
				$("#level").html("Level: <span>"+(Number(GameLevel)-3)+"</span>");
				
				Game.debug(586, "check"+Game.checkLevel());
				
				
				
				if (!Game.checkLevel() && elemNum.length != (Number(boxRows) * Number(boxColumns) ) )
				{
            var lastID = 0;
            var d = new Date();
            var now = d.getTime();
            
            var db = openDatabase('gamedata', '1.0', 'Kocka DB', 2 * 1024 * 1024);
            db.transaction(function (tx) {
                  
                  if (player.name == "Guest") {
                        player.name += " "+player.id+". ";
                  }
                  //console.log('INSERT INTO SCORES (id, name, fid, score, time) VALUES ('+player.id+', "'+player.name+' '+player.id+'.", '+player.id+', '+player.score+', '+now+')');
                  
                  tx.executeSql('INSERT INTO SCORES (id, name, fid, score, date, time) VALUES ('+parseInt(player.id)+', "'+player.name+'", '+player.fid+', '+parseInt(player.score)+', '+now+', "'+player.time+'")');            
            });
              if (GameType=="sas" && GameLevel< 15) {
                  GameLevel = Number(GameLevel) + 1 ;                    
                  boxColumns=Number(boxColumns)+1;
                  boxRows=Number(boxRows)+1;
                  bW = Math.floor(winWIDTH/boxColumns)-5;
                  bH = Math.floor((winHEIGHT-90)/boxRows)-5;
                  if (bW > bH) bW = bH;
                  main.innerHTML = "";
                  Game.buildPlacc(false);

                  Game.levelUpText((Number(GameLevel)-3));				
                  level.innerHTML = "Level: <span>"+(Number(GameLevel)-3)+"</span>";
                    if (Number(GameLevel) > 3) {
                      main.className = "level0"+(Number(GameLevel)-3);
                    }   
   
            } else {
              
                console.log(GameType+"."+GameLevel);
                
                Game.hDialog("end", "Game Over", "div", "150px", "30%", "gameOver", container);
                
                var end = document.getElementById("end");
                Game.hText("score", "Score:"+player.score, "p", "55px", "20px", "gameScore", end);
                Game.hText("share", "Share with friends!", "p", "90px", "20px", "gameScore", end);
                Game.cButton("endBtn", "Replay", "", "", "20px", "20px", Game.restart, 'endBtn', end);
                Game.cButton("shareBtn", "Share", "", "20px", "20px", "", Game.share, 'shareBtn', end);
                Game.hDialog("layer", "", "div", "", "", "gameLayer", container);
                newLevel = true;
                klicked = false
            }
				} 
                                
                                
       
				
		};





function demoMode() {
	document.getElementById("startHeroBtn").style.display = "none";
	document.getElementById("settingsBtn").style.display = "none";
	console.log("demoMode");
};

//end window onload
        
                                                                                                                                    
         FB.init({                                                                                                                                                           
           appId      : '448852595204459', // App ID                                                                                                                         
           status     : true, // check login status                                                                                                                          
           cookie     : true                                                                                                                                                 
         });                                                                                                                                                                 

         // Check if the current user is logged in                                                                                                                           
         // and has authorized the app                                                                                                                                       
         FB.getLoginStatus(function(response) {
            //console.log(response);
           // Check the result of the user                                                                                                                                   
           if(response && response.status == 'connected') {                                                                                                                  
             // The user is connected to Facebook                                                                                                                            
             // and has authorized the app.                                                                                                                                  
             // Now personalize the user experience                                                                                                                          

             FB.api('/me', function(response) {
                  player.name = response.first_name;
                  player.fid = response.id;
                  
               var message = document.getElementById('welcomeMessage');
               message.innerHTML = 'Welcome, ' + response.first_name;
               console.log(response);
               console.log(response.birthday);
                var time = new Date();
                  $.post('log.php', {time: time, player: player}, function(){
                        console.log("Save Data");
                  });
             });                                                                                                                                                             
           } else {                                                                                                                                                          
            var time = new Date();
                  $.post('log.php', {time: time, player: player}, function(){
                        console.log("Save Data");
                  });                                                                                                         
           }                                                                                                                                                                 
         });
      //log statistic
     
      
      function postToFeed() {

        // calling the API ...
        var obj = {
          method: 'feed',
          redirect_uri: 'http://davidbreuer.hu/games/kocka/',
          link: 'http://davidbreuer.hu/games/kocka/',
          picture: 'http://davidbreuer.hu/games/kocka/images/logo.png',
          name: 'Kocka game',
          caption: 'My score: '+player.score+'.',
          description: 'Come and beat my highscore!'
        };

        function callback(response) {
          console.log("Post ID: " + response['post_id']);
        }

        FB.ui(obj, callback);
      }
      
       


       