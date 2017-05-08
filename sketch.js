let moveOffset;
let nodes;

let backColor;

function setup()
{
    createCanvas(800,600);

    nodes = new Array();

    nodes.push(new MixNode(width/3,height/2));
    nodes.push(new Output(width/2,height/2));

    backColor = 100;
}

function draw()
{
    background(backColor);

    nodes.forEach(function(node)
    {
        node.update();
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