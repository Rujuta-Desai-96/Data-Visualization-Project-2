 <script>
    var url = 'https://raw.githubusercontent.com/TKCJMurges/dataVS/main/data.csv';

    fetch(url)
      .then(response => response.text())
      .then(csvText => {
        var data = d3.csvParse(csvText);

        var uniqueCompanies = new Set(data.map(item => item.Name));
        var companies = Array.from(uniqueCompanies);

        const svg = d3.select('#chartDiv').append('svg')
          .attr('width', 800)
          .attr('height', 400); // Adjusted height

        const margin = { top: 40, right: 80, bottom: 70, left: 70 }; // Adjusted margins
        const width = +svg.attr('width') - margin.left - margin.right;
        const height = +svg.attr('height') - margin.top - margin.bottom;

        const g = svg.append('g')
          .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

        const x = d3.scaleTime().range([0, width]);
        const y = d3.scaleLinear().range([height, 0]);

        const lineClosing = d3.line()
          .x(d => x(new Date(d.Date)))
          .y(d => y(+d.Closing_Price));

        const lineOpening = d3.line()
          .x(d => x(new Date(d.Date)))
          .y(d => y(+d.Open));

        x.domain(d3.extent(data, d => new Date(d.Date)));
        y.domain([0, 500]); // Adjusted y-axis range

        function updateChart(selectedCompany) {
          g.selectAll('.line').remove();

          const selectedData = data.filter(d => d.Name === selectedCompany);

          g.append('path')
            .datum(selectedData)
            .attr('class', 'line')
            .attr('d', lineClosing)
            .style('stroke', 'blue') // Change the color as needed
            .style('fill', 'none');

          g.append('path')
            .datum(selectedData)
            .attr('class', 'line')
            .attr('d', lineOpening)
            .style('stroke', 'red') // Change the color as needed
            .style('fill', 'none');
        }

        const dropdown = d3.select('#companyDropdown');

        companies.forEach(company => {
          dropdown.append('option')
            .text(company)
            .attr('value', company);
        });

        dropdown.on('change', function() {
          updateChart(this.value);
        });

        // Add x-axis
        g.append('g')
          .attr('transform', 'translate(0,' + height + ')')
          .call(d3.axisBottom(x))
          .append('text')
          .attr('x', width / 2)
          .attr('y', 40)
          .attr('fill', '#000')
          .attr('text-anchor', 'middle')
          .text('Date'); // X-axis title

        // Add y-axis
        g.append('g')
          .call(d3.axisLeft(y))
          .append('text')
          .attr('transform', 'rotate(-90)')
          .attr('y', -margin.left)
          .attr('x', -height / 2)
          .attr('dy', '1em')
          .attr('fill', '#000')
          .attr('text-anchor', 'middle')
          .text('Price'); // Y-axis title

        // Add chart title
        svg.append('text')
          .attr('x', width / 2)
          .attr('y', margin.top / 2)
          .attr('text-anchor', 'middle')
          .style('font-size', '1.2em')
          .text('Interactive Time-Series Line Chart For Stock Prices');

        // Enable zoom and pan functionality
        const zoom = d3.zoom()
          .scaleExtent([1, 10])
          .on('zoom', function(event) {
            g.attr('transform', event.transform);
          });

        svg.call(zoom);

        // Zoom and pan controls
        window.zoomIn = function() {
          svg.transition().call(zoom.scaleBy, 1.2);
        };

        window.zoomOut = function() {
          svg.transition().call(zoom.scaleBy, 0.8);
        };

        window.resetZoom = function() {
          svg.transition().call(zoom.transform, d3.zoomIdentity);
        };

        window.panLeft = function() {
          svg.transition().call(zoom.translateBy, -50, 0);
        };

        window.panRight = function() {
          svg.transition().call(zoom.translateBy, 50, 0);
        };

        window.panUp = function() {
          svg.transition().call(zoom.translateBy, 0, -50);
        };

        window.panDown = function() {
          svg.transition().call(zoom.translateBy, 0, 50);
        };
      })
      .catch(error => console.error('Error fetching the data:', error));
  </script>

