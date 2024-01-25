const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const chartRendered = false;
const setChartPath = path.join(__dirname, 'utils', 'setChart.js');
const setChartFunction = fs.readFileSync(setChartPath, 'utf8');

let option = {
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: [120, 200, 150, 80, 70, 110, 130],
        type: 'bar'
      }
    ]
  };

  let optionLine = {
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: [150, 230, 224, 218, 135, 147, 260],
        type: 'line'
      }
    ]
  };
  
  let option3 = {
    angleAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    radiusAxis: {},
    polar: {},
    series: [
      {
        type: 'bar',
        data: [1, 2, 3, 4, 3, 5, 1],
        coordinateSystem: 'polar',
        name: 'A',
        stack: 'a',
        emphasis: {
          focus: 'series'
        }
      },
      {
        type: 'bar',
        data: [2, 4, 6, 1, 3, 2, 1],
        coordinateSystem: 'polar',
        name: 'B',
        stack: 'a',
        emphasis: {
          focus: 'series'
        }
      },
      {
        type: 'bar',
        data: [1, 2, 3, 4, 1, 2, 5],
        coordinateSystem: 'polar',
        name: 'C',
        stack: 'a',
        emphasis: {
          focus: 'series'
        }
      }
    ],
    legend: {
      show: true,
      data: ['A', 'B', 'C']
    }
  };

const combinedData = option3.series.flatMap((seriesItem) => {
  const name = seriesItem.name;
  const data = seriesItem.data;
  return data.map((value) => `${value}-${name}`);
});

async function createPdfWithChart() {
    const browser = await puppeteer.launch({
        headless: "new" 
    });
    const page = await browser.newPage();
      await page.setContent(`     
          <script type="text/javascript" src="https://fastly.jsdelivr.net/npm/echarts@5.4.3/dist/echarts.min.js"></script>      
              <div id="chart" style="width: 600px;height:400px;"></div>
              <div id="chart2" style="width: 600px;height:400px;"></div>
              <div id="chart3" style="width: 600px;height:400px;"></div>          
      `);
        
    await page.waitForSelector('#chart')    
    await page.evaluate(setChartFunction);
    await page.evaluate(`setChart("chart", "http://some-domain", "fill", ${JSON.stringify(option)}, ${JSON.stringify(option.xAxis.data)});`);
    await page.waitForFunction('window.chartRendered === true');
    await page.evaluate(`setChart("chart2", "http://some-domain", "fill", ${JSON.stringify(optionLine)}, ${JSON.stringify(optionLine.xAxis.data)});`);
    await page.waitForFunction('window.chartRendered === true');
    await page.evaluate(`setChart("chart3", "http://some-domain", "fill", ${JSON.stringify(option3)}, ${JSON.stringify(combinedData)});`);
    await page.waitForFunction('window.chartRendered === true');
    await page.pdf({ path: 'chart.pdf', width: '1000px', height: '1600px' });
    await browser.close();
}

createPdfWithChart();
