class Circle{
    constructor(posx, posy, Momentumx, Momentumy, Movex, Movey, diameter, Collisions, EdgeCollision){
        this.posx = posx;
        this.posy = posy;
        this.Momentumx = Momentumx;
        this.Momentumy = Momentumy;
        this.Movex = Movex;
        this.Movey = Movey;
        this.diameter = diameter;
        this.Collisions = Collisions;
        this.EdgeCollision = EdgeCollision;
        this.UpThrust = this.UpThrust;
        this.LeftThrust = this.LeftThrust;
        this.DownThrust = this.DownThrust;
        this.RightThrust = this.RightThrust;
        this.BotGrace = this.BotGrace;
    }
}
class Block{
    constructor(width, height, posx, posy, health, uppery, upperx, lowerx, lowery, dead){
        this.health = parseInt(health);
        this.width = parseFloat(width);
        this.height = parseFloat(height);
        this.posx = parseFloat(posx);
        this.posy = parseFloat(posy);
        this.uppery = parseFloat(uppery);
        this.lowery = parseFloat(lowery);
        this.upperx = parseFloat(upperx);
        this.lowerx = parseFloat(lowerx);
        this.dead = parseFloat(dead);
    }
}
Choice();
window.times = -1;
function Choice(Message){
    window.Start = Start;
    let InitialHTML = '<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">'; //this enables the html to use bootstrap
    window.cookie = require("cookie"); //allows the use of the cookies module
    window.cookies = cookie.parse(document.cookie); //reads all the cookies
    if(cookies["Level"] == undefined){ //if cookies hasn't stored the level yet
        document.cookie = cookie.serialize("Level", "1"); //the level of 1 is stored in the cookie
    }
    if(cookies["name"] == null){ //if name doesn't exist
        cookies["name"] = ""; //name is nothing
    }
    if(Message == null){ //if this is the first time playing the game since page loaded
        InitialHTML+= 'Name: <input type="text" id="InpName" value="' + cookies["name"] + '"><p></p>'; //allows the user to input their name
    }else{
        InitialHTML+= Message;
        for(x = 0; x <= NumCircles; x++){
            document.getElementById("SingularCircle" + x).innerHTML.style = ""; //erases all the circles
        }
        for(x = 0; x <= NumBlocks; x++){
            document.getElementById("Block" + x).innerHTML.style = "";// erases all the blocks
        }
    }
    for(var x = 1; x < parseInt(cookies["Level"]); x++){ //iterates through all the levels before your current level
        InitialHTML+= '<button type="button" class="btn btn-info" onclick="window.Start(' + x + ')">Level ' + x + '</button> You achieved the highest score of ' + cookies[x] + '<p></p>'; //displays button for level selection
    }
    InitialHTML+= '<button type="button" onclick="window.Start(' + (parseInt(x)) + ')">Level ' + (parseInt(x)) + '</button>'; //displays button to play current level (button looks different to the others)
    document.write(InitialHTML); //writes all the html
    document.close(); //html has finished loading
}
function Start(level){
    times++; //amount of times the game has been ran in one load (0 means first time) is increased by 1
    if(times == 0){
        document.cookie = cookie.serialize("name",document.getElementById("InpName").value); //stores name put in the html input box as a cookie
    }else{ //removes the Intervals from the game that was previously played
        clearInterval(MainBlockFuncInterval);
        clearInterval(MainFuncInterval);
        clearInterval(CircleCreationInterval);
        clearInterval(NewWallInterval);
        clearInterval(TimeCounter);
    }
    document.write('<div><div id="spikes"></div><div id="border"></div><div id="ExTop"></div><div id="ExBottom"></div><div id="ExLeft"></div><div id="ExRight"></div><div id="MultipleCircles"></div><div id="Blocks"></div>'); //this is the html that the javascript uses to display the css objects
    document.close(); //html finished reloading
    window.level = parseInt(level); //sets required global variables
    window.InBackCol = 0;
    window.MaxSpeed = 2;
    window.stop = 0;
    window.SqVelocity = 0.5 //real velocity is the square root of the value
    window.Row = 0;
    window.NumBlocks = -1;
    window.NumCircles = -1;
    window.CircleClass = [];
    window.BlockClass = [];
    window.end = false;
    window.rightPressed = false;
    window.leftPressed = false;
    window.upPressed = false;
    window.downPressed = false;
    window.DefaultDiameter = parseFloat(window.innerHeight) / 10;
    if(window.innerWidth > window.innerHeight){ //ensures the game is contained in a square
        window.Limitx = window.innerHeight - (DefaultDiameter / parseInt(level));
        window.Limity = Limitx;
    }else{
        window.Limitx = window.innerWidth - (DefaultDiameter / parseInt(level));
        window.Limity = Limitx;
    }
    //var level = 2;
    window.lives = 5;
    document.title = "Level " + String(level) + ", Lives left " + String(lives); //gives level and lives remaining on the tab title
    window.length = Limitx / 6;
    window.Amount = parseInt(Limitx / (length / parseInt(level)));
    window.time = 0;
    BlockVar = document.getElementById("border"); //the border of the game
    BlockVar.type = "text/css";
    BlockVar.style.width = Limitx;
    BlockVar.style.height = window.innerHeight;
    BlockVar.style.position = "fixed";
    BlockVar.style.top = 0;
    BlockVar.style.left = 0;
    BlockVar.style.border="3px solid black";
    amountSpikes = parseInt(Limitx / ((length / 8))) / 2;
    for(x = 0; x < amountSpikes; x++){ //creates all the spikes
        document.getElementById("spikes").innerHTML+= "<div id = spikes" + x + "></div>";
        BlockVar = document.getElementById("spikes" + x);
        BlockVar.style.backgroundRepeat = "no-repeat";
        BlockVar.style.backgroundImage = 'url(spike.png)';
        BlockVar.style.backgroundSize = "contain";
        BlockVar.type = "text/css";
        BlockVar.style.width = length / 8 ;
        BlockVar.style.height = length / 6;
        BlockVar.style.position = "fixed";
        BlockVar.style.top = (window.innerHeight) - (length / 7);
        BlockVar.style.left = (length / 8) * x * 2;
    }
    FirstCircleCreation(NumCircles); //creates the user's balloon
    CircleCreation(NumCircles); //creates a ball
    InitialWall(); //creates the inital wall
    MainBlockFunc()
    ExTop(false);
    ExBottom(false);
    ExLeft(false);
    ExRight(false);
    MainBlockFuncInterval = setInterval(function(){if(end == false){MainBlockFunc()}}, 2.5); //updates the bricks position
    MainFuncInterval = setInterval(function(){if(end == false){MainFunc()}},1); //updates everthing else
    CircleCreationInterval = setInterval(function(){if(end == false){CircleCreation(NumCircles)}},60000); //creates a new ball
    NewWallInterval = setInterval(function(){if(end == false){NewWall()}},20000); //wall increases in thickness
    TimeCounter = setInterval(function(){time++;}, 100); //counts the time elapsing
    document.addEventListener("keydown", keyDownHandler, false); //checks if arrows are pressed
    document.addEventListener("keyup", keyUpHandler, false);
}
function ExTop(on){ //top flame
    BlockVar = document.getElementById("ExTop");
    BlockVar.type = "text/css";
    BlockVar.style.backgroundSize = "contain";
    BlockVar.style.backgroundRepeat = "no-repeat";
    BlockVar.style.flex = 1;
    if(on == true){
        BlockVar.style.width = CircleClass[0].diameter / 3;
        BlockVar.style.height = CircleClass[0].diameter / 2;
        BlockVar.style.position = "fixed";
        BlockVar.style.backgroundImage = 'url(up.png)';
        BlockVar.style.top = CircleClass[0].posy - (CircleClass[0].diameter / 2);
        BlockVar.style.left = CircleClass[0].posx + (CircleClass[0].diameter / 2);
    }else{
        BlockVar.style.width = 0;
        BlockVar.style.height = 0;
        BlockVar.style.position = "fixed";
        BlockVar.style.top = CircleClass[0].posy - (CircleClass[0].diameter / 3);
        BlockVar.style.left = CircleClass[0].posx + (CircleClass[0].diameter / 2.5);
    }

}
function ExBottom(on){ //bottom flame
    BlockVar = document.getElementById("ExBottom");
    BlockVar.type = "text/css";
    BlockVar.style.backgroundSize = "contain";
    BlockVar.style.backgroundRepeat = "no-repeat";
    BlockVar.style.flex = 1;
    if(on == true){
        BlockVar.style.width = CircleClass[0].diameter / 5;
        BlockVar.style.height = CircleClass[0].diameter / 3;
        BlockVar.style.position = "fixed";
        BlockVar.style.backgroundImage = 'url(down.png)';
        BlockVar.style.top = CircleClass[0].posy + CircleClass[0].diameter;
        BlockVar.style.left = CircleClass[0].posx + (CircleClass[0].diameter / 2.5);
    }else{
        BlockVar.style.width = 0;
        BlockVar.style.height = 0;
        BlockVar.style.position = "fixed";
        BlockVar.style.top = CircleClass[0].posy + (CircleClass[0].diameter / 2);
        BlockVar.style.left = CircleClass[0].posx + (CircleClass[0].diameter / 2.5);
    }

}
function ExRight(on){ //right flame
    BlockVar = document.getElementById("ExRight");
    BlockVar.type = "text/css";
    BlockVar.style.backgroundSize = "contain";
    BlockVar.style.backgroundRepeat = "no-repeat";
    BlockVar.style.flex = 1;
    if(on == true){
        BlockVar.style.width = CircleClass[0].diameter / 3;
        BlockVar.style.height = CircleClass[0].diameter / 5;
        BlockVar.style.position = "fixed";
        BlockVar.style.backgroundImage = 'url(right.png)';
        BlockVar.style.top = CircleClass[0].posy + (CircleClass[0].diameter / 2.5);
        BlockVar.style.left = CircleClass[0].posx + CircleClass[0].diameter;
    }else{
        BlockVar.style.width = 0;
        BlockVar.style.height = 0;
        BlockVar.style.position = "fixed";
        BlockVar.style.top = CircleClass[0].posy + (CircleClass[0].diameter / 2);
        BlockVar.style.left = CircleClass[0].posx + (CircleClass[0].diameter / 2.5);
    }

}
function ExLeft(on){ //left flame
    BlockVar = document.getElementById("ExLeft");
    BlockVar.type = "text/css";
    BlockVar.style.backgroundSize = "contain";
    BlockVar.style.backgroundRepeat = "no-repeat";
    BlockVar.style.flex = 1;
    if(on == true){
        BlockVar.style.width = CircleClass[0].diameter / 3;
        BlockVar.style.height = CircleClass[0].diameter / 5;
        BlockVar.style.position = "fill";
        BlockVar.style.backgroundImage = 'url(left.png)';
        BlockVar.style.top = CircleClass[0].posy + (CircleClass[0].diameter / 2.5);
        BlockVar.style.left = CircleClass[0].posx - (CircleClass[0].diameter / 3);
        //BlockVar.style.backgroundSize = (1 / level * 5);
    }else{
        BlockVar.style.width = 0;
        BlockVar.style.height = 0;
        BlockVar.style.position = "fixed";
        BlockVar.style.top = CircleClass[0].posy + (CircleClass[0].diameter / 2);
        BlockVar.style.left = CircleClass[0].posx + (CircleClass[0].diameter / 2.5);
        //BlockVar.style.backgroundSize = (1 / level * 5);
    }

}
function keyDownHandler(event){ //handles all valid keys pressed
    if(event.keyCode == 39){
        rightPressed = true;
    }else if(event.keyCode == 37){
        leftPressed = true;
    }else if(event.keyCode == 40){
        downPressed = true;
    }else if(event.keyCode == 38){
        upPressed = true;
    }
}
function keyUpHandler(event){//handles all keys not being pressed
    if(event.keyCode == 39){
        rightPressed = false;
    }else if(event.keyCode == 37){
        leftPressed = false;
    }else if(event.keyCode == 40){
        downPressed = false;
    }else if(event.keyCode == 38){
        upPressed = false;
    }
}
function RandomNumber(Max){ //generates random number
    return (Math.random() * parseFloat(Max * 2)) - Max;
}
function InitialWall(){ //created a wall
    for(z = 0; z < Amount; z++){
        BlockCreate(z)
    }
    Row++;
}
function NewWall(){ //adds to the wall
    for(n = 0; n < NumBlocks + 1; n++){
        P = BlockClass[n].posy;
        BlockClass[n].posy += parseFloat((length / level) * (13 / 43));
        BlockClass[n].uppery += parseFloat((length / level) * (13 / 43));
        BlockClass[n].lowery += parseFloat((length / level) * (13 / 43));
    }
    InitialWall()
}
function Quadratic(a, b, c){ //works out a quadratic function
    if(Math.pow(parseFloat(b),2) - (4  *parseFloat(a) * parseFloat(c)) < 0){ //if no solutions
        return null;
    }else{
        Values = []
        Values.push(parseFloat(-parseFloat(b) + Math.sqrt(Math.pow(parseFloat(b),2) - (4* parseFloat(a) * parseFloat(c))) / 2* parseFloat(a)));
        Values.push(parseFloat(-parseFloat(b) - Math.sqrt(Math.pow(parseFloat(b),2) - (4 * parseFloat(a) * parseFloat(c))) / 2 * parseFloat(a)));
        return Values;
    }
}


