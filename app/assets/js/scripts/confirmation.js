$(document).ready(function () {
    var db = firebase.firestore();

    var confirm = db.collection("KonfirmasiTambahDana");

    confirm.get().then(function (querySnapshot) {
        var sn = 0;
        var confirmArr = [];
        querySnapshot.forEach(function (doc) {
            sn++;
            let bank = doc.data().bankPengirim;
            let jumlah = doc.data().jumlah;
            jumlah = 'IDR ' + jumlah.toFixed(0).replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1\.");
            let status = doc.data().status;
            let namaPengirim = doc.data().namaPengirim;
            let nomorRekening = doc.data().nomorRekening;

            confirmArr.push([sn, bank, namaPengirim, nomorRekening, jumlah, status, doc.id]);

            return confirmArr;
        });

        $('#confirmTable').DataTable({ //display data
            data: confirmArr,
            createdRow: function (row, data, dataIndex) {
                $(row).attr('data-toggle', 'modal');
                $(row).attr('data-target', '#confirmModal');
            },
            columns: [
                { title: "#" },
                { title: "Bank" },
                { title: "Nama Pengirim" },
                { title: "Nomor Rekening" },
                { title: "Jumlah" },
                { title: "Status" }
            ]
        });

        var table = $('#confirmTable').DataTable();
       
        var userRole = localStorage.getItem('userRole');
        console.log(userRole);
        
        if (userRole == 0) {
            $('#confirmTable tbody').on('click', 'tr', function () { //when data row is clicked
                var data = table.row(this).data();
                var status = data[data.length - 2];
                console.log(status);
                $('#status').val(status);

                $("#saveChanges").click(function () {  //when save button is clicked
                    var docId = data[data.length - 1];
                    let updateStatus = $('#status').val();

                    confirm.doc(docId).update({
                        status: updateStatus
                    })
                        .then(function () {
                            console.log("Document successfully updated!");
                            $("#saveMsg").html("Successfully updated!");
                            location.reload(); //relaod after saved
                        })
                        .catch(function (error) {
                            console.error("Error updating document: ", error);
                            $("#saveMsg").html("Error updating!");
                        });
                });
            });
        }else{
            $('#confirmTable tbody tr').css("pointer-events","none");
        }

    }).catch(function (err) {
        console.log(err);
    });
});



