var currCharts = document.getElementsByClassName("trends__chart--curr");
var currChart = currCharts[0];

let trendsButton = document.querySelector(".navBar__item--report");

let weeklyTab = document.getElementById("weeklyTab");
let dailyTab = document.getElementById("dailyTab");
let monthlyTab = document.getElementById("monthlyTab");

let trendsBar = document.getElementById("trendsBarTabs");
let trendsCharts = document.getElementById("trendsCharts");

let date = document.getElementById("date");
let prevButton = document.getElementById("prevButton");
let nextButton = document.getElementById("nextButton");

var myChart;
var data; 
var labels; 

var today = new Date();
var currWeek = new Date(); 
var currMonth= new Date(); 
var currDate = new Date(); 

//load the weekly chart first by default
trendsButton.addEventListener("click", showWeeklyChart);

//Change chart when buttons are clicked
weeklyTab.addEventListener("click", showWeeklyChart); 
dailyTab.addEventListener("click", showDailyChart); 
monthlyTab.addEventListener("click", showMonthlyChart); 

prevButton.addEventListener("click", clickPrev); 
nextButton.addEventListener("click", clickNext); 

//Show weekly chart
function showWeeklyChart(){
    //update styling
    currChart.id = "weeklyChart";
    changeActiveTab(1);
    weeklyTab.style.backgroundColor = "black";
    nextButton.disabled = true; 
    
    //set the current week to today's week
    setDate(currWeek, today.getDate() - 6, today.getMonth(), today.getFullYear());
    updateDateText(currWeek);

    //get array of the past 7 days 
    var daysOfWeek = getDaysInWeek(currWeek.getFullYear(), currWeek.getMonth(), currWeek.getDay());

    //destroy and rerender the chart
    if(myChart) {
        myChart.destroy();
    }

    myChart = renderWeeklyChart(daysOfWeek);
}

//Show daily chart
function showDailyChart(){
    //update styling
    currChart.id = "dailyChart";
    changeActiveTab(0);
    dailyTab.style.backgroundColor = "black";
    nextButton.disabled = true; 

    //set the current date to today's date
    updateDateText(today);
    setDate(currDate, today.getDate(), today.getMonth(), today.getFullYear());

    //destroy and rerender the chart
    if(myChart) {
        myChart.destroy();
    }

    myChart = renderDailyChart();
}

//Show monthly chart
function showMonthlyChart(){
    //update styling
    currChart.id = "monthlyChart";
    changeActiveTab(2);
    monthlyTab.style.backgroundColor = "black";
    nextButton.disabled = true; 

    //set the current month to today's month
    setDate(currMonth, today.getDate(), today.getMonth(), today.getFullYear());
    updateDateText(today);

    //get array of the every day in the month
    var daysOfMonth = getDaysInMonth(today.getFullYear(), today.getMonth());

    //destroy and rerender the chart
    if(myChart) {
        myChart.destroy();
    }

    myChart = renderMonthlyChart(daysOfMonth); 
}

//set a given date object with the given month, date, and year
function setDate(dateObj, date, month, year) {
  dateObj.setDate(date); 
  dateObj.setMonth(month);
  dateObj.setFullYear(year);
}

//change colour of inactive tabs 
function changeActiveTab(openedTabNumber) {
    let tabs = trendsBar.children;
    for(var i = 0; i < tabs.length; i++) {
        if(i != openedTabNumber) {
            tabs[i].style.backgroundColor = "rgb(97, 97, 97)";
        }
    }   
}

//get an array of every day in a month
function getDaysInMonth(year, month) {
    var thisDate = new Date(year, month, 1);
    var days = [];
    
    while (thisDate.getMonth() === month) {
        var d2 = thisDate.toString().substr(4, 11); 
        var d3 = d2.slice(3, 6);
        days.push(d3);
        
        thisDate.setDate(thisDate.getDate() + 1);
    }
    return days;
  }

//get an array of the past 7 days from a given date
function getDaysInWeek(year, month, day) {
    var thisDate = new Date(year, month, day);
    var days = [];
    
    for(var i = 0; i < 7; i++) {
        var d2 = thisDate.toString().substr(0, 11); 
        days.push(d2);
        
        thisDate.setDate(thisDate.getDate() + 1);
    }
    return days;
}

//update chart when prev button is clicked 
function clickPrev() {
    var dateLabels; 
    
    //re-enable next button
    nextButton.disabled = false; 

    if(currChart.id === "weeklyChart") {
        currWeek.setDate(currWeek.getDate() - 7); 
        dateLabels = getDaysInWeek(currWeek.getFullYear(), currWeek.getMonth(), currWeek.getDate());
        updateDateText(currWeek);
  
        myChart.data.labels = dateLabels; 
        myChart.update();

    } else if (currChart.id === "monthlyChart") {
        currMonth.setMonth(currMonth.getMonth() - 1);
        dateLabels = getDaysInMonth(currMonth.getFullYear(), currMonth.getMonth());
        updateDateText(currMonth);

        myChart.data.labels = dateLabels; 
        myChart.update();

    } else if (currChart.id === "dailyChart") {
        currDate.setDate(currDate.getDate() - 1); 
        updateDateText(currDate);
    }
}

