import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { chartColors } from '@/lib/colors';

interface BarChartData {
  name: string;
  invoiced: number;
  paid: number;
}

interface BarChartProps {
  title: string;
  data: BarChartData[];
  formatValue: (value: number) => string;
  maxItems?: number;
}

export const BarChart: React.FC<BarChartProps> = ({ 
  title, 
  data, 
  formatValue, 
  maxItems = 8 
}) => {
  const chartRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 500 });
  const displayData = data.slice(0, maxItems);

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        setDimensions({
          width: Math.max(containerWidth - 48, 600), // Account for padding
          height: 500
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    if (!chartRef.current || displayData.length === 0) return;

    const svg = d3.select(chartRef.current);
    svg.selectAll('*').remove();

    const width = dimensions.width;
    const height = dimensions.height;
    const margin = { top: 40, right: 60, bottom: 120, left: 80 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const g = svg
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Scales
    const maxValue = d3.max(displayData, d => Math.max(d.invoiced, d.paid)) || 0;
    
    const xScale = d3.scaleBand()
      .domain(displayData.map(d => d.name))
      .range([0, chartWidth])
      .padding(0.3);

    const yScale = d3.scaleLinear()
      .domain([0, maxValue])
      .range([chartHeight, 0]);

    const barWidth = (xScale.bandwidth() / 2) - 2;

    // Background grid (horizontal lines)
    const yTicks = yScale.ticks(5);
    g.selectAll('.grid-line')
      .data(yTicks)
      .enter()
      .append('line')
      .attr('class', 'grid-line')
      .attr('x1', 0)
      .attr('x2', chartWidth)
      .attr('y1', d => yScale(d))
      .attr('y2', d => yScale(d))
      .attr('stroke', chartColors.grid)
      .attr('stroke-width', 1);

    // Create groups for each item
    const itemGroups = g.selectAll('.item-group')
      .data(displayData)
      .enter()
      .append('g')
      .attr('class', 'item-group')
      .attr('transform', d => `translate(${(xScale(d.name) || 0)}, 0)`);

    // Invoiced bars (left)
    itemGroups.append('rect')
      .attr('class', 'bar-invoiced')
      .attr('x', 0)
      .attr('y', chartHeight)
      .attr('width', barWidth)
      .attr('height', 0)
      .attr('fill', chartColors.invoiced)
      .attr('rx', 4)
      .transition()
      .duration(1000)
      .delay((_, i) => i * 100)
      .attr('y', d => yScale(d.invoiced))
      .attr('height', d => chartHeight - yScale(d.invoiced));

    // Paid bars (right)
    itemGroups.append('rect')
      .attr('class', 'bar-paid')
      .attr('x', barWidth + 4)
      .attr('y', chartHeight)
      .attr('width', barWidth)
      .attr('height', 0)
      .attr('fill', chartColors.paid)
      .attr('rx', 4)
      .transition()
      .duration(1000)
      .delay((_, i) => (i * 100) + 200)
      .attr('y', d => yScale(d.paid))
      .attr('height', d => chartHeight - yScale(d.paid));

    // Value labels for invoiced (on top of bars)
    itemGroups.append('text')
      .attr('class', 'label-invoiced')
      .attr('x', (barWidth / 2))
      .attr('y', d => yScale(d.invoiced) - 8)
      .attr('text-anchor', 'middle')
      .style('font-size', '11px')
      .style('font-weight', '600')
      .style('fill', chartColors.invoiced)
      .style('opacity', 0)
      .text(d => formatValue(d.invoiced))
      .transition()
      .duration(1000)
      .delay((_, i) => (i * 100) + 500)
      .style('opacity', 1);

    // Value labels for paid (on top of bars)
    itemGroups.append('text')
      .attr('class', 'label-paid')
      .attr('x', barWidth + 4 + (barWidth / 2))
      .attr('y', d => yScale(d.paid) - 8)
      .attr('text-anchor', 'middle')
      .style('font-size', '11px')
      .style('font-weight', '600')
      .style('fill', chartColors.paid)
      .style('opacity', 0)
      .text(d => formatValue(d.paid))
      .transition()
      .duration(1000)
      .delay((_, i) => (i * 100) + 700)
      .style('opacity', 1);

    // Payment rate labels (below x-axis)
    itemGroups.append('text')
      .attr('class', 'payment-rate')
      .attr('x', (xScale.bandwidth() / 2))
      .attr('y', chartHeight + 30)
      .attr('text-anchor', 'middle')
      .style('font-size', '11px')
      .style('font-weight', 'bold')
      .style('fill', d => {
        const rate = (d.paid / d.invoiced) * 100;
        if (rate >= 90) return chartColors.success;
        if (rate >= 70) return chartColors.warning;
        return chartColors.error;
      })
      .style('opacity', 0)
      .text(d => {
        const rate = (d.paid / d.invoiced) * 100;
        return `${rate.toFixed(1)}%`;
      })
      .transition()
      .duration(1000)
      .delay((_, i) => (i * 100) + 900)
      .style('opacity', 1);

    // X-axis labels (item names)
    itemGroups.append('text')
      .attr('class', 'item-label')
      .attr('x', (xScale.bandwidth() / 2))
      .attr('y', chartHeight + 15)
      .attr('text-anchor', 'middle')
      .style('font-size', '12px')
      .style('font-weight', '500')
      .style('fill', chartColors.primary)
      .text(d => {
        const maxLength = chartWidth < 600 ? 10 : 15;
        return d.name.length > maxLength ? d.name.substring(0, maxLength) + '...' : d.name;
      })
      .each(function() {
        // Rotate labels if they're too long or chart is narrow
        if (chartWidth < 800) {
          d3.select(this)
            .attr('transform', `rotate(-45, ${(xScale.bandwidth() / 2)}, ${chartHeight + 15})`)
            .attr('text-anchor', 'end')
            .attr('y', chartHeight + 10);
        }
      });

    // Y-axis
    g.append('g')
      .call(d3.axisLeft(yScale)
        .tickFormat(d => formatValue(d as number))
        .ticks(5)
      )
      .selectAll('text')
      .style('font-size', '11px')
      .style('fill', chartColors.secondary);

    // Y-axis label
    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - margin.left)
      .attr('x', 0 - (chartHeight / 2))
      .attr('dy', '1em')
      .attr('text-anchor', 'middle')
      .style('font-size', '12px')
      .style('font-weight', '600')
      .style('fill', chartColors.primary)
      .text('Amount');

    // Legend
    const legend = g.append('g')
      .attr('transform', `translate(${chartWidth - 150}, -20)`);

    // Invoiced legend
    legend.append('rect')
      .attr('width', 12)
      .attr('height', 12)
      .attr('fill', chartColors.invoiced)
      .attr('rx', 2);

    legend.append('text')
      .attr('x', 18)
      .attr('y', 10)
      .style('font-size', '12px')
      .style('font-weight', '500')
      .style('fill', chartColors.primary)
      .text('Invoiced');

    // Paid legend
    legend.append('rect')
      .attr('x', 80)
      .attr('width', 12)
      .attr('height', 12)
      .attr('fill', chartColors.paid)
      .attr('rx', 2);

    legend.append('text')
      .attr('x', 98)
      .attr('y', 10)
      .style('font-size', '12px')
      .style('font-weight', '500')
      .style('fill', chartColors.primary)
      .text('Paid');

    // Add hover effects
    itemGroups
      .on('mouseover', function(event, d) {
        d3.select(this).selectAll('rect').style('opacity', 0.8);
        
        const tooltip = d3.select('body').append('div')
          .attr('class', 'chart-tooltip')
          .style('position', 'absolute')
          .style('background', chartColors.tooltip.background)
          .style('color', 'white')
          .style('padding', '12px')
          .style('border-radius', '8px')
          .style('font-size', '13px')
          .style('pointer-events', 'none')
          .style('z-index', '1000')
          .style('box-shadow', chartColors.shadow);

        const paymentRate = (d.paid / d.invoiced * 100).toFixed(1);
        const outstanding = d.invoiced - d.paid;

        tooltip.html(`
          <div style="font-weight: bold; margin-bottom: 8px; border-bottom: 1px solid ${chartColors.tooltip.border}; padding-bottom: 4px;">
            ${d.name}
          </div>
          <div style="margin-bottom: 4px;">💰 Invoiced: <strong>${formatValue(d.invoiced)}</strong></div>
          <div style="margin-bottom: 4px;">✅ Paid: <strong>${formatValue(d.paid)}</strong></div>
          <div style="margin-bottom: 4px;">⚠️ Outstanding: <strong>${formatValue(outstanding)}</strong></div>
          <div style="color: ${chartColors.success};">📊 Payment Rate: <strong>${paymentRate}%</strong></div>
        `)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 10) + 'px');
      })
      .on('mouseout', function() {
        d3.select(this).selectAll('rect').style('opacity', 1);
        d3.selectAll('.chart-tooltip').remove();
      });

  }, [displayData, formatValue, dimensions]);

  return (
    <Card className="hover:shadow-lg transition-all duration-300 hover:scale-[1.005]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {title}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div ref={containerRef} className="w-full">
          <svg ref={chartRef} className="w-full"></svg>
        </div>
      </CardContent>
    </Card>
  );
};