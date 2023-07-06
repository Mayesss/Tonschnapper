<template>
  <div ref="chartContainer"></div>
</template>

<script>
import SoundAnalyzer from "../utils/soundAnalyzer";
import * as d3 from "d3";

export default {
  data() {
    return {
      spectrum: [],
      spectrums: [],
      width: 300,
      height: 500,
      color: "steelblue",
    };
  },

  mounted() {
    this.startAnalyzing();
  },
  methods: {
    startAnalyzing() {
      const analyzer = new SoundAnalyzer();
      analyzer.setSpectrumUpdateCallback((spectrum) => {
        this.spectrum = spectrum;
        if (this.spectrums.length > 100) this.spectrums.shift();
        this.spectrums.push(spectrum);
      });
      analyzer.startAnalysis();
    },
    createChart() {
      const svg = d3
        .select(this.$refs.chartContainer)
        .append("svg")
        .attr("width", this.options.width)
        .attr("height", this.options.height);

      const xScale = d3
        .scaleLinear()
        .domain([0, 1]) // Update the domain based on your frequency range
        .range([0, this.options.width]);

      const yScale = d3
        .scaleLinear()
        .domain([0, 100]) // Update the domain based on your dB range
        .range([this.options.height, 0]);

      const line = d3
        .line()
        .x((d, i) => xScale(i / this.spectrum.length))
        .y((d) => yScale(d));

      svg
        .append("path")
        .attr("fill", "none")
        .attr("stroke", this.options.color);

      this.updateChart();

      this.$watch("spectrum", this.updateChart);
    },
    updateChart() {
      const svg = d3.select(this.$refs.chartContainer).select("svg");

      const xScale = d3
        .scaleLinear()
        .domain([0, this.spectrum.length])
        .range([0, this.options.width]);

      const yScale = d3
        .scaleLinear()
        .domain([0, d3.max(this.spectrum)])
        .range([this.options.height, 0]);

      const line = d3
        .line()
        .x((d, i) => xScale(i / this.spectrum.length))
        .y((d) => yScale(d));

      svg.select("path").datum(this.spectrum).attr("d", line);
    },
  },
};
</script>