<script>
    var url = 'https://raw.githubusercontent.com/TKCJMurges/dataVS/main/data.csv';

    fetch(url)
      .then(response => response.text())
      .then(csvText => {
        var stock_data = d3.csvParse(csvText);

        var companies = Array.from(new Set(stock_data.map(item => item.Name)));

        var fig = {
          data: [],
          layout: {
            updatemenus: [{
              buttons: [],
              direction: 'down',
              showactive: true,
              x: 0.5,
              y: 2.5
            }],
            xaxis: { title: 'Date' },
            yaxis: { title: 'Price' },
            title: 'Interactive Candlestick Chart - Closing Prices',
            dragmode: 'zoom', // Enable zoom on drag
            showlegend: true,
            width: 800
          }
        };

        companies.forEach((company, i) => {
          const companyData = stock_data.filter(d => d.Name === company);

          fig.data.push({
            type: 'candlestick',
            x: companyData.map(d => d.Date),
            open: companyData.map(d => parseFloat(d.Open)),
            high: companyData.map(d => parseFloat(d.Daily_High)),
            low: companyData.map(d => parseFloat(d.Daily_Low)),
            close: companyData.map(d => parseFloat(d.Closing_Price)),
            name: company,
            visible: i === 0 ? true : false
          });

          // Create buttons for dropdown selection
          const visibility = Array(companies.length).fill(false);
          visibility[i] = true;
          const button = {
            label: company,
            method: 'update',
            args: [
              { visible: visibility },
              { title: `Interactive Candlestick Chart - ${company}` }
            ]
          };
          fig.layout.updatemenus[0].buttons.push(button);
        });

        Plotly.newPlot('chartDiv', fig.data, fig.layout);

        const dropdown = d3.select('#companyDropdown');

        companies.forEach(company => {
          dropdown.append('option')
            .text(company)
            .attr('value', company);
        });

        dropdown.on('change', function() {
          var selectedCompany = this.value;
          fig.data.forEach(trace => {
            trace.visible = trace.name === selectedCompany;
          });

          Plotly.update('chartDiv', fig.data, fig.layout);
        });
      })
      .catch(error => console.error('Error fetching the data:', error));
  </script>

