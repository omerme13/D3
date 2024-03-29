const svg = d3.select('.canvas')
    .append('svg')
    .attr('width',600)
    .attr('height',600);

// create margins and dimensions 
const margin = {top: 20, right: 20, bottom: 100, left: 100};
const graphWidth = 600 - margin.left - margin.right;    
const graphHeight = 600 - margin.top - margin.bottom;    

const graph = svg.append('g')
    .attr('width', graphWidth)
    .attr('height', graphHeight)
    .attr('transform', `translate(${margin.left}, ${margin.top})`);
    
const xAxisGroup = graph.append('g')
    .attr('transform', `translate(0, ${graphHeight})`);    
const yAxisGroup = graph.append('g');    


// scales
const y = d3.scaleLinear()
.range([graphHeight, 0]);

const x = d3.scaleBand()
.range([0, 500])
.paddingInner(0.2)
.paddingOuter(0.3);

// create the axes
const xAxis = d3.axisBottom(x);
const yAxis = d3.axisLeft(y)
    .ticks(3)
    .tickFormat(d => d + " orders");

// update x axis text
xAxisGroup.selectAll('text')
    .attr('transform', 'rotate(-40)')
    .attr('text-anchor', 'end')
    .attr('fill', 'red');    

    
const update = data => {
    // updating scales domains
    y.domain([0, d3.max(data, d => d.orders)]);
    x .domain(data.map(item => item.name));

    //  join data to rects
    const rects = graph.selectAll('rect')
        .data(data);
    
    // remove exit selection
    rects.exit().remove();    

    // update rects that are already in the DOM
    rects.attr('width', x.bandwidth)
        .attr('fill', () => 'orangered')
        .attr('x', d => x(d.name))

    // append the enter selection to DOM
    rects.enter()
        .append('rect')
        .attr('fill', () => 'orangered')
        .attr('x', d => x(d.name))
        .attr('height', 0)
        .attr('y', graphHeight)
        .merge(rects)
        .transition().duration(500)
            .attrTween('width', widthTween)
            .attr('height', d => graphHeight - y(d.orders))
            .attr('y', d => y(d.orders));


    // call axes
    xAxisGroup.call(xAxis);
    yAxisGroup.call(yAxis);
}

// i used var instead of const brcause of the scope
var data = [];

db.collection('dishes').onSnapshot(res => {
        for (let change of res.docChanges()) {
            const doc = {...change.doc.data(), id: change.doc.id};
    
            switch(change.type) {
                case "added":
                    data.push(doc);
                    break;

                case "modified":
                    const index = data.findIndex(item => item.id === doc.id)
                    data[index] = doc;
                    break;   

                case "removed":
                    data = data.filter(item => item.id !== doc.id)
                    break;       
                    
                default: break;    
            }                   
        }
    update(data);
})

// TWEENS 
const widthTween = d => {
    let i = d3.interpolate(0, x.bandwidth());
    
    return function(t) {
        return i(t);
    }
}