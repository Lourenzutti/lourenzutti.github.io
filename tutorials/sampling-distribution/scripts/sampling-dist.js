/* Javascript with code specific for the sampling distribution chapter.
/* Date: 2021-04-20
/* Author: Rodolfo Lourenzutti*/

get_data_from_table = (table_name, collapsible = false) =>{ 
	const table = document.getElementById(table_name);
	const entries_pop = table.querySelectorAll("td");
    let data;
    if (collapsible) data = Array((entries_pop.length-3)/2);
    else data = Array(entries_pop.length/2);
       
	let cont = 0;
	entries_pop.forEach(
		(entry) => {
			value = parseFloat(entry.textContent);
			if (!isNaN(value)) {
				data[cont++] = parseFloat(entry.textContent);
				entry.value = value;
			}
		}
	);
	return data;
}

selectConfigureSVG = (id, height = 400) => {
    let svg = d3.select('#' + id);
    svg.selectAll("*").remove();
    svg.attr('width', width)
        .attr('height', height + margin.top + margin.bottom )
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");
    return svg;
}

makeXAxis = (bins, xLabel, height = 400) => {
    x = d3.scaleLinear()
    .domain([bins[0].x0 - 1, bins[bins.length - 1].x1 + 5])
    .range([margin.left, width - margin.right]);

    xAxis = g => g
    .attr("transform", `translate(0, ${height - margin.bottom})`)
    .call(d3.axisBottom(x).ticks(width / 100).tickSizeOuter(0))
    .call(g => g.append("text")
        .attr("x", width / 2)
        .attr("y", 7)
        .attr("fill", "currentColor")
        .attr("font-weight", "bold")
        .attr("text-anchor", "bottom")
        .attr('font-size', '16px')
        .attr("class", "axis")
        .attr("dy", "2.5em")
        .text(xLabel)
        .attr("class","axes-label"));

        return [x, xAxis];

}

makeYAxis = (bins, height = 400) => {
    y = d3.scaleLinear()
        .domain([0, d3.max(bins, d => d.length) + 10]).nice()
        .range([height - margin.bottom, margin.top]);

    yAxis = g => g
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y).ticks(height / 100))
        .call(g => g.select(".tick:last-of-type text").clone()
        .attr("x", -(height - margin.bottom)/3)
        .attr("y", -45)
        .attr("font-weight", "bold")
        .attr('font-size', '16px')
        .attr('transform', 'rotate(270)')
        .attr("text-anchor", "middle")
        .text("Frequency")
        .attr("class","axes-label"));

        return [y, yAxis];
}

appendBars = (svg, bins, x, y) => {
    svg.append("g")
        .attr("fill", "steelblue")
        .selectAll("rect")
        .data(bins)
        .join("rect")
        .attr("x", d => x(d.x0) + 1)
        .attr("width", d => Math.max(0, x(d.x1) - x(d.x0) - 1))
        .attr("y", d => y(d.length))
        .attr("height", d => y(0) - y(d.length))
        .attr("class", 'bin');
}

appendTitle = (svg, title) => {
    svg.append("text")
    .attr("x", width / 2)
    .attr("y", 50)
    .attr("text-anchor", "middle")
    .text(title)
    .attr("dy", "-15px")
    .attr("class", "plot-title");
}

appendAxes = (svg, xAxis, yAxis) => {
    svg.append("g")
        .call(xAxis);
    
    svg.append("g")
        .call(yAxis);
}

makeHistogram = (id, data, nbins, title, xLabel, height = 400) => {
    let svg = selectConfigureSVG(id, height);
    
    let bins = d3.bin()
        .thresholds(nbins)(data);

    [x, xAxis] = makeXAxis(bins, xLabel, height);
    [y, yAxis] = makeYAxis(bins, height);
    appendBars(svg, bins, x, y);
    //appendTitle(svg, title);
    appendAxes(svg, xAxis, yAxis);
}


/** Getting the calculated style properties */
const pop_dist = document.getElementById('pop-dist-stat-100-grades').parentElement;
let margin = { top: 25, right: 30, bottom: 25, left: 60 },
    height = 400,
    width = pop_dist.clientWidth - parseInt(window.getComputedStyle(pop_dist).paddingRight);

