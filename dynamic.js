const { select, csv, scaleLinear, min, max, scaleBand, axisLeft, axisBottom } =
  d3;
let windowWidth = window.innerWidth;
let windowHeight = window.innerHeight;

const svg = select("svg")
  .attr("width", windowWidth)
  .attr("height", windowHeight * 0.87);
const svgWidth = +svg.attr("width");
const svgHeight = +svg.attr("height");

let margin = { top: 100, right: 20, bottom: 20, left: 100 };
innerHeight = svgHeight - margin.top;

const xValue = (d) => d["Year"];
const yValue = (d) => d["Price"];

const render = (data) => {
  //changing string value to number for easy calculation
  data.forEach((d) => {
    // d["Year"] = +d["Year"];
    d["Price"] = +d["Price"];
  });

  //_____________________________
  //scales defined here
  const xScale = scaleBand()
    .domain(data.map((d) => xValue(d)))
    .range([margin.left, svgWidth - margin.right])
    .padding(0.1);

  //   _________________________________
  const yScale = scaleLinear()
    .domain([min(data, (d) => yValue(d)), max(data, (d) => yValue(d))])
    .range([innerHeight, 100]);
  //

  //_______________________________________
  // Axis here

  const yAxis = axisLeft(yScale);
  const xAxis = axisBottom(xScale);
  const g = svg.append("g");

  g.append("g").call(yAxis).attr("transform", `translate(${margin.left}, 0)`);
  g.append("g").call(xAxis).attr("transform", `translate(0, ${innerHeight})`);

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
    });
  g.append("text")
    .text("Bitcoin Price change ")
    .attr("transform", `translate(${svgWidth / 3}, 40)`);
};

//csv function returns promise.
let x = csv("data.csv").then((data) => {
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
//want to create a percentage chart as well.
//  percentage Data has been calculated.
//  It's easy. Just duplication is required with some slight changes.
// year, price;
// 2012, 152.37191650853893;
// 2013, 5692.7819548872185;
// 2014, -59.254452001453714;
// 2015, 38.54485219164118;
// 2016, 129.39621079738802;
// 2017, 1244.3494472230852;
// 2018, -71.15014121218809;
// 2019, 85.76187436522315;
// 2020, 308.9006677796327;
// 2021, 27.044636289465974;

// let y = csv("data.csv").then((data) => findPercentageChange(data));
