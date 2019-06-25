< !DOCTYPE html >
    <
    html >

    <
    head >
    <
    meta charset = "utf-8" / >
    <
    title > Sample Viewer < /title> <
    script type = "text/javascript"
src = "https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js" > < /script> <
    script type = "text/javascript"
src = "scripts/Chart.min.js" > < /script> <
    script type = "text/javascript"
src = "https://cdn.jsdelivr.net/npm/@aspnet/signalr@1.1.2/dist/browser/signalr.js" > < /script> <
    script type = "text/javascript"
src = "scripts/databysignalr.js" > < /script> <
    /head>

<
body >
    <
    h1 > Received Message < /h1> <
    div id = "textArrived" > < /div><br / >
    <
    div id = "textMessage" > < /div>

<
table >
    <
    tr >
    <
    td >
    <
    canvas id = "tempChart"
width = "600"
height = "600" > < /canvas> <
    /td> <
    td >
    <
    canvas id = "humChart"
width = "600"
height = "600" > < /canvas> <
    /td> <
    /tr> <
    /table> <
    /body>

<
/html>         yAxes: [{
id: yAxisLabel,
    type: 'linear',
    scaleLabel: {
        labelString: yAxisLabel,
        display: true
    },
    position: 'left'
}]
}
};
var lineChart = new Chart(docElement, {
    type: 'line',
    data: dataGroup,
    options: basicOption
});

return lineChart;
}


//Get the context of the canvas element we want to select
var ctxTemp = document.getElementById("tempChart").getContext("2d");
var optionsNoAnimation = { animation: false };
var ctxHum = document.getElementById("humChart").getContext("2d");

var tempLineChart = createGraphBase(timeData, tempData, 'Temperature', "rgba(255, 204, 0, 1)", "rgba(2, 204, 0, 0.4)", ctxTemp);
var humLineChart = createGraphBase(timeData, humData, 'Humidity', "rgba(2, 204, 0, 1)", "rgba(2, 204, 0, 0.4)", ctxHum);

const apiBaseUrl = "https://egsignalrservicehub20190620.azurewebsites.net";
let data = { ready: false };
textArrivedElem = document.getElementById("textArrived");
textMessageElem = document.getElementById("textMessage");

getConnectionInfo().then(function(info) {
    let accessToken = info.accessToken;

    const options = {
        accessTokenFactory: function() {
            if (accessToken) {
                const _accessToken = accessToken;
                accessToken = null;
                return _accessToken;
            } else {
                return getConnectionInfo().then(function(info) {
                    return info.accessToken;
                });
            }
        }
    };

    const connection = new signalR.HubConnectionBuilder()
        .withUrl(info.url, options)
        .configureLogging(signalR.LogLevel.Information)
        .build();

    connection.on("SendData", function(obj) {
        var recieved = JSON.parse(obj);
        arrived = recieved.arrived;
        message = recieved.message;
        console.log('time:' + arrived + ',message:' + JSON.stringify(message));
        textArrivedElem.innerHTML = arrived;
        textMessageElem.innerHTML = JSON.stringify(message);

        if (!message.measured_time || !message.temperature || !message.humidity) {
            return;
        }
        timeData.push(message.measured_time);
        tempData.push(message.temperature);
        humData.push(message.humidity);

        // only keep no more than 50 points in the line chart
        var len = timeData.length;
        if (len > 200) {
            timeData.shift();
            tempData.shift();
            humData.shift();
        }
        tempLineChart.update();
        humLineChart.update();
    });


    connection.onclose(function() {
        console.log('disconnected');
        setTimeout(function() { startConnection(connection); }, 2000);
    });

    console.log('connecting...');
    connection.start().then(() => data.ready = true)
        .catch(console.error);
});

function getConnectionInfo() {
    return $.post({
        url: `${apiBaseUrl}/api/SignalRInfo`,
        data: {}
    }).done(function(resp, textStatus, jqXHR) {
        return resp.data;
    }).fail(function(jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
    });
}
});