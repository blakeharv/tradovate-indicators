// Coding by Blake Harvey
// https://github.com/blakeharv
// https://www.linkedin.com/in/blakeharv

const predef = require("./tools/predef")
const meta = require("./tools/meta")
const SMA = require("./tools/SMA")
const typicalPrice = require("./tools/typicalPrice")

class commodityChannelIndex {
  init() {
    this.sma = new SMA(this.props.period)
  }
  
  map(d, i) {
    const tp = typicalPrice(d)
    this.sma.push(tp)
    let cci;
    if (i >= this.props.period) {
      cci = (tp - this.sma.avg()) / (0.015 * this.sma.meanDeviation())
    }
    return { cci, zero: 0 }
  }
  
  filter(d) {
    return predef.filters.isNumber(d.cci)
  }
}

module.exports = {
  name: "ccizero",
  description: "Commodity Channel Index Zero",
  calculator: commodityChannelIndex,
  params: {
    period: predef.paramSpecs.period(50)
  },
  inputType: meta.InputType.BARS,
  areaChoice: meta.AreaChoice.NEW,
  plots: {
    cci: { title: "CCI" },
    zero: { displayOnly: true }
  },
  tags: [predef.tags.Oscillators],
  schemeStyles: {
    dark: {
      cci: predef.styles.plot("#8cecff"),
      zero: predef.styles.plot({ color: "#AAAAAA", lineStyle: 4 })
    }
  }
}
