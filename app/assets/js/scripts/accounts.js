function checkDate(){
    var from = $("#fromDate").val();
    var to = $("#toDate").val();

    if(from > to){
        alert("Invalid Dates");
    }else{
        getStatement(from, to);
    }
}


function getStatement(from, to) {

    console.log("Get statement !");
    
    let requestURL = "https://mutasibank.co.id/api/v1/statements/1450072032";
    let api = 'OXVqVnpHaFZFREFxZnRzM3Q2S1hsQVpGT1R2VGF3NlNBejVZRHM2WHpOQnRMUUY2Z2VqYWQ3OGlTSWlM5e862492eefba';
    var myHeaders = new Headers();
    myHeaders.append("Authorization", api);

    var formdata = new FormData();
    console.log(from + " - " + to);
    formdata.append("date_from", from);
    formdata.append("date_to", to);

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow'
    };

    fetch("https://cors-anywhere.herokuapp.com/" + requestURL, requestOptions)
        .then(response => response.text())
        .then(data => {
          
            var details = JSON.stringify(data);
            var parseData = JSON.parse(details);
            console.log(parseData);
            appendData(parseData);

            return data;
        })
        .catch(e => {
            console.log(e);
            $("#response").html("Failed to fetch!")
            return e;
        });

}

function appendData(data) {
    //for (var i = 0; i < data.length; i++) {
        console.log(data);
        console.log(data.message);
        $("#response").append(data.message);
    //}
}