//update chart when next button is clicked 
function clickNext() {
    var dateLabels; 
    
    if(currChart.id === "weeklyChart") {
        currWeek.setDate(currWeek.getDate() + 7); 
        dateLabels = getDaysInWeek(currWeek.getFullYear(), currWeek.getMonth(), currWeek.getDate());
        updateDateText(currWeek);
  
        myChart.data.labels = dateLabels; 
        myChart.update();

        var tempDate = new Date();
        tempDate.setDate(tempDate.getDate()-7);

        if(currWeek >= tempDate) {
          nextButton.disabled = true; 
        }

    } else if (currChart.id === "monthlyChart") {
        currMonth.setMonth(currMonth.getMonth() + 1);
        dateLabels = getDaysInMonth(currMonth.getFullYear(), currMonth.getMonth());
        updateDateText(currMonth);

        myChart.data.labels = dateLabels; 
        myChart.update();

        if(currMonth >= today) {
          nextButton.disabled = true; 
        }

    } else if (currChart.id === "dailyChart") {
        currDate.setDate(currDate.getDate() + 1); 
        updateDateText(currDate);

        if(currDate >= today) {
          nextButton.disabled = true; 
        }
    }
}

//update date text between prev and next buttons
function updateDateText(givenDate) {
    if(currChart.id === "weeklyChart") {
        //parse into MMM/DD/YYYY format 
        var parsedEndDate = parseFullDate(givenDate);
        
        //get the given date + 6 days 
        var startD = new Date(currWeek.getFullYear(), currWeek.getMonth(), currWeek.getDate()); 
        startD.setDate(startD.getDate()+6); 

        //parse into MMM/DD/YYYY format 
        var parsedStartDate = parseFullDate(startD); 
        date.textContent = parsedEndDate.toString() + " - " + parsedStartDate.toString(); 

    } else if (currChart.id === "dailyChart") {
        //parse into MMM/DD/YYYY format 
        var parsedDate = parseFullDate(givenDate);
        date.textContent = parsedDate.toString(); 

    } else if (currChart.id === "monthlyChart") { 
        //parse into MMM/YYYY format 
        var d2 = givenDate.toString().substr(4, 11); 
        var d3 = d2.slice(0, 3) + '/' + d2.slice(6);
        date.textContent = d3.toString();
    }
}

//parse into MMM/DD/YYYY format 
function parseFullDate(givenDate) {
  var d2 = givenDate.toString().substr(4, 11); 
  var d3 = d2.slice(0, 3) + '/' + d2.slice(3, 6) + '/' + d2.slice(6);

  return d3;
}


/* -----CHARTS------- */

/* -----WEEKLY CHART------- */
function renderWeeklyChart(daysOfWeek) {
    return new Chart(currChart, {
        type: 'bar',
        data: {
          labels: daysOfWeek,
          datasets: weeklyChartData,
        },
      options: {
          title: {
              display: true,
              text: 'Weekly Study Hours'
          },
          tooltips: {
            displayColors: true,
            callbacks:{
              mode: 'x',
            },
          },
          scales: {
            xAxes: [{
              stacked: true,
              gridLines: {
                display: false,
              },
              scaleLabel: {
                  display: true,
                  labelString: "Day of the Week"
              }
            }],
            yAxes: [{
              stacked: true,
              ticks: {
                beginAtZero: true,
              },
              type: 'linear',
              scaleLabel: {
                display: true,
                labelString: "Study Hours"
                }
            }]
          },
          responsive: true,
          maintainAspectRatio: false,
          legend: { position: 'bottom' },
        }
      });
}

/* -----DAILY CHART------- */
function renderDailyChart() {
    return new Chart(currChart, {
        type: 'bar',
        data: {
          labels: ["0","1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23"],
          datasets: dailyChartData,
        },
      options: {
          title: {
              display: true,
              text: 'Daily Study Hours'
          },
          tooltips: {
            displayColors: true,
            callbacks:{
              mode: 'x',
            },
          },
          scales: {
            xAxes: [{
              stacked: true,
              gridLines: {
                display: false,
              },
              scaleLabel: {
                display: true,
                labelString: "Hour of the Day"
              }
            }],
        
            yAxes: [{
              stacked: true,
              ticks: {
                beginAtZero: true,
              },
              type: 'linear',
              scaleLabel: {
                display: true,
                labelString: "Study Minutes"
              }
            }]
          },
          responsive: true,
          maintainAspectRatio: false,
          legend: { position: 'bottom' },
        }
      });
}

/* -----MONTHLY CHART------- */
function renderMonthlyChart(daysOfMonth) {
    return new Chart(currChart, {
        type: 'bar',
        data: {
          labels: daysOfMonth,
          datasets: monthlyChartData,
        },
      options: {
          title: {
              display: true,
              text: 'Monthly Study Hours'
          },
          tooltips: {
            displayColors: true,
            callbacks:{
              mode: 'x',
            },
          },
          scales: {
            xAxes: [{
              stacked: true,
              gridLines: {
                display: false,
              },
              scaleLabel: {
                display: true,
                labelString: "Day of the Month"
              }
            }],
            yAxes: [{
              stacked: true,
              ticks: {
                beginAtZero: true,
              },
              type: 'linear',
              scaleLabel: {
                display: true,
                labelString: "Study Hours"
              }
            }]
          },
          responsive: true,
          maintainAspectRatio: false,
          legend: { position: 'bottom' },
        }
      });
}




  
  

  
  
  
