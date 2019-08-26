const dims =  {width: 300, height: 300, radius: 150};
const center =  {
    x: dims.width/2 + 5,
    y: dims.height/2 + 5,
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

const update = data => {
    // update color scale domain
    color.domain(data.map(item => item.name));

    // join enhanced (pie) data to path elements:
    const paths = graph.selectAll('path')
        .data(pie(data));

    // handle the exit selection
    paths.exit().remove()

    // handle the current DOM path updates
    paths.attr('d', arcPath)
      
    // append the enter selection to dom
    paths.enter()
    .append('path')
        .attr('class', 'arc')
        .attr('d', arcPath)
        .attr('stroke', 'white')
        .attr('stroke-width', 3)
        .attr('fill', d => color(d.data.name))
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
})
