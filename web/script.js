function loadSubAccountNames(data){
    let moduleSelectionDiv = document.getElementById('account-selection');
    jsonData = JSON.parse(data);

    allHtml = '<p>Please select a <b>subaccount</b> that you would like to visualise:</p><select class = "form-control" name="modules" id="subaccounts">';

    for (let eachAccount of jsonData) {
        allHtml += `<option value="${eachAccount.id}">${eachAccount.name}</option>`;
    }

    allHtml += '</select>';

    moduleSelectionDiv.innerHTML = allHtml;
    //moduleDropDown = document.getElementById('modules');
    //moduleDropDown.addEventListener('change', sendModuleNameOnModuleSelection);
}


function renderTree(data){
    // Clear out any previous graphs that got generated
    tree_div = document.getElementById('container');
    tree_div.innerHTML = "";

    py_payload = JSON.parse(data);

    // Default width
    let width = 2500;

    if(py_payload.width != ""){
        width = parseInt(py_payload.width)
    }

    // Compute the tree height; this approach will allow the height of the
    // SVG to scale according to the breadth (width) of the tree layout.
    const root = d3.hierarchy(py_payload.viz_json);
    const dx = 30;
    const dy = width / (root.height + 1);

    // Create a tree layout.
    const tree = d3.tree().nodeSize([dx, dy]);

    // Sort the tree and apply the layout.
    root.sort((a, b) => d3.ascending(a.data.name, b.data.name));
    tree(root);

    // Compute the extent of the tree. Note that x and y are swapped here
    // because in the tree layout, x is the breadth, but when displayed, the
    // tree extends right rather than down.
    let x0 = Infinity;
    let x1 = -x0;
    root.each(d => {
        if (d.x > x1) x1 = d.x;
        if (d.x < x0) x0 = d.x;
    });

    // Compute the adjusted height of the tree.
    /**
     * Compute the height first. If it is smaller than a certain threshold, 
     * use the threshold instead
     * **/
    const height = x1 - x0 + dx * 2;
    let height_prod = 2000;

    if(height > height_prod){
        height_prod = height;
    }

    // Create an SVG element
    const svg = d3.create("svg")
        .attr("width", width)
        .attr("height", height_prod)
        .attr("viewBox", [-dy / 3, x0 - dx, width, height])
        .attr("style", "max-width: 100%; height: 100%; font: 10px sans-serif;");

    // Create a group for zoomable content
    const zoomGroup = svg.append("g");

    // Define the zoom behavior
    const zoom = d3.zoom()
        .scaleExtent([0.5, 5])  // Set the zoom scale limits
        .on("zoom", (event) => {
            zoomGroup.attr("transform", event.transform);  // Apply zoom transformation
        });

    // Apply zoom behavior to the SVG
    svg.call(zoom);

    // Draw the links
    const link = zoomGroup.append("g")
        .attr("fill", "none")
        .attr("stroke", "#555")
        .attr("stroke-opacity", 0.4)
        .attr("stroke-width", 1.5)
        .selectAll()
        .data(root.links())
        .join("path")
        .attr("d", d3.linkHorizontal()
            .x(d => d.y)
            .y(d => d.x));

    // Draw the nodes
    const node = zoomGroup.append("g")
        .attr("stroke-linejoin", "round")
        .attr("stroke-width", 3)
        .selectAll()
        .data(root.descendants())
        .join("g")
        .attr("transform", d => `translate(${d.y},${d.x})`);

    node.append("circle")
        .attr("fill", d => d.children ? "#555" : "#999")
        .attr("r", 2.5);

    node.append("text")
        .attr("dy", "0.31em")
        .attr("x", d => d.children ? -6 : 6)
        .attr("text-anchor", d => d.children ? "end" : "start")
        .text(d => d.data.name)
        .attr("stroke", "white")
        .attr("paint-order", "stroke");

    // Append the SVG element to the container
    tree_div.appendChild(svg.node());

    //load data in modal as well
    jsonModal = document.getElementById('graph-json-display');
    jsonModal.innerHTML = `${JSON.stringify(py_payload.viz_json)}`;
    jsonModalHeading = document.getElementById("jsonModalLabel");

    jsonModalHeading.innerHTML = `JSON - ${py_payload.viz_json.name}`;

    //enable the export json button
    exportButton = document.getElementById('export-json-btn');
    exportButton.disabled = false;
}


eel.expose(renderErrorMessage);
function renderErrorMessage(data){
    errorMessage = JSON.parse(data).error;
    errorDiv = document.getElementById('error');

    errorDiv.innerHTML = `<code>${errorMessage}</code>`;

}


function visualiseOnButtonPress() {
    //need to make a map of data to be sent over to python
    //schedule-time and schedule-type
    selectedSubaccount = document.getElementById('subaccounts').value;
    setWidth = document.getElementById('set-width').value;

    let userInputs = {
        'id': selectedSubaccount, 
        'width': setWidth
    };

    //send over to python for scheduling
    eel.initiate_tree_generation(JSON.stringify(userInputs))(renderTree);

}


document.addEventListener("DOMContentLoaded", function (event) {
    eel.send_subaccount_names_on_first_load()(loadSubAccountNames);
});