class MixNode extends BaseNode
{
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
    constructor(x,y)
    {
        super(x,y,130,60,'#7f8c8d','Image Output');

        this.ios =
        {
            'iImage' : new Io(0, ioTypes.IN, dataTypes.COLOR, 'Image', null, color(0,0,0)),
        };
    }

    compute()
    {
        super.compute();
        setBackgroundColor(this.ios['iImage'].value);
    }
}

class ColorNode extends BaseNode
{
    constructor(x,y)
    {
        super(x,y,130,60,'#f1c40f','RGB Color');

        this.ios =
        {
            'oColor' : new Io(0, ioTypes.OUT, dataTypes.COLOR, 'Color', null, color(255,0,0)),
        };
    }

    compute()
    {
        super.compute();
        this.needsRecompute = false;
    }

    setColor(c)
    {
        this.ios['oColor'].value = c;
        this.needsRecompute = true;
    }
}
