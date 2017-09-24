// Coding by Blake Harvey
// https://github.com/blakeharv
// https://www.linkedin.com/in/blakeharv

// Inspired by Bill Williams Fractal Indicator written by Mike Lapping
// This checks for "traditional" as well as "non-standard" fractals

const predef = require("./tools/predef");
const meta = require("./tools/meta")

class fractal {
    init() {
        this.symbol = this.props.symbol
        this.symbolSize = this.props.symbolSize
        this.symbolColorUp = this.props.symbolColorUp
        this.symbolColorDown = this.props.symbolColorDown
        this.barBuf = []
    }
    
    map(d, i, history) {
        var fractal,
            upFractal,
            downFractal,
            bar,
            b1, b2, b3, b4, b5,
            leftSide, rightSide;
        
        bar = {
            time: d.timestamp(),
            high: d.high(),
            low: d.low()
        }
        
        // Just starting, so only add bars to the buffer and return
        if (this.barBuf.length < 6) {
            this.barBuf.push(bar)
            return
        }
        
        // Check for UP fractal
        
        b1 = this.barBuf[0].high,
        b2 = this.barBuf[1].high,
        b3 = this.barBuf[2].high,
        b4 = this.barBuf[3].high,
        b5 = this.barBuf[4].high;
        
        leftSide = ((b1 <= b2 && b2 < b3) || (b1 < b3 && b2 < b3)),
        rightSide = ((b3 > b4 && b4 >= b5) || (b3 > b4 && b3 > b5))
        
        if (leftSide && rightSide) {
            upFractal = {
                text: ["<tspan fill=\"" + this.symbolColorUp + "\" style=\"font-size:" + this.symbolSize + "em\">" + this.symbol + "</tspan>"],
                x: [this.barBuf[2].time, this.barBuf[2].time],
                y: [b3 + 0.15, b3 + 0.15]
            }; 
        }
        
        // Check for DOWN fractal
        
        b1 = this.barBuf[0].low
        b2 = this.barBuf[1].low
        b3 = this.barBuf[2].low
        b4 = this.barBuf[3].low
        b5 = this.barBuf[4].low
        
        leftSide = ((b1 >= b2 && b2 > b3) || (b1 > b3 && b2 > b3)),
        rightSide = ((b3 < b4 && b4 <= b5) || (b3 < b4 && b3 < b5))
        
        if (leftSide && rightSide) {
            downFractal = {
                text: ["<tspan fill=\"" + this.symbolColorDown + "\" style=\"font-size:" + this.symbolSize + "em\">" + this.symbol + "</tspan>"],
                x: [this.barBuf[2].time, this.barBuf[2].time],
                y: [b3 - 0.1, b3 - 0.1]
            }; 
        }
        
        this.barBuf.shift()
        this.barBuf.push(bar)
        
        fractal = { 
            up: upFractal,
            down: downFractal
        }
        
        return fractal
    }
    
    filter (d) {
        return !!d;
    }
}

module.exports = {
    name: "Fractal",
    description: "Fractal",
    calculator: fractal,
    params: {
        symbol: predef.paramSpecs.text("&bull;"),
        symbolSize: predef.paramSpecs.number(3.25),
        symbolColorUp: predef.paramSpecs.color("#EEE"),
        symbolColorDown: predef.paramSpecs.color("#EEE")
    },
    inputType: meta.InputType.BARS,
    plotter: predef.plotters.zigzag(["up", "down"]),
    plots: {
        up: { title: "up" },
        down: { title: "down" }
    }
};
