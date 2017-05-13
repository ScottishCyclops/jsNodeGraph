let globalNeedRecompute = false;

class Graph
{
    constructor()
    {
        //variable containing the difference between the selected node's position and the cursor position
        this.moveOffset = createVector(0,0);

        this.nodes = new Array();
        this.nodes.push(new OutNode(width/2,height/2));

        globalNeedRecompute = true;

        this.makingNewConnection = false;
        this.newConnectionStart = createVector(0,0);
    }

    addNode(node)
    {
        this.nodes.push(node);
    }

    getNode(index)
    {
        return this.nodes[index];
    }

    update()
    {
        if(globalNeedRecompute)
        {
            this.nodes[0].compute();
            globalNeedRecompute = false;
        }

        this.draw();
    }

    draw()
    {
        this.nodes.forEach(function(node){
            node.draw();
        }, this);

        if(this.makingNewConnection)
        {
            stroke(255,240);
            noFill();
            strokeWeight(2);
            line(this.newConnectionStart.x,this.newConnectionStart.y,mouseX,mouseY);
        }
    }

    mousePressedEvents()
    {
        if(mouseButton === LEFT)
        {
            this.nodes.forEach(function(node){
                if(isCursorInNode(node) || node.isResizeZoneHovered)
                {
                    node.select();
                    this.moveOffset = createVector(mouseX-node.x,mouseY-node.y);
                }
                else
                {
                    node.deselect();
                }
            }, this);
        }

        if(mouseButton === RIGHT)
        {
            if(!this.makingNewConnection)
            {
                this.makingNewConnection = true;
                this.newConnectionStart = createVector(mouseX,mouseY);
            }
        }
    }

    mouseReleasedEvents()
    {
        cursor(ARROW);

        //TODO: make the connection
        this.makingNewConnection = false;
    }

    mouseMovedEvents()
    {
        this.nodes.forEach(function(node) {  
            node.isResizeZoneHovered = isCursorWithinResizeZone(node);
        }, this);
    }

    mouseDraggedEvents()
    {
        if(mouseButton === LEFT)
        {
            cursor(MOVE);
            this.nodes.forEach(function(node) {  
                if(node.isResizeZoneHovered)
                {
                    node.resizeTo(mouseX-node.x);
                }
                else if(node.isSelected)
                {
                    //selected but now resize hovered
                    node.moveTo(mouseX-this.moveOffset.x,mouseY-this.moveOffset.y);
                }
            }, this);
        }
    }
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