function BlockCreate(l){ //creates a brick
    NumBlocks++;
    BlockClass.push(new Block);
    document.getElementById("Blocks").innerHTML += "<div id=" + "Block" + NumBlocks + "></div>";
    BlockVar = document.getElementById("Block" + NumBlocks);
    BlockVar.type = "text/css";
    BlockVar.style.width = length / level;
    BlockVar.style.height = (length / level) * (13 / 43);
    BlockVar.style.position = "fixed";
    BlockVar.style.background = 'url("Brick.jpg")';
    BlockVar.style.top = 0;
    BlockVar.style.left = (length / level) * z;
    BlockVar.style.backgroundSize = (length / level) / 2;
    //Block.backgroundImage = "Bricks.jpg";
    BlockClass[NumBlocks].width = parseFloat(BlockVar.style.width);
    BlockClass[NumBlocks].height = parseFloat(BlockVar.style.height);
    BlockClass[NumBlocks].posx = parseFloat(BlockVar.style.left);
    BlockClass[NumBlocks].posy = parseFloat(BlockVar.style.top);
    BlockClass[NumBlocks].health = 1;
    BlockClass[NumBlocks].upperx = parseFloat(parseFloat(BlockClass[l].posx) + (parseFloat(BlockClass[l].width) / 1.48));
    BlockClass[NumBlocks].uppery = parseFloat(parseFloat(BlockClass[l].posy))
    BlockClass[NumBlocks].lowerx = parseFloat(parseFloat(BlockClass[l].posx) - (parseFloat(BlockClass[l].width) / 3));
    BlockClass[NumBlocks].lowery = parseFloat(parseFloat(BlockClass[l].posy) - (parseFloat(BlockClass[l].height) / 0.9));
    BlockClass[NumBlocks].dead = false;
}
function MainBlockFunc(){ //updates the position of the bricks
    for(l = 0; l <= NumBlocks; l++){
        Blocks = document.getElementById("Block" + l);
        if(BlockClass[l].health <= 0){
            BlockClass[l].dead = true;
            BlockClass[l].posy = -100;
            BlockClass[l].posx = -100;
            BlockClass[l].width = 0;
            BlockClass[l].height = 0;
        }
        Blocks.style.width = BlockClass[l].width;
        Blocks.style.height = BlockClass[l].height;
        BlockClass[l].upperx = parseFloat(parseFloat(BlockClass[l].posx) + (parseFloat(BlockClass[l].width) / 1.48));
        BlockClass[l].uppery = parseFloat(parseFloat(BlockClass[l].posy))
        BlockClass[l].lowerx = parseFloat(parseFloat(BlockClass[l].posx) - (parseFloat(BlockClass[l].width) / 3));
        BlockClass[l].lowery = parseFloat(parseFloat(BlockClass[l].posy) - (parseFloat(BlockClass[l].height) / 0.9));
        Blocks.style.top = BlockClass[l].posy;
        Blocks.style.left = BlockClass[l].posx;
    }
}

