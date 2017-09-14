// Coding by Blake Harvey
// https://github.com/blakeharv
// https://www.linkedin.com/in/blakeharv

const predef = require("./tools/predef")
const EMA = require("./tools/EMA")

class zeroLagExponentialMovingAverage {
  init() {
    this.ema = EMA(this.props.period)
  }
  
  map(d, i, history) {
    const lag = Math.round(this.props.period / 2)
    const lagValue = history.back(lag) ? history.back(lag).value() : d.value()
    const calc = d.value() + (d.value() - lagValue)
    return this.ema(calc)
  }
  
  filter(_, i) {
    return i >= this.props.period
  }
}

module.exports = {
  name: "ZLEMA",
  description: "Zero-Lag Exponential Moving Average",
  calculator: zeroLagExponentialMovingAverage,
  params: {
    period: predef.paramSpecs.period(21)
  },
  tags: [predef.tags.MovingAverage],
  schemeStyles: predef.styles.solidLine("#8CECFF")
};
