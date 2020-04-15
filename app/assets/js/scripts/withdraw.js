$(document).ready(function () {
    var db = firebase.firestore();

    var withdraw = db.collection("TarikDana");

    withdraw.get().then(function (querySnapshot) {
        var sn = 0;
        var withdrawArr = [];
        querySnapshot.forEach(function (doc) {
            sn++;
            let bank = doc.data().bank;
            let jumlah = doc.data().jumlah;
            jumlah = 'IDR ' + jumlah.toFixed(0).replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1\.");
            let status = doc.data().status;
            let namaRekening = doc.data().namaRekening;
            let nomorRekening = doc.data().nomorRekening;
            let selesai = doc.data().selesai;

            withdrawArr.push([sn, bank, namaRekening, nomorRekening, jumlah, status, selesai, doc.id]);

            return withdrawArr;
        });

        $('#withdrawTable').DataTable({
            data: withdrawArr,
            createdRow: function (row, data, dataIndex) {
                $(row).attr('data-toggle', 'modal');
                $(row).attr('data-target', '#withdrawModal');
            },
            columns: [
                { title: "#" },
                { title: "Bank" },
                { title: "Nama Rekening" },
                { title: "Nomor Rekening" },
                { title: "Jumlah" },
                { title: "Status" },
                { title: "Selesai" }
            ],
            initComplete: function () {
                this.api().columns([5, 6]).every(function () {
                    var column = this;
                    var select = $('<select class="custom-select" style="min-width: 180px;"><option value=""> </option></select>')
                        .appendTo($(column.footer()).empty())
                        .on('change', function () {
                            var val = $.fn.dataTable.util.escapeRegex(
                                $(this).val()
                            );
                            column
                                .search(val ? '^' + val + '$' : '', true, false)
                                .draw();
                        });

                    column.data().unique().sort().each(function (d, j) {
                        select.append('<option value="' + d + '">' + d + '</option>')
                    });
                });
            }
        });

        var table = $('#withdrawTable').DataTable();

        $('#withdrawTable tbody').on('click', 'tr', function () {
            var data = table.row(this).data();
            var status = data[data.length - 3];
            var selesai = data[data.length - 2];
            selesai = selesai.toString();
            $('#selesai').val(selesai);
            $('#status').val(status);

            $("#saveChanges").click(function () {
                var docId = data[data.length - 1];
                let selesai = $('#selesai').val();
                let updateStatus = $('#status').val();
                var updateSelesai = (selesai === 'true');

                withdraw.doc(docId).update({
                    selesai: updateSelesai,
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

    }).catch(function (err) {
        console.log(err);
    });
});



