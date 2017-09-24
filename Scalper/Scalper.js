// Coding by Blake Harvey
// https://github.com/blakeharv
// https://www.linkedin.com/in/blakeharv

const lodash = require("lodash");
const predef = require("./tools/predef");
const meta = require("./tools/meta");

class scalper {
    init() {
        // noop
    }

    map(d, i, history) {
            const sellSignal = {
                text: [undefined],
                x: [
                    d.timestamp(),
                    d.timestamp()
                ],
                y: [
                    d.high() + .30,
                    d.high() + .05
                ]
            };
            
            const buySignal = {
                text: [undefined],
                x: [
                    d.timestamp(),
                    d.timestamp()
                ],
                y: [
                    d.low() - .30,
                    d.low() - .05
                ]
            };
            
            const value = {
                sell: sellSignal,
                buy: buySignal
            }

        return value;
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
    plotter: predef.plotters.zigzag(["sell", "buy"]),
    plots: {
        sell: { title: "Sell" },
        buy: { title: "Buy" }
    },
    schemeStyles: {
        dark: {
            sell: predef.styles.plot({ color: "#ffe738", lineWidth: 5 }),
            buy: predef.styles.plot({ color: "#ffe738", lineWidth: 5 }),
        }
    }
};
