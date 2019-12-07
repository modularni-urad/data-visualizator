/* global axios Chart moment */

// $('.input-daterange').datepicker({
//   todayBtn: true,
//   language: 'cs',
//   autoclose: true
// })

// $('.input-daterange input').each(function() {
//     $(this).datepicker('clearDates');
// });

var color = Chart.helpers.color
const dataApiURL = 'http://data.mutabor.cz:2300/data'

var config = {
  type: 'line',
  data: {
    datasets: [{
      label: 'teplota ket kube',
      backgroundColor: color('rgb(255, 99, 132)').alpha(0.5).rgbString(),
      borderColor: 'rgb(255, 99, 132)',
      fill: false,
      data: []
    }]
  },
  options: {
    responsive: true,
    animation: {
      duration: 0
    },
    // title: {
    //   display: true,
    //   text: 'Chart.js Time Point Data'
    // },
    scales: {
      xAxes: [{
        type: 'time',
        display: true,
        scaleLabel: {
          display: true
          // labelString: 'čas'
        },
        gridLines: {
          zeroLineColor: 'rgba(0,255,0,1)'
        },
        ticks: {
          major: {
            fontStyle: 'bold',
            fontColor: '#FF0000'
          }
        }
      }],
      yAxes: [{
        display: true,
        gridLines: {
          zeroLineColor: 'rgba(0,255,0,1)'
        },
        scaleLabel: {
          display: true,
          labelString: 'hodnota'
        }
      }]
    },
    plugins: {
      zoom: {
        pan: {
          enabled: true,
          mode: 'xy',
          onPanComplete: function ({ chart }) {
            const min = new Date(chart.scales['x-axis-0'].min)
            const max = new Date(chart.scales['x-axis-0'].max)
            _load(min, max)
          }
        },
        zoom: {
          enabled: true,
          mode: 'xy'
        }
      }
    }
  }
}

function _load (start, end) {
  const filter = {
    typ: 'temp',
    app_id: 'tabor_aplikace',
    dev_id: 'ketcube_tabor',
    and: [
      { time: { '>': start } },
      { time: { '<': end } }
    ]
  }
  axios.get(`${dataApiURL}?filter=${JSON.stringify(filter)}&fields=value,time`)
    .then(res => {
      config.data.datasets[0].data = res.data.map(i => {
        return { x: moment(i.time), y: i.value }
      })
      window.myLine.update()
    })
}

window.onload = function () {
  var ctx = document.getElementById('canvas').getContext('2d')
  window.myLine = new Chart(ctx, config)
  _load('2019-11-30T16:32:52.200Z', '2019-12-01T20:32:52.200Z')
}