/****************************************
*** Creates the Population Distribution
*** for the STAT 100 grades
*****************************************/
grades = get_data_from_table("pop-grades");
makeHistogram("pop-dist-stat-100-grades", grades, 6, "Population distribution STAT 100 grades", "Final Grades", height = 400)

/*********************************************
*** Creates the Sample Distribution 
*** for samples of size 15 of STAT 100 grades
**********************************************/
const sample_plot = document.getElementById("sample-dist").parentElement;
sample_plot.style.display = "none";
const draw_sample_btn = document.getElementById("draw-sample");


draw_sample_btn.addEventListener("click", (d) => {
    let grades_sample = sample(grades, size = 15);
    sample_plot.style.display = "inline";
    makeHistogram("sample-dist", grades_sample, 6, "Sample distribution STAT 100 grades of 15 students", "Final Grades");
    d3.select("#sample-dist").selectAll(".axes-label").attr("font-size","18px");
    d3.select("#sample-dist").selectAll("text").attr("font-size","14px");

});

/**********************************
**** Controls the collapsible table 
/**********************************/
btns = document.querySelectorAll(".row-button button")
btns.forEach(btn => {
    btn.onclick = (e) => {
        table = btn.closest("table");
        tbodies = table.querySelectorAll(".collapsible");
        tbodies[0].style.display = "table-row-group"; // set the visibility of the first hidden part of the table.
        e.target.parentElement.parentElement.parentElement.remove(); // removes the tbody that contains the first button

        tbody_level2 = e.target.parentElement.parentElement.parentElement.cloneNode(true);
        table.appendChild(tbody_level2); //attach the tbody with the level 2 button
        btn_level2 = tbody_level2.querySelector("button");
        btn_level2.textContent = "Show all"; // update the text of the level 2 button

        // assign a new event handler for the level 2 button
        btn_level2.onclick = (e2) => {
            tbodies[1].style.display = "table-row-group";
            e2.target.parentElement.parentElement.parentElement.remove();
            tbody_level3 = e2.target.parentElement.parentElement.parentElement.cloneNode(true);
            table.appendChild(tbody_level3);
            btn_level3 = tbody_level3.querySelector("button");
            btn_level3.textContent = "Collapse";

            // assign a new event handler for the level 3 button
            btn_level3.onclick = (e3) => {
                tbodies[0].style.display = ""; // resets the display of the first part of the table.
                tbodies[1].style.display = "";
                table.appendChild(e.target.parentElement.parentElement.parentElement);
                e3.target.parentElement.parentElement.parentElement.remove(); // removes button level 3
            }
        }
    }
})

/**********************************/
/****  Creates the histogram 
 **** of Sampling Distribution 
/**********************************/

/** Collecting the data from the table */
let sample_means_fish = get_data_from_table("all-samples-fish", true);
let sampling_dist_fish = selectConfigureSVG("sampling-dist-fish", height = 500);

/** creates the bin with thresholds of 20 */
bins = d3.bin().thresholds(20)(sample_means_fish);

[x_fish, xAxis] = makeXAxis(bins, "Average Fish Weight (dkg)", height = 500);
[y_fish, yAxis] = makeYAxis(bins, height = 500);
appendAxes(sampling_dist_fish, xAxis, yAxis);
//appendTitle(sampling_dist_fish, "Histogram of the sample mean of fish weights over all possible samples")

