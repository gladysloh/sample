let userRole = localStorage.getItem("userRole");

$(document).ready(function () {
    if(userRole == 0){
    var db = firebase.firestore();

    var today = new Date();
    var tMonth = today.getUTCMonth() + 1;
    var tDay = today.getUTCDate();
    var tYear = today.getUTCFullYear();
    var todayDate = tDay + "/" + tMonth + "/" + tYear;

    var tambahDana = db.collection("TambahDana");
    var withdraw = db.collection("TarikDana");
    var titipan = db.collection("Titipan");

    tambahDana.get().then(function (querySnapshot) {
        var totalJumlah = 0;
        querySnapshot.forEach(function (doc) {
            if (doc.data().status == 'SELESAI') {
                var jumlah = doc.data().jumlah;
                totalJumlah += jumlah;
                return totalJumlah;
            } else {
                return totalJumlah;
            }

        });

        totalJumlah = "IDR " + totalJumlah.toFixed(0).replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1\.");
        $("#totalJumlah").html(totalJumlah)
    });

    withdraw.get().then(function (querySnapshot) {
        var totalWithdraw = 0;
        querySnapshot.forEach(function (doc) {
            var activeDate = doc.data().tanggal;
            activeDate = activeDate.toDate();
            var month = activeDate.getUTCMonth() + 1; //months from 1-12
            var day = activeDate.getUTCDate();
            var year = activeDate.getUTCFullYear();
            var newActiveDate = day + "/" + month + "/" + year;

            if (doc.data().status == 'SELESAI' && todayDate == newActiveDate) {
                var jumlah = doc.data().jumlah;

                totalWithdraw += jumlah;

                return totalWithdraw;
            }else{

                return totalWithdraw;
            }

        });

        totalWithdraw = "IDR " + totalWithdraw.toFixed(0).replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1\.");
        $("#totalWithdraw").html(totalWithdraw);
    });

    titipan.get().then(function (querySnapshot) {
        var activeTitipan = 0;
        $("#todayDate").html(todayDate);

        querySnapshot.forEach(function (doc) {
            var activeDate = doc.data().tanggalMulai;
            activeDate = activeDate.toDate();
            var month = activeDate.getUTCMonth() + 1; //months from 1-12
            var day = activeDate.getUTCDate();
            var year = activeDate.getUTCFullYear();

            var newActiveDate = day + "/" + month + "/" + year;

            if (doc.data().aktif == true && todayDate == newActiveDate) {
                var danaTitipan = doc.data().danaTitipan;
                activeTitipan += danaTitipan;

                return activeTitipan;
            } else {
                return activeTitipan;
            }

        });

        activeTitipan = "IDR " + activeTitipan.toFixed(0).replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1\.");
        $("#activeTitipan").html(activeTitipan);

    });
}else{
    $(".main-content").hide();
}
});