/**
 * Charts ChartsJS
 */
'use strict';

document.addEventListener('DOMContentLoaded', function (e) {
  // Color Variables
  const purpleColor = '#836AF9',
    yellowColor = '#ffe800',
    cyanColor = '#28dac6',
    orangeColor = '#FF8132',
    orangeLightColor = '#FDAC34',
    oceanBlueColor = '#299AFF',
    greyColor = '#4F5D70',
    greyLightColor = '#EDF1F4',
    blueColor = '#2B9AFF',
    blueLightColor = '#84D0FF',
    blueDarkColor = '#1D9FF2';

	// overriding color variables for chartjs
	let cardColor, headingColor, labelColor, borderColor, legendColor, info, danger, primary;

	if (isDarkStyle) {
		cardColor = window.Helpers.getCssVar('paper-bg', true);
		headingColor = window.Helpers.getCssVar('heading-color', true);
		labelColor = window.Helpers.getCssVar('secondary-color', true);
		legendColor = window.Helpers.getCssVar('body-color', true);
		borderColor = window.Helpers.getCssVar('border-color', true);
		primary = window.Helpers.getCssVar('primary', true);
		info = window.Helpers.getCssVar('info', true);
		danger = window.Helpers.getCssVar('danger', true);
	} else {
		cardColor = window.Helpers.getCssVar('paper-bg', true);
		headingColor = window.Helpers.getCssVar('heading-color', true);
		labelColor = window.Helpers.getCssVar('secondary-color', true);
		legendColor = window.Helpers.getCssVar('body-color', true);
		borderColor = window.Helpers.getCssVar('border-color', true);
		primary = window.Helpers.getCssVar('primary', true);
		info = window.Helpers.getCssVar('info', true);
		danger = window.Helpers.getCssVar('danger', true);
	}

	// Set height according to their data-height
	// --------------------------------------------------------------------
	const chartList = document.querySelectorAll('.chartjs');
	chartList.forEach(function (chartListItem) {
		chartListItem.height = chartListItem.dataset.height;
	});

	const lineChart = document.getElementById('lineChart');
	if (lineChart) {
		const lineChartVar = new Chart(lineChart, {
		type: 'line',
		data: {
			labels: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140],
			datasets: [
			{
				data: [80, 150, 180, 270, 210, 160, 160, 202, 265, 210, 270, 255, 290, 360, 375],
				label: 'Europe',
				borderColor: danger,
				tension: 0.5,
				pointStyle: 'circle',
				backgroundColor: danger,
				fill: false,
				pointRadius: 1,
				pointHoverRadius: 5,
				pointHoverBorderWidth: 5,
				pointBorderColor: 'transparent',
				pointHoverBorderColor: cardColor,
				pointHoverBackgroundColor: danger
			},
			{
				data: [80, 125, 105, 130, 215, 195, 140, 160, 230, 300, 220, 170, 210, 200, 280],
				label: 'Asia',
				borderColor: primary,
				tension: 0.5,
				pointStyle: 'circle',
				backgroundColor: primary,
				fill: false,
				pointRadius: 1,
				pointHoverRadius: 5,
				pointHoverBorderWidth: 5,
				pointBorderColor: 'transparent',
				pointHoverBorderColor: cardColor,
				pointHoverBackgroundColor: primary
			},
			{
				data: [80, 99, 82, 90, 115, 115, 74, 75, 130, 155, 125, 90, 140, 130, 180],
				label: 'Africa',
				borderColor: yellowColor,
				tension: 0.5,
				pointStyle: 'circle',
				backgroundColor: yellowColor,
				fill: false,
				pointRadius: 1,
				pointHoverRadius: 5,
				pointHoverBorderWidth: 5,
				pointBorderColor: 'transparent',
				pointHoverBorderColor: cardColor,
				pointHoverBackgroundColor: yellowColor
			}
			]
		},
		options: {
			responsive: true,
			maintainAspectRatio: false,
			scales: {
			x: {
				grid: {
				color: borderColor,
				drawBorder: false,
				borderColor: borderColor
				},
				ticks: {
				color: labelColor
				}
			},
			y: {
				scaleLabel: {
				display: true
				},
				min: 0,
				max: 400,
				ticks: {
				color: labelColor,
				stepSize: 100
				},
				grid: {
				color: borderColor,
				drawBorder: false,
				borderColor: borderColor
				}
			}
			},
			plugins: {
			tooltip: {
				// Updated default tooltip UI
				rtl: isRtl,
				backgroundColor: cardColor,
				titleColor: headingColor,
				bodyColor: legendColor,
				borderWidth: 1,
				borderColor: borderColor
			},
			htmlLegend: {
				containerID: 'legendContainer'
			},
			legend: {
				display: false
			}
			}
		},
		plugins: [LegendUtils.htmlLegendPlugin]
		});
	}
});

$(function () {

	var start = moment().subtract(29, 'days');
	var end = moment();

	function cb(start, end) {
		$('#reportrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
	}

	$('#reportrange').daterangepicker({
		startDate: start,
		endDate: end,
		ranges: {
			'Today': [moment(), moment()],
			'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
			'Last 7 Days': [moment().subtract(6, 'days'), moment()],
			'Last 30 Days': [moment().subtract(29, 'days'), moment()],
			'This Month': [moment().startOf('month'), moment().endOf('month')],
			'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
		}
	}, cb);

	cb(start, end);

});
