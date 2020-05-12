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

                let jumlah = doc.data().jumlah;
                jumlah = 'IDR ' + jumlah.toFixed(0).replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1\.");
                let status = doc.data().status;
                let waktuMulai = doc.data().waktuMulai;
                let bank = doc.data().dari.bank;
                let namaPemilik = doc.data().dari.namaPemilik;
                let nomorRekening = doc.data().dari.nomorRekening;

                if (waktuMulai != null) {
                    waktuMulai = waktuMulai.toDate();
                } else {
                    waktuMulai = ' - '
                } 
                
                if(status=="MENUNGGU"){
                    depositArr.push([sn, jumlah, status, waktuMulai, bank, namaPemilik, nomorRekening, doc.id]);
                }
                
                return depositArr;
            });

            $('#data-table').DataTable({
                data: depositArr,
                columns: [
                    { title: "#" },
                    { title: "Jumlah" },
                    { title: "Status" },
                    { title: "Waktu Mulai" },
                    { title: "Data Pengirim" },
                    { title: "Nama Pemilik" },
                    { title: "Nomor Rekening" },
                    { title: "Action" }
                ],
                columnDefs: [{
                    "targets": -1,
                    "data": null,
                    "defaultContent": "<button class='btn btn-primary btn-sm' id='setuju'> Setuju </button>" +
                        " <button class='btn btn-default btn-sm' id='tidak'> Tidak </button>"
                }]
            });

            var table = $('#data-table').DataTable();
            $('#data-table tbody').on('click', '#setuju', function () {
                var data = table.row($(this).parents('tr')).data();

                var status = data[2];
                var docId = data[7];

                if (status == 'MENUNGGU') {
                    alert(docId);
                    deposit.doc(docId).update({
                        status: 'SELESAI'
                    })
                        .then(function () {
                            alert("Successfully Updated Dokumen Status to 'SELESAI'")
                            location.reload(); //reload after saved
                        })
                        .catch(function (error) {
                            console.error("Error updating document: ", error);

                        });
                } else{
                    alert("Invalid")
                }

            });

            $('#data-table tbody').on('click', '#tidak', function () {
                var data = table.row($(this).parents('tr')).data();
                var status = data[2];
                var docId = data[7];

                if (status == 'MENUNGGU') {
                    deposit.doc(docId).update({
                        status: 'GAGAL'
                    })
                        .then(function () {
                            alert("Successfully Updated Dokumen Status to 'GAGAL'")
                            location.reload(); //reload after saved
                        })
                        .catch(function (error) {
                            console.error("Error updating document: ", error);

                        });
                } else{
                    alert("Invalid")
                }

            });

        }).catch(function (err) {
            console.log(err);
        });

    } else {
        $(".main-content").hide();
    }
}