/** appending the bars and adding event handlers */
sampling_dist_fish.append("g")
    .attr("fill", "steelblue")
    .selectAll("rect")
    .data(bins)
    .join("rect")
    .attr("x", d => x_fish(d.x0) + 1)
    .attr("width", d => Math.max(0, x_fish(d.x1) - x_fish(d.x0) - 1))
    .attr("y", d => y_fish(d.length))
    .attr("height", d => y_fish(0) - y_fish(d.length))
    .attr("class", 'bin')
    .on("mouseenter", (d, i, nodes) => { 
        console.log((x_fish(i.x0) + x_fish(i.x1)) / 2);
        // Mouse-over event: turns the bin red and add the number of data points in the bin to the top of the bin
        d3.select(d.target).attr("fill", "red");
        d3.select(d.target.parentNode)
            .append("text")
            .attr("x", (x_fish(i.x0) + x_fish(i.x1)) / 2)
            .attr("text-anchor", "middle")
            .attr("y", y_fish(i.length + 3))
            .attr("class", "freq")
            .text(i.length)
            .property("bar", d.target);

        d3.select(d.target).style("cursor", "pointer"); // change the cursor
        document.getElementById("all-samples-fish")
                .querySelectorAll("td")
                .forEach(entry => {
                    if (entry.value >= x_fish.invert(d.target.x.baseVal.value) &&
                        entry.value <= x_fish.invert(d.target.x.baseVal.value + d.target.width.baseVal.value)) {
                        entry.style.color = 'red';
                }
        });
    })
    .on("mouseout", (d, i, nodes) => { 
        // Mouse-out event: returns to the original configuration
        if (!d.target.flag) {
            d3.select(d.target).attr("fill", "steelblue")
            d3.selectAll(".freq")
                .filter((e, j, texts) => {
                    return texts[j].bar === d.target;
                }).remove();
            d3.select(d.target).style("cursor", "default");

            document.getElementById("all-samples-fish")
                .querySelectorAll("td")
                .forEach(entry => {
                    if (entry.value >= x_fish.invert(d.target.x.baseVal.value) &&
                        entry.value <= x_fish.invert(d.target.x.baseVal.value + d.target.width.baseVal.value)) {
                        entry.style.color = '';
                }
            });
        }
    })
    .on("click", (d, i, nodes) => { 
        // click event: lock/unlock the mouse over changes.
        d.target.flag = !d.target.flag;
        if (d.target.flag) {
            sampling_dist_fish.dispatch("mouseenter");
        }
        else {
            d3.select(d.target).attr("fill", "steelblue");
        }
    });


/** Append Subtitle */
sampling_dist_fish.append("text")
    .text("Population Mean: 43.45")
    .attr("x", x_fish(28))
    .attr("y", y_fish(195))
    .attr("text-anchor", "start")
    .attr("dy", "6px")
    .attr("class", "plot-subtitle");

/** Button to Show/Hide Mean  */
let g = sampling_dist_fish.append("g")
    .on("mouseover", function (d) {
        d3.select(this).style("cursor", "pointer"); // change the cursor
    })
    .on("mouseout", function (d) {
        d3.select(this).style("cursor", "default");
    })
    .on("click", (d, i, e) => {
        d.target.parentElement.clicked = !d.target.parentElement.clicked;
        g_element = d3.select(d.target.parentElement);
        if (d.target.parentElement.clicked) {
            g_element.select("rect")
                .attr("fill", "#c45149");
            g_element.select('text')
                .text('Hide true mean');

            g_element
                .append('line')
                .style("stroke", "black")
                .style("stroke-width", 3)
                .attr("x1", d => x_fish(43.45))
                .attr("y1", d => y_fish(0))
                .attr("x2", d => x_fish(43.45))
                .attr("y2", d => y_fish(195));
        }
        else {
            g_element.select("rect")
                .attr("fill", "gray");
            g_element.select('text')
                .text('Show true mean');

            g_element.select("line").remove()
        }
    });

/** Creates the rectangle of the button */
g.append("rect")
    .attr("x", x_fish(28))
    .attr("y", y_fish(190))
    .attr("width", 140)
    .attr("height", 35)
    .attr("fill", "gray");

/**  Add text to the button */
g.append("text")
    .text("Show true mean")
    .attr("x", x_fish(28.7))
    .attr("y", y_fish(180))
    .attr("text-anchor", "start")
    .style("font-size", '15px')
    .attr("fill", "white");

/**  Button to Reset */
let reset = sampling_dist_fish.append("g")
    .on("mouseover", function (d) {
        d3.select(this).style("cursor", "pointer"); // change the cursor
    })
    .on("click", (d, i, e) => {
        var bins = d3.selectAll(".bin");
        for (var i = 0; i < bins._groups[0].length; i++) {
            bin = bins._groups[0][i];
            bin.flag = false;
        }
        bins.dispatch("mouseout");
    });

