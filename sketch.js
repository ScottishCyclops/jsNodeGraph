let moveOffset;
let nodes;

let backColor;

function setup()
{
    createCanvas(800,600);

    nodes = new Array();

    nodes.push(new ColorNode(10,height/2));
    nodes.push(new ColorNode(10,height/2+100));
    nodes.push(new MixNode(210,height/2));
    nodes.push(new OutNode(410,height/2));

    nodes[2].connect('iColor1',nodes[0],'oColor');
    nodes[2].connect('iColor2',nodes[1],'oColor');
    nodes[3].connect('iImage',nodes[2],'oColor');

    nodes[0].setColor(color(0,255,0));
    nodes[1].setColor(color(255,0,0));

    backColor = 100;
}

function draw()
{
    background(backColor);

    nodes[3].compute();

    nodes.forEach(function(node)
    {
        node.draw();
    }, this);
}

function mousePressed()
{
    if(mouseButton === LEFT)
    {
        nodes.forEach(function(node) {
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

function setBackgroundColor(newColor)
{
    backColor = newColor;
}

function isCursorInNode(shape)
{
    return (mouseX >= shape.x && mouseX <= shape.x+shape.w) && (mouseY >= shape.y && mouseY <= shape.y+shape.h);
}

function isCursorWithinResizeZone(shape)
{
    return abs(mouseX-(shape.x+shape.w)) <= SELECT_DIST && (mouseY >= shape.y && mouseY <= shape.y+shape.h);
}

/**
 * Returns a number between a minimum and a maximum
 * @param {Number} n 
 * @param {Number} minimum 
 * @param {Number} maximum 
 */
function clamp(n,minimum,maximum)
{
    return min(max(n,minimum),maximum);
}