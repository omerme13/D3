const canvas = d3.select('.canvas');
const svg = canvas.append('svg')
    .attr('height', 600)
    .attr('width', 600);

const group = svg.append('g')
    .attr('transform', 'rotate(10)');    

group.append('rect')
    .attr('height', 100)
    .attr('width', 200)
    .attr('fill', 'blue')
    .attr('x', 30)
    .attr('y', 30);

group.append('circle')
    .attr('r', 50)
    .attr('fill', 'red')
    .attr('cx', 100)
    .attr('cy', 100);

group.append('line')
    .attr('x1', 50)
    .attr('x2', 100)
    .attr('y1', 75)
    .attr('y2', 175)
    .attr('stroke', 'green')
    .attr('stroke-width', 3);

svg.append('text')
    .attr('fill', 'yellow')
    .attr('x', 60)
    .attr('y', 60)
    .text('This is SVG text')
    .style('font-family', 'sans-serif');