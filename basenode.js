HEADER_MIN_WIDTH = 90;
HEADER_HEIGHT = 30;
BOX_COLOR = '#333';
TEXT_COLOR = 255;
SELECT_COLOR = '#d35400';
RESIZE_COLOR = '#e67e22';
SELECT_DIST = 5;
HEADING_PADDING = 12;

class BaseNode
{
    constructor(x,y,w,h,color,heading)
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
        this.color = color;
        this.heading = heading;
        this.isMinimized = false;
        this.isSelected = false;

        this.isResizeZoneHovered = false;

        this.ios = null;
        this.connections = null;

        this.needsRecompute = false;
    }

    update()
    {
        if(this.needsRecompute)
        {
            this.compute();
        }
    }

    moveTo(x,y)
    {
        this.x = clamp(x,0,width-this.w);
        this.y = clamp(y,0,height-this.h);
    }

    resizeTo(w)
    {
        this.w = clamp(w,this.minWidth,width-this.x);
    }

    draw()
    {
        //header
        fill(this.color);
        noStroke();
        rect(this.x,this.y,this.w,HEADER_HEIGHT);
        //heading
        textStyle(BOLD);
        textSize(13);
        fill(TEXT_COLOR);
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
            //drawing inputs
            for(let i in this.ios)
            {
                let xPos = this.x
                if(this.ios[i].ioType === ioTypes.OUT)
                {
                    xPos+=this.w;
                }
                    
                this.ios[i].draw(xPos,this.y+HEADER_HEIGHT+IO_PADDING);
            }
        }
    }

    minimize()
    {
        this.isMinimized = true;
    }

    maximize()
    {
        this.isMinimized = false;
    }

    select()
    {
        this.isSelected = true;
    }

    deselect()
    {
        this.isSelected = false;
    }
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