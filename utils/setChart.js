
const setChart = (containerId,rootUrl, attr, option, pathData)=>{
    const chartNode = document.getElementById(containerId);
  const myChart = echarts.init(chartNode, null, {
    renderer: 'svg'
  });
  

  if (option && typeof option === 'object') {
      myChart.setOption(option);
      myChart.on('finished', () => {
          const svg = myChart.getDom();
          setWrapper(svg, pathData, rootUrl, attr);
          chartRendered = true;
      });
  }
  chartRendered = false
  const setWrapper = (svg, xAxisData, rootPath, attribute) =>{
      try {
          const paths = svg.querySelectorAll(`path[${attribute}]:not([${attribute}="none"])`);
          paths.forEach((path, index) => {
              if (!path.parentNode || path.parentNode.nodeName !== 'a') {
                  const a = document.createElementNS('http://www.w3.org/2000/svg', 'a');
                  a.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', rootPath + '/' + xAxisData[index]);
                  path.parentNode.replaceChild(a, path);
                  a.appendChild(path);
              }
          });
      } catch (error) {
          console.error('Error in setWrapper:', error);
      }
  }  
  }

