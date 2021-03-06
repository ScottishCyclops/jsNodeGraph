class MixNode extends BaseNode
{
    /**
     * Mix node lerping between 2 colors based on a factor.
     * 
     * @param {number} x x componant of the default location
     * @param {number} y y componant of the default location
     */
    constructor(x,y)
    {
        super(x,y,130,120,'#16a085','Mix');
        this.ios =
        {
            'iMix'    : new Io(0, ioTypes.IN,  dataTypes.NUMBER, 'Mix',    null, 0.5),
            'iColor1' : new Io(1, ioTypes.IN,  dataTypes.COLOR,  'Color1', null, color(  0,  0,  0)),
            'iColor2' : new Io(2, ioTypes.IN,  dataTypes.COLOR,  'Color2', null, color(255,255,255)),
            'oColor'  : new Io(0, ioTypes.OUT, dataTypes.COLOR,  'Color',  null, color(  0,  0,  0)),
        };

    }

    /**
     * Overloaded function doing the actual node calculation after updating the inputs.
     * 
     * this function only does the actual calculation if needed.
     */
    compute()
    {
        //we update our input values
        super.compute();

        if(this.needsRecompute)
        {
            //actual node work
            this.ios['oColor'].value = lerpColor(this.ios['iColor1'].value,this.ios['iColor2'].value,this.ios['iMix'].value);
            this.needsRecompute = false;
        }
    }
}

class OutNode extends BaseNode
{
    /**
     * Output node responsable for handling the output of the whole graph
     * 
     * @param {number} x x componant of the default location
     * @param {number} y y componant of the default location
     */
    constructor(x,y)
    {
        super(x,y,130,60,'#7f8c8d','Image Output');

        this.ios =
        {
            'iImage' : new Io(0, ioTypes.IN, dataTypes.COLOR, 'Image', null, color(0,0,0)),
        };
    }

    /**
     * Overloaded function doing the actual node calculation after updating the inputs.
     * 
     * this function only does the actual calculation if needed.
     */
    compute()
    {
        super.compute();
        if(this.needsRecompute)
        {
            setBackgroundColor(this.ios['iImage'].value);
            this.needsRecompute = false;
        }
    }
}

class ColorNode extends BaseNode
{
    /**
     * Node containing a single RGB color value.
     * 
     * @param {number} x x componant of the default location
     * @param {number} y y componant of the default location
     */
    constructor(x,y)
    {
        super(x,y,130,60,'#f1c40f','RGB Color');

        this.ios =
        {
            'oColor' : new Io(0, ioTypes.OUT, dataTypes.COLOR, 'Color', null, color(255,0,0)),
        };
    }

    /**
     * Overloaded function doing the actual node calculation after updating the inputs.
     */
    compute()
    {
        super.compute();
        this.needsRecompute = false;
    }


    /**
     * Test method for changing the color of the node by code
     */
    setColor(c)
    {
        this.ios['oColor'].value = c;
        this.somethingChanged();
    }
}

class RandomNode extends BaseNode
{
    /**
     * Node containing a random value between 0 and 1
     * 
     * @param {number} x x componant of the default location
     * @param {number} y y componant of the default location
     */
    constructor(x,y)
    {
        super(x,y,130,60,'#8e44ad','Random');

        this.ios =
        {
            'oNumber' : new Io(0, ioTypes.OUT, dataTypes.NUMBER, 'Number', null, random()),
        };
    }

    /**
     * Overloaded function doing the actual node calculation after updating the inputs.
     */
    compute()
    {
        super.compute();
        this.needsRecompute = false;
    }


    /**
     * Test method for changing the color of the node by code
     */
    reset()
    {
        this.ios['oNumber'].value = random();
        this.somethingChanged();
    }
}
