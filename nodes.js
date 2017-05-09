class MixNode extends BaseNode
{
    constructor(x,y)
    {
        super(x,y,130,120,'#16a085','Mix');

        this.ios =
        {
            'iMix' : new Io('in','mix',null,0.5),
            'iColor1' : new Io('out','color1',null,color(  0,  0,  0)),
            'iColor2' : new Io('out','color2',null,color(255,255,255)),
            'oColor' : new Io('out','color',null,color(0,0,0)),
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
/*
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
*/

class MixNode extends BaseNode
{
    constructor()
    {
        super();
        this.ios =
        {
            'iMix' : new Io('in','mix',null,0.5),
            'iColor1' : new Io('out','color1',null,color(  0,  0,  0)),
            'iColor2' : new Io('out','color2',null,color(255,255,255)),
            'oColor' : new Io('out','color',null,color(0,0,0)),
        };
    }

    compute()
    {
        if(this.needsRecompute)
        {
            //we update our input values
            super.compute();

            //actual node work
            this.ios['oColor'].value = lerpColor(this.ios['iColor1'].value,this.ios['iColor2'].value,this.ios['iMix'].value);

            this.needsRecompute = false;
        }
    }
}