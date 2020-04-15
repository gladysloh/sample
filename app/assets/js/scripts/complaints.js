var db = firebase.firestore();
var complain = db.collection("Komplain");

function viewComplaints() {
    complain.get().then(function (querySnapshot) {
        var sn = 0;
        var complaintsArr = [];
        querySnapshot.forEach(function (doc) {
            sn++;
            let email = doc.data().email;
            let keluhan = doc.data().keluhan;
            let status = doc.data().status;
            let namaPengguna = doc.data().namaPengguna;
            let topik = doc.data().topik;
            let respon = doc.data().respon;
            let timestamp = doc.data().tanggal.toDate();

            complaintsArr.push([sn, namaPengguna, email, keluhan, topik, status, respon, timestamp, doc.id]);

            return complaintsArr;
        });

        $('#viewTable').DataTable({ //display data
            data: complaintsArr,
            columns: [
                { title: "#" },
                { title: "Nama Pengguna" },
                { title: "Email" },
                { title: "Keluhan" },
                { title: "Topik" },
                { title: "Status" },
                { title: "Respon" },
                // { title: "Date" },
                {
                    mRender: function (data, type, row) {
                        return '<button class="btn btn-icon btn-hover btn-sm btn-rounded pull-right" data-id="'
                            + row[0] + '" id="edit-complaint"> <i class="anticon anticon-edit"> </i> </button>'
                    }
                },
            ]

        });
        var table = $('#viewTable').DataTable();
        $('#viewTable tbody').on('click', '#edit-complaint', function () {
            var data = table.row($(this).parents('tr')).data();
            var queryString = "?complainId=" + data[8];
            window.location.href = "edit-response.html" + queryString
        });
    });
}

function editResponse() {
    var docId = getUrlParameter('complainId').split('+').join(' ');
    complain.doc(docId).get().then(function (doc) {
        if (doc.exists) {
            let email = doc.data().email;
            let keluhan = doc.data().keluhan;
            let status = doc.data().status;
            let namaPengguna = doc.data().namaPengguna;
            let topik = doc.data().topik;
            let respon = doc.data().respon;
            let timestamp  = doc.data().tanggal.toMillis();
            timestamp = new Date(timestamp);

            $("#viewEmail").val(email);
            $("#viewKeluhan").val(keluhan);
            $("#viewStatus").val(status);
            $("#viewUsername").val(namaPengguna);
            $("#viewTopik").val(topik);
            $("#respon").val(respon);
            $("#submitDate").html(timestamp);

        } else {
            console.log("No such document!");
        }
    }).catch(function (error) {
        console.log("Error getting document:", error);
    });

    $("#responSave").click(function () {
        var respon = $("#respon").val();

        complain.doc(docId).update({
            respon: respon
        }).then(function (doc) {
            location.reload();
        })
            .catch(function (error) {
                console.error("Error updating document: ", error);

            }).catch(function (err) {
                console.log(err);
            });

    })

}

$("#addComplaint").click(function () {
    window.location.href = "add-complaint.html"
});
$("#backBtn").click(function () {
    window.history.back();
});


$("#submitComplain").click(function () {
    var date = new Date();
    let email = $("#email").val();
    let username = $("#username").val();
    let keluhan = $("#keluhan").val();
    let topik = $('input[name="topik"]:checked').val();
    let status = $('input[name="status"]:checked').val();
    var timestamp = date.getTime();

    if (email != '' && username != '' && keluhan != '' && topik != 'undefined' && status != 'undefined') {
        complain.add({
            email: email,
            keluhan: keluhan,
            namaPengguna: username,
            status: status,
            topik: topik,
            tanggal: firebase.firestore.Timestamp.fromDate(new Date(timestamp)),
            respon: '',
        })
            .then(function (doc) {
                console.log("Document successfully updated! " + doc.id);
                window.location.href = "users-complain.html";

            })
            .catch(function (error) {
                console.error("Error updating document: ", error);

            }).catch(function (err) {
                console.log(err);
            });

    } else {
        $("#valMsg").append('<div class="badge badge-danger"> Form Incomplete </div>');
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
