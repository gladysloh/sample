var userRole = localStorage.getItem("userRole");

function getAllTraders() {
    if (userRole == 0) {
        var db = firebase.firestore();

        var trader = db.collection("Trader"); //All User 

        let userid;

        trader.get().then(function (querySnapshot) {
            var sn = 0;
            var traderDetails = [];
            querySnapshot.forEach(function (doc) {
                sn++;
                userid = doc.id;
                let name = doc.data().namaTrader;
                let danaTitipan = doc.data().danaTitipan;
                danaTitipan = 'IDR ' + danaTitipan.toFixed(0).replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1\.");
                let avatar = doc.data().urlAvatar;
                let user = "<div class='d-flex align-items-center'><img src='"
                    + avatar + "' class='img-fluid rounded' style='max-width: 60px'><h6 class='m-b-0 m-l-10 trader-name'>"
                    + name + "</h6></div>";

                traderDetails.push([sn, user, danaTitipan, name]);

                return traderDetails;
            });

            $('#data-table').DataTable({
                data: traderDetails,
                columns: [
                    { title: "S/N" },
                    { title: "User" },
                    { title: "DanaTitipan" },
                    {
                        mRender: function (data, type, row) {
                            return '<button class="btn btn-icon btn-hover btn-sm btn-rounded pull-right" data-id="'
                                + row[0] + '" id="edit-trader"> <i class="anticon anticon-edit"> </i> </button>'
                                + '<button class="btn btn-icon btn-hover btn-sm btn-rounded pull-right" data-id="'
                                + row[0] + '" id="trader-info" data-toggle="modal" data-target="#traderModal"> <i class="anticon anticon-info-circle"></i></button>'
                        }
                    },
                ]
            });

            var table = $('#data-table').DataTable();

            $('#data-table tbody').on('click', '#edit-trader', function () {
                var data = table.row($(this).parents('tr')).data();
                var queryString = "?namaTrader=" + data[3];
                window.location.href = "edit-trader.html" + queryString
            });

            $('#data-table tbody').on('click', '#trader-info', function () {
                var data = table.row($(this).parents('tr')).data();
                var tradername = data[data.length - 1];
                Promise.all(getTrader(tradername)).then(function (value) {
                    var arrays = value
                    var merged = [].concat.apply([], arrays);
                    $("#modalTitle").text(merged[0]);
                    $("#totalInvest").text(merged[1]);
                    $("#peopleInvested").text(merged[2]);
                });
            });

        }).catch(function (err) {
            console.log(err);
        });
    }else{
        $(".main-content").hide();
    }

}

function getTrader(trader) {
    var db = firebase.firestore();
    var traderRef = db.collection('Trader').doc(trader);

    var totalInvest = db.collection("Titipan")
        .where('trader', '==', traderRef)
        .get()
        .then(function (querySnapshot) {
            var tempInvest = 0;
            var countUser = [];

            querySnapshot.forEach(function (doc) {
                countUser.push(doc.id);
                var invest = doc.data().danaTitipan;
                tempInvest += invest;
            });
            tempInvest = "IDR " + tempInvest.toFixed(0).replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1\.");
            var length = countUser.length;
            return [tempInvest, length];
        })
        .catch(function (error) {
            console.log("Error getting documents: ", error);
        });

    return [trader].concat(totalInvest);
}

