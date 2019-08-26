const dims =  {width: 300, height: 300, radius: 150};
const center =  {
    x: dims.width / 2 + 5,
    y: dims.height / 2 + 5,
};

const legendSpace = 150;

const svg = d3.select('.canvas')
    .append('svg')
    .attr('width', dims.width + legendSpace)
    .attr('height', dims.height + legendSpace);

const graph = svg.append('g')
    .attr('transform', `translate(${center.x}, ${center.y})`);

const pie = d3.pie()
    .sort(null)
    .value(d => d.cost)
    // the value we are evaluating to create the pie angles

const arcPath = d3.arc()
    .outerRadius(dims.radius)
    .innerRadius(dims.radius / 2);

const color = d3.scaleOrdinal(d3['schemeSet3']);

const legendGroup = svg.append('g') 
    .attr('transform', `translate(${dims.width + 50}, 20)`)
    .attr('height', dims.height)

const legend = d3.legendColor()
    .shape('circle')
    .shapePadding(10)
    .scale(color);

const tip = d3.tip()
    .attr('class', 'tip card')    
    .html(d => {
        return `
            <p class="name">${d.data.name}</p>
            <p class="cost">${d.data.cost}</p>
            <p class="delete-msg">click to delete</p>
        `
    })

graph.call(tip);


const update = data => {
    // update color scale domain
    color.domain(data.map(item => item.name));

    // update and call legend
    legendGroup.call(legend);
    legendGroup.selectAll('text')
        .attr('fill', 'white');

    // join enhanced (pie) data to path elements:
    const paths = graph.selectAll('path')
        .data(pie(data));

    
    // handle the exit selection
    paths.exit()
        .transition().duration(500)
        .attrTween('d', arcTweenExit)
        .remove()

    // handle the current DOM path updates
    paths.attr('d', arcPath)
        .transition().duration(500)
        .attrTween('d', arcTweenUpdate)
      
    // append the enter selection to dom
    paths.enter()
    .append('path')
        .attr('class', 'arc')
        .attr('d', arcPath)
        .attr('stroke', 'white')
        .attr('stroke-width', 3)
        .attr('fill', d => color(d.data.name))
        .each(function(d) {this.current = d})
            .transition().duration(500)
            .attrTween('d', arcTweenEnter)

    // add events 
    graph.selectAll('path')
        .on('mouseover', (d, i, n) => {
            tip.show(d, n[i]);
            handleMouseOver(d, i, n);
        })    
        .on('mouseout', (d, i, n) => {
            tip.hide();
            handleMouseOut(d, i, n);
        })    
        .on('click', handleClick)    
        
}

var data = [];

db.collection('expenses').onSnapshot(res => {
    for (let change of res.docChanges()) {
        const doc = {...change.doc.data(), id: change.doc.id}

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
});

const arcTweenEnter = d => {
    var i = d3.interpolate(d.endAngle, d.startAngle);

    return function(t) {
        d.startAngle = i(t);
        return arcPath(d);
    }
}

const arcTweenExit = d => {
    var i = d3.interpolate(d.startAngle, d.endAngle);

    return function(t) {
        d.startAngle = i(t);
        return arcPath(d);
    }
}

// use function keyword to allow use of "this"
function arcTweenUpdate(d) {

    // interpolate between the two objects
    var i = d3.interpolate(this.current, d) 

    // update the current prop with new updated data
    this.current = i(1);

    return function(t) {
        return arcPath(i(t))
    }
}


// EVENT HANDLERS
const handleMouseOver = (d, i, n) => {
    d3.select(n[i])
        .transition('changeSliceFill').duration(300)
        .attr('fill', 'white');
}

const handleMouseOut = (d, i, n) => {
    d3.select(n[i])
        .transition('changeSliceFill').duration(300) 
        .attr('fill', color(d.data.name));
}

const handleClick = d => {
    const id = d.data.id;
    db.collection('expenses').doc(id).delete();
}