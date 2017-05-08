IO_RADIUS = 9;
IO_DISTANCE = 20;
IO_PADDING = 10;
IO_LEGEND_COLOR = '#ecf0f1';
IO_LEGEND_PADDING = 12;

let dataTypes = Object.freeze
({
    COLOR  : 0,
    NUMBER : 1,
    VECTOR : 2,
    properties:
    {
        0:{color:'#f1c40f'},
        1:{color:'#ecf0f1'},
        2:{color:'#2980b9'},
    }
});

let ioTypes = Object.freeze
({
    IN : 0,
    OUT: 1,
});

class Io
{
    constructor(index,ioType,dataType,legend,defaultValue)
    {
        this.index = index;
        this.ioType = ioType;
        this.dataType = dataType;
        this.connection = null;
        this.legend = legend;
        this.defaultValue = defaultValue;
        this.value = defaultValue;
    }

    connect(io)
    {
        this.connection = io;
    }

    disconnect()
    {
        this.connection = null;
        this.value = this.defaultValue;
    }

    draw(x,y)
    {
        //circle
        fill(dataTypes.properties[this.dataType].color);
        noStroke();
        ellipse(x,y+this.index*IO_DISTANCE,IO_RADIUS);

        //legend and value
         //no connection, direct legend
        if(!this.isConnected)
        {
            fill(IO_LEGEND_COLOR);
            textStyle(NORMAL);
            textSize(12);
            textAlign(LEFT,CENTER);
            
            let legendX = x+IO_LEGEND_PADDING;

            if(this.ioType === ioTypes.OUT)
            {
                textAlign(RIGHT,CENTER);
                legendX = x-IO_LEGEND_PADDING;
            }

            text(this.legend,legendX,y+this.index*IO_DISTANCE);
        }
    }
}