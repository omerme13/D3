const dims = {height: 500, width: 1100};

const svg = d3.select('.canvas')
    .append('svg')
    .attr('height', dims.height + 100)
    .attr('width', dims.width + 100);

const graph = svg.append('g')
    .attr('transform', 'translate(50, 50)');

const stratify = d3.stratify()
    .id(d => d.name)
    .parentId(d => d.parent);    

const tree = d3.tree()
    .size([dims.width, dims.height])

const color = d3.scaleOrdinal(d3['schemeSet1']);

const update = data => {
    color.domain(data.map(item => item.department));

    graph.selectAll('.node').remove();
    graph.selectAll('.link').remove();

    const rootNode = stratify(data);
    const treeData = tree(rootNode);

    const nodes = graph.selectAll('.node')
        .data(treeData.descendants());

    const links = graph.selectAll('.link')
        .data(treeData.links());

    links.enter()
        .append('path')
        .attr('class', 'link')
        .attr('fill', 'none')
        .attr('stroke', '#aaa')
        .attr('stroke-width', 2)
        .attr('d', d3.linkVertical()
            .x(d => d.x)
            .y(d => d.y)
        );

    const enterNodes = nodes.enter()
        .append('g')
        .attr('class', 'node')
        .attr('transform', d => `translate(${d.x}, ${d.y})`);

    enterNodes.append('rect')
        .attr('fill', '#aaa')
        .attr('stroke', '#555')
        .attr('stroke-width', 2)
        .attr('height', 50)
        .attr('width', d => d.data.name.length * 20)
        .attr('fill', d => color(d.data.department))
        .attr('transform',d => `translate(${-(d.data.name.length * 20) / 2}, -30)`);

    enterNodes.append('text')    
        .attr('text-anchor', 'middle')
        .attr('fill', 'white')
        .text(d => d.data.name)
}

var data = [];

db.collection('employees').onSnapshot(res => {
    for (let change of res.docChanges()) {
        const doc = {...change.doc.data(), id: change.doc.id}

        switch(change.type) {
            case "added":
                data.push(doc);
                break;

            case "modified":
                const index = data.findIndex(item => item.id === doc.id);
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
