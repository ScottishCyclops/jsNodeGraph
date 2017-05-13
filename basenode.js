//constant values for the nodes
const HEADER_MIN_WIDTH = 90;
const HEADER_HEIGHT = 30;
const BOX_COLOR = '#333';
const TEXT_LIGHT_COLOR = '#ecf0f1';
const TEXT_DARK_COLOR = '#2c3e50';
const SELECT_COLOR = '#d35400';
const RESIZE_COLOR = '#e67e22';
const SELECT_DIST = 5;
const HEADING_PADDING = 12;
const DARK_TEXT_THRESHOLD = 80;

class BaseNode
{
    /**
     * Creates a basic node, holding a position on the canvas, a size, a color and a heading text.
     * 
     * @param {number} x the x position on the canvas
     * @param {number} y the y position on the canvas
     * @param {number} w the width of the node
     * @param {number} h the height of the node
     * @param {*} c the color of the header of the node
     * @param {string} heading the text contained in the node's header
     */
    constructor(x,y,w,h,c,heading)
    {
        //style to check final size
        textFont('Courier New');
        textStyle(BOLD);
        textSize(13);
        this.minWidth = max(max(textWidth(heading)+HEADING_PADDING,HEADER_MIN_WIDTH),w);

        this.x = x;
        this.y = y;
        this.w = this.minWidth;
        this.h = max(h,HEADER_HEIGHT);
        this.color = c;
        this.heading = heading;

        this.isMinimized = false;
        this.isSelected = false;
        this.isResizeZoneHovered = false;

        this.ios = null;
        this.needsRecompute = true;

        this.textColor = brightness(color(this.color)) > DARK_TEXT_THRESHOLD ? TEXT_DARK_COLOR : TEXT_LIGHT_COLOR;

        //array that holds all the nodes our outputs are connected to
        this.connectedNodes = new Array();
    }

    /**
     * Tells the node that it will need to be recomputed.
     * 
     * in that case, we also need to recompute all the connected nodes down the chain
     */
    somethingChanged()
    {
        console.log(this.heading+" just changed");

        this.needsRecompute = true;
        this.connectedNodes.forEach(function(node) {
            node.somethingChanged();
            globalNeedRecompute = true;
        }, this);
    }

    /**
     * Template function overloaded by all the child nodes.
     * 
     * verifies that all the input values are up to date, and computes the connected nodes if needed.
     */
    compute()
    {
        //foreach io in this node, we update it's value
        for(let i in this.ios)
        {
            //if the io is connected to something. otherwise, the value is up to date
            if(this.ios[i].connection != null)
            {
                //we make sure the node's output we are connected to are up to date
                if(this.ios[i].connection.node.needsRecompute)
                {
                    this.ios[i].connection.node.compute();
                    //we take the value from the node's ouput we are connected to
                    this.ios[i].value = this.ios[i].connection.node.ios[this.ios[i].connection.outputName].value;

                    //if the parent needs recompute, so do we
                    this.needsRecompute = true;
                }
            }
        }
        
        console.log("computed " + this.heading);
    }
    
    /**
     * Adds a connection from on of this node's inputs to an other node's output.
     * 
     * @param {string} inputName the name of the input we want to connect from
     * @param {BaseNode} outputNode the node we want to connect to
     * @param {string} outputName the name of the output we want to connect to
     */
   connect(inputName,outputNode,outputName)
    {
        if(this.ios[inputName] === undefined || outputNode.ios[outputName] === undefined)
        {
            console.log("Unvalid connection made from "+this.heading);
        }
        else
        {
            this.ios[inputName].defaultValue = this.ios[inputName].value;
            this.ios[inputName].connection = new Connection(outputNode,outputName);

            this.somethingChanged();

            //we add ouself to the newly connected node's list
            if(outputNode.connectedNodes.indexOf(this) === -1)
            {
                outputNode.connectedNodes.push(this);
            }

        }
    }

    /**
     * Removes a connection from on of this noe's inputs.
     * 
     * @param {string} inputName 
     */
    disconnect(inputName)
    {
        if(this.ios[inputName].connection !== null)
        {
            let connectedNodeIndex = this.ios[inputName].connection.node.connectedNodes.indexOf(this);
            if(connectedNodeIndex !== -1)
            {
                this.ios[inputName].connection.node.connectedNodes.splice(connectedNodeIndex,1);
                this.ios[inputName].connection = null;
            }
        }

        this.ios[inputName].value = this.ios[inputName].defaultValue;

        this.somethingChanged();
    }

    /**
     * Moves this node to a given position.
     * 
     * @param {number} x the x componant of the new position
     * @param {number} y the y componant of the new position
     */
    moveTo(x,y)
    {
        this.x = clamp(x,0,width-this.w);
        this.y = clamp(y,0,height-this.h);
    }

    /**
     * Resizes this node's width to a new given one.
     * 
     * @param {number} w the new width of the node
     */
    resizeTo(w)
    {
        //make sure the new width is bigger than the minimum
        //and make sure we arn't resizing outside the canvas
        this.w = clamp(w,this.minWidth,width-this.x);
    }

    /**
     * Draws the node on the canvas.
     * 
     * take care of outlines, ios, minimization and connection lines.
     */
    draw()
    {
        //header
        fill(this.color);
        noStroke();
        rect(this.x,this.y,this.w,HEADER_HEIGHT);
        //heading
        textStyle(BOLD);
        textSize(13);
        fill(this.textColor);
        textAlign(CENTER,CENTER);
        text(this.heading,this.x+this.w/2,this.y+HEADER_HEIGHT/2);

        if(!this.isMinimized)
        {
            fill(BOX_COLOR);
            rect(this.x,this.y+HEADER_HEIGHT,this.w,this.h-HEADER_HEIGHT);
        }

        if(this.isSelected)
        {
            noFill();
            stroke(SELECT_COLOR);
            strokeWeight(1);
            rect(this.x,this.y,this.w,this.h);
        }

        if(this.isResizeZoneHovered)
        {
            stroke(RESIZE_COLOR);
            strokeWeight(2);
            line(this.x+this.w,this.y,this.x+this.w,this.y+this.h);
        }

        //at the end because on top of everything
        if(!this.isMinimized)
        {
            //drawing ios
            for(let i in this.ios)
            {
                let xPos = this.x
                let yPos = this.y+HEADER_HEIGHT+IO_PADDING;
                if(this.ios[i].ioType === ioTypes.OUT)
                {
                    xPos+=this.w;
                }

                //we draw the line below the point
                if(this.ios[i].connection != null)
                {
                    noFill();
                    stroke(0);
                    strokeWeight(2);

                    let connectX = this.ios[i].connection.node.x + this.ios[i].connection.node.w;
                    let connectY = this.ios[i].connection.node.y+HEADER_HEIGHT+IO_PADDING + this.ios[i].connection.node.ios[this.ios[i].connection.outputName].y;

                    line(xPos,yPos+this.ios[i].y,connectX,connectY);
                }

                this.ios[i].draw(xPos,yPos);
            }
        }
    }

    /**
     * Simple method setting isMinimized to true.
     */
    minimize(){this.isMinimized = true;}
    /**
     * Simple method setting isMinimized to false.
     */
    maximize(){this.isMinimized = false;}

    /**
     * Simple method setting isSelected to true.
     */
    select(){this.isSelected = true;}

     /**
     * Simple method setting isSelected to false.
     */
    deselect(){this.isSelected = false;}
}