<script>
    var url = 'https://raw.githubusercontent.com/TKCJMurges/dataVS/main/data.csv';

    fetch(url)
      .then(response => response.text())
      .then(csvText => {
        var stock_data = Plotly.d3.csv.parse(csvText, d3.autoType); // Parse data types

        // Filter out rows with missing or NaN values in necessary columns
        stock_data = stock_data.filter(d => !isNaN(d.Date) && !isNaN(d.Closing_Price) && !isNaN(d.Volume));

        var companies = Array.from(new Set(stock_data.map(item => item.Name)));

        var dropdown = document.getElementById('company-dropdown');
        companies.forEach(company => {
          var option = document.createElement('option');
          option.text = company;
          option.value = company;
          dropdown.appendChild(option);
        });

        var selectedCompany = companies[0]; // Default company
        var filtered_stock_data = stock_data.filter(d => d.Name === selectedCompany);

        // Calculate VWAP for each row
        filtered_stock_data.forEach((d, i) => {
          var sum = 0, volume = 0;
          for (var j = i; j >= 0; j--) {
            sum += (stock_data[j].Closing_Price * stock_data[j].Volume);
            volume += stock_data[j].Volume;
          }
          d.VWAP = sum / volume;
        });

        var trace = {
          x: filtered_stock_data.map(d => d.Date),
          y: filtered_stock_data.map(d => d.VWAP),
          mode: 'lines',
          name: 'VWAP'
        };

        var closingTrace = {
          x: filtered_stock_data.map(d => d.Date),
          y: filtered_stock_data.map(d => d.Closing_Price),
          mode: 'lines',
          name: 'Closing Price',
          yaxis: 'y2' // Plot on secondary y-axis
        };

        var layout = {
          title: 'Volume-Weighted Average Price (VWAP) with Closing Price Channel',
          xaxis: { title: 'Date' },
          yaxis: { title: 'VWAP' },
          yaxis2: {
            title: 'Closing Price',
            overlaying: 'y',
            side: 'right'
          },
          updatemenus: [{
            buttons: [
              { args: ['autosize', false], label: 'Reset Zoom', method: 'relayout' }
            ],
            direction: 'down',
            showactive: true,
            x: 0.5,
            xanchor: 'center',
            y: 1.2,
            yanchor: 'top'
          }]
        };

        Plotly.newPlot('vwap-chart', [trace, closingTrace], layout);

        dropdown.onchange = function() {
          selectedCompany = this.value;
          filtered_stock_data = stock_data.filter(d => d.Name === selectedCompany);

          // Calculate VWAP for the selected company
          filtered_stock_data.forEach((d, i) => {
            var sum = 0, volume = 0;
            for (var j = i; j >= 0; j--) {
              sum += (stock_data[j].Closing_Price * stock_data[j].Volume);
              volume += stock_data[j].Volume;
            }
            d.VWAP = sum / volume;
          });

          var update = {
            x: [filtered_stock_data.map(d => d.Date), filtered_stock_data.map(d => d.Date)],
            y: [filtered_stock_data.map(d => d.VWAP), filtered_stock_data.map(d => d.Closing_Price)]
          };

          Plotly.update('vwap-chart', update);
        };
      })
      .catch(error => console.error('Error fetching or parsing the data:', error));
  </script>


  <script>
  let data; // Declare data in a broader scope
  let myChart; // Declare myChart variable

  var url = 'https://raw.githubusercontent.com/TKCJMurges/dataVS/main/data.csv';

  fetch(url)
    .then(response => response.text())
    .then(csvText => {
      data = d3.csvParse(csvText); // Assign parsed CSV data to the 'data' variable
      populateDropdown(); // Call function to populate dropdown after data is fetched
      updateChart(); // Call function to update the chart after data is fetched
    });

    // Function to retrieve unique company names from the dataset
    function getUniqueCompanies() {
      const uniqueCompanies = [...new Set(data.map(item => item.Name))];
      return uniqueCompanies;
    }

    function calculateSMA(data, windowSize) {
  const smaValues = [];
  const smaDates = []; // To store corresponding dates for SMA values
  for (let i = 0; i < data.length - windowSize + 1; i++) {
    const window = data.slice(i, i + windowSize);
    const sum = window.reduce((acc, val) => acc + parseFloat(val.Closing_Price), 2);
    const average = sum / windowSize;
    smaValues.push(average.toFixed(2)); // Round to 2 decimal places
    smaDates.push(window[windowSize - 1].Date); // Store the date corresponding to the last item in the window
  }
  return { smaValues, smaDates }; // Return both SMA values and their associated dates
}

    // Function to update chart based on selected company
    function updateChart() {
      if (!data || !data.length) {
      console.error('Data is empty or not loaded yet.');
      return;
    }
    const selectedCompany = document.getElementById('company-select').value;
  const selectedCompanyData = data.filter(item => item.Name === selectedCompany);

  const closingPrices = selectedCompanyData.map(item => parseFloat(item.Closing_Price));
  const smaWindow = 3;
  const { smaValues, smaDates } = calculateSMA(selectedCompanyData, smaWindow); // Destructure smaValues and smaDates

  const reversedSmaValues = smaValues.slice().reverse();
  const reversedSmaDates = smaDates.slice().reverse();
  const reversedClosingPrices = closingPrices.slice().reverse();

  const ctx = document.getElementById('myChart').getContext('2d');
  if (myChart) {
    myChart.destroy(); // Clear previous chart instance
  }
  myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: reversedSmaDates, // Use reversed SMA dates for x-axis labels
      datasets: [
        {
          label: 'Closing Prices',
          data: reversedClosingPrices,
          borderColor: 'blue',
          borderWidth: 1,
          pointRadius: 0,
          fill: false
        },
        {
          label: `SMA (${smaWindow} Days)`,
          data: reversedSmaValues,
          borderColor: 'red',
          borderWidth: 1,
          pointRadius: 0,
          fill: false
        }
      ]
    },
    options: {
  plugins: {
    zoom: {
      zoom: {
        wheel: {
          enabled: true,
        },
        pinch: {
          enabled: true
        },
        mode: 'xy',
      },
      pan: {
        enabled: true,
        mode: 'xy',

              }
            }
          },
          responsive: true,
          scales: {
            x: {
              display: true,
              title: {
                display: true,
                text: 'Day'
          }
        },
        y: {
              display: true,
              title: {
                display: true,
                text: 'Price'
              }
            }
          }
        }
      });
    }

    // Populate dropdown with unique company names on page load
    function populateDropdown() {
      const companySelect = document.getElementById('company-select');
      const uniqueCompanies = getUniqueCompanies();
      uniqueCompanies.forEach(company => {
        const option = document.createElement('option');
        option.value = company;
        option.textContent = company;
        companySelect.appendChild(option);
      });
    }
    // Initial chart creation on page load
    updateChart();