//sees if the circle has collided with a brick (ignoring corners)
function BlockCircleCheck(Pos1 ,Pos2 , Line, Radius){ //if checking x Pos1 = Posy and Pos2 = Posx and its the otherway around when checking for y and line refers to lower/upper x/y
    answer =  Quadratic(1,2 * Pos1, Math.pow(Pos1,2) + Math.pow(Line,2) - (2 * Pos2 * Line) + Math.pow(Pos2,2) - Math.pow(Radius,2));
    if(answer != null){
        if(isNaN(answer[0]) || isNaN(answer[1])){
            return null;
        }else{
            return answer;
        }
    }
    return answer;
}
function BlockCollision(CurrentNumber){
    CircleClass[CurrentNumber].Momentumx = Math.sqrt(Math.pow(CircleClass[CurrentNumber].Movex,2));
    CircleClass[CurrentNumber].Momentumy = Math.sqrt(Math.pow(CircleClass[CurrentNumber].Movey,2));
    Collision = false;
    BlockNum = 0;
    hit = false;
    for(f = 0; f <= NumBlocks; f++){ //uppery lowery upperx lowerx
        if(BlockClass[f].dead == false){
            Cposx = CircleClass[CurrentNumber].posx;
            Cposy = CircleClass[CurrentNumber].posy;
            Lowery = BlockClass[f].lowery;
            Uppery = BlockClass[f].uppery;
            Lowerx = BlockClass[f].lowerx;
            Upperx = BlockClass[f].upperx;
            Cdiameter = CircleClass[CurrentNumber].diameter;
            downYCheck = BlockCircleCheck(parseFloat(Cposx), parseFloat(Cposy), parseFloat(Lowery), parseFloat(Cdiameter) / 2);
            upYCheck = BlockCircleCheck(parseFloat(Cposx), parseFloat(Cposy), parseFloat(Uppery), parseFloat(Cdiameter) / 2);
            downXCheck = BlockCircleCheck(parseFloat(Cposy), parseFloat(Cposx), parseFloat(Lowerx), parseFloat(Cdiameter) / 2);
            upXCheck = BlockCircleCheck(parseFloat(Cposy), parseFloat(Cposx), parseFloat(Upperx), parseFloat(Cdiameter) / 2);
            if(downYCheck != null){ //checks if the edges of the brick is being touched by the circles (balloon or ball)
                if(Lowerx <= Cposx && Cposx <= Upperx){
                    hit = true;
                }else if(Math.pow(Lowerx - Cposx,2) + Math.pow(Lowery - Cposy,2) <= Math.pow(Cdiameter / 2,2) || Math.pow(Cposx - Upperx,2) + Math.pow(Lowery - Cposy,2) <= Math.pow(Cdiameter / 2,2)){
                    hit = true; //for corner collisions
                }
            }else if(upYCheck != null){
                if(Lowerx <= Cposx && Cposx <= Upperx){
                    hit = true;
                }else if(Math.pow(Lowerx - Cposx,2) + Math.pow(Cposy - Uppery,2) <= Math.pow(Cdiameter / 2,2) || Math.pow(Cposx - Upperx,2) + Math.pow(Cposy - Uppery,2) <= Math.pow(Cdiameter / 2,2)){
                    hit = true;
                }
            }else if(upXCheck != null){
                if(Lowery <= Cposy && Cposy <= Uppery){
                    hit = true;
                }else if(Math.pow(Lowery - Cposy,2) + Math.pow(Cposx - Upperx,2) <= Math.pow(Cdiameter / 2,2) || Math.pow(Cposy - Uppery,2) + Math.pow(Cposx - Upperx,2) <= Math.pow(Cdiameter / 2,2)){
                    hit = true;
                }
            }
            else if(downXCheck != null){
                if(Lowery <= Cposy && Cposy <= Uppery){
                    hit = true;
                }else if(Math.pow(Lowery - Cposy,2) + Math.pow(Lowerx - Cposx,2) <= Math.pow(Cdiameter / 2,2) || Math.pow(Cposy - Uppery,2) + Math.pow(Lowerx - Cposx,2) <= Math.pow(Cdiameter / 2,2)){
                    hit = true;
                }
            }else{
                hit = false;
            }
            if(hit == true){
                Collision = true;
                if(CurrentNumber != 0){
                    BlockClass[f].health = BlockClass[f].health - 1;
                }
                break; 
            }
        }
    }
        
        if(Collision == true){
            if(Uppery >= (Cposy + (Cdiameter / 2)) && Cposy + (Cdiameter / 2) >= Lowery){//determines where the nearest side the circle is at
                yway = "low";
                diffy = (Cposy + (Cdiameter / 2)) - Lowery;
            }else if((Uppery >= Cposy - (Cdiameter / 2) && Cposy - (Cdiameter / 2) >= Lowery)){
                yway = "up";
                diffy = Uppery - (Cposy - (Cdiameter / 2));
            }else{
                yway = "low";
                diffy = (Cposy + (Cdiameter / 2)) - Lowery;
            }
            if(Upperx >= (Cposx + (Cdiameter / 2)) && Cposx + (Cdiameter / 2) >= Lowerx){
                xway = "low";
                diffx = (Cposx + (Cdiameter / 2)) - Lowerx;
            }else if((Upperx >= Cposx - (Cdiameter / 2) && Cposx - (Cdiameter / 2) >= Lowerx)){
                xway = "up";
                diffx = Upperx - (Cposx - (Cdiameter / 2));
            }
            if(yway == "low"){ //changes direction based on where it has collided with the brick
                if(xway == "low"){
                    if(diffy - diffx >= 0){
                        a = parseFloat(CircleClass[CurrentNumber].Movex);
                        CircleClass[CurrentNumber].Movex = -parseFloat(CircleClass[CurrentNumber].Momentumx);
                    }else if(diffy - diffx < 0){
                        a = parseFloat(CircleClass[CurrentNumber].movey);
                        CircleClass[CurrentNumber].Movey = -parseFloat(CircleClass[CurrentNumber].Momentumy);
                    }
                }else if(xway == "up"){
                    if(diffy - diffx >= 0){
                        a = parseFloat(CircleClass[CurrentNumber].Movex);
                        CircleClass[CurrentNumber].Movex = parseFloat(CircleClass[CurrentNumber].Momentumx);
                    }else if(diffy - diffx < 0){
                        a = parseFloat(CircleClass[CurrentNumber].Movey);
                        CircleClass[CurrentNumber].Movey = -parseFloat(CircleClass[CurrentNumber].Momentumy);
                    }
                }
            }else if(yway == "up"){
                if(xway == "low"){
                    if(diffy - diffx >= 0){
                        a = parseFloat(CircleClass[CurrentNumber].Movex);
                        CircleClass[CurrentNumber].Movex = -parseFloat(CircleClass[CurrentNumber].Momentumx);
                    }else if(diffy - diffx < 0){
                        a = parseFloat(CircleClass[CurrentNumber].Movey);
                        CircleClass[CurrentNumber].Movey = parseFloat(CircleClass[CurrentNumber].Momentumy);
                    }
                }else if(xway == "up"){
                    if(diffy - diffx >= 0){
                        a = parseFloat(CircleClass[CurrentNumber].Movex);
                        CircleClass[CurrentNumber].Movex = parseFloat(CircleClass[CurrentNumber].Momentumx);
                    }else if(diffy - diffx < 0){
                        a = parseFloat(CircleClass[CurrentNumber].Movey);
                        CircleClass[CurrentNumber].Movey = parseFloat(CircleClass[CurrentNumber].Momentumy);
                    }
                }
                }
        }
}
function CollisionDetector(CurrentNumber, CurrentCirclex, CurrentCircley){ //array will have all the circles that had collided
    Collision = "False";
    Clipping = false;
    Collisions = [];
    CurrentCirclex = parseFloat(CurrentCirclex);
    CurrentCircley = parseFloat(CurrentCircley);
    for (k = 0; k <= NumCircles; k++){ //cycles through all the circles (balloon and balls) and determines which ones have collided
        if (k != CurrentNumber){
            ChosenCircle  = document.getElementById("SingularCircle" + k);
            ChosenCirclex = parseFloat(ChosenCircle.style.left);
            ChosenCircley = parseFloat(ChosenCircle.style.top);
            Linex = parseFloat(parseFloat(CurrentCirclex) - parseFloat(ChosenCirclex));
            Liney = parseFloat(parseFloat(CurrentCircley) - parseFloat(ChosenCircley));
            if(Math.sqrt((parseFloat(Linex) * parseFloat(Linex)) + (parseFloat(Liney) * parseFloat(Liney))) < parseFloat(ChosenCircle.style.width) - 1){
                for(n = 0; n > parseFloat(CircleClass[CurrentNumber].Collisions.length); n++){
                    if(parseFloat(CircleClass[CurrentNumber].Collisions[n]) == k){
                        Clipping = true;
                        break;
                    }
                }
                if(Clipping == false){
                    Collisions.push(k);
                    Collision = "True";
                }
            }
        }
    }
    for(p = 0; p < CircleClass[CurrentNumber].Collisions.length; p++){//checks if the circles are clipping each other (they can get stuck on one another)
        for(v = 0; v < Collisions.length; v++){
            if(parseFloat(CircleClass[CurrentNumber].Collisions[v]) == parseFloat(Collisions[p])){
                Clipping = true;
                break;
            }
        }
    }
    if(Collision == "False"){
        Collisions.push("False");
    }else if(Clipping == true){
        Collisions.push("Clipping");
    }
    CircleClass[CurrentNumber].Collisions = Collisions;
    return Collisions;
}
function DirectionChange(CirclesCollided, CurrentNumber){
    CurrentCirclex = parseFloat(CircleClass[CurrentNumber].Movex);
    CurrentCircley = parseFloat(CircleClass[CurrentNumber].Movey);
    if(CirclesCollided[CirclesCollided.length - 1] == "Clipping"){ //if balls have clipped
        for(q = 0; q < AmountOfCollisions; q++){
            diffx = CircleClass[CurrentNumber].posx - CircleClass[CirclesCollided[q]].posx;
            if(CircleClass[CurrentNumber].posx - (CircleClass[CurrentNumber].diameter / 2) < 0 && CircleClass[CurrentNumber].posx - (CircleClass[CurrentNumber].diameter / 2) > Limitx){
                if(diffx < 0){
                    CircleClass[CurrentNumber].posx-= 1;
                }else{
                    CircleClass[CurrentNumber].posx+= 1;
                }
            }
            diffy = CircleClass[CurrentNumber].posy - CircleClass[CirclesCollided[q]].posy;
            if(CircleClass[CurrentNumber].posy - (CircleClass[CurrentNumber].diameter / 2) < 0 && CircleClass[CurrentNumber].posy - (CircleClass[CurrentNumber].diameter / 2) > Limity){
                if(diffy < 0){
                    CircleClass[CurrentNumber].posy-= 1;
                }else{
                    CircleClass[CurrentNumber].posy+= 1;
                }
            }
        } 
    }else{//balls bounce off each other
        AmountOfCollisions = CirclesCollided.length;
        for(q = 0; q < AmountOfCollisions; q++){
            CircleClass[CurrentNumber].Movex =- parseFloat(CircleClass[CirclesCollided[q]].Movex);
            CircleClass[CurrentNumber].Movey =- parseFloat(CircleClass[CirclesCollided[q]].Movey);
            CircleClass[CurrentNumber].Momentumx = Math.sqrt(parseFloat(CircleClass[CurrentNumber].Movex) * parseFloat(CircleClass[CurrentNumber].Movex));
            CircleClass[CurrentNumber].Momentumy = Math.sqrt(parseFloat(CircleClass[CurrentNumber].Movey) * parseFloat(CircleClass[CurrentNumber].Movey));
            CircleClass[CirclesCollided[q]].Movex =- parseFloat(CurrentCirclex);
            CircleClass[CirclesCollided[q]].Movey =- parseFloat(CurrentCircley);
            CircleClass[CirclesCollided[q]].Momentumx = Math.sqrt(parseFloat(CircleClass[CirclesCollided[q]].Movex) * parseFloat(CircleClass[CirclesCollided[q]].Movex));
            CircleClass[CirclesCollided[q]].Momentumy = Math.sqrt(parseFloat(CircleClass[CirclesCollided[q]].Movey) * parseFloat(CircleClass[CirclesCollided[q]].Movey));
            CircleClass[CirclesCollided[q]].Movex = -CircleClass[CirclesCollided[q]].Movex;
            CircleClass[CirclesCollided[q]].Movey = -CircleClass[CirclesCollided[q]].Movey;
            CircleClass[CurrentNumber].Movex = -CircleClass[CurrentNumber].Movex;
            CircleClass[CurrentNumber].Movey = -CircleClass[CurrentNumber].Movey;
        }
    }
}

