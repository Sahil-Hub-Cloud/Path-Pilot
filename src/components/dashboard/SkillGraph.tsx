'use client';

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface SkillData {
  axis: string;
  value: number;
}

const data: SkillData[] = [
  { axis: "Logic", value: 80 },
  { axis: "Syntax", value: 70 },
  { axis: "Systems", value: 60 },
  { axis: "Debugging", value: 85 },
  { axis: "AI Usage", value: 75 },
];

export default function SkillGraph() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 300, height = 300;
    const margin = 40;
    const radius = Math.min(width, height) / 2 - margin;
    
    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    const angleSlice = (Math.PI * 2) / data.length;
    const rScale = d3.scaleLinear().domain([0, 100]).range([0, radius]);

    // Draw grid
    const levels = 5;
    for (let j = 0; j < levels; j++) {
      const levelFactor = radius * ((j + 1) / levels);
      svg.selectAll(".grid")
        .data(data)
        .enter()
        .append("line")
        .attr("x1", (d, i) => levelFactor * Math.cos(angleSlice * i - Math.PI / 2))
        .attr("y1", (d, i) => levelFactor * Math.sin(angleSlice * i - Math.PI / 2))
        .attr("x2", (d, i) => levelFactor * Math.cos(angleSlice * (i + 1) - Math.PI / 2))
        .attr("y2", (d, i) => levelFactor * Math.sin(angleSlice * (i + 1) - Math.PI / 2))
        .attr("class", "line")
        .style("stroke", "#2D2D4E")
        .style("stroke-width", "1px");
    }

    // Draw area
    const radarLine = d3.lineRadial<SkillData>()
      .radius(d => rScale(d.value))
      .angle((d, i) => i * angleSlice)
      .curve(d3.curveLinearClosed);

    svg.append("path")
      .datum(data)
      .attr("d", radarLine)
      .style("fill", "rgba(124, 58, 237, 0.4)")
      .style("stroke", "#7C3AED")
      .style("stroke-width", "2px");

    // Labels
    svg.selectAll(".label")
      .data(data)
      .enter()
      .append("text")
      .attr("x", (d, i) => (radius + 15) * Math.cos(angleSlice * i - Math.PI / 2))
      .attr("y", (d, i) => (radius + 15) * Math.sin(angleSlice * i - Math.PI / 2))
      .attr("text-anchor", "middle")
      .attr("font-size", "10px")
      .attr("font-weight", "black")
      .attr("fill", "#94A3B8")
      .text(d => d.axis.toUpperCase());

  }, []);

  return <svg ref={svgRef} className="mx-auto"></svg>;
}
