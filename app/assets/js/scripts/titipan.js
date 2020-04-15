function getTitipan(){
    var db = firebase.firestore();

    var titipan = db.collection("Titipan"); 


        titipan.get().then(function(querySnapshot) {
            var sn = 0;
            var titipanArr = [];
            querySnapshot.forEach(function(doc) {
                sn++;
                let aktif = doc.data().aktif;
                let danaTitipan = doc.data().danaTitipan;
                danaTitipan = 'IDR ' + danaTitipan.toFixed(0).replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1\.");
                let keuntungan = doc.data().keuntungan;
                keuntungan = 'IDR ' + keuntungan.toFixed(0).replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1\.");
                let komisiTrader = doc.data().komisiTrader;
                komisiTrader = 'IDR ' + komisiTrader.toFixed(0).replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1\.");
                let tanggalBerakhir = doc.data().tanggalBerakhir;
                let tanggalMulai = doc.data().tanggalMulai;

                if(tanggalBerakhir != null){
                    tanggalBerakhir = tanggalBerakhir.toDate();
                }else{
                    tanggalBerakhir = ' - '
                }
                if (tanggalMulai != null){
                    tanggalMulai = tanggalMulai.toDate();
                }else{
                    tanggalMulai = " - "
                }
                

                titipanArr.push([sn,aktif,danaTitipan,keuntungan,komisiTrader,tanggalBerakhir, tanggalMulai]);
                
                return titipanArr;
            });
            
            $('#data-table').DataTable({
                data: titipanArr,
                columns: [
                    { title: "#" },
                    { title: "Aktif" },
                    { title: "Dana Titipan" },
                    { title: "Keuntungan"},
                    { title: "Komisi Trader"},
                    { title: "Tanggal Berakhir"},
                    { title: "TanggalMulai"},
                ]
            });

        }).catch(function(err){
            console.log(err);
        });
}