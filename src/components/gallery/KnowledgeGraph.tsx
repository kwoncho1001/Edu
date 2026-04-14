import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { KnowledgeGraphData, KnowledgeNode, KnowledgeLink } from '@/types/villain';

interface D3Node extends KnowledgeNode, d3.SimulationNodeDatum {}
interface D3Link extends d3.SimulationLinkDatum<D3Node> {
  source: string | D3Node;
  target: string | D3Node;
  strength: number;
}

interface Props {
  data: KnowledgeGraphData;
}

export default function KnowledgeGraph({ data }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.nodes.length) return;

    const width = 600;
    const height = 400;

    const svg = d3.select(svgRef.current)
      .attr('viewBox', [0, 0, width, height])
      .style('width', '100%')
      .style('height', 'auto');

    svg.selectAll('*').remove();

    const nodes: D3Node[] = data.nodes.map(d => ({ ...d }));
    const links: D3Link[] = data.links.map(d => ({ ...d }));

    const simulation = d3.forceSimulation<D3Node>(nodes)
      .force('link', d3.forceLink<D3Node, D3Link>(links).id(d => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2));

    const link = svg.append('g')
      .attr('stroke', '#000')
      .attr('stroke-opacity', 0.6)
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke-width', d => Math.sqrt(d.strength) * 2);

    const node = svg.append('g')
      .selectAll('g')
      .data(nodes)
      .join('g')
      .call(drag(simulation) as any);

    node.append('rect')
      .attr('width', 80)
      .attr('height', 40)
      .attr('x', -40)
      .attr('y', -20)
      .attr('fill', d => d.type === 'Villain' ? '#FF006E' : d.status === 'Mastered' ? '#3A86FF' : '#FFBE0B')
      .attr('stroke', '#000')
      .attr('stroke-width', 2);

    node.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '.35em')
      .attr('font-size', '10px')
      .attr('font-weight', 'bold')
      .attr('fill', d => d.type === 'Villain' ? '#FFF' : '#000')
      .text(d => d.label);

    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node
        .attr('transform', (d: any) => `translate(${d.x},${d.y})`);
    });

    function drag(simulation: any) {
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

      return d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended);
    }
  }, [data]);

  return (
    <div className="w-full brutal-border bg-white overflow-hidden">
      <svg ref={svgRef}></svg>
    </div>
  );
}
