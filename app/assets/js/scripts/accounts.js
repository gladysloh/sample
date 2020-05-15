
function getStatement() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    
    today = yyyy + '-' + mm + '-' + dd;

    console.log("Get statement !")

    let requestURL = "https://mutasibank.co.id/api/v1/statements/1512";
    let api = 'OXVqVnpHaFZFREFxZnRzM3Q2S1hsQVpGT1R2VGF3NlNBejVZRHM2WHpOQnRMUUY2Z2VqYWQ3OGlTSWlM5e862492eefba';
    var myHeaders = new Headers();
    myHeaders.append("Authorization", api);
    myHeaders.append("Access-Control-Allow-Origin", "*");

    var formdata = new FormData();
    formdata.append("date_from", today);
    formdata.append("date_to", today);

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow'
    };

    fetch("https://cors-anywhere.herokuapp.com/" + requestURL, requestOptions)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            var details = JSON.stringify(data);
            var parseData = JSON.parse(details);
            appendData(parseData);
            return data;
        })
        .catch(e => {
            console.log(e);
            $("#response").html("Failed to fetch!")
            return e;
        });

}

function appendData(obj) {
    var statements = obj.data;
    var sArray = []
    for (var i = 0; i < statements.length; i++) {
       
        var sysdate = statements[i].system_date;
        var transdate = statements[i].transaction_date;
        var amt = statements[i].amount;
        amt = 'IDR ' + amt.toFixed(0).replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1\.");
        var bal = statements[i].balance;
        bal = 'IDR ' + bal.toFixed(0).replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1\.");
        var des = statements[i].description;
        var type = statements[i].type;

        sArray.push([i+1, sysdate, transdate, des, amt, bal, type]);
    }

    $('#data-table').DataTable({
        data: sArray,
        columns: [
            { title: "#" },
            { title: "Tanggal Buat" },
            { title: "Tanggal" },
            { title: "Description" },
            { title: "Jumlah" },
            { title: "Saldo"},
            { title: "Type"},
        ]
    });

   
}