function FirstCircleCreation(CurrentNumber){ //creates green balloon
    NumCircles++;
    CurrentNumber++;
    MultipleCircles.innerHTML += "<div id=" + ("SingularCircle" + CurrentNumber) + "></div>";
    CircleClass.push(new Circle);
    sinCircle = document.getElementById("SingularCircle" + CurrentNumber);
    sinCircle.type = "text/css";
    sinCircle.style.width = DefaultDiameter / level;
    sinCircle.style.height = sinCircle.style.width;
    sinCircle.style.position = "fixed";
    sinCircle.style.background = "green";
    sinCircle.style.borderRadius = "100%";
    sinCircle.style.top = parseInt(Limity / 2 - 50);
    sinCircle.style.left = parseInt(Limitx / 2 - 50);
    CircleClass[CurrentNumber].posy = parseInt(Limity / 2 - 50);
    CircleClass[CurrentNumber].posx = parseInt(Limitx / 2 - 50);
    CircleClass[CurrentNumber].Momentumx = 0;
    CircleClass[CurrentNumber].Momentumy = 0;
    CircleClass[CurrentNumber].Movey = CircleClass[CurrentNumber].Momentumy;
    CircleClass[CurrentNumber].Movex = CircleClass[CurrentNumber].Momentumx;
    CircleClass[CurrentNumber].diameter = parseFloat(sinCircle.style.width);
    CircleClass[CurrentNumber].Collisions = [];
    CircleClass[CurrentNumber].EdgeCollision = false;
}
function CircleCreation(CurrentNumber){ //creates a ball
    NumCircles++;
    CurrentNumber++;
    MultipleCircles.innerHTML += "<div id=" + ("SingularCircle" + CurrentNumber) + "></div>";
    CircleClass.push(new Circle);
    sinCircle = document.getElementById("SingularCircle" + CurrentNumber);
    sinCircle.type = "text/css";
    sinCircle.style.width = DefaultDiameter / level;
    sinCircle.style.height = sinCircle.style.width;
    sinCircle.style.position = "fixed";
    sinCircle.style.background = "blue";
    sinCircle.style.borderRadius = "100%";
    CircleClass[CurrentNumber].diameter = parseFloat(sinCircle.style.width);
    sinCircle.style.top = Limity - CircleClass[CurrentNumber].diameter;
    sinCircle.style.left = parseInt(Limitx / 2 - 50);
    CircleClass[CurrentNumber].posy = Limity - CircleClass[CurrentNumber].diameter;
    CircleClass[CurrentNumber].posx = parseInt(Limitx / 2);
    CircleClass[CurrentNumber].Momentumx = RandomNumber(0.5);
    CircleClass[CurrentNumber].Momentumy = -Math.sqrt(SqVelocity - (CircleClass[CurrentNumber].Momentumx * CircleClass[CurrentNumber].Momentumx));  //This would make the speed of circle root 2 (1.414) of one pixle per millisecond
    CircleClass[CurrentNumber].Movey = CircleClass[CurrentNumber].Momentumy;
    CircleClass[CurrentNumber].Movex = CircleClass[CurrentNumber].Momentumx;
    CircleClass[CurrentNumber].Collisions = [];
    CircleClass[CurrentNumber].EdgeCollision = false;
    CircleClass[CurrentNumber].BotGrace = 0;

}
function MainFunc(){
    if(stop <= 0){ //if pause is required
        if(InBackCol == 0){
            document.body.style.background = "white";
        }else{
            InBackCol = InBackCol - 1;
        }
        if(lives < 0){ //if you lose
            document.title = "Level " + String(level) + ", Lives left " + String(lives);
            var cookies = cookie.parse(document.cookie);
            Choice("<p>" + cookies["name"] + ", you lose</p><p></p>");
            end = true;
        }
        BlockDown = -1;
        for(j = 0; j <= NumBlocks; j++){ //counts the bricks that have been broken
            if(BlockClass[j].dead == true){
                BlockDown++;
            }
        }
        if(BlockDown == NumBlocks){ //if user wins
            document.title = "Level " + String(level) + ", Lives left " + String(lives);
            var cookies = cookie.parse(document.cookie);
            if(parseInt(cookies["Level"]) == parseInt(level)){
                document.cookie = cookie.serialize('Level', parseInt(level) + 1);
            }
            score = parseInt((10000000000 / time) * lives);
            if(cookies[level] < score || cookies[level] == undefined){
                document.cookie = cookie.serialize(level, score);
            }
            var cookies = cookie.parse(document.cookie);
            str = "<p>" + cookies["name"] + ", you achieved, on the current level of " + level + ", a score of " + score + "</p>";
            end = true;
            Choice(str + "<p></p>");
        }
        for (x = 0; x <= NumCircles; x++){ //speed limiter
            sinCircle = document.getElementById("SingularCircle" + x);
            if(Math.pow(CircleClass[x].movex,2) + Math.pow(CircleClass[x].Movey,2) > Math.pow(MaxSpeed,2)){
                OverallSpeed = Math.pow(Math.pow(CircleClass[x].movex,2) + Math.pow(CircleClass[x].Movey),0.5);
                TimesSpeed = MaxSpeed / OverallSpeed;
                CircleClass[x].Movex = CircleClass[x].Movex * TimesSpeed;
                CircleClass[x].Movey = CircleClass[x].Movey * TimesSpeed;
                CircleClass[x].Momentumx = CircleClass[x].Momentumx * TimesSpeed;
                CircleClass[x].Momentumy = CircleClass[x].Momentumy * TimesSpeed;
            }
            CirclesCollided = CollisionDetector(x, CircleClass[x].posx, CircleClass[x].posy);
            if (CirclesCollided[CirclesCollided.length - 1] != "False"){
                DirectionChange(CirclesCollided, x)
            }
            if(x == 0){
                OpDirectAc = 0.01; //acceleration when trying to move in the opposite direction of current velocity
                NormAc = 0.005; //normal velocity
                if(rightPressed == true){
                    ExLeft(true);
                    if(CircleClass[x].Movex < 0){
                        CircleClass[x].Movex = CircleClass[x].Movex + OpDirectAc;
                    }else{
                        CircleClass[x].Movex = CircleClass[x].Movex + NormAc;
                    }
                    CircleClass[x].Momentumx = Math.sqrt(parseFloat(CircleClass[x].Movex) * parseFloat(CircleClass[x].Movex));
                }else{
                    ExLeft(false);
                }
                if(leftPressed == true){
                    ExRight(true);
                    if(CircleClass[x].Movex > 0){
                        CircleClass[x].Movex = CircleClass[x].Movex - OpDirectAc;
                    }else{
                        CircleClass[x].Movex = CircleClass[x].Movex - NormAc;
                    }
                    CircleClass[x].Momentumx = Math.sqrt(parseFloat(CircleClass[x].Movex) * parseFloat(CircleClass[x].Movex));
                }else{
                    ExRight(false);
                }
                if(upPressed == true){
                    ExBottom(true);
                    if(CircleClass[x].Movey > 0){
                        CircleClass[x].Movey = CircleClass[x].Movey - OpDirectAc;
                    }else{
                        CircleClass[x].Movey = CircleClass[x].Movey - NormAc;
                    }
                    CircleClass[x].Momentumy = Math.sqrt(parseFloat(CircleClass[x].Movey) * parseFloat(CircleClass[x].Movey));
                }else{
                    ExBottom(false);
                }
                if(downPressed == true){
                    ExTop(true);
                    if(CircleClass[x].Movey < 0){
                        CircleClass[x].Movey = CircleClass[x].Movey + OpDirectAc;
                    }else{
                        CircleClass[x].Movey = CircleClass[x].Movey + NormAc;
                    }
                    CircleClass[x].Momentumy = Math.sqrt(parseFloat(CircleClass[x].Movey) * parseFloat(CircleClass[x].Movey));
                }else{
                    ExTop(false);
                }
            }
            BlockCollision(x) //changes direction of balls and balloon if collides with brick
            if (x != 0){ //if not balloon
                if(CircleClass[x].BotGrace > 0){ //grace period decreases
                    CircleClass[x].BotGrace = CircleClass[x].BotGrace - 1
                }
                sinCircle.style.background = "blue";
            }
            if(parseFloat(CircleClass[x].posy) >= Limity){ //bounce from the bottom
                CircleClass[x].Movey = -parseFloat(CircleClass[x].Momentumy) * 0.5;
                CircleClass[x].posy += parseFloat(CircleClass[x].Movey);
                sinCircle.style.top = CircleClass[x].posy + "px";
                if (x != 0){
                    if(CircleClass[x].BotGrace == 0){ //if there is no grace period
                        if(CircleClass[x].EdgeCollision == false){
                            document.body.style.background = "red";
                            sinCircle.style.background = "white";
                            CircleClass[x].BotGrace = 100
                            InBackCol = 5;
                            lives = lives - 1;
                            document.title = "Level " + String(level) + ", Lives left " + String(lives);
                            CircleClass[x].EdgeCollision = true;
                            stop = 50;
                        }
                    }
                }
            }else if(parseFloat(CircleClass[x].posy) < 0){ //bounce off top
                CircleClass[x].Movey = parseFloat(CircleClass[x].Momentumy) * 0.5;
                CircleClass[x].posy += parseFloat(CircleClass[x].Movey);
                sinCircle.style.top = CircleClass[x].posy + "px";  
            }else{
                CircleClass[x].posy += parseFloat(CircleClass[x].Movey);
                sinCircle.style.top = CircleClass[x].posy + "px";
                CircleClass[x].EdgeCollision = false;
            }
            if(parseFloat(CircleClass[x].posx) >= Limitx - (CircleClass[x].diameter)){ //bounce off far right
                CircleClass[x].Movex = -parseFloat(CircleClass[x].Momentumx) * 0.5;
                CircleClass[x].posx += parseFloat(CircleClass[x].Movex);
                sinCircle.style.left = CircleClass[x].posx + "px";
            }else if(parseFloat(CircleClass[x].posx) < 0){ //bounce off far left
                CircleClass[x].Movex = parseFloat(CircleClass[x].Momentumx) * 0.5;
                CircleClass[x].posx += parseFloat(CircleClass[x].Movex);
                sinCircle.style.left = CircleClass[x].posx + "px";
            }else{
                CircleClass[x].posx += parseFloat(CircleClass[x].Movex);
                sinCircle.style.left = CircleClass[x].posx + "px";
            }
        }
    }else{
        stop--; //reduces stop time
    }
}