function editTrader() {
    var traderName = getUrlParameter('namaTrader').split('+').join(' ');

    $(".traderName").text(traderName);

    var db = firebase.firestore();
    var docRef = db.collection("Trader").doc(traderName);
    var tradeHistory = docRef.collection("RiwayatTrader");

    docRef.get().then(function (doc) {
        if (doc.exists) {
            $('#traderAvatar').attr('src', doc.data().urlAvatar);
            $("#namaTrader").val(doc.data().namaTrader);
            $("#traderId").val(doc.data().id);
            $("#danaTitipan").val(doc.data().danaTitipan);
            $("#jumlahPenitip").val(doc.data().jumlahPenitip);
            $("#trader-url").val(doc.data().url);
            $("#rating").val(doc.data().rating);
            $("#resiko").val(doc.data().resiko);
            $("#deskripsi").val(doc.data().deskripsi);
            $('.select2').select2();
            var grafik = doc.data().grafik;
            $("#grafik").val(grafik);
            grafik = grafik.join(', ')
            $("#displayGrafik").append('<p>' + grafik + '</p>');
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch(function (error) {
        console.log("Error getting document:", error);
    });

    tradeHistory.get().then(function (querySnapshot) {
        var count = 0;
        var history = [];
        querySnapshot.forEach(function (doc) {
            count++;
            console.log(doc.data());
            let mataUang = doc.data().mataUang;
            let tipe = doc.data().tipe;
            let untung = doc.data().untung;
            let waktuBuka = doc.data().waktuBuka.toDate();
            let waktuTutup = doc.data().waktuTutup.toDate();

            history.push([count, mataUang, tipe, untung, waktuBuka, waktuTutup]);

            return history;
        });

        $('#data-table').DataTable({
            data: history,
            columns: [
                { title: "#" },
                { title: "MataUang" },
                { title: "Tipe" },
                { title: "Untung" },
                { title: "WaktuBuka" },
                { title: "WaktuTutup" },
            ]
        });
    });

}

$("#saveTrader").click(function () {
    var trader = $("#traderId").val();

    var db = firebase.firestore();
    var docRef = db.collection("Trader").doc(trader);
    console.log(docRef);

    let nama = $("#namaTrader").val();
    let titipan = $("#danaTitipan").val();
    let penitip = $("#jumlahPenitip").val();
    let url = $("#trader-url").val();
    let rating = $("#rating").val();
    let resiko = $("#resiko").val();
    let deskripsi = $("#deskripsi").val();
    let grafik = $("#grafik").val().split(',');
    var grafikArr = [];
    for (var i = 0; i < grafik.length; i++) {
        grafikArr.push(parseInt(grafik[i]))
    }

    docRef.update({
        namaTrader: nama,
        danaTitipan: parseInt(titipan),
        jumlahPenitip: parseInt(penitip),
        url: url,
        rating: parseInt(rating),
        resiko: parseInt(resiko),
        deskripsi: deskripsi,
        grafik: grafikArr
    })
        .then(function () {
            console.log("Document successfully updated!");
            $("#saveSuccess").append('<span class="badge badge-success"> Successfully Updated <i class="anticon anticon-check"></i> </span>')
            //location.reload(); //relaod after saved
        })
        .catch(function (error) {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
        });

    //var tradeHistory = db.collection("Trader").doc(nama).collection("RiwayatTrader");
});

$("#addHistory").click(function () {
    var nama = $("#namaTrader").val();
    var mataUang = $("#mataUang").val();
    var tipe = $("#tipe").val();
    var untung = $("#untung").val();
    var waktuBuka = $("#buka").val();
    var waktuTutup = $("#tutup").val();
    var untungVal = (untung === 'true');
    console.log(untungVal);

    if (waktuBuka == '' || waktuTutup == '') {
        $(".text-left").html('<span class="badge badge-danger"> Warning! Invalid Date </span>');
    }

    if (mataUang != null && mataUang != '') {
        var tradeHistory = db.collection("Trader").doc(nama).collection("RiwayatTrader");
        tradeHistory.doc().set({
            mataUang: mataUang.toUpperCase(),
            tipe: tipe,
            untung: untungVal,
            waktuBuka: firebase.firestore.Timestamp.fromDate(new Date(waktuBuka)),
            waktuTutup: firebase.firestore.Timestamp.fromDate(new Date(waktuTutup))
        })
            .then(function () {
                console.log("Document successfully written!");
                $(".text-left").html('<span class="badge badge-success"> Successfully Added! </span>');
            })
            .catch(function (error) {
                console.error("Error writing document: ", error);
                $(".text-left").html('<span class="badge badge-danger"> Warning! Error! </span>');
            });
    } else {
        $(".text-left").html('<span class="badge badge-danger"> Warning! Enter Values </span>');
    }

});

var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
};