/** Creates the rectangle of the button */
reset.append("rect")
    .attr("x", x_fish(60))
    .attr("y", y_fish(190))
    .attr("width", 108)
    .attr("height", 35)
    .attr("fill", "#e3732d");

/** Add text to the button */
reset.append("text")
    .text("Reset plot")
    .attr("x", x_fish(61))
    .attr("y", y_fish(180))
    .attr("text-anchor", "start")
    .style("font-size", '15px')
    .attr("fill", "white");

/************************************
 **** Exercise sampling distribution
*************************************/

/** Exercise 1: Check the reader selected the 
 ** right bars in the histogram: */

var check_button = document.getElementById("check-item-1");
check_button.onclick =
    d => {
        let item1_back = d.target.previousElementSibling;
        const bins = document.getElementById("sampling-dist-fish").querySelectorAll(".bin");
        for (var i = 0; i < bins.length; i++) {
            bin = bins[i];
            if (x_fish.invert(bin.x.baseVal.value + bin.width.baseVal.value) < 40 || x_fish.invert(bin.x.baseVal.value) > 46.001) {
                if (bin.getAttribute("fill") === "red") {
                    alert("You did not select the right bins.");
                    item1_back.style.backgroundColor = '#fac6c3';
                    return;
                }
            }
            if (x_fish.invert(bin.x.baseVal.value + bin.width.baseVal.value) <= 46.00001 && x_fish.invert(bin.x.baseVal.value) >= 40) {
                if (bin.getAttribute("fill") !== "red") {
                    alert("You did not select the right bins.");
                    item1_back.style.backgroundColor = '#fac6c3';
                    return;
                }
            }
        }
        item1_back.style.backgroundColor = '#c3fac4';
    }


/** Exercise 3.2 */
check_button = document.getElementById("check-item-2");
check_button.onclick =
    d => {
        item2_back = d.target.previousElementSibling;
        const bins = document.getElementById("sampling-dist-fish").querySelectorAll(".bin");
        for (var i = 0; i < bins.length; i++) {
            bin = bins[i];
            if (x_fish.invert(bin.x.baseVal.value + bin.width.baseVal.value) < 36 || x_fish.invert(bin.x.baseVal.value) > 50) {
                if (bin.getAttribute("fill") !== "red") {
                    console.log("first if");
                    console.log(x_fish.invert(bin.x.baseVal.value + bin.width.baseVal.value) < 36);
                    console.log(x_fish.invert(bin.x.baseVal.value + bin.width.baseVal.value) > 50);
                    console.log(x_fish.invert(bin.x.baseVal.value + bin.width.baseVal.value));
                    console.log(bin.getAttribute("fill"));
                    alert("You did not select the right bins.");
                    item2_back.style.backgroundColor = '#fac6c3';
                    return;
                }
            }
            if (x_fish.invert(bin.x.baseVal.value + bin.width.baseVal.value) < 50 && x_fish.invert(bin.x.baseVal.value) > 36.0001) {
                if (bin.getAttribute("fill") === "red") {
                    console.log("second if");
                    console.log("x >= 36? " + x_fish.invert(bin.x.baseVal.value + bin.width.baseVal.value) < 36);
                    console.log("x < 50? " + x_fish.invert(bin.x.baseVal.value + bin.width.baseVal.value) < 36);
                    console.log(x_fish.invert(bin.x.baseVal.value + bin.width.baseVal.value));
                    alert("You did not select the right bins.");
                    item2_back.style.backgroundColor = '#fac6c3';
                    return;
                }
            }
        }
        item2_back.style.backgroundColor = '#c3fac4';
    }



/************************************************
 ******************* ACTIVITY *******************
 ************************************************/

/********************************************************
*** Creates the Population Distribution for the Activity
*********************************************************/

income = get_data_from_table( "table-resident-income", collapsible=true);
makeHistogram("pop-dist-activity", income, nbins = 30, title="Population Distribution of Income", xLabel="Income");	















































