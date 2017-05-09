HEADER_MIN_WIDTH = 90;
HEADER_HEIGHT = 30;
BOX_COLOR = '#333';
TEXT_LIGHT_COLOR = '#ecf0f1';
TEXT_DARK_COLOR = '#2c3e50';
SELECT_COLOR = '#d35400';
RESIZE_COLOR = '#e67e22';
SELECT_DIST = 5;
HEADING_PADDING = 12;
DARK_TEXT_THRESHOLD = 80;

class BaseNode
{
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
    }

    compute()
    {
        //foreach io in this node, we update it's value
        for(let io in this.ios)
        {
            //if the io is connected to something. otherwise, the value is up to date
            if(this.ios[io].connection != null)
            {
                //we make sure the node's output are up to date
                if(this.ios[io].connection.node.needsRecompute)
                {
                    this.ios[io].connection.node.compute();
                    //we take the value from the node's ouput we are connected to
                    this.ios[io].value = this.ios[io].connection.node.ios[this.ios[io].connection.outputName].value;

                    //if the parent needs recompute, so do we
                    this.needsRecompute = true;
                }
            }
        }
        console.log("computed " + this.heading);
    }
    
    connect(inputName,outputNode,outputName)
    {
        this.ios[inputName].defaultValue = this.ios[inputName].value;
        this.ios[inputName].connection = new Connection(outputNode,outputName);
        this.needsRecompute = true;
    }

    disconnect(inputName)
    {
        this.ios[inputName].value = this.ios[inputName].defaultValue;
        this.ios[inputName].connection = null;
        this.needsRecompute = true;
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
