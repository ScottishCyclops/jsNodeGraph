//constant values for the ios
const IO_RADIUS = 9;
const IO_DISTANCE = 20;
const IO_PADDING = 10;
const IO_LEGEND_COLOR = '#ecf0f1';
const IO_LEGEND_PADDING = 12;

/**
 * Represents the data type of an io. Either COLOR, NUMBER or VECTOR.
 * 
 * associates a color property depending of the type.
 */
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

/**
 * Represents an io type. Either IN or OUT.
 */
let ioTypes = Object.freeze
({
    IN : 0,
    OUT: 1,
});

class Connection
{
    /**
     * Creates a structure containing a node and an output io representing a connection.
     * 
     * @param {BaseNode} node the node to which the connection is made
     * @param {string} outputName the name of the output io to which the connection is made
     */
    constructor(node,outputName)
    {
        this.node = node;
        this.outputName = outputName;
    }
}

class Io
{
    /**
     * Creates an io object, containing an index, a legend and a connection.
     * 
     * @param {number} index the index of this io within all of the ios of the node
     * @param {number} ioType the type of io. Either IN or OUT
     * @param {number} dataType the data type the io holds. Either COLOR, NUMER or VECTOR
     * @param {string} legend the text written next to the io
     * @param {Connection} connection the connection object. can be null if no connection
     * @param {*} defaultValue the value than gets set at the io creation
     */
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

    /**
     * Draws the io at a given x and y, adding the local y value to the given one.
     * 
     * @param {number} x the x position on the canvas
     * @param {number} y the y position on the canvas
     */
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
