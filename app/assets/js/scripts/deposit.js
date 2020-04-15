var userRole = localStorage.getItem("userRole");

function getDeposits() {
    if (userRole == 0) {
        var db = firebase.firestore();

        var deposit = db.collection("TambahDana");

        deposit.get().then(function (querySnapshot) {
            var sn = 0;
            var depositArr = [];
            querySnapshot.forEach(function (doc) {
                sn++;
                let bank = doc.data().bank;
                let jumlah = doc.data().jumlah;
                jumlah = 'IDR ' + jumlah.toFixed(0).replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1\.");
                let status = doc.data().status;
                let waktuMulai = doc.data().waktuMulai;
                let waktuSelesai = doc.data().waktuSelesai;

                if (waktuMulai != null) {
                    waktuMulai = waktuMulai.toDate();
                } else {
                    waktuMulai = ' - '
                }
                if (waktuSelesai != null) {
                    waktuSelesai = waktuSelesai.toDate();
                } else {
                    waktuSelesai = " - "
                }

                depositArr.push([sn, bank, jumlah, status, waktuMulai, waktuSelesai]);

                return depositArr;
            });

            $('#data-table').DataTable({
                data: depositArr,
                columns: [
                    { title: "#" },
                    { title: "Bank" },
                    { title: "Jumlah" },
                    { title: "Status" },
                    { title: "Waktu Mulai" },
                    { title: "Waktu Selesai" }
                ]
            });

        }).catch(function (err) {
            console.log(err);
        });
    }else{
        $(".main-content").hide();
    }
}