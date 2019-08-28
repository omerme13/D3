const margin = {top: 40, right: 20, bottom: 50, left: 100};
const graphWidth = 560 - margin.left - margin.right;
const graphHeight = 560 - margin.top - margin.bottom;

const svg = d3.select('.canvas')
    .append('svg')
    .attr('width', graphWidth + margin.left + margin.right)
    .attr('height', graphHeight + margin.top + margin.bottom)

const graph = svg.append('g')    
    .attr('width', graphWidth)
    .attr('height', graphHeight)
    .attr('transform', `translate(${margin.left}, ${margin.top})`)

const x = d3.scaleTime().range([0, graphWidth]);
const y = d3.scaleLinear().range([graphHeight, 0]);

const xAxisGroup = graph.append('g')
    .attr('class', 'x-axis')
    .attr('transform', `translate(0, ${graphHeight})`);

const yAxisGroup = graph.append('g')
    .attr('class', 'y-axis');

var data = [];

const line = d3.line()
    .x(d => x(new Date(d.date)))
    .y(d => y(d.distance))

const path = graph.append('path');

const dottedLineGroup = graph.append('g');

const dottedLineX = dottedLineGroup.append('line')
    .attr('stroke', 'lightgrey')
    .attr('stroke-width', '1')
    .attr('stroke-dasharray', 4);

const dottedLineY = dottedLineGroup.append('line')
    .attr('stroke', 'lightgrey')
    .attr('stroke-width', '1')
    .attr('stroke-dasharray', 4);



const update = data => {
    data = data.filter(item => item.activity == curAct);

    data.sort((a, b) => new Date(a.date) - new Date(b.date));

    x.domain(d3.extent(data, d => new Date(d.date))); // i use new Date to convert the string to a date type
    y.domain([0, d3.max(data, d => d.distance)]);

    path.data([data])
        .attr('fill', 'none')
        .attr('stroke', '#00bfa5')
        .attr('stroke-width', 2)
        .attr('d', line)

    const circles = graph.selectAll('circle')
        .data(data);

    circles
        .attr('cx', d => x(new Date(d.date)))    
        .attr('cy', d => y(d.distance))  
        
    circles.exit().remove();
        
    circles.enter()
        .append('circle')
        .attr('r', 5)
        .attr('cx', d => x(new Date(d.date)))    
        .attr('cy', d => y(d.distance))    
        .attr('fill', 'lightgrey')
        
    graph.selectAll('circle')
        .on('mouseover', (d, i, n) => {
            d3.select(n[i])
                .transition('resizeCircle').duration(200)
                .attr('fill', 'white')
                .attr('r', 8)

            dottedLineX
                .attr('x1', x(new Date(d.date)))
                .attr('x2', x(new Date(d.date)))
                .attr('y1', graphHeight)
                .attr('y2', y(d.distance))

            dottedLineY
                .attr('x1', 0)
                .attr('x2', x(new Date(d.date)))
                .attr('y1', y(d.distance))
                .attr('y2', y(d.distance))

            dottedLineGroup.attr('opacity', 1)       

        })
        .on('mouseout', (d, i, n) => {
            d3.select(n[i])
                .transition('resizeCircle').duration(200)
                .attr('fill', 'lightgrey')
                .attr('r', 5)

            dottedLineGroup.attr('opacity', 0)       
        })
        
    const xAxis = d3.axisBottom(x)
        .ticks(4)
        .tickFormat(d3.timeFormat('%b %d'));
    const yAxis = d3.axisLeft(y)
        .ticks(4)
        .tickFormat(d => d + 'm');

    
    xAxisGroup.call(xAxis);
    yAxisGroup.call(yAxis);

    xAxisGroup.selectAll('text')
        .attr('transform', 'rotate(-40)')
        .attr('text-anchor', 'end')

}


db.collection('activities').onSnapshot(res => {
    for (let change of res.docChanges()) {
        const doc = {...change.doc.data(), id: change.doc.id};

        switch(change.type) {
            case "added":
                data.push(doc);
                break;

            case "modified":
                const index = data.findIndex(item => item.id == doc.id);
                data[index] = doc;
                break;     

            case "removed":
                data = data.filter(item => item.id !== doc.id);
                break;   

            default: break;
        }
    }
    update(data);
})
