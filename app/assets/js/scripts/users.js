var userRole = localStorage.getItem("userRole");
function getAllUsers() {
    if (userRole == 0) {
        var pengguna = db.collection("Pengguna"); //All User 

        let userid;
        pengguna.get().then(function (querySnapshot) {
            var sn = 0;
            var userDetails = [];
            querySnapshot.forEach(function (doc) {
                sn++;
                userid = doc.id;
                // var totalDeposit = getTotalDeposit(userid);
                // console.log(totalDeposit);
                let name = doc.data().namaLengkap;
                if (name == null) {
                    name = ' - '
                 }

                let email = doc.data().email;
                if (email == null) {
                    email = ' - '
                 }

                let tele = doc.data().nomorTelepon;
                if (tele == null) {
                   tele = ' - '
                }

                let bal = doc.data().saldoUtama;
                if (bal == null) {
                    bal = ' - ';
                }else{
                    bal = 'IDR ' + bal.toFixed(0).replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1\.");
                }
                
                let avatar = doc.data().urlAvatar;
                user = "<div class='d-flex align-items-center'><img src='" + avatar + "' class='img-fluid rounded' style='max-width: 60px'><h6 class='m-b-0 m-l-10' id='user-name'>" + name + "</h6><input type='hidden' id='userId' name='userId' value='" + userid + "'></div>";

                let status = doc.data().verified;
                if (status == true) {
                    status = 'Verified';
                } else {
                    status = 'Not Verified';
                }

                userDetails.push([sn, user, email, tele, bal, status, userid]);

                return userDetails;
            });

            $('#data-table').DataTable({
                data: userDetails,
                createdRow: function (row, data, dataIndex) {
                    // Set the data-status attribute, and add a class
                    $(row).attr('data-toggle', 'modal');
                    $(row).attr('data-target', '#userModal');
                },
                columns: [
                    { title: "S/N" },
                    { title: "User" },
                    { title: "Email" },
                    { title: "Telephone" },
                    { title: "Balance" },
                    { title: "Status" },
                    { title: "UserID", visible: false }
                ]
            });

            $(document).ready(function () {
                var table = $('#data-table').DataTable();

                $('#data-table tbody').on('click', 'tr', function () {
                    var data = table.row(this).data();
                    var uid = data[data.length - 1];
                    var user = data[data.length - 6];
                    Promise.all(getTotalOfUser(uid)).then(function (value) {
                        //$("#modalTitle").html(user);
                        $("#modalTitle").text(value[0]);
                        $("#totalDeposit").text(value[1]);
                        $("#totalInvest").text(value[2]);
                        $("#pencairan").text(value[3]);

                    });

                });
            });

        }).catch(function (err) {
            console.log(err);
        });
    } else {
        $(".main-content").hide();
    }

}

function getTotalOfUser(userid) {
    var db = firebase.firestore();
    var userRef = db.collection('Pengguna').doc(userid);

    var username = userRef.get().then(function (doc) {
        if (doc.exists) {
            return doc.data().namaLengkap;
        } else {
            console.log("No such document!");
        }
    }).catch(function (error) {
        console.log("Error getting document:", error);
    });

    var totalDeposit = db.collection("TambahDana")
        .where('pengguna', '==', userRef)
        .where('status', '==', 'SELESAI')
        .get()
        .then(function (querySnapshot) {
            var tempDeposit = 0;
            querySnapshot.forEach(function (doc) {
                var deposit = doc.data().jumlah;
                tempDeposit += deposit;
            });
            tempDeposit = "IDR " + tempDeposit.toFixed(0).replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1\.");
            return tempDeposit;
        })
        .catch(function (error) {
            console.log("Error getting documents: ", error);
        });

    var totalInvest = db.collection("Titipan")
        .where("pengguna", '==', userRef)
        .where("aktif", '==', true)
        .get()
        .then(function (querySnapshot) {
            var tempInvest = 0;
            querySnapshot.forEach(function (doc) {
                var invest = doc.data().danaTitipan;

                tempInvest += invest;
            });
            tempInvest = "IDR " + tempInvest.toFixed(0).replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1\.");
            return tempInvest;
        })
        .catch(function (error) {
            console.log("Error getting documents: ", error);
        });

    var pencairan = db.collection("TarikDana")
        .where('dokumenPengguna', '==', userRef)
        .get()
        .then(function (querySnapshot) {
            var tempPen = 0;
            querySnapshot.forEach(function (doc) {
                var pen = doc.data().jumlah;
                tempPen += pen;
            });
            tempPen = "IDR " + tempPen.toFixed(0).replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1\.");
            return tempPen;
        })
        .catch(function (error) {
            console.log("Error getting documents: ", error);
        });

    return [username, totalDeposit, totalInvest, pencairan];
}