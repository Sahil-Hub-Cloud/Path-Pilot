'use client';

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { motion } from 'framer-motion';

interface Module {
    id: number | string;
    title: string;
    energy_cost: number;
    difficulty: string;
}

interface SkillGraphProps {
    modules: Module[];
}

export default function SkillGraph({ modules }: SkillGraphProps) {
    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        if (!svgRef.current || modules.length === 0) return;

        const width = 800;
        const height = 400;

        // Clear previous SVG content
        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove();

        // Prepare data for D3
        const nodes = modules.map(m => ({ ...m }));
        const links: { source: any; target: any }[] = [];

        // Create sequential links for now (1 -> 2 -> 3)
        for (let i = 0; i < nodes.length - 1; i++) {
            links.push({ source: nodes[i].id, target: nodes[i + 1].id });
        }

        const simulation = d3.forceSimulation(nodes as any)
            .force('link', d3.forceLink(links).id((d: any) => d.id).distance(150))
            .force('charge', d3.forceManyBody().strength(-300))
            .force('center', d3.forceCenter(width / 2, height / 2))
            .force('collision', d3.forceCollide().radius(60));

        const container = svg.append('g');

        // Draw links
        const link = container.append('g')
            .selectAll('line')
            .data(links)
            .enter().append('line')
            .attr('stroke', 'rgba(6, 182, 212, 0.2)')
            .attr('stroke-width', 2)
            .attr('stroke-dasharray', '5,5');

        // Draw nodes
        const node = container.append('g')
            .selectAll('g')
            .data(nodes)
            .enter().append('g')
            .call(d3.drag<any, any>()
                .on('start', dragstarted)
                .on('drag', dragged)
                .on('end', dragended)
            );

        // Node circle (glow effect)
        node.append('circle')
            .attr('r', 30)
            .attr('fill', 'rgba(6, 182, 212, 0.05)')
            .attr('stroke', 'rgba(6, 182, 212, 0.5)')
            .attr('stroke-width', 2)
            .style('filter', 'drop-shadow(0 0 8px rgba(6, 182, 212, 0.4))');

        // Node title
        node.append('text')
            .text((d: any) => d.title.toUpperCase())
            .attr('text-anchor', 'middle')
            .attr('dy', 50)
            .attr('fill', 'white')
            .attr('font-size', '8px')
            .attr('font-weight', '900')
            .attr('letter-spacing', '0.1em');

        // Energy tag
        node.append('text')
            .text((d: any) => `${d.energy_cost} EC`)
            .attr('text-anchor', 'middle')
            .attr('dy', -45)
            .attr('fill', 'rgba(6, 182, 212, 0.6)')
            .attr('font-size', '7px')
            .attr('font-weight', 'bold');

        simulation.on('tick', () => {
            link
                .attr('x1', (d: any) => d.source.x)
                .attr('y1', (d: any) => d.source.y)
                .attr('x2', (d: any) => d.target.x)
                .attr('y2', (d: any) => d.target.y);

            node.attr('transform', (d: any) => `translate(${d.x}, ${d.y})`);
        });

        function dragstarted(event: any) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            event.subject.fx = event.subject.x;
            event.subject.fy = event.subject.y;
        }

        function dragged(event: any) {
            event.subject.fx = event.x;
            event.subject.fy = event.y;
        }

        function dragended(event: any) {
            if (!event.active) simulation.alphaTarget(0);
            event.subject.fx = null;
            event.subject.fy = null;
        }

        // Handle zoom
        svg.call(d3.zoom<SVGSVGElement, unknown>()
            .scaleExtent([0.5, 2])
            .on('zoom', (event) => {
                container.attr('transform', event.transform);
            }) as any);

    }, [modules]);

    return (
        <div className="w-full h-[400px] bg-[#050911]/50 border border-white/5 rounded-[2.5rem] relative overflow-hidden group">
            <div className="absolute top-6 left-8 z-10">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400">Neural Constellation</h3>
                <p className="text-[8px] text-white/30 uppercase tracking-widest mt-1">Real-time dependency mapping</p>
            </div>

            <svg
                ref={svgRef}
                className="w-full h-full cursor-grab active:cursor-grabbing"
                viewBox="0 0 800 400"
            />

            <div className="absolute bottom-6 right-8">
                <div className="flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
                    <div className="w-2 h-2 rounded-full bg-white/10" />
                    <div className="w-2 h-2 rounded-full bg-white/10" />
                </div>
            </div>
        </div>
    );
}
