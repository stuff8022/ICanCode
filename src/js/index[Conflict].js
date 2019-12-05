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
    let InitialHTML = '<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">';
    window.cookie = require("cookie");
    window.cookies = cookie.parse(document.cookie);
    if(cookies["Level"] == undefined){
        document.cookie = cookie.serialize("Level", "1");
    }
    if(cookies["name"] == null){
        cookies["name"] = "";
    }
    if(Message == null){
        InitialHTML+= "<p>The goal of this game is to use a green ball (using the arrow keys) to hit the blue balls into the bricks. Once all the bricks have been destroyed you win, however if you hit the bottom side of the game too many times (lives are show in the title of the tab) you lose. Bouncing off the sides doesn't conserve the momentum but acts as a cushion (bounce off the sides will take way 50% of the horizontal momentum and if the ball bounces off the top and bottom, the ball loses 50% of its vertical speed)</p>";
        InitialHTML+= 'Name: <input type="text" id="InpName" value="' + cookies["name"] + '"><p></p>';
    }else{
        InitialHTML+= Message;
        document.getElementById("ExTop").innerHTML.style = "";
        document.getElementById("ExBottom").innerHTML.style = "";
        document.getElementById("ExLeft").innerHTML.style = "";
        document.getElementById("ExRight").innerHTML.style = "";
        for(x = 0; x <= NumCircles; x++){
            document.getElementById("SingularCircle" + x).innerHTML.style = "";
        }
        for(x = 0; x <= NumBlocks; x++){
            document.getElementById("Block" + x).innerHTML.style = "";
        }
    }
    for(var x = 1; x < parseInt(cookies["Level"]); x++){
        InitialHTML+= '<button type="button" class="btn btn-info" onclick="window.Start(' + x + ')">Level ' + x + '</button> You achieved the highest score of ' + cookies[x] + '<p></p>';
    }
    InitialHTML+= '<button type="button"  onclick="window.Start(' + (parseInt(x)) + ')">Level ' + (parseInt(x)) + '</button>';
    document.write(InitialHTML);
    document.close();
}
function Start(level){
    times++;
    if(times == 0){
        document.cookie = cookie.serialize("name",document.getElementById("InpName").value);
    }else{
        clearInterval(MainBlockFuncInterval);
        clearInterval(MainFuncInterval);
        clearInterval(CircleCreationInterval);
        clearInterval(NewWallInterval);
        clearInterval(TimeCounter);
    }
    document.write('<div><div id="border"></div><div id="ExTop"></div><div id="ExBottom"></div><div id="ExLeft"></div><div id="ExRight"></div><div id="MultipleCircles"></div><div id="Blocks"></div>'); //this is the html that javascript writes to the browser
    document.close();
    window.level = parseInt(level);
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
    window.DefaultDiameter = window.innerHeight / 10;
    //var Limity = window.innerHeight - 100;
    //var Limitx = window.innerWidth;
    if(window.innerWidth > window.innerHeight){
        window.Limitx = window.innerHeight - (DefaultDiameter / parseInt(level));
        window.Limity = Limitx;
    }else{
        window.Limitx = window.innerWidth - (DefaultDiameter / parseInt(level));
        window.Limity = Limitx;
    }
    //var level = 2;
    window.lives = 5;
    document.title = "Level " + String(level) + ", Lives left " + String(lives);
    window.length = Limitx / 6;
    window.Amount = parseInt(Limitx / (length / parseInt(level)));
    BlockVar = document.getElementById("border");
    BlockVar.type = "text/css";
    BlockVar.style.width = Limitx;
    BlockVar.style.height = Limity + DefaultDiameter;
    BlockVar.style.position = "fixed";
    BlockVar.style.top = 0;
    BlockVar.style.left = 0;
    BlockVar.style.border="3px solid black"
    window.time = 0;
    FirstCircleCreation(NumCircles);
    CircleCreation(NumCircles);
    InitialWall();
    MainBlockFunc()
    MainBlockFuncInterval = setInterval(function(){if(end == false){MainBlockFunc()}}, 2.5);
    MainFuncInterval = setInterval(function(){if(end == false){MainFunc()}},1);
    CircleCreationInterval = setInterval(function(){if(end == false){CircleCreation(NumCircles)}},60000);
    NewWallInterval = setInterval(function(){if(end == false){NewWall()}},20000);
    TimeCounter = setInterval(function(){time++;}, 100);
    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);
}
function ExTop(on){
    BlockVar = document.getElementById("ExTop");
    BlockVar.type = "text/css";
    if(on == true){
        BlockVar.style.width = CircleClass[0].diameter / 5;
        BlockVar.style.height = CircleClass[0].diameter / 3;
        BlockVar.style.position = "fixed";
        BlockVar.style.background = 'orange';
        BlockVar.style.top = CircleClass[0].posy - (CircleClass[0].diameter / 3);
        BlockVar.style.left = CircleClass[0].posx + (CircleClass[0].diameter / 2.5);
        //BlockVar.style.backgroundSize = (1 / level * 5);
    }else{
        BlockVar.style.width = 0;
        BlockVar.style.height = 0;
        BlockVar.style.position = "fixed";
        BlockVar.style.background = 'orange';
        BlockVar.style.top = CircleClass[0].posy - (CircleClass[0].diameter / 3);
        BlockVar.style.left = CircleClass[0].posx + (CircleClass[0].diameter / 2.5);
        //BlockVar.style.backgroundSize = (1 / level * 5);
    }

}
function ExBottom(on){
    BlockVar = document.getElementById("ExBottom");
    BlockVar.type = "text/css";
    if(on == true){
        BlockVar.style.width = CircleClass[0].diameter / 5;
        BlockVar.style.height = CircleClass[0].diameter / 3;
        BlockVar.style.position = "fixed";
        BlockVar.style.background = 'orange';
        BlockVar.style.top = CircleClass[0].posy + CircleClass[0].diameter;
        BlockVar.style.left = CircleClass[0].posx + (CircleClass[0].diameter / 2.5);
        //BlockVar.style.backgroundSize = (1 / level * 5);
    }else{
        BlockVar.style.width = 0;
        BlockVar.style.height = 0;
        BlockVar.style.position = "fixed";
        BlockVar.style.background = 'orange';
        BlockVar.style.top = CircleClass[0].posy + (CircleClass[0].diameter / 2);
        BlockVar.style.left = CircleClass[0].posx + (CircleClass[0].diameter / 2.5);
        //BlockVar.style.backgroundSize = (1 / level * 5);
    }

}
function ExRight(on){
    BlockVar = document.getElementById("ExRight");
    BlockVar.type = "text/css";
    if(on == true){
        BlockVar.style.width = CircleClass[0].diameter / 3;
        BlockVar.style.height = CircleClass[0].diameter / 5;
        BlockVar.style.position = "fixed";
        BlockVar.style.background = 'orange';
        BlockVar.style.top = CircleClass[0].posy + (CircleClass[0].diameter / 2.5);
        BlockVar.style.left = CircleClass[0].posx + CircleClass[0].diameter;
        //BlockVar.style.backgroundSize = (1 / level * 5);
    }else{
        BlockVar.style.width = 0;
        BlockVar.style.height = 0;
        BlockVar.style.position = "fixed";
        BlockVar.style.background = 'orange';
        BlockVar.style.top = CircleClass[0].posy + (CircleClass[0].diameter / 2);
        BlockVar.style.left = CircleClass[0].posx + (CircleClass[0].diameter / 2.5);
        //BlockVar.style.backgroundSize = (1 / level * 5);
    }

}
function ExLeft(on){
    BlockVar = document.getElementById("ExLeft");
    BlockVar.type = "text/css";
    if(on == true){
        BlockVar.style.width = CircleClass[0].diameter / 3;
        BlockVar.style.height = CircleClass[0].diameter / 5;
        BlockVar.style.position = "fixed";
        BlockVar.style.background = 'orange';
        BlockVar.style.top = CircleClass[0].posy + (CircleClass[0].diameter / 2.5);
        BlockVar.style.left = CircleClass[0].posx - (CircleClass[0].diameter  / 3);
        //BlockVar.style.backgroundSize = (1 / level * 5);
    }else{
        BlockVar.style.width = 0;
        BlockVar.style.height = 0;
        BlockVar.style.position = "fixed";
        BlockVar.style.background = 'orange';
        BlockVar.style.top = CircleClass[0].posy + (CircleClass[0].diameter / 2);
        BlockVar.style.left = CircleClass[0].posx + (CircleClass[0].diameter / 2.5);
        //BlockVar.style.backgroundSize = (1 / level * 5);
    }

}
function keyDownHandler(event){
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
function keyUpHandler(event){
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
function RandomNumber(Max){
    return (Math.random() * parseFloat(Max * 2)) - Max;
}
function InitialWall(){
    for(z = 0; z < Amount; z++){
        BlockCreate(z)
    }
    Row++;
}
function NewWall(){
    for(n = 0; n < NumBlocks + 1; n++){
        P = BlockClass[n].posy;
        BlockClass[n].posy += parseFloat((length / level) * (13 / 43));
        BlockClass[n].uppery += parseFloat((length / level) * (13 / 43));
        BlockClass[n].lowery += parseFloat((length / level) * (13 / 43));
    }
    InitialWall()
}
function Quadratic(a, b, c){
    if(Math.pow(parseFloat(b),2) - (4  *parseFloat(a) * parseFloat(c)) < 0){
        return null;
    }else{
        Values = []
        Values.push(parseFloat(-parseFloat(b) + Math.sqrt(Math.pow(parseFloat(b),2) - (4* parseFloat(a) * parseFloat(c))) / 2* parseFloat(a)));
        Values.push(parseFloat(-parseFloat(b) - Math.sqrt(Math.pow(parseFloat(b),2) - (4 * parseFloat(a) * parseFloat(c))) / 2 * parseFloat(a)));
        return Values;
    }
}


function BlockCreate(l){
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
function MainBlockFunc(){
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
            if(downYCheck != null){
                if(Lowerx <= Cposx && Cposx <= Upperx){
                    hit = true;
                }else if(Math.pow(Lowerx - Cposx,2) + Math.pow(Lowery - Cposy,2) <= Math.pow(Cdiameter / 2,2) || Math.pow(Cposx - Upperx,2) + Math.pow(Lowery - Cposy,2) <= Math.pow(Cdiameter / 2,2)){
                    hit = true;
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
            if(Uppery >= (Cposy + (Cdiameter / 2)) && Cposy + (Cdiameter / 2) >= Lowery){
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
            if(yway == "low"){
                if(xway == "low"){
                    if(diffy - diffx >= 0){
                        a = parseFloat(CircleClass[CurrentNumber].Movex);
                        CircleClass[CurrentNumber].Movex = -parseFloat(CircleClass[CurrentNumber].Momentumx);
                        if(a == CircleClass[CurrentNumber].Movex){
                            console.log("fail");
                        }
                    }else if(diffy - diffx < 0){
                        a = parseFloat(CircleClass[CurrentNumber].movey);
                        CircleClass[CurrentNumber].Movey = -parseFloat(CircleClass[CurrentNumber].Momentumy);
                        if(a == CircleClass[CurrentNumber].Movey){
                            console.log("fail");
                        }
                    }
                }else if(xway == "up"){
                    if(diffy - diffx >= 0){
                        a = parseFloat(CircleClass[CurrentNumber].Movex);
                        CircleClass[CurrentNumber].Movex = parseFloat(CircleClass[CurrentNumber].Momentumx);
                        if(a == CircleClass[CurrentNumber].Movex){
                            console.log("fail");
                        }
                    }else if(diffy - diffx < 0){
                        a = parseFloat(CircleClass[CurrentNumber].Movey);
                        CircleClass[CurrentNumber].Movey = -parseFloat(CircleClass[CurrentNumber].Momentumy);
                        if(a == CircleClass[CurrentNumber].Movey){
                            console.log("fail");
                        }
                    }
                }
            }else if(yway == "up"){
                if(xway == "low"){
                    if(diffy - diffx >= 0){
                        a = parseFloat(CircleClass[CurrentNumber].Movex);
                        CircleClass[CurrentNumber].Movex = -parseFloat(CircleClass[CurrentNumber].Momentumx);
                        if(a == CircleClass[CurrentNumber].Movex){
                            console.log("fail");
                        }
                    }else if(diffy - diffx < 0){
                        a = parseFloat(CircleClass[CurrentNumber].Movey);
                        CircleClass[CurrentNumber].Movey = parseFloat(CircleClass[CurrentNumber].Momentumy);
                        if(a == CircleClass[CurrentNumber].Movey){
                            console.log("fail");
                        }
                    }
                }else if(xway == "up"){
                    if(diffy - diffx >= 0){
                        a = parseFloat(CircleClass[CurrentNumber].Movex);
                        CircleClass[CurrentNumber].Movex = parseFloat(CircleClass[CurrentNumber].Momentumx);
                        if(a == CircleClass[CurrentNumber].Movex){
                            console.log("fail");
                        }
                    }else if(diffy - diffx < 0){
                        a = parseFloat(CircleClass[CurrentNumber].Movey);
                        CircleClass[CurrentNumber].Movey = parseFloat(CircleClass[CurrentNumber].Momentumy);
                        if(a == CircleClass[CurrentNumber].Movey){
                            console.log("fail");
                        }
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
    for (k = 0; k <= NumCircles; k++){
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
    for(p = 0; p < CircleClass[CurrentNumber].Collisions.length; p++){
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
    if(CirclesCollided[CirclesCollided.length - 1] == "Clipping"){
        for(q = 0; q < AmountOfCollisions; q++){
            CircleClass[CurrentNumber].Movex = -parseFloat(CircleClass[CurrentNumber].Movex);
            CircleClass[CurrentNumber].Movey = -parseFloat(CircleClass[CurrentNumber].Movey);
            CircleClass[CirclesCollided[q]].Movex = -parseFloat(CircleClass[CirclesCollided[q]].Movex);
            CircleClass[CirclesCollided[q]].Movey = -parseFloat(CircleClass[CirclesCollided[q]].Movey);
            CircleClass[CirclesCollided[q]].Momentumx = Math.sqrt(parseFloat(CircleClass[CirclesCollided[q]].Movex) * parseFloat(CircleClass[CirclesCollided[q]].Movex));
            CircleClass[CirclesCollided[q]].Momentumy = Math.sqrt(parseFloat(CircleClass[CirclesCollided[q]].Movey) * parseFloat(CircleClass[CirclesCollided[q]].Movey));
            CircleClass[CurrentNumber].Momentumx = Math.sqrt(parseFloat(CircleClass[CurrentNumber].Movex) * parseFloat(CircleClass[CurrentNumber].Movex));
            CircleClass[CurrentNumber].Momentumy = Math.sqrt(parseFloat(CircleClass[CurrentNumber].Movey) * parseFloat(CircleClass[CurrentNumber].Movey));
        } 
    }else{
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

function FirstCircleCreation(CurrentNumber){
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
    MultipleCircles.innerHTML += "<div id=" + "UpThrust></div>";
    MultipleCircles.innerHTML += "<div id=" + "DownThrust></div>";
    MultipleCircles.innerHTML += "<div id=" + "LeftThrust></div>";
    MultipleCircles.innerHTML += "<div id=" + "RightThrust></div>";
    CircleClass[CurrentNumber].UpThrust = document.getElementById("UpThrust");
    CircleClass[CurrentNumber].DownThrust = document.getElementById("DownThrust");
    CircleClass[CurrentNumber].LeftThrust = document.getElementById("LeftThrust");
    CircleClass[CurrentNumber].RightThrust = document.getElementById("RightThrust");
    CircleClass[CurrentNumber].UpThrust.style.type = "text/css";
    CircleClass[CurrentNumber].UpThrust.style.position = "fixed";
    CircleClass[CurrentNumber].UpThrust.style.background = "black";
    CircleClass[CurrentNumber].UpThrust.style.width = CircleClass[CurrentNumber].diameter / 5;
    CircleClass[CurrentNumber].UpThrust.style.height = CircleClass[CurrentNumber].diameter / 2.8;
    CircleClass[CurrentNumber].UpThrust.style.top = CircleClass[CurrentNumber].posy;
    CircleClass[CurrentNumber].UpThrust.style.left = CircleClass[CurrentNumber].posx + (CircleClass[CurrentNumber].diameter / 2.5);
    CircleClass[CurrentNumber].DownThrust.style.type = "text/css";
    CircleClass[CurrentNumber].DownThrust.style.position = "fixed";
    CircleClass[CurrentNumber].DownThrust.style.background = "black";
    CircleClass[CurrentNumber].DownThrust.style.width = CircleClass[CurrentNumber].diameter / 5;
    CircleClass[CurrentNumber].DownThrust.style.height = CircleClass[CurrentNumber].diameter / 2.8;
    CircleClass[CurrentNumber].DownThrust.style.top = CircleClass[CurrentNumber].posy + (CircleClass[CurrentNumber].diameter / 1.6);
    CircleClass[CurrentNumber].DownThrust.style.left = CircleClass[CurrentNumber].posx + (CircleClass[CurrentNumber].diameter / 2.5);
    CircleClass[CurrentNumber].LeftThrust.style.type = "text/css";
    CircleClass[CurrentNumber].LeftThrust.style.position = "fixed";
    CircleClass[CurrentNumber].LeftThrust.style.background = "black";
    CircleClass[CurrentNumber].LeftThrust.style.width = CircleClass[CurrentNumber].diameter / 2.8;
    CircleClass[CurrentNumber].LeftThrust.style.height = CircleClass[CurrentNumber].diameter / 5;
    CircleClass[CurrentNumber].LeftThrust.style.top = CircleClass[CurrentNumber].posy + (CircleClass[CurrentNumber].diameter / 2.5);
    CircleClass[CurrentNumber].LeftThrust.style.left = CircleClass[CurrentNumber].posx;
    CircleClass[CurrentNumber].RightThrust.style.type = "text/css";
    CircleClass[CurrentNumber].RightThrust.style.position = "fixed";
    CircleClass[CurrentNumber].RightThrust.style.background = "black";
    CircleClass[CurrentNumber].RightThrust.style.width = CircleClass[CurrentNumber].diameter / 2.8;
    CircleClass[CurrentNumber].RightThrust.style.height = CircleClass[CurrentNumber].diameter / 5;
    CircleClass[CurrentNumber].RightThrust.style.top = CircleClass[CurrentNumber].posy + (CircleClass[CurrentNumber].diameter / 2.5);
    CircleClass[CurrentNumber].RightThrust.style.left = CircleClass[CurrentNumber].posx + (CircleClass[CurrentNumber].diameter / 1.6);
}
function CircleCreation(CurrentNumber){
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
    if(stop <= 0){
        if(InBackCol == 0){
            document.body.style.background = "white";
        }else{
            InBackCol = InBackCol - 1;
        }
        if(lives < 0){
            document.title = "Level " + String(level) + ", Lives left " + String(lives);
            var cookies = cookie.parse(document.cookie);
            Choice("<p>" + cookies["name"] + ", you lose</p><p></p>");
            end = true;
        }
        BlockDown = -1;
        for(j = 0; j <= NumBlocks; j++){
            if(BlockClass[j].dead == true){
                BlockDown++;
            }
        }
        if(BlockDown == NumBlocks){
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
        for (x = 0; x <= NumCircles; x++){
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
                OpDirectAc = 0.01 * Math.sqrt(level);
                NormAc = 0.005 * Math.sqrt(level);
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
            BlockCollision(x)
            if (x != 0){
                if(CircleClass[x].BotGrace > 0){
                    CircleClass[x].BotGrace = CircleClass[x].BotGrace - 1
                }
                sinCircle.style.background = "blue";
            }
            if(parseFloat(CircleClass[x].posy) >= Limity){
                CircleClass[x].Movey = -parseFloat(CircleClass[x].Momentumy) * 0.5;
                CircleClass[x].posy += parseFloat(CircleClass[x].Movey);
                sinCircle.style.top = CircleClass[x].posy + "px";
                if (x != 0){
                    if(CircleClass[x].BotGrace == 0){
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
            }else if(parseFloat(CircleClass[x].posy) < 0){
                CircleClass[x].Movey = parseFloat(CircleClass[x].Momentumy) * 0.5;
                CircleClass[x].posy += parseFloat(CircleClass[x].Movey);
                sinCircle.style.top = CircleClass[x].posy + "px";  
            }else{
                CircleClass[x].posy += parseFloat(CircleClass[x].Movey);
                sinCircle.style.top = CircleClass[x].posy + "px";
                CircleClass[x].EdgeCollision = false;
            }
            if(parseFloat(CircleClass[x].posx) >= Limitx - (CircleClass[x].diameter)){
                CircleClass[x].Movex = -parseFloat(CircleClass[x].Momentumx) * 0.5;
                CircleClass[x].posx += parseFloat(CircleClass[x].Movex);
                sinCircle.style.left = CircleClass[x].posx + "px";
            }else if(parseFloat(CircleClass[x].posx) < 0){
                CircleClass[x].Movex = parseFloat(CircleClass[x].Momentumx) * 0.5;
                CircleClass[x].posx += parseFloat(CircleClass[x].Movex);
                sinCircle.style.left = CircleClass[x].posx + "px";
            }else{
                CircleClass[x].posx += parseFloat(CircleClass[x].Movex);
                sinCircle.style.left = CircleClass[x].posx + "px";
            }
        }
        document.getElementById("UpThrust").style.left = CircleClass[0].posx + (CircleClass[0].diameter / 2.5);
        document.getElementById("UpThrust").style.top = CircleClass[0].posy;
        document.getElementById("DownThrust").style.top = CircleClass[0].posy + (CircleClass[0].diameter / 1.6);
        document.getElementById("DownThrust").style.left = CircleClass[0].posx + (CircleClass[0].diameter / 2.5);
        document.getElementById("LeftThrust").style.top = CircleClass[0].posy + (CircleClass[0].diameter / 2.5);
        document.getElementById("LeftThrust").style.left = CircleClass[0].posx;
        document.getElementById("RightThrust").style.top = CircleClass[0].posy + (CircleClass[0].diameter / 2.5);
        document.getElementById("RightThrust").style.left = CircleClass[0].posx + (CircleClass[0].diameter / 1.6);
    }else{
        stop--;
    }
}
