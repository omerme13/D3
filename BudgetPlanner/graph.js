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

const arcPath = d3.arc()
    .outerRadius(dims.radius)
    .innerRadius(dims.radius / 2)

const update = data => {
    console.log(data)
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
