'use client';

import React, { useEffect, useRef } from 'react';
import { select, scaleLinear, lineRadial, curveLinearClosed } from 'd3';

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
    const svgEl = svgRef.current;
    // cleanup previous render
    select(svgEl).selectAll('*').remove();
    const rect = svgEl.getBoundingClientRect();
    const width = Math.min(340, rect.width || 300);
    const height = width;
    const margin = 40;
    const radius = Math.min(width, height) / 2 - margin;

    const svg = select(svgEl)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('role', 'img')
      .attr('aria-label', 'Skill proficiency radar')
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    const angleSlice = (Math.PI * 2) / data.length;
    const rScale = scaleLinear().domain([0, 100]).range([0, radius]);

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
        .style('stroke', 'var(--border-clay, #B48C5A)')
        .style("stroke-width", "1px");
    }

    // Draw area
    const radarLine = lineRadial<SkillData>()
      .radius(d => rScale(d.value))
      .angle((d, i) => i * angleSlice)
      .curve(curveLinearClosed);

    svg.append("path")
      .datum(data)
      .attr("d", radarLine)
      .style('fill', 'rgba(0, 107, 122, 0.18)')
      .style('stroke', 'var(--peacock-blue, #006B7A)')
      .style('stroke-width', '2px');

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
      .attr('fill', 'var(--text-muted, #8B6E52)')
      .text(d => d.axis.toUpperCase());

  }, []);

  return <svg ref={svgRef} className="mx-auto w-full max-w-[340px]" style={{ display: 'block' }}><title>Skill Radar</title></svg>;
}
