class MixNode extends BaseNode
{
    constructor(x,y)
    {
        super(x,y,130,120,'#16a085','Mix');

        this.ios =
        {
            'factor' : new Io(0, ioTypes.IN,dataTypes.NUMBER,'Fac',0.5),
            'color1' : new Io(1, ioTypes.IN,dataTypes.COLOR,'Color 1',color(255,0,0)),
            'color2' : new Io(2, ioTypes.IN,dataTypes.COLOR,'Color 2',color(100,100,100)),
            'color'  : new Io(0, ioTypes.OUT,dataTypes.COLOR,'Color',0),
        };

    }

    compute()
    {
        let fac = this.ios['factor'].value;
        let color1 = this.ios['color1'].value;
        let color2 = this.ios['color2'].value;

        this.ios['color'].value = lerpColor(color1,color2,fac);
    }
}

class Output extends BaseNode
{
    constructor(x,y)
    {
        super(x,y,130,60,'#7f8c8d','Image Output');

        this.ios =
        {
            'image' : new Io(0, ioTypes.IN,dataTypes.COLOR,'Image',0),
        };
    }

    compute()
    {
        let image = this.ios['image'].value;
        setBackgroundColor(image);
    }
}