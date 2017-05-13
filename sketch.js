//test variable containing the current background color
let backColor;

let graph;

function setup()
{
    createCanvas(innerWidth,innerHeight);
    document.addEventListener('contextmenu', event => event.preventDefault());

    graph = new Graph();

    graph.addNode(new ColorNode(10,height/2));
    graph.addNode(new ColorNode(10,height/2+100));
    graph.addNode(new MixNode(210,height/2));
    graph.addNode(new RandomNode(10,height/2-100));

    graph.getNode(3).connect('iColor1',graph.getNode(1),'oColor');
    //nodes[3].connect('iColor2',nodes[2],'oColor');
    //nodes[0].connect('iImage',nodes[3],'oColor');
    //nodes[3].connect('iMix',nodes[4],'oNumber');

    graph.getNode(0).connect('iImage',graph.getNode(3),'oColor');

    //nodes[1].setColor(color(0,0,0));
    //nodes[2].setColor(color(255,0,0));

    backColor = 100;

}

function draw()
{
    background(backColor);

    graph.update();
}

function keyPressed()
{
    if(keyCode === 13) //ENTER
    {
        graph.getNode(1).setColor(color(random(255),random(255),random(255)));
    }
    
}

function mousePressed()
{
    graph.mousePressedEvents();
}

function mouseReleased()
{
    graph.mouseReleasedEvents();
}

function mouseMoved()
{
    graph.mouseMovedEvents();
}

function mouseDragged()
{
    graph.mouseDraggedEvents();
}

/**
 * changes the background color variable.
 * 
 * @param {*} newColor 
 */
function setBackgroundColor(newColor)
{
    backColor = newColor;
}

/**
 * Returns n constrained between the minimum and the maximum.
 * 
 * @param {number} n the number to clamp
 * @param {number} minimum the minimum value to return
 * @param {number} maximum the maximum value to return
 */
function clamp(n,minimum,maximum)
{
    return min(max(n,minimum),maximum);
}
