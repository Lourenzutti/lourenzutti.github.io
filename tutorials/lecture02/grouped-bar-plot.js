colorScale = d3.scaleOrdinal(
    [...new Set(data.map((d) => d.X))],
    d3.schemeTableau10
  )
  
  function colorLegend(colorScale, options = {}) {
    let { tickPadding = 5, width = 110, marginRight = 80 } = options;
    return Plot.plot({
      marks: [
        Plot.cellX(colorScale.domain(), {
          y: colorScale.domain(),
          x: 0,
          color: colorScale.range()
        })
      ],
      y: {
        axis: "right",
        tickSize: 0,
        tickPadding
      },
      x: {
        axis: null
      },
      width,
      marginRight,
      marginTop: 100,
      height: 200,
      style: {
        fontSize: '0.45em'
      }
    });
  }
  function addLegend (chart, legend) {
    let [lw, cw] = [+legend.getAttribute("width"), +chart.getAttribute("width")];
    let [lh, ch] = [
      +legend.getAttribute("height"),
      +chart.getAttribute("height")
    ];
    return svg`<svg width=${lw + cw} height=${Math.max(
      lh,
      ch
    )}>${chart}<g transform=translate(${cw},0)>${legend}</g></svg>`;
  }
  addLegend(Plot.plot({
    x: {
      axis: null,
      domain: data.X
    },
    y: {
      grid: true,
      tickFormat: ".0%",
      domain: [0, 1]
    },
    color: {
      domain: data.X,
    },
    fx: {
      domain: data.Frequency,
      label: null,
      tickSize: 6,
    },
    facet: {
      data: data,
      x: "Y"
    },
    marks: [
      Plot.barY( data, {x: "X", y: "Frequency", fill: "X", title: "X"}),
      Plot.ruleY([0])
    ],
    style: {
      fontSize: '.45em',
    },
    height: 450,
      width: 478,
      marginLeft: 50,
      marginRight: 25,
      marginTop: 50,
      marginBottom: 50,
  }), colorLegend(colorScale));