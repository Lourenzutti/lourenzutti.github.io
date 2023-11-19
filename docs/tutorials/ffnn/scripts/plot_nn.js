function createNeuralNetwork(layers, div_name, drawZSquares=true, neuronRadius = 20, squareSize = 20, width = 1000, height = 400) {

    const layerWidth = width / layers.length;
    //const fontSize = neuronRadius / 2; // Set font size proportional to neuron radius
    const fontSize = 14;
    squareSize = drawZSquares ? squareSize : -2;
    
    // Clear previous content
    d3.select(`#${div_name}`).html('');

    // Create SVG element for lines and neurons
    const svg = d3.select(`#${div_name}`).append("svg")
        .attr("width", width)
        .attr("height", height)
        .style("position", "absolute");

    // Function to calculate Y positions
    const calculateY = (layerIndex, nodeIndex, totalNodes) => {
        const spacing = height / (totalNodes + 1);
        return (nodeIndex + 1) * spacing;
    };

    // Draw connections (lines) and weight annotations
    for (let l = 0; l < layers.length - 1; l++) {
        for (let i = 0; i < layers[l]; i++) {
            for (let j = 0; j < layers[l + 1]; j++) {
                const x1 = (l + 0.5) * layerWidth;
                const y1 = calculateY(l, i, layers[l]);
                const x2 = (l + 1.5) * layerWidth - neuronRadius - squareSize - 2;
                const y2 = calculateY(l + 1, j, layers[l + 1]);

                // Draw line
                svg.append("line")
                    .attr("x1", x1)
                    .attr("y1", y1)
                    .attr("x2", x2)
                    .attr("y2", y2)
                    .attr("stroke", "black")
                    .attr("stroke-width", 1);

                // Calculate position and rotation for weight annotation
                const scaler = 0.8;
                const annotationX = x1 + neuronRadius + (drawZSquares ? 10 : 20);
                const slope = (y2 - y1) / (x2 - x1);
                const angle = Math.atan(slope) * (180 / Math.PI);
                const annotationY = y1 + slope * (annotationX - x1) - scaler*fontSize - 2;

                const weightAnnotation = `w_{${j + 1}${i + 1}}^{(${l + 1})}`;
                d3.select(`#${div_name}`).append("div")
                    .attr("class", "weight-annotation")
                    .style("left", `${annotationX}px`)
                    .style("top", `${annotationY}px`)
                    .style("font-size", `${scaler*fontSize}px`)
                    .style("transform", `translateY(-50%) rotate(${angle}deg)`)
                    .html(`\\(${weightAnnotation}\\)`);
            }
        }
    }

    // Draw neurons and neuron annotations
    layers.forEach((numNeurons, layerIndex) => {
        const x = (layerIndex + 0.5) * layerWidth;
        const layerAnnotation = `Layer ${layerIndex}`;
        svg.append("text")
            .attr("x", x)
            .attr("y", 20) // Position at the top, you can adjust this value
            .attr("text-anchor", "middle")
            .attr("font-family", "Arial")
            .attr("font-size", "16px")
            .text(layerAnnotation);
        for (let i = 0; i < numNeurons; i++) {
            const y = calculateY(layerIndex, i, numNeurons);

            // Draw neuron
            svg.append("circle")
                .attr("cx", x)
                .attr("cy", y)
                .attr("r", neuronRadius)
                .attr("fill", "steelblue");

            // Add neuron annotation
            const neuronAnnotation = `x_{${i + 1}}^{(${layerIndex})}`;
            d3.select(`#${div_name}`).append("div")
                .attr("class", "neuron-annotation")
                .style("left", `${x}px`)
                .style("top", `${y}px`)
                .style("font-size", `${fontSize}px`)
                .style('color', 'white')
                .html(`\\(${neuronAnnotation}\\)`);

            // Draw annotation for non-input neurons
            if (layerIndex > 0 && drawZSquares) {
                const rectX = x - neuronRadius - squareSize - 1;
                const rectY = y - squareSize / 2;

                const squareAnnotation = `z_{${i + 1}}^{(${layerIndex})}`;
                d3.select(`#${div_name}`).append("div")
                    .attr("class", "annotation")
                    .style("left", `${rectX}px`)
                    .style("top", `${rectY}px`)
                    .style("width", `${squareSize}px`)
                    .style("height", `${squareSize}px`)
                    .style("line-height", `${squareSize}px`)
                    .style("font-size", `${0.8*fontSize}px`)
                    .html(`\\(${squareAnnotation}\\)`);
            }
        }
    });
    // Function to animate impulse
    function animateImpulse(startX, startY, endX, endY, duration) {
        const impulse = svg.append("circle")
            .attr("cx", startX)
            .attr("cy", startY)
            .attr("r", 5)
            .attr("fill", "red");

        impulse.transition()
            .duration(duration)
            .attr("cx", endX)
            .attr("cy", endY)
            .on("end", () => impulse.remove());
    }

    // Function to propagate impulse
    function propagateImpulse(layerIndex, neuronIndex) {
        if (layerIndex < layers.length - 1) {
            for (let j = 0; j < layers[layerIndex + 1]; j++) {
                const startX = (layerIndex + 0.5) * layerWidth;
                const startY = calculateY(layerIndex, neuronIndex, layers[layerIndex]);
                const endX = (layerIndex + 1.5) * layerWidth - neuronRadius - squareSize - 2;
                const endY = calculateY(layerIndex + 1, j, layers[layerIndex + 1]);

                animateImpulse(startX, startY, endX, endY, 1200);

                // Recursive call for next layer
                setTimeout(() => propagateImpulse(layerIndex + 1, j), 1000);
            }
        }
    }

    // Draw neurons and neuron annotations
    layers.forEach((numNeurons, layerIndex) => {
        for (let i = 0; i < numNeurons; i++) {
            const x = (layerIndex + 0.5) * layerWidth;
            const y = calculateY(layerIndex, i, numNeurons);

            // Draw neuron
            svg.append("circle")
                .attr("cx", x)
                .attr("cy", y)
                .attr("r", neuronRadius)
                .attr("fill", "steelblue")
                .attr("cursor", "pointer")
                .on("click", () => propagateImpulse(layerIndex, i));

        }
    });
    // Render MathJax
    MathJax.typesetPromise();
}


createNeuralNetwork([2, 3, 2, 1], 'fig-usual_diagram', false, 20, 25, 800, 300);

createNeuralNetwork([2, 3, 2, 1], 'diagram_z', true, 20, 25, 800, 300);