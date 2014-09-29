(function(){

	var SnakeAndLadder = {
		noofPlayers: 2,
		checkboard: 5,
		snakes : [
					{ p1 : 22, p2: 4},
					{ p1 : 17, p2: 8},
					{ p1 : 11, p2: 2}
				],
		ladders : [
					{ p1 : 5, p2: 16},
					{ p1 : 9, p2: 20},
					{ p1 : 14, p2: 23}
				],
		snakeBite: function(value){
			var newVal = 0;
			SnakeAndLadder.snakes.forEach(function(element, index){
				if(element.p1 === value)
					newVal = element.p2;
			});
			return newVal;
		},
		climbLadder: function(value){
			var newVal = 0;
			SnakeAndLadder.ladders.forEach(function(element, index){
				if(element.p1 === value)
					newVal = element.p2;
			});
			return newVal;
		}
	}

	function randomIntFromInterval(min, max){
	    return Math.floor(Math.random()*(max-min+1)+min);
	}

	function ContextManager(container, canvasId, widthOfCanvas, heightOfCanvas){
		this.widthOfCanvas = typeof widthOfCanvas !== "undefined" ? widthOfCanvas : 650;
		this.heightOfCanvas = typeof heightOfCanvas !== "undefined" ? heightOfCanvas : 650;
		this.numberOfRect = 0;
		this.container = container;
		this.canvasId = canvasId;		
		this.context = null;
		this.boardPointCollection = [];
		this.colorsOfPawns = [];
	}

	ContextManager.prototype.init = function(){
			var canvas = document.getElementById(this.canvasId);
			var box = document.getElementById(this.container);
			canvas.width = this.widthOfCanvas;//box.clientWidth;
			canvas.height = this.heightOfCanvas;//box.clientHeight;
			this.context = canvas.getContext("2d");
			this.context.clearRect(0, 0, this.widthOfCanvas, this.heightOfCanvas);
	};

	ContextManager.prototype.checkboard = function(numberOfRect) {
			this.numberOfRect = numberOfRect;
			var totalNumberofBlocks = this.numberOfRect * this.numberOfRect;
			var widthOfEachContainer = (this.widthOfCanvas - 50) / this.numberOfRect;
			var heightOfEachContainer = (this.heightOfCanvas - 50)/ this.numberOfRect;
			this.context.lineWidth = 1;
			this.context.strokeStyle = "black";
			this.context.font = "20px Calibri";

			for(var i=0; i<this.numberOfRect; i++){
				var startYAxis = i * heightOfEachContainer;
				for(var j=0; j<this.numberOfRect; j++){
					var startXAxis = j * widthOfEachContainer;
					this.context.beginPath();
					this.context.strokeRect(startXAxis, startYAxis, widthOfEachContainer, heightOfEachContainer);

					var textX = startXAxis + (widthOfEachContainer / 2);
					var textY = startYAxis + (heightOfEachContainer / 2);
					this.context.fillText(" " +  totalNumberofBlocks + " ", textX , textY );
					this.context.closePath();

					var cellPoint = { x: textX, y: textY };
					var obj = {};
					obj[totalNumberofBlocks] = cellPoint;
					this.boardPointCollection.push(obj);

					totalNumberofBlocks--;
				}
			}
		};

	ContextManager.prototype.cellFinder = function(cellValue){
			return function(element, index, arr){
				return (typeof element[cellValue] !== "undefined");
			};
		};

	ContextManager.prototype.drawSnake = function(firstCell, secondCell){
			var firstPoints = this.boardPointCollection.filter(this.cellFinder(firstCell));
			var secondPoints = this.boardPointCollection.filter(this.cellFinder(secondCell));
			if(firstPoints.length < 0 && secondPoints.length < 0) 
				return;
			firstPoints = firstPoints[0];
			secondPoints = secondPoints[0];
			var xc = (firstPoints[firstCell].x + secondPoints[secondCell].x) / 2 + 15;
			var yc = (firstPoints[firstCell].y + secondPoints[secondCell].y) / 2 + 15;
			this.context.beginPath();
			this.context.moveTo(firstPoints[firstCell].x, firstPoints[firstCell].y);
			this.context.quadraticCurveTo(firstPoints[firstCell].x, firstPoints[firstCell].y, xc, yc);
			this.context.quadraticCurveTo(firstPoints[firstCell].x, firstPoints[firstCell].y, secondPoints[secondCell].x, secondPoints[secondCell].y);
			this.context.quadraticCurveTo(secondPoints[secondCell].x, secondPoints[secondCell].y, xc, yc);
			this.context.quadraticCurveTo(secondPoints[secondCell].x, secondPoints[secondCell].y, firstPoints[firstCell].x, firstPoints[firstCell].y);			
			this.context.fillStyle = "#000000";
			this.context.fill();
			this.context.closePath();

			this.context.beginPath();
			this.context.arc(firstPoints[firstCell].x, firstPoints[firstCell].y, 15, 2 * Math.PI, false);
			this.context.fillStyle = "#808080";
			this.context.fill();
			this.context.closePath();			
		};

	ContextManager.prototype.drawLadder = function(firstCell, secondCell){
			var firstPoints = this.boardPointCollection.filter(this.cellFinder(firstCell));
			var secondPoints = this.boardPointCollection.filter(this.cellFinder(secondCell));
			if(firstPoints.length < 0 && secondPoints.length < 0) 
				return;
			firstPoints = firstPoints[0];
			secondPoints = secondPoints[0];

			this.context.beginPath();
			this.context.moveTo(firstPoints[firstCell].x, firstPoints[firstCell].y);
			this.context.lineTo(secondPoints[secondCell].x, secondPoints[secondCell].y);
			this.context.lineWidth = 3;
			this.context.stroke();
			this.context.closePath();

			this.context.beginPath();
			this.context.moveTo(secondPoints[secondCell].x + 20, secondPoints[secondCell].y + 10);
			this.context.lineTo(firstPoints[firstCell].x + 20, firstPoints[firstCell].y + 10);
			this.context.lineWidth = 3;
			this.context.stroke();
			this.context.closePath();
		};

	function getRandomColor() {
	    var letters = '0123456789ABCDEF'.split('');
	    var color = '#';
	    for (var i = 0; i < 6; i++ ) {
	        color += letters[Math.floor(Math.random() * 16)];
	    }
	    return color;
	}

	ContextManager.prototype.drawPawns = function(pawns, numberOfPawns) {
			var radius = 15;
			var x = 0;
			var y = 0;
			this.context.beginPath();
			if (!pawns){
				for(var i=1; i<=numberOfPawns; i++){
					var colorVal = getRandomColor();
					this.colorsOfPawns.push(colorVal);
					this.context.globalCompositeOperation = 'source-over';    
				    // draw circle
				    this.context.fillStyle = colorVal;
				    this.context.beginPath();
				    
				    x = (this.widthOfCanvas - 50) + 25 + i;
				    y = (this.heightOfCanvas - 50) + 5 - ( 2 * radius * i);
				    this.context.arc(x, y, radius, 0, Math.PI *2, true);
				    this.context.fill();
				}
			}
			else{
				buildCanvas(this);
				for(var i=0; i<numberOfPawns; i++){					
					var points = this.boardPointCollection.filter(this.cellFinder(pawns[i]));
					var colorVal = this.colorsOfPawns[i];
					this.context.globalCompositeOperation = 'source-over';    
				    // draw circle
				    this.context.fillStyle = colorVal;
				    this.context.beginPath();
				    
				    points = points[0];

				    if(typeof points === "undefined"){
					    x = (this.widthOfCanvas - 50) + 25 + i * 3;
					    y = (this.heightOfCanvas - 50) + 5 - ( 2 * radius * i);
				    }
				    else{
				    	x = points[pawns[i]].x;
				    	y = points[pawns[i]].y;
				    }
				    this.context.arc(x, y, radius, 0, Math.PI *2, true);
				    this.context.fill();
				}
			}
			this.context.closePath();
	};

	function Player(name){
		this.playerName = name;
		this.playingTurn = false;
		var position = 0;
		this.setPosition = function(pos){
			position = pos;
		};
		this.getPosition = function(){
			return position;
		};
		var rolledValue = 0;
		this.setRolledValue = function(val){
			rolledValue = val;
		};
		this.getRolledValue =  function(){
			return rolledValue;
		};
	}	

	function PlayerManager(numberOfPlayers){
		this.numberOfPlayers = numberOfPlayers;
		var players = (function(){
							var playerArr = [];
							for(var i=1;  i<=numberOfPlayers; i++){
								playerArr.push(new Player("Player"+i));
							}
							return playerArr;
						})();
		this.getPlayers = function(){
							return players;
						};	

		var currentPlayerId = null;
		this.setCurrentPlayerId = function(playerName){
			players.some(function(entry, index){
					if(entry.playerName === playerName){
						currentPlayerId = index;
						players[index].playingTurn = true;
					}
					else
						players[index].playingTurn = false;
				});
		};
		this.getCurrentPlayerId = function(){ return currentPlayerId; };
	}

	PlayerManager.prototype.displayDetails = function(gameResults){
		var playersInfo = document.getElementById("divPlayers");
		var players = this.getPlayers();
		playersInfo.innerHTML = "";
		var val = "<div>"
		var playerName = "";
		for(var i=0; i<players.length; i++){
			if(players[i].playingTurn){
				val += '<div style="color:red;">';
				playerName = players[i].playerName;
			}
			else
				val += '<div>'
			val += "<h3>Player: " + players[i].playerName + "</h3><h4>Rolled: " + players[i].getRolledValue() + "</h4></div>";
		}
		gameResults = typeof gameResults === "undefined" ? (playerName === "" ? "NA" : playerName + " played..") : gameResults;
		val += "</div><div><h2>Result: " + gameResults + "</h2></div>";
		playersInfo.innerHTML = val;
	};

	PlayerManager.prototype.serverPlayer = function(drawingFunc){
		var divDiceRole = document.getElementById("divInnerDice");
		divDiceRole.className += " divDiceAnimation ";		

		var playerId = this.getCurrentPlayerId();
		var index = null;
		if (playerId === null)
			index = 0;
		else {
			var length = this.getPlayers().length;
			index = playerId + 1 === length ? 0 : playerId + 1;
		}

		var player = this.getPlayers()[index];

		var diceRollValue = randomIntFromInterval(1, 6);

		var currentValue = player.getPosition();
		if ( currentValue + diceRollValue === (SnakeAndLadder.checkboard * SnakeAndLadder.checkboard)){
			this.displayDetails("The current player wins :)");			
		}
		else if ( currentValue + diceRollValue > (SnakeAndLadder.checkboard * SnakeAndLadder.checkboard)){
			this.displayDetails("Please roll the dice again. !");			
		}
		else {
			var snakeRet = SnakeAndLadder.snakeBite(currentValue + diceRollValue);
			var ladderRet = SnakeAndLadder.climbLadder(currentValue + diceRollValue);
			var pos = 0;
			if(snakeRet > 0 || ladderRet > 0)
				pos = snakeRet > 0 ? snakeRet : ladderRet;				
			else
				pos = currentValue + diceRollValue;
			
			this.setCurrentPlayerId(player.playerName);
			this.getPlayers()[this.getCurrentPlayerId()].setPosition(pos);
			this.getPlayers()[this.getCurrentPlayerId()].setRolledValue(diceRollValue);			

			var pawns = [];
			var arr = this.getPlayers();
			for(var i=0; i<arr.length; i++){
				pawns.push(arr[i].getPosition());
			}
			this.displayDetails(drawingFunc(pawns, arr.length));		
		}
		setTimeout(function(){
			divDiceRole.className = divDiceRole.className.replace( /(?:^|\s)divDiceAnimation(?!\S)/g , '' )
		}, 800);
	};

	function buildCanvas(ctxtManager){
		ctxtManager.init()
		ctxtManager.checkboard(SnakeAndLadder.checkboard);

		for(var i=0; i< SnakeAndLadder.snakes.length; i++){
			ctxtManager.drawSnake(SnakeAndLadder.snakes[i].p1, SnakeAndLadder.snakes[i].p2)	
		}

		for(var i=0; i< SnakeAndLadder.ladders.length; i++){
			ctxtManager.drawLadder(SnakeAndLadder.ladders[i].p1, SnakeAndLadder.ladders[i].p2)
		}		
	}

	document.onreadystatechange = function () {
		if(document.readyState === "complete"){
			var ctxtManager = new ContextManager('divActualBox', 'canBoard');
			buildCanvas(ctxtManager);
			ctxtManager.drawPawns(0, SnakeAndLadder.noofPlayers); //Initial
			
			var playerManager = new PlayerManager(SnakeAndLadder.noofPlayers);
			playerManager.displayDetails();

			var diceDiv = document.getElementById('divInnerDice');
			diceDiv.addEventListener('click', function(){
				playerManager.serverPlayer(ctxtManager.drawPawns.bind(ctxtManager));
			});
		}
	};
})();
