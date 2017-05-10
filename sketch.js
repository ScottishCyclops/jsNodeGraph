//variable containing the difference between the selected node's position and the cursor position
let moveOffset;
//array containing all the nodes of the graph
let nodes;
//test variable containing the current background color
let backColor;

function setup()
{
    createCanvas(800,600);

    nodes = new Array();

    nodes.push(new OutNode(410,height/2));
    nodes.push(new ColorNode(10,height/2));
    nodes.push(new ColorNode(10,height/2+100));
    nodes.push(new MixNode(210,height/2));

    nodes[3].connect('iColor1',nodes[1],'oColor');
    nodes[3].connect('iColor2',nodes[2],'oColor');
    nodes[0].connect('iImage',nodes[3],'oColor');

    nodes[1].setColor(color(0,255,0));
    nodes[2].setColor(color(255,0,0));

    backColor = 100;
}

function draw()
{
    background(backColor);

    //we always compute the output node
    nodes[0].compute();

    nodes.forEach(function(node){
        node.draw();
    }, this);
}

function mousePressed()
{
    if(mouseButton === LEFT)
    {
        nodes.forEach(function(node){
            if(isCursorInNode(node) || node.isResizeZoneHovered)
            {
                node.select();
                moveOffset = createVector(mouseX-node.x,mouseY-node.y);
            }
            else
            {
                node.deselect();
            }
        }, this);
    }
}

function mouseReleased()
{
    cursor(ARROW);
}

function mouseMoved()
{
    nodes.forEach(function(node) {  
        node.isResizeZoneHovered = isCursorWithinResizeZone(node);
    }, this);
}

function mouseDragged()
{
    if(mouseButton === LEFT)
    {
        cursor(MOVE);
        nodes.forEach(function(node) {  
            if(node.isResizeZoneHovered)
            {
                node.resizeTo(mouseX-node.x);
            }
            else if(node.isSelected)
            {
                //selected but now resize hovered
                node.moveTo(mouseX-moveOffset.x,mouseY-moveOffset.y);
            }
        }, this);
    }
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
 * Returns whether the cursor is currently inside a given node.
 * 
 * @param {BaseNode} node the node to test
 */
function isCursorInNode(node)
{
    return (mouseX >= node.x && mouseX <= node.x+node.w) && (mouseY >= node.y && mouseY <= node.y+node.h);
}

/**
 * Returns whether the cursor is currently inside the resizing zone of a given node.
 * 
 * @param {BaseNode} node the node to test
 */
function isCursorWithinResizeZone(node)
{
    return abs(mouseX-(node.x+node.w)) <= SELECT_DIST && (mouseY >= node.y && mouseY <= node.y+node.h);
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
