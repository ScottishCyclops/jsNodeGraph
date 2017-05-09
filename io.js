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

class Connection
{
    constructor(node,outputName)
    {
        this.node = node;
        this.outputName = outputName;
    }
}

class Io
{
    constructor(index,ioType,dataType,legend,connection,defaultValue)
    {
        this.y = index*IO_DISTANCE;
        this.ioType = ioType;
        this.dataType = dataType;
        this.legend = legend;
        this.connection = connection;
        this.defaultValue = defaultValue;
        this.value = defaultValue;
    }

    draw(x,y)
    {
        //circle
        fill(dataTypes.properties[this.dataType].color);
        noStroke();
        ellipse(x,this.y+y,IO_RADIUS);

        //legend and value
         //no connection, input field then legend

        let inputFieldPadding = 10;
        if(this.connection != null || this.ioType === ioTypes.OUT)
        {
            inputFieldPadding = 0;
        }

        if(this.connection === null)
        {
            //draw input box
        }

        fill(IO_LEGEND_COLOR);
        textStyle(NORMAL);
        textSize(12);

        textAlign(LEFT,CENTER);
        let legendX = x+IO_LEGEND_PADDING+inputFieldPadding;

        if(this.ioType === ioTypes.OUT)
        {
            textAlign(RIGHT,CENTER);
            legendX = x-IO_LEGEND_PADDING-inputFieldPadding;
        }

        text(this.legend,legendX,this.y+y);
    }
}
