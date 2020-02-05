$(function() {
  var output = "";
  const length = 100;
  var timeArray = [];
  var coinsTogglesArray = [];
  var togglesLength = 5;
  var checkedToggles = "";
  var names = "";

  ///////////////// Functions ///////////////////////

  var initCoins = () => {
    output = "";
    $.ajax({
      url: "https://api.coingecko.com/api/v3/coins/list",
      success: function(result) {
        for (let i = 0; i < length; i++) {
          output += `
          <div id="${result[i].symbol}-card" class="coin-card col-lg-4 col-md-6 col-sm-12 animated fadeIn">
          <div class="card" >
              <div class="card-body" id=${i}>  
              <label class="toggleBtn switch">
                           <input id="${result[i].symbol}" class="toggle" type="checkbox" />
                          <span class="slider round"></span>
                        </label>
              <h1 class="symbol card-title">${result[i].symbol}</h1>
                  <h4 class="card-title" id="${result[i].id}"></span>${result[i].name}</h4>
                 <button type="button" class="btn btn-info moreInfo" data-toggle="collapse" data-target="#demo${i}">More Info</button>
                 <br>
                 <div id="demo${i}" class="collapse in">
                 <div class="mx-auto d-block lds-ring"><div></div><div></div><div></div><div></div></div>
                  </div>
              </div>
           </div>
          </div>
          `;
        }
        $("#mainCoins").html(`<div>
          <div class="container-fluid">
            <!-- row -->
            <div id="cards" class="row">
              <!-- card -->
               ${output}
              <!-- End of Cards -->
            </div>
          </div>
        </div>`);
      }
    });
  };

  var printAllCoins = () => {
    $.ajax({
      url: "https://api.coingecko.com/api/v3/coins/list",
      success: function(result) {
        for (let i = 0; i < length; i++) {
          output += `
          <div id="${result[i].symbol}-card" class="coin-card col-lg-4 col-md-6 col-sm-12 animated fadeIn">
          <div class="card">
              <div class="card-body" id=${i} >  
              <label class="toggleBtn switch">
                           <input id="${result[i].symbol}" class="toggle" type="checkbox" />
                          <span class="slider round"></span>
                        </label>
              <h1 class="symbol card-title">${result[i].symbol}</h1>
                  <h4 class="card-title" id="${result[i].id}"></span>${result[i].name}</h4>
                 <button type="button" class="btn btn-info moreInfo" data-toggle="collapse" data-target="#demo${i}">More Info</button>
                 <br>
                 <div id="demo${i}" class="collapse in">
                 <div class="mx-auto d-block lds-ring"><div></div><div></div><div></div><div></div></div>
                  </div>
              </div>
           </div>
          </div>
          `;
        }
        $("#mainCoins").html(`<div>
        <div class="container-fluid">
          <!-- row -->
          <div id="cards" class="row">
            <!-- card -->
             ${output}
            <!-- End of Cards -->
          </div>
        </div>
      </div>`);

        coinsTogglesArray.forEach(element => {
          $("#" + element).prop("checked", true);
        });
      }
    });
  };

  //print more Info//
  var moreInfo = (coinName, data, coinNum, timeOfClick) => {
    $.ajax({
      type: "GET",
      url: `https://api.coingecko.com/api/v3/coins/` + coinName,
      success: function(response) {
        $("body").find(`${data}`).html(`
        <br>
        <div class="animated fadeIn">
        <img class="coinImg mx-auto d-block" src=${response.image.large}></img>
        <br>
        <ul class="list-group list-group-flush text-center">
        <li class="list-group-item">USD: ${response.market_data.current_price.usd.toFixed(
          4
        )}$</li>
        <li class="list-group-item">EUR: ${response.market_data.current_price.eur.toFixed(
          4
        )}€</li>
        <li class="list-group-item">ILS: ${response.market_data.current_price.ils.toFixed(
          4
        )}₪</li>
      </ul>
      </div>`);

        timeArray[coinNum] = timeOfClick;

        // save to local storage//
        var checker = localStorage.getItem("coins");
        if (checker == null) {
          coinsToSave = [];
        } else {
          coinsToSave = JSON.parse(localStorage.getItem("coins"));
        }

        coinsToSave[coinNum] = {
          id: coinNum,
          Name: response.name,
          USD: response.market_data.current_price.usd.toFixed(4),
          EUR: response.market_data.current_price.eur.toFixed(4),
          ILS: response.market_data.current_price.ils.toFixed(4),
          Image: response.image.large,
          time: new Date().getTime() + 10000
        };

        var myJSON = JSON.stringify(coinsToSave);
        localStorage.setItem("coins", myJSON);
        console.log(coinsToSave);
        console.log(timeArray[coinNum]);
      }
    });
  };
  ///////////////////////////END OF FUNCTIONS/////////////////////////////////

  initCoins();

  ////Search Function//////
  $("#searchInput").keyup(function() {
    let searchVal = $("#searchInput")
      .val()
      .toLowerCase();
    let matches = $(`.coin-card[id*="${searchVal}"]`);
    if (searchVal) {
      let matches = $(`.coin-card[id*="${searchVal}"]`);
      matches.css("display", "block");
      let unMatching = $(".coin-card").not(matches);
      unMatching.css("display", "none");
      matches.length === 0
        ? $("#search-alert").show()
        : $("#search-alert").hide();
    } else {
      $(".coin-card").show();
      $("#search-alert").hide();
    }
  });

  //Print All Coins//
  $("#coins").click(function() {
    output = "";
    $("#main").show();
    $("#liveReports").hide();
    $("#aboutMe").hide();

    if (typeof chartTo === "undefined") {
      printAllCoins();
    } else {
      clearTimeout(chartTo);
      printAllCoins();
    }
  });

  //Collapse Content//
  $("body").on("click", ".moreInfo", function() {
    $(this)
      .parent()
      .toggleClass("opened");
    var coinId = $(this)
      .prev()
      .attr("id");
    var cardId = parseInt(
      $(this)
        .parent()
        .attr("id")
    );
    var dataInfo = $(this).attr("data-target");
    var timenow = new Date().getTime();
    var timeclicked = timenow + 120000;

    if (
      $(this)
        .parent()
        .hasClass("opened")
    ) {
      $(this).removeClass("btn-info");
      $(this).addClass("btn-danger");
      $(this).text("Less Info");

      if (timeArray[cardId] == null || timenow > coinsToSave[cardId].time) {
        moreInfo(coinId, dataInfo, cardId, timeclicked);
        console.log("from server");
      } else {
        console.log("from storage");
        var fromstorage = JSON.parse(localStorage.getItem("coins"));
        $("body").find(`${dataInfo}`).html(`
          <br>
          <div class="animated fadeIn">
          <img class="coinImg mx-auto d-block" src=${fromstorage[cardId].Image}></img>
          <br>
          <ul class="list-group list-group-flush text-center">
          <li class="list-group-item">USD: ${fromstorage[cardId].USD}$</li>
          <li class="list-group-item">EUR: ${fromstorage[cardId].EUR}€</li>
          <li class="list-group-item">ILS: ${fromstorage[cardId].ILS}₪</li>
        </ul>
        </div>`);

        setTimeout(() => {
          $(this)
            .next()
            .show();
        }, 120000);

        $(this)
          .next()
          .click(function() {
            moreInfo(coinId, dataInfo, cardId, timeclicked);
            $(this).hide();
            setTimeout(() => {
              $(this).show();
            }, 120000);
          });
      }
    } else {
      $(this).removeClass("btn-danger");
      $(this).addClass("btn-info");
      $(this).text("More Info");
      $(this)
        .next()
        .click(function() {
          moreInfo(coinId, dataInfo, cardId, timeclicked);
          $(this).hide();
          setTimeout(() => {
            $(this).show();
          }, 120000);
        });
    }

    $(this).collapse();
  });

  /////////////////body Toggles//////////////////////////
  $("body").on("change", ".toggle", function() {
    coinNameId = $(this)
      .parent()
      .siblings("h1")
      .text();
    if ($(this).is(":checked")) {
      coinsTogglesArray.push(coinNameId);
      console.log(coinsTogglesArray);
    } else {
      coinsTogglesArray.splice($.inArray(coinNameId, coinsTogglesArray), 1);
      console.log(coinsTogglesArray);
    }

    if (coinsTogglesArray.length > togglesLength) {
      checkedToggles = "";
      coinsTogglesArray.splice(5, 1);
      $(this).prop("checked", false);
      $("#exampleModal").modal("show");
      for (let i = 0; i < togglesLength; i++) {
        checkedToggles += `
        <div class="text-center">
        <h4>${coinsTogglesArray[i]}</h4>
        <label class="switch">
          <input id="${coinsTogglesArray[i]}" type="checkbox" checked />
          <span class="slider round"></span>
        </label>
      </div>`;
      }
      $("#toggles").html(checkedToggles);
    }
  });

  /////////////////Modal Toggles//////////////////////////
  $(".modal-body").on("change", "input", function() {
    thisToggle = $(this).attr("id");
    coinsTogglesArray.splice($.inArray(thisToggle, coinsTogglesArray), 1);
    coinsTogglesArray.push(coinNameId);
    $(this)
      .parent()
      .siblings("h4")
      .text(coinNameId);
    $(this).attr("id", coinNameId);
    $(this).prop("checked", true);
    $("#exampleModal").modal("hide");
    console.log(coinsTogglesArray);
    $("body")
      .find("#" + thisToggle)
      .prop("checked", false);
    $("body")
      .find("#" + coinNameId)
      .prop("checked", true);
  });

  ///////////////////Live Reports///////////////////////////
  $("#reports").click(function() {
    if (coinsTogglesArray.length == 0) {
      alert("You Must Select Coins To Show");
    } else {
      $("#liveReports").show();
      $("#aboutMe").hide();
      $("#main").hide();
      loadReport();
      getCoinsData();
      updateChart();
    }
  });

  /////////////////About Me//////////////////
  $("#about").click(function() {
    $("#aboutMe").show();
    $("#liveReports").hide();
    $("#main").hide();
    if (typeof chartTo === "undefined") {
    } else {
      clearTimeout(chartTo);
    }
  });

  ///////////////LIVE CHART FUNCTIONS///////////////////////////////////////////

  function getNames() {
    names = "";
    coinsTogglesArray.forEach(element => {
      str = element.toUpperCase();
      names += str + ",";
    });
    console.log(names);
  }
  function getCoinsData() {
    getNames();
    $.ajax({
      url:
        "https://min-api.cryptocompare.com/data/pricemulti?fsyms=" +
        names +
        "&tsyms=USD",
      success: function(result) {
        setCoinsDataToChart(result);
      }
    });
  }

  function setCoinsDataToChart(result) {
    if (result.Response == "Error") {
      $("#ajaxError").show();
      return true;
    } else {
      $("#ajaxError").hide();
      options.data = [];
      if (result.length == 0) {
        option.data = {};
        return true;
      }
      $.each(result, function(key, value) {
        coinObj = result[key];
        var coinData = {
          type: "spline",
          name: key,
          showInLegend: true,
          xValueType: "dateTime",
          xValueFormatString: "HH:MM:ss",
          yValueFormatString: "####.#####$",
          dataPoints: [{ x: new Date(), y: coinObj.USD }]
        };
        options.data.push(coinData);
        console.log(coinData.dataPoints);
        console.log(options);
      });
      $("#chartContainer").CanvasJSChart(options);
    }
  }

  function loadReport() {
    options = {
      animationEnabled: true,
      zoomEnabled: false,
      axisX: {
        title: "chart updates every 2 seconds"
      },
      axisY: {
        title: "Coin Value",
        titleFontColor: "#000",
        lineColor: "#4F81BC",
        labelFontColor: "#4F81BC",
        tickColor: "#4F81BC",
        suffix: "$",
        includeZero: false
      },
      toolTip: {
        shared: true
      },
      legend: {
        cursor: "pointer",
        itemclick: toggleDataSeries,
        verticalAlign: "top",
        fontSize: 22,
        fontColor: "dimGrey"
      },
      data: []
    };

    $("#chartContainer").CanvasJSChart(options);
    console.log(options.data);

    function toggleDataSeries(e) {
      if (typeof e.dataSeries.visible === "undefined" || e.dataSeries.visible) {
        e.dataSeries.visible = false;
      } else {
        e.dataSeries.visible = true;
      }
      e.chart.render();
    }
  }

  function updateChart() {
    $.ajax({
      url:
        "https://min-api.cryptocompare.com/data/pricemulti?fsyms=" +
        names +
        "&tsyms=USD",

      success: function(result) {
        if (result.Response !== "Error") {
          priceArray = Object.values(result);
          for (let i = 0; i < priceArray.length; i++) {
            options.data[i].dataPoints.push({
              x: new Date(),
              y: priceArray[i].USD
            });
            console.log(options.data[i].dataPoints);
          }
          $("#chartContainer")
            .CanvasJSChart()
            .render(options);
        }
      }
    });

    chartTo = setTimeout(function() {
      updateChart();
    }, 2000);
  }

  //////////////////////////END OF LIVE CHART////////////////////////////////////
});
