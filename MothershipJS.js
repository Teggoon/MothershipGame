
var sketchProc = function(processingInstance) {
 with (processingInstance) {
    size(400, 400);
    frameRate(50);
    /**
    * The Mothership!
    *
    * My first Alien game! My first airplane game!
    *
    * Hope y'all like it!
    */

    var scene='menu';
    var life=3;
    var startlife=3;
    var mlife=200;
    var money=0;
    var reload=60;
    var reloadspeed=3;
    var mslreload=60;
    var mslreloadspeed=0.3;
    var damage=3;
    var msldamage=12;
    var screenx=0;
    var pscreenx=0;
    var px=330;
    var py=300;
    var ppy=300;
    var pr=-1;
    var pspeed=3;
    var ppr=-1;
    var lockon=false;
    var keys=[];
        noStroke();
    rectMode(CENTER);
    textAlign( CENTER,CENTER);
    textFont(createFont('Trebuchet MS Bold'));
    var rob1= function() {
    var img = createGraphics(60, 80, P2D);
    try{img.background(0, 0, 0,0);} catch(e) {}
    for (var i=0;i<20;i++) {
        img.stroke(255-i*1.5);
        img.line(30+i,0,30+i,80-i*4);
        img.line(30-i,0,30-i,80-i*4);
    }
    return img.get();
    };
    var flam=rob1();
    var r1 = {
        hit:55,
        hitx:40,
        offset:0,
        life:30,
        reloadspeed:0.3,
        reward:100
    };
    var r2 = {
        hit:130,
        hitx:30,
        offset:80,
        life:40,
        reloadspeed:0.5,
        reward:200
    };
    var r3 = {
        hit:130,
        hitx:30,
        offset:80,
        life:50,
        reloadspeed:1,
        reward:300
    };

    var rs=[r1,r2,r3];

    var blu = function(x,y,r,type) {
        this.x=x;
        this.y=y;
        this.exi=true;
        this.r=r;
        this.speed=9;
        this.type=type;
        if (this.type==='bullet'){this.damage=damage;}
        else {this.damage=msldamage;}
    };
    blu.prototype.draw = function() {
        fill(0, 0, 0);
        if (this.type==='bullet'){
        ellipse(this.x,this.y,10,2);
        this.x+=this.r*cos(this.r)*this.speed;
        if (this.x<-300||this.x>460){this.exi=false;}
        } else {
            pushMatrix();
            translate(this.x,this.y);
            rotate(this.r);
            rect(0,0,10,4);
            triangle(5,-2,5,2,13,0);
            popMatrix();
        this.x+=cos(this.r)*this.speed;
        if (this.x<-900||this.x>460){this.exi=false;}
        }
        this.y+=sin(this.r)*this.speed;
        if (this.x+screenx>4500&&this.y<250){mlife-=this.damage;this.exi=false;}
        if (screenx>3000&&this.type==='rocket'){this.r=180;}
    };
    blu.prototype.hit = function(z) {
        if (dist(z.x+screenx,0,this.x,0)<z.hitx&&dist(z.y-30+z.offset,0,this.y,0)<z.hit&&z.life>0){this.exi=false;z.life-=this.damage;}
        if (this.type==='rocket'&&dist(z.x+screenx,z.y,px,py)<600&&z.life>0) {
            var rt=atan2(z.y-this.y,z.x-this.x+screenx);
            this.r=rt;
        }
    };
    var bullets=[];

    var player = function() {
        pushMatrix();
        translate(px, py);
        rotate(radians(90+ppr*(ppy-py)/2+pr*85));
        fill(0, 0, 0);
        ellipse(-13,0,24*cos(pr*90),6*cos(pr*90));
        quad(-10,0,8*cos(pr*90),19*cos(pr*90),18*cos(pr*90),19*cos(pr*90),18*cos(pr*90),0*cos(pr*90));
        quad(-10,0,8*cos(pr*90),-19*cos(pr*90),18*cos(pr*90),-19*cos(pr*90),18*cos(pr*90),0*cos(pr*90));
        scale(1,-pr);
        rect(0,0,24,6);
        arc(-12,0,30,6,radians(90),radians(270));
        arc(-12,-3,13,6,radians(180),radians(360));
        quad(14,-3,12,-7,6,-7,1,-3);
        popMatrix();
    };

    var lo = function(x,y,w,h) {
        pushMatrix();
        translate(x,y);
            scale(w,h);
            quad(-100,0,100,0,80,10,-80,10);
            quad(-85,10,85,10,70,30,-70,30);
            quad(-120,-12,120,-12,80,5,-80,5);
            rect(0,-10,200,10);
        popMatrix();
    };


    var smth= function() {
    var img = createGraphics(34, 34, P2D);
    try{img.background(0, 0, 0,0);} catch(e) {}
        img.noStroke();
        img.fill(0);
        img.ellipse(17,17,13,13);
    for (var i=0;i<180;i+=30) {
        img.pushMatrix();
        img.translate(17,17);
        img.rotate(radians(i));
        img.triangle(-3,0,3,0,10,10);
        img.popMatrix();
    }
    return img.get();
    };
    var abimg=smth();

    var alienbs=[];
    var alienb = function(x, y,type) {
        this.x = x+screenx;
        this.y = y;
        this.timer=0;
        this.type=type;
        this.exi=true;
    };
    alienb.prototype.draw = function() {
        this.timer++;
        if (this.y>400||this.x>500){this.exi=false;}
        pushMatrix();
        translate(this.x, this.y);
        rotate(radians(frameCount*28));
        image(abimg,-17,-17);
        if (this.type==='v'){
        this.x+=screenx-pscreenx;
        if (this.timer<=50){this.y-=3;}
        else if (this.timer===51){this.x+=random(210,280);this.y=-200;}
        else {this.y+=4;}}
        else {this.x+=4+screenx-pscreenx;}
        if (dist(px,0,this.x,0)<30&&dist(py,0,this.y,0)<8){this.exi=false;life--;py=300;ppy=300;screenx=0;
    for (var i = 0; i < alienbs.length; i++) {alienbs[i].exi=false;}
        for (var i=0;i<alienbs.length;i++) {
            if (this.type===alienbs[i].type) {alienbs[i].y=450;}
        }
        }
        popMatrix();
    };

    var huh = function(x, y,type) {
        this.x = x;
        this.y = y;
        this.type=type;
        this.life=this.type.life;
        this.hit=this.type.hit;
        this.hitx=this.type.hitx;
        this.offset=this.type.offset;
        this.reload=0;
        this.reloadspeed=this.type.reloadspeed;
        this.reward=this.type.reward;
        this.dead=0;
        this.r=0;
    };
    huh.prototype.draw = function(s) {
        pushMatrix();
        translate(this.x+screenx, this.y);
        translate(0,80);
        rotate(radians(this.r));
        translate(0,-80);
        scale(s);
        /*image(flam,-30,105+cos(frameCount*75)*10,60,80+this.dead);
        noStroke();
        fill(0,0,0,395+this.dead*2);
        rect(0,0,90,120);
         rect(0,-50,40,60);
        rect(5,-100,55,60);
        quad(-38,60,38,60,20,115,-20,115);
        fill(255, 255, 255,395+this.dead*2);
        rect(20,-85,26,3);
        rect(20,-110,16,6);*/
        fill(0,0,0,395+this.dead*2);
        switch (this.type){
            case r1:
        image(flam,-47,15+cos(frameCount*75)*10,90,120+this.dead);
        if (this.life>0&&dist(this.x+screenx,0,px,0)<20&&py>this.y) {
            life--;screenx=0;py=300;ppy=300;
        }
        if (this.life>0&&dist(this.x+screenx,0,px,0)<35&&py>this.y) {
        image(flam,-60,15+cos(frameCount*75)*10,120,200);
        }
        bezier(-80,-90,-120,-40,-100,0,-80,120);
        bezier(-60,-90,-95,-40,-80,0,-60,120);
        bezier(60,-90,95,-40,80,0,60,120);
        bezier(80,-90,120,-40,100,0,80,120);
        lo(0,2,0.5,0.9);
        rect(0,-30,120,40);
        lo(0,-55,0.7,-0.7);
        quad(10,-80,-10,-80,-17,-70,17,-70);
        quad(-20,-80,-40,-80,-47,-70,-13,-70);
        quad(20,-80,40,-80,47,-70,13,-70);
        break;
        case r2:
        lo(0,-40,0.7,0.9);
        //rect(0,-30,120,40);
        lo(0,-55,0.6,-0.7);
        quad(-40,-20,40,-20,10,90,-10,90);
        triangle(10,90,-10,90,0,170);
        triangle(10,90,-10,50,-30,170);
        triangle(10,50,-10,90,30,170);
        quad(10,-80,-10,-80,-17,-70,17,-70);
        quad(-20,-80,-40,-80,-47,-70,-13,-70);
        quad(20,-80,40,-80,47,-70,13,-70);
        break;
        case r3:
            if (py<this.y-40&&this.life>0){this.y--;}
            if (py>this.y+40&&this.y<310&&this.life>0){this.y-=-1;}
            rect(0,0,60,120);
            lo(0,-80,0.6,1);
            lo(0,90-this.y/9,0.6,-0.6-(200-this.y)/400);
            for (var i=-2;i<2;i++) {
                pushMatrix();
                translate(30,12+i*25);
                quad(0,-10,0,10,9,7,9,-7);
                popMatrix();
                if (this.reload>80&&this.life>0&&px<this.x+screenx+400) {
            alienbs.push(new alienb(this.x,this.y+12+round(random(-2,2))*25,'h'));this.reload=0;}
            }
        }
        if (this.type!==r3){
            fill(255,0,0);
            rect(0,-40,40,4*this.life/this.type.life);
            fill(255,255,255,255*this.life/this.type.life);
            rect(0,-40,40,1);}
        else {
            fill(255,0,0);
            rect(0,-70,40,4*this.life/this.type.life);
            fill(255,255,255,255*this.life/this.type.life);
            rect(0,-70,40,1);}
        popMatrix();
        this.reload+=this.reloadspeed;
        if (scene==='game' ){this.x+=1.1;}
        if (this.x>280&&this.life>0) {life=0;}
        if (this.life>0&&dist(this.x+screenx,0,px,0)<40&&py<this.y) {
            for (var i=0;i<3;i++){alienbs.push(new alienb(this.x-30+i*30,this.y-60,'v'));}
        }
        if (this.reload>80&&this.life>0&&this.type!==r3&&px<this.x+screenx+400) {
            for (var i=0;i<3;i++){alienbs.push(new alienb(this.x-30+i*30,this.y-80,'v'));}this.reload=0;
        if (this.type===r2) {
            for (var i=0;i<3;i++){alienbs.push(new alienb(this.x-30+i*30,this.y-40,'v'));}}}
        if (this.life<=0){this.dead--;}
        if (this.dead>-60){this.r+=this.dead/19;this.y-=this.dead/20;}
        if (this.life>0&&dist(this.x+screenx,0,px,0)<this.hitx*2&&dist(py,0,this.y+this.offset,0)<this.hit) {
            life--;screenx=0;py=300;ppy=300;
    for (var i = 0; i < alienbs.length; i++) {alienbs[i].exi=false;}
        }
    };
    var huhs=[];
    for (var i=-1500;i<0;i+=500){
    huhs.push(new huh(-100+i,150,r1));}
    for (var i=-3000;i<-1500;i+=500){
    huhs.push(new huh(i,150,r2));}
    for (var i=-4000;i<-3000;i+=500){
    huhs.push(new huh(i,150,r3));}

    var bx=400;
    var base = function() {
        fill(0);
        pushMatrix();
            translate(bx+screenx,300);
            rect(0,0,300,100);
            rect(90,0,30,400);
        popMatrix();
    };


    var mx=-4000;
    var my=0;
    var mdeath=0;
    var mlod=0;
    var mothership  = function(ox,oy,os,oc) {
        pushMatrix();
            translate(mx+screenx+ox,120+oy+my);
            scale(1.5+os);
        fill(0);
            lo(0,0,2,1.4);
            lo(0,-40,1.6,-1.4);
            lo(0,53,1);
            fill(255+oc,0,0);
            rect(0,0,80,9*mlife/200);
            fill(255, 255, 255);
            rect(0,0,80,2*mlife/200);
        popMatrix();
        if (mlife<=0){mlife=0;
    for (var i = 0; i < huhs.length; i++) {huhs[i].life=0;}
    for (var i = 0; i < alienbs.length; i++) {alienbs[i].exi=false;}
        mdeath+=1;
        if (my<110){my+=mdeath/18;}
        }
       // if (screenx>3500&&frameCount%70===1&&mlife>0){alienbs.push(new alienb(mx+random(0,300),100,'v'));alienbs.push(new alienb(mx,0+random(0,200),'h'));}
    };

        var button = function(x, y, w, h, tx, m) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.tx = tx;
        this.m = m;
    };
    button.prototype.inm = function() {
        return mouseX >= this.x - this.w / 2 && mouseX <= this.x + this.w / 2 && mouseY >= this.y - this.h / 2 && mouseY <= this.y + this.h / 2;
    };
    button.prototype.draw = function() {
        noStroke();
        fill(71, 71, 71, 120);

        rect(this.x, this.y, this.w, this.h, 12);
        fill(255);
        if (this.inm()) {
            fill(0, 130, 250, 160);
        }
        textSize(this.tx);
        textAlign(CENTER, CENTER);
        text(this.m, this.x, this.y);
    };

    var menub=new button(200,290,120,50,40,'PLAY');
    var menual=new huh(200,220,r1);
    var menu = function() {
        scene='menu';
        fill(0);
        mothership(4200,-80,-0.6,0);
        menual.draw(1.2);
        textSize(40);
        fill(247, 0, 0);
        text('By Tegoon',200,331);
        textSize(73);
        fill(255, 255, 255);
        text('Mothership',200,95);
        fill(26, 26, 26);
        text('Mothership',200,98);
        fill(247, 0, 0);
        text('Mothership',202,97);
        menub.draw();
    };
    var next=new button(200,300,100,40,30,'Next');
    var start=new button(200,300,100,40,30,'Play');
    var goshop=new button(200,350,100,40,30,'Shop');
    var howpage=1;
    var how = function() {
        scene='how';
        textSize(35);
        textAlign(CENTER);
        player();
        fill(0);
        rect(200,400,400,140);
        text("Instructions", 200, 75);
        if (howpage===1){
            next.draw();
            fill(0);
        textSize(20);
        text("A huge alien ship has landed!\nYou must fly your fighter jet through\nits fleet of minion ships to destroy it\nand save the human race!", 200, 165);} else {
        textSize(18);
        text("Enemy is on the left. Base is on the right. \nDon't let them get to your base!\nYou can upgrade your plane in the shop\n\nLeft/Right arrow keys to change direction.\nUp/Down to change height.\nSpacebar to fire gun\nEnter to fire missile", 200, 125);
        start.draw();
        goshop.draw();}
    };

    var gunreloadcost=500;
    var gundamagecost=500;
    var mslreloadcost=500;
    var msldamagecost=500;
    var lifecost=500;
    var goback=new button(100,350,100,40,30,'Menu');
    var goback2=new button(300,350,100,40,30,'Play');
    var retry=new button(200,290,100,40,30,'Retry');
    var addgunreload=new button(350,130,70,25,20,'Buy');
    var addgundamage=new button(350,170,70,25,20,'Buy');
    var addmslreload=new button(350,210,70,25,20,'Buy');
    var addmsldamage=new button(350,250,70,25,20,'Buy');
    var addlif=new button(350,290,70,25,20,'Buy');
    var shop = function() {
        scene='shop';
        textSize(45);
        fill(0, 0, 0);
        textAlign(CENTER,CENTER);
        text("Shop",100, 55);
        textSize(25);
        fill(0, 0, 0);
        textAlign(CORNER,CENTER);
        text("Gun fire rate",40, 130);
        text("Gun damage",40, 170);
        text("Missile Fire Rate",40, 210);
        text("Missile Damage",40, 250);
        text("More lives",40, 290);
        text("$"+round(gunreloadcost),240, 130);
        text("$"+round(gundamagecost),240, 170);
        text("$"+round(mslreloadcost),240, 210);
        text("$"+round(msldamagecost),240, 250);
        text("$"+round(lifecost),240, 290);
        text('Money: $' +round(money),220,70);
        goback.draw();
        goback2.draw();
        addgunreload.draw();
        addgundamage.draw();
        addmslreload.draw();
        addmsldamage.draw();
        addlif.draw();
    };

    var deathtimer=0;
    var game = function (){
        scene='game';
        base();
        if (screenx!==pscreenx){pscreenx=screenx;}
        if (life>0){player();
        py+=(ppy-py)/10;
        if (keys[UP]&&py>80){ppy-=pspeed;}
        if (keys[DOWN]&&py<285){ppy+=pspeed;}
        screenx-=pr*pspeed;
        }
        if (ppr===1&&pr<1){pr+=0.1;}
        if (ppr===-1&&pr>-1){pr-=0.1;}
       // if (pr>=1||pr<=-1){screenx-=pr*pspeed;}
       lockon=false;
    for (var i = 0; i < huhs.length; i++) {
                huhs[i].draw();
    if (dist(huhs[i].x+screenx,huhs[i].y,px,py)<600&&huhs[i].life>0){lockon=true;}
    for (var j = 0; j < bullets.length; j++) {
         bullets[j].hit(huhs[i]);
    }
                }
        if (screenx>2500){mothership(0,0,0,0);lockon=true;
        fill(255, 0, 0);
        textSize(24);
        if (mlife>0){text('Mothership\'s life: '+round(mlife),20,20);}
        }
        if (mlod>600&&mlife>0&&life>0){
            var a = round(random(0,rs.length-1));
    huhs.push(new huh(-3900,150,rs[a]));mlod=0;
        }
        mlod-=-1;
        fill(0, 0, 0);
        rect(200,400,400,140);
        rect(0,400,180,140);
    for (var i = 0; i < huhs.length; i++) {
                if (huhs[i].dead<=-198){money+=huhs[i].reward;huhs.splice(i,1);}
                }

    for (var i = 0; i < bullets.length; i++) {
                bullets[i].draw();
                }
    for (var i = 0; i < alienbs.length; i++) {
                alienbs[i].draw();
                }
    for (var i = 0; i < bullets.length; i++) {
                if (!bullets[i].exi){bullets.splice(i,1);}
                }
    for (var i = 0; i < alienbs.length; i++) {
                if (!alienbs[i].exi){alienbs.splice(i,1);}
                }
                if (random(300)<1&&mlife>0) {
            alienbs.push(new alienb(-screenx-30,random(20,300),'h'));}
        if (reload>=60&&keys[32]){bullets.push(new blu(px,py,-ppr * Math.PI,'bullet'));reload=0;
        if (screenx>3600&&pr<0&&py<280){mlife-=damage;}}
        if (mslreload>=60&&keys[ENTER]&&lockon){bullets.push(new blu(px,py,-ppr * Math.PI,'rocket'));mslreload=0;
        if (screenx>3600&&pr<0){mlife-=msldamage;}
        }
        reload+=reloadspeed;
        mslreload+=mslreloadspeed;
        if (reload>60){reload=60;}
        if (mslreload>60){mslreload=60;}
        textSize(13);
        textAlign(CORNER);
        fill(255);
        text("Life " + life, 5, 355);
        text("Money $" + round(money),5, 374);
        rect(200,360,220,40);
        fill(0,100,255);
        rect(290+(px-screenx)/20,343+py/10,8,8);
        rect(305,375,10,8);
        fill(0);
        rect(103,360,18,14);
        rect(400,400,180,140);
        fill(250,0,0);
        rect(103,360,8,2);
        fill(255);
        text("Gun", 320, 349);
        text("Missile",320, 375);
        rect(350,357,65,7);
        rect(350,383,65,12);
        fill(0,130,255);
        rect(320+30*reload/60,357,65*reload/60,5);
        rect(320+30*mslreload/60,383,65*mslreload/60,10);
            textSize(13);
            if (mslreload>=60) {
        if (!lockon){
            fill(255);
        text("No target",320, 387);
        } else {
            fill(255,0,0);
        text("Locked on",320, 387);}
        }
        fill(0);
    for (var i = 0; i < huhs.length; i++) {
        if (huhs[i].life>0){rect(290+(huhs[i].x)/20,343+huhs[i].y/10,8,8);}}
        if (life<=0) {deathtimer++;
        for (var i = 0; i < huhs.length; i++){huhs[i].life=0;huhs[i].reward=0;}
            fill(0,0,0,deathtimer*3);
            rect(200,200,400,400);
        textSize(25);
        textAlign(CENTER);
        fill(255);
        text("You died!\nThe aliens took over.\n\nTry again?", 200, 130);
        goshop.draw();
        retry.draw();
        } else if (mlife<=0) {
            fill(250,250,250,mdeath*3);
            rect(200,200,400,400);
        textSize(25);
        textAlign(CENTER);
        fill(0);
        text("You win!\nWithout the mothership,\nthe aliens were\neventually wiped out.\n\nYou saved the planet!\nThank you!", 200, 130);
        }
    };

    draw = function() {
        background(255, 255, 255);
        switch (scene) {
            case "menu":
                menu();
                break;
            case "how":
                how();
                break;
            case "game":
                    game();
                break;
            case "shop":
                    shop();
                break;
    }
    };

    var reset = function() {
    for (var i=-1500;i<0;i+=500){
    huhs.push(new huh(-100+i,150,r1));}
    for (var i=-3000;i<-1500;i+=500){
    huhs.push(new huh(i,150,r2));}
    for (var i=-4000;i<-3000;i+=500){
    huhs.push(new huh(i,150,r3));
    life=startlife;screenx=0;py=300;ppy=300;mlife=200;ppr=-1;deathtimer=0;
    }
    };

    mouseClicked  = function() {
        if (menub.inm()&&scene==='menu'){scene='how';}
        else if (next.inm()&&scene==='how'&&howpage===1){howpage=2;}
        else if (start.inm()&&scene==='how'&&howpage===2){scene='game';}
        else if (goshop.inm()&&scene==='how'&&howpage===2){scene='shop';}
        else if (goshop.inm()&&scene==='game'&&life<=0){scene='shop';reset();}
        else if (goback2.inm()&&scene==='shop'){scene='game';}
        else if (goback.inm()&&scene==='shop'){scene='how';}
        else if (retry.inm()&&scene==='game'&&life<=0){reset();}

        if (scene==='shop') {
            if (addgunreload.inm()&&money>=round(gunreloadcost)) {money-=gunreloadcost;reloadspeed*=1.2;gunreloadcost*=1.2;}
            if (addgundamage.inm()&&money>=round(gundamagecost)) {money-=gundamagecost;damage*=1.2;gundamagecost*=1.2;}
            if (addmslreload.inm()&&money>=round(mslreloadcost)) {money-=mslreloadcost;mslreloadspeed*=1.2;mslreloadcost*=1.2;}
            if (addmsldamage.inm()&&money>=round(msldamagecost)) {money-=msldamagecost;msldamage*=1.2;msldamagecost*=1.2;}
            if (addlif.inm()&&money>=round(lifecost)) {money-=lifecost;startlife++;lifecost*=1.1;life=startlife;}
        }
    };

    keyPressed = function() {
        keys[keyCode] = true;
        if (ppr>=-1&&keys[RIGHT]){ppr=1;}
        else if (ppr<=1&&keys[LEFT]){ppr=-1;}
    };
    keyReleased = function() {
        keys[keyCode] = false;
    };

    }};


var canvas = document.getElementById("mycanvas");
// Pass the function sketchProc (defined in myCode.js) to Processing's constructor.
var processingInstance = new Processing(canvas, sketchProc);
