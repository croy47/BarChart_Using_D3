const { select, csv, scaleLinear, min, max, scaleBand, axisLeft, axisBottom } =
  d3;
let windowWidth = window.innerWidth;
let windowHeight = window.innerHeight;

const svg = select("svg")
  .attr("width", windowWidth)
  .attr("height", windowHeight * 0.8);
const svgWidth = +svg.attr("width");
const svgHeight = +svg.attr("height");

let margin = { top: 50, right: 20, bottom: 20, left: 100 };
innerHeight = svgHeight - margin.top;

const xValue = (d) => d["Year"];
const yValue = (d) => d["priceChange"];

const render = (data) => {
  //changing string value to number for easy calculation
  data.forEach((d) => {
    // d["Year"] = +d["Year"];
    d["priceChange"] = +(+d["priceChange"]).toFixed(3);
  });

  //_____________________________
  //scales defined here
  const xScale = scaleBand()
    .domain(
      data.map((d) => {
        return xValue(d);
      })
    )
    .range([margin.left, svgWidth - margin.right])
    .padding(0.1);

  //   _________________________________
  const yScale = scaleLinear()
    .domain([min(data, (d) => yValue(d)), max(data, (d) => yValue(d))])
    .range([innerHeight, 50]);
  //
  console.log(yScale.domain());
  //_______________________________________
  // Axis here

  const yAxis = axisLeft(yScale);
  const xAxis = axisBottom(xScale);

  const g = svg.append("g");

  const y = g
    .append("g")
    .call(yAxis)
    .attr("transform", `translate(${margin.left}, 0)`);

  const x = g
    .append("g")
    .call(xAxis)
    .attr("transform", `translate(0, ${innerHeight})`)
    .append("text")
    .text("Year")
    .attr("transform", `translate(90, 100)`);

  g.selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", (d) => {
      //returns x offSet of each rect element
      return xScale(xValue(d));
    })
    .attr("y", (d) => {
      return yScale(yValue(d));
    })
    //bandwidth is computed width of a single bar
    .attr("width", xScale.bandwidth())
    .attr("height", (d) => {
      return innerHeight - yScale(yValue(d));
    })
    .append("title")
    .text((d) => yValue(d));

  g.append("text")
    .text("Bitcoin Price change (in %)")
    .attr("transform", `translate(${svgWidth / 3}, 40)`);
};

//csv function returns promise.
let dataCSV = csv("perCentChange.csv").then((data) => {
  render(data);
});

// const findPercentageChange = (data) => {
//   let string = `year,price`;
//   data.forEach((d) => {
//     let index = data.indexOf(d);
//     if (index < data.length - 1) {
//       curYearVal = d["Price"];
//       nextYearVal = data[index + 1]["Price"];
//       //   console.log(nextYearVal);
//       difference = nextYearVal - curYearVal;
//       let change = (difference / curYearVal) * 100;

//       string += `\n${d["Year"]},${change}`;
//     }
//   });
//   console.log(string);
// };

// let y = csv("data.csv").then((data) => findPercentageChange(data));
