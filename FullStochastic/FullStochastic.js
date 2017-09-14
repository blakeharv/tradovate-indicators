// Coding by Blake Harvey
// https://github.com/blakeharv
// https://www.linkedin.com/in/blakeharv

const predef = require("./tools/predef")
const meta = require("./tools/meta")
const MovingHigh = require("./tools/MovingHigh")
const MovingLow = require("./tools/MovingLow")
const SMA = require("./tools/SMA")

class fullStochastic {
  init() {
    this.overBought = this.props.overBought
    this.overSold = this.props.overSold
    this.highest = MovingHigh(this.props.period)
    this.lowest = MovingLow(this.props.period)
    this.sma = SMA(this.props.smoothPeriod)
    this.sma2 = SMA(this.props.Slow_K_sma_period)
    
    this.HKhighest = MovingHigh(this.props.high_Period)
    this.HKlowest = MovingLow(this.props.high_Period)
    this.HKsma = SMA(this.props.high_Smooth_Period)
    this.HKsma2 = SMA(this.props.high_K_SMA_Period)
  }

  map(d) {
    const high = d.high()
    const low = d.low()
    const close = d.close()
    
    const hh = this.highest(high)
    const ll = this.lowest(low)
    
    const hkhh = this.HKhighest(high)
    const hkll = this.HKlowest(low)
    
    const K = (hh - ll) === 0 ? 0 : this.sma2(100 * (close - ll) / (hh - ll))
    const HK = (hkhh - hkll) === 0 ? 0 : this.HKsma2(100 * (close - hkll) / (hkhh - hkll))
    
    const D = this.sma(K)
    const HD = this.HKsma(HK)
    
    return { K, D, HK, overBought: this.overBought, overSold: this.overSold }
  }

  filter(d) {
    return predef.filters.isNumber(d.D)
  }
}

module.exports = {
  name: "fullStochastic",
  description: "Full Stochastic",
  calculator: fullStochastic,
  params: {
    overBought: predef.paramSpecs.number(80),
    overSold: predef.paramSpecs.number(20),
    period: predef.paramSpecs.period(5),
    smoothPeriod: predef.paramSpecs.period(3),
    Slow_K_sma_period: predef.paramSpecs.period(3),
    high_Period: predef.paramSpecs.period(21),
    high_Smooth_Period: predef.paramSpecs.period(2),
    high_K_SMA_Period:predef.paramSpecs.period(14)
  },
  validate(obj) {
    if (obj.period < 1) {
      return meta.error("period", "Period should be a positive number")
    }
    if (obj.highKPeriod < 1) {
      return meta.error("highKPeriod", "Period should be a positive number")
    }
    if (obj.smoothPeriod < 2) {
      return meta.error("smoothPeriod", "Smooth period should be greater than 1")
    }
    if (obj.highKSmoothPeriod < 2) {
      return meta.error("hightKSmoothPeriod", "Smooth period should be greater than 1")
    }
    return undefined
  },
  tags: [predef.tags.Oscillators],
  inputType: meta.InputType.BARS,
  areaChoice: meta.AreaChoice.NEW,
  plots: {
    K: { title: "Slow %K" },
    D: { title: "Slow %D" },
    HK: { title: "High %K" },
    overBought: { displayOnly: true },
    overSold: { displayOnly: true }
  },
  schemeStyles: {
    dark: {
      K: predef.styles.plot("#CC33FF"),
      D: predef.styles.plot("#CC6600"),
      HK: predef.styles.plot("#CCCCCC"),
      overBought: predef.styles.plot({ color: "#AAAAAA", lineStyle: 4 }),
      overSold: predef.styles.plot({ color: "#AAAAAA", lineStyle: 4 })
    }
  }
}
