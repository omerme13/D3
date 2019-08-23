const svg = d3.select('svg');

d3.json('menu.json')
    .then(data => {
        // function to find min/max/both
        /*
            const min = d3.min(data, d => d.orders);
            const max = d3.max(data, d => d.orders);
            const extent = d3.extent(data, d => d.orders);

        */    
        
        // another way without the functions above
        // max = Math.max(...data.map(item => item.orders))

        const y = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.orders)])
            .range([0, 500]);
            
        const x = d3.scaleBand()
            .domain(data.map(item => item.name))
            .range([0, 500])
            .paddingInner(0.2)
            .paddingOuter(0.3);

            
        //  join data to rects
        const rects = svg.selectAll('rect')
            .data(data);

        //  add attr to rects that are already in the DOM
        rects.attr('width', x.bandwidth)
            .attr('height', d => y(d.orders))
            .attr('fill', () => 'orangered')
            .attr('x', d => x(d.name));

        //  append the enter selection to DOM
        rects.enter()
            .append('rect')
            .attr('width', x.bandwidth)
            .attr('height', d => y(d.orders))
            .attr('fill', () => 'orangered')
            .attr('x', d => x(d.name));
    })