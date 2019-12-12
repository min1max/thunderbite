require('./scss/style.scss');
import { gsap } from "gsap";
import Draggable from "gsap/Draggable";
import bodymovin from 'bodymovin';
import $ from 'jquery';
import { Back, Power4, Linear } from "gsap/gsap-core";
import { isNumber } from "util";

var winPosition;
let winColors = ['blue', 'green', 'pink', 'orange'];
var headerAnim;

var animData = {
    container: document.getElementById('test'),
    renderer: 'svg',
    loop: false,
    autoplay: true,
    path: './anim/header/data.json'
};

headerAnim = bodymovin.loadAnimation(animData);

headerAnim.addEventListener('complete',doComplete);


function loopComplete() {
    console.log('loopComplete');
        
}
function doComplete() {
    //console.log('doComplete');
    //console.log(headerAnim);
    headerAnim.playSegments([230,299], true);
}
function doOnComplete() {
    console.log('doOnComplete');
    
}
function doOnsegmentStart() {
    
    console.log('doOnsegmentStart');
    console.log(headerAnim);
    
}

function doEnterFrame() {
    console.log(headerAnim.loop);
    console.log(headerAnim.playCount);
    console.log(headerAnim.currentFrame);
}

const wheel = $('#wheel');
const spin = $('#spin');
const marker = $('#marker');
var spinning = false, 
markerSpinning = false, 
dragging = false, 
spinnerRotation=0, 
markerRotation=0, 
randomSpinAmount = 5;


gsap.registerPlugin(Draggable); 
var tl = gsap.timeline();
var tl2 = gsap.timeline();

//var gridWidth = 650;
//var gridHeight = 650;
gsap.set("#spinner", {width:650, height:650, transformOrigin:"50% 50%"});

let clockwise = true;

Draggable.create("#spinner", {
    type:"rotation",
    throwProps:true,
    cursor: "grab", 
    activeCursor: "grabbing",
    lockAxis: true,
    onDrag:function() {
        dragging = true;
        console.log(Math.round(this.rotation));
        getRotationSegment();
        console.log(this);
        console.log('lockAxis: ' + this.lockAxis);
        if(this.deltaX < 0){
            //console.log('deltaX: ' + this.deltaX);
            //console.log('getDirection("start"): ' + this.getDirection("start"));
            this.disable();
            clockwise = false;
            //this.update();

            this.enable();
        }else{
            this.update();
            this.enable();
        }
        
    },
    onDragEnd:function() {
        if(clockwise) {
            var angle = (this.rotation + 360 * 100000) % 360; //ensure that the value is always between 0 and 360. Don't let it go negative or beyond 360. 
            //console.log('onDragEnd');
            //console.log(Math.round(this.rotation));
            //console.log('angle: ' + angle);
            tl.to("#spinner", 1.3, {rotation: this.rotation + 20, ease: Linear.easeIn});
            //getRotationSegment();
        }
        
    }
});




function startTheSpin(pos){

    // set spinner in motion random amount of spins and adjust time
    spinning = true;
    markerSpinning = true;
    var pickSegment = pos;
    var spinAmount = (pickSegment * 36);
    var extraSpins = Math.floor(Math.random() * randomSpinAmount) + 1;
    var spinTime = 2 + extraSpins;
    spinAmount = Math.floor(spinAmount + (extraSpins*360));
    spinnerRotation = spinnerRotation + spinAmount;
    markerRotation = markerRotation + spinAmount;

    console.log('%c ROTATION ' + spinnerRotation % 360, 'background: #222; color: #bada55');
    
    tl.to("#spinner", {
        duration: spinTime, 
        rotation: spinnerRotation, 
        ease: Power4.easeOut, 
        onUpdate: getRotationSegment, 
        onUpdateParams:["spinAmount"], 
        onComplete: spinFinished
    });


    tl2.to(marker, {
        duration: .3, 
        rotation: -14
    })
    tl2.to(marker, {
        duration: .3, 
        rotation: 0
    });

      
}




spin.on('click', (evt) => {

    if (spinning == false){
        evt.preventDefault();
        
        fetch('https://my.api.mockaroo.com/thunderbite.json?key=6fc51700')
        .then(
          function(response) {
            if (response.status !== 200) {
                console.log(response.status);
                //if endpoint fails, generate random number 1-4
                startTheSpin(Math.floor(Math.random() * 4) + 1);
            }
      
            // Examine the response
            response.json().then(function(data) {
                if(data.POSITION){
                    //console.log(data);
                    console.log('%c data.POSITION ' + data.POSITION, 'background: #222; color: #ffc0cb');
                    startTheSpin(data.POSITION);
                }
            });
          }
        )
        .catch(function(err) {
          console.log('Fetch Error :-S', err);
        });
    }


         
 });




function spinFinished() {
    spinning = false;
    markerSpinning = false;
    
    console.log('spinFinished');
    console.log('%c WINNER ' + winColors[winPosition], 'background: #222; color: #ffc0cb');
    //console.log('markerSpinning ' +markerSpinning);
	//console.log('winPosition: ' + winPosition);
	
}


function getRotationSegment() {

    let spinRot = Number(getRotationDegrees($('#spinner')));
    //console.log('spinRot: '+spinRot);

    let markerRot = Number(getRotationDegrees($('#marker')));

    
    //console.log('markerRot: '+ markerRot);
    //simple division to 4 segments

    if ( 0 <= spinRot && spinRot < 90 ) {
        winPosition = 0;
        
    } 
    else if ( spinRot > 90  && spinRot  <= 180 ) {
        winPosition = 1;
    } 
    else if ( spinRot > 180  && spinRot  <= 270 ) {
        winPosition = 2;
    } 
    else if ( spinRot > 270  && spinRot  <= 360 ) {
        winPosition = 3;
    }else if ( 0 <= spinRot && spinRot < 3 || 90 <= spinRot && spinRot < 93 || 180 <= spinRot && spinRot < 183 || spinRot > 270  && spinRot  <= 273 ) {


        tl2.to(marker, {
            duration: .3, 
            rotation: -14
        })
        tl2.to( marker, {
            duration: .3, 
            rotation: 0

        });

        markerSpinning = true;
            
    }
    //write the winner segment
    //$('#winner').text(winColors[winPosition]);
    //console.log('%c WINNER ' + winColors[winPosition], 'background: #222; color: #ffc0cb');
    //console.log('%c winPosition ' +winPosition, 'background: #222; color: #ffc0cb');
    

    //console.log('markerSpinning ' +markerSpinning);


}


function getRotationDegrees(obj) {
    var matrix = obj.css("-webkit-transform") ||
    obj.css("-moz-transform")    ||
    obj.css("-ms-transform")     ||
    obj.css("-o-transform")      ||
    obj.css("transform");
    if(matrix !== 'none') {
        var values = matrix.split('(')[1].split(')')[0].split(',');
        var a = values[0];
        var b = values[1];
        var angle = Math.round(Math.atan2(b, a) * (180/Math.PI));
    } else { var angle = 0; }

    if(angle < 0) angle +=360;
    return angle;
}
