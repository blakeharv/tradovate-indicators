// Coding by Blake Harvey
// https://github.com/blakeharv
// https://www.linkedin.com/in/blakeharv

const lodash = require("lodash");
const predef = require("./tools/predef");
const meta = require("./tools/meta");

class scalper {
    init() {
        this.highBuf = []
        this.lowBuf = []
        this.lastBar = {}
        this.trend = 0
    }

    map(d, i, history) {
        var curBar, lastBar,
            signalHigh, signalLow;
        
        curBar = {
            time: d.timestamp(),
            close: d.close(),
            high: d.high(),
            low: d.low()
        }
        
        if (this.lastBar !== {}) {
            lastBar = {
                time: this.lastBar.timestamp,
                close: this.lastBar.close,
                high: this.lastBar.high,
                low: this.lastBar.low
            }
        }
        
        this.lastBar = curBar
        
        if(lastBar === null) {
            return
        }
        
        if (this.trend === 0) {
            if (curBar.close > lastBar.high && curBar.low >= lastBar.low) {
                this.highBuf.push(curBar)
                this.lowBuf.length = 0
            } else if (curBar.close < lastBar.low && curBar.high <= lastBar.high) {
                this.lowBuf.push(curBar)
                this.highBuf.length = 0
            } else {
                return
            }
		}
        
        
        if (this.lowBuf.length == 3 && this.lowBuf[0].close > this.lowBuf[2].close) {
            signalLow = {
                text: [undefined],
                x: [
                    this.lowBuf[0].time,
                    this.lowBuf[0].time
                ],
                y: [
                    this.lowBuf[0].high,
                    this.lowBuf[0].low
                ]
            };
            
            this.lowBuf.length = 0
            this.highBuf.length = 0
        } else if (this.lowBuf.length == 3 && this.lowBuf[0].close <= this.lowBuf[2].close) {
            this.lowBuf.length = 2
        }
        
        
        if (this.highBuf.length == 3 && this.highBuf[0].close < this.highBuf[2].close) {
            signalHigh = {
                text: [undefined],
                x: [
                    this.highBuf[0].time,
                    this.highBuf[0].time
                ],
                y: [
                    this.highBuf[0].high,
                    this.highBuf[0].low
                ]
            };
            
            this.lowBuf.length = 0
            this.highBuf.length = 0
        } else if (this.highBuf.length == 3 && this.highBuf[0].close >= this.highBuf[2].close) {
            this.highBuf.length = 2
        }
        
        const value = {
           signalSell: signalLow,
           signalBuy: signalHigh
        }

        if (signalHigh || signalLow) {
            return value
        } else {
            return
        }
    }

    filter(d) {
        return !!d;
    }
}

module.exports = {
    name: "Scalper",
    title: "Scalper",
    description: "Scalper",
    calculator: scalper,
    inputType: meta.InputType.BARS,
    plotter: predef.plotters.zigzag(["signalSell", "signalBuy"]),
    plots: {
        signalSell: { title: "Signal Sell" },
        signalBuy: { title: "Signal Buy" }
    },
    schemeStyles: {
        dark: {
            signalSell: predef.styles.plot({ color: "#fff244", lineWidth: 5 }),
            signalBuy: predef.styles.plot({ color: "#309eff", lineWidth: 5 })
        }
    }
};
