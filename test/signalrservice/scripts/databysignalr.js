< !DOCTYPE html >
    <
    html >

    <
    head >
    <
    meta charset = "utf-8" / >
    <
    title > Test < /title> <
    script type = "text/javascript"
src = "https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js" > < /script> <
    script src = "https://cdn.jsdelivr.net/npm/@aspnet/signalr@1.1.2/dist/browser/signalr.js" > < /script> <
    script type = "text/javascript"
src = "scripts/databysignalr.js" > < /script> <
    /head>

<
body >
    <
    h1 > Hello < /h1> <
    /body>

<
/html>             });
}
}
};

const connection = new signalR.HubConnectionBuilder()
    .withUrl(info.uri, options)
    .configureLogging(signalR.LogLevel.Information)
    .build();

connection.on("SendData", function(obj) {
    message = obj;
    x = message.x;
    y = message.y;
    console.log('x=' + x + 'y=' + y);
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
        url: '${apiBaseUrl}/api/negotiate',
        data: {}
    }).done(function(resp, textStatus, jqXHR) {
        return resp.data;
    }).fail(function(jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
    });
}
});