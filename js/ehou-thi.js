

var key_question = "question";
var key_setting_on_off = "key_setting_on_off";
var dataSetting = "off";

$(document).ready(function () {
    chrome.storage.local.get(key_setting_on_off, function (result) {
        dataSetting = result.key_setting_on_off;
        if(dataSetting == 'on' && localStorage.getItem("key_thi") == 'true') {
            syncDatabase();
            
            var secret = "KUTHANG9675";
            var dataDapAn = localStorage.getItem("data");
            dataDapAn = CryptoJS.AES.decrypt(dataDapAn, secret).toString(CryptoJS.enc.Utf8);

    var listResult = [];
    var lengthQuestion = $("div[id^=question]").length
    for (var i = 0; i < lengthQuestion; i++) {
        var dataResult = {};
        var invalid = false;
        var ansewer = false;
        var monhoc = $(".page-header-headings h1").eq(0).html();
        var dom = $("div[id^=question]")[i];
        
        //append end
        var question = $('.qtext', $(dom)).eq(0).html();
        var questionSearch = $('.qtext p', $(dom)).eq(0).html();
        ansewer = $('.correct', $(dom)).eq(0).html();
        invalid = $('.incorrect', $(dom)).eq(0).html();
        feedback = $('.feedback', $(dom)).eq(0).html();
        dataResult = { monhoc: monhoc ? monhoc : false, question: question ? question : '', invalid: invalid ? invalid : false, ansewer: ansewer ? ansewer : false, feedback: feedback?feedback: false };
       //writeFirebase(dataResult);
        //data
        var dapan = getDapAn(JSON.parse(dataDapAn), questionSearch.trim());
        var cauhoi = "";
        var htmlKetQua = "";
        var mon = "";
        //chọn kết quả
        var luachon = $(".answer [class^=r]", $("div[id^=question]")[i]);
        var check = false;
        for(var j=0; j<luachon.length; j++) {
            var luachonTxt = $("p", luachon[j]).eq(0).text();
            if(getCheckDapAn(JSON.parse(dataDapAn), questionSearch.trim(), luachonTxt)) {
                $("input", luachon[j])[0].checked = true;
                check = true;
            }
            
        }
        if(!check) {
            $("input", luachon[0])[0].checked = true;
        }

        //append kết quả 
        if(dapan && dapan.length > 0) {
            htmlKetQua = htmlKetQua + '<h3 class="label label-danger">Kết quả tìm được</h3><div style="position: relative;height: 200px;overflow: auto;display: block;"><table class="table table-bordered table-dark"><tr><th>Môn học</th><th>Kết quả</th><th>Kết quả</th></tr>';
            dapan.forEach(element => {
                if(element.ansewer) {
                    cauhoi = element.question.replaceAll("name=", "a=").replaceAll("id=", "b=");
                    dapan = element.ansewer.replaceAll("name=", "a=").replaceAll("id=", "b=");
                    mon = element.monhoc;
                    htmlKetQua = htmlKetQua+ '<tr><td>'+mon+'</td><td>'+cauhoi+'</td><td>'+dapan+'</td></tr>';
                } else if(element.feedback) {
                    mon = element.monhoc;
                    cauhoi = element.question.replaceAll("name=", "a=").replaceAll("id=", "b=");
                    dapan = element.feedback;
                    htmlKetQua = htmlKetQua+ '<tr><td>'+mon+'</td><td>'+cauhoi+'</td><td>'+dapan+'</td></tr>';
                } else if(element.invalid) {
                    mon = element.monhoc;
                    cauhoi = element.question.replaceAll("name=", "a=").replaceAll("id=", "b=");
                    dapan = element.invalid.replaceAll("name=", "a=").replaceAll("id=", "b=");
                    htmlKetQua = htmlKetQua+ '<tr><td>'+mon+'</td><td>'+cauhoi+'</td><td>'+dapan+'</td></tr>';
                } else {
                    dapan = "";
                }

                
            });
            htmlKetQua = htmlKetQua+'</div></table>';
            $(dom).append($(htmlKetQua));
        }
        

        
        
        listResult.push(dataResult);


    }
    var listOld = localStorage.getItem(key_question);
    var jsonSave = JSON.stringify(listResult);
    if (listOld) {
        listOld = JSON.parse(listOld);
        listResult.push(...listOld);
    }
    $("#page-content").prepend(' <button type="button" class="btn btn-success" id="syncData">Đồng bộ data</button>');
    $( "#syncData" ).click(function() {
        syncDatabase();
        alert("Đồng bộ thành công vui lòng tải lại trang");
        
      });

    function readFirebase(txt) {
        var docRef = db.collection("cauhoi");
        docRef.where('question', '>=', txt).get().then(function (doc) {

            var msg = "test";
            if (doc.exists) {
                //doc.data()
                console.log({ type: "result", status: "success", data: doc.data(), request: msg });
            } else {
                //No such document!
                console.log({ type: "result", status: "error", data: 'No such document!', request: msg });
            }
        }).catch(function (error) {
            //Error getting document:",error
            console.log({ type: "result", status: "error", data: error, request: msg });
        });

    }

    async function syncDatabase() {
        var secret = "KUTHANG9675";
        const events = await firebase.firestore().collection('cauhoi')
        events.get().then((querySnapshot) => {
            const tempDoc = querySnapshot.docs.map((doc) => {
                return { id: doc.id, ...doc.data() }
            })
            localStorage.setItem("data", CryptoJS.AES.encrypt(JSON.stringify(tempDoc), secret));
            
           
        })
    }

    async function writeFirebase(data) {
        let myPromise = new Promise(function (resolve) {
            console.log("write database");
            db.collection("cauhoi").doc(uuid()).set(data)
                .then(function () {
                    console.log("Document successfully written!");
                })
                .catch(function (error) {
                    console.error("Error writing document: ", error);
                });
        });
        await myPromise;


    }

    function uuid() {
        var uuid = "", i, random;

        for (i = 0; i < 32; i++) {
            random = Math.random() * 16 | 0;

            if (i == 8 || i == 12 || i == 16 || i == 20) {
                uuid += "-";
            }

            uuid += (i == 12 ? 4 : (i == 16 ? (random & 3 | 8) : random)).toString(16);
        }

        return uuid;
    }

    function getDapAn(data, txtSearch) {
        try{
            var result = data.filter(x => x.question? x.question.search(txtSearch) > 0: true);
            if(result && result.length > 0) {
                return result;
            }
    
            
             result = data.filter(x => x.question? x.question.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/gi, '').search(txtSearch.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/gi, '')) > 0: true);
            //console.log(JSON.stringify(data));
            return result;
        } catch {
            return [];
        }
        
        
    }

    // lay thong tin 
    function getCheckDapAn(data, txtSearch, luachon) {
        try {
            var result = data.filter(x => x.question? x.question.search(txtSearch) > 0: true);
            if(result && result.length > 0) {
                
                 result1 = result.filter(x => x.ansewer? x.ansewer.search(luachon) > 0: x.feedback? x.feedback.search(luachon)>=0 : false);;
                 if(result1 && result1.length > 0) {
                    return true;
               }
            }
    
             result = data.filter(x => x.question? x.question.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/gi, '').search(txtSearch.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/gi, '')) > 0: true);
            if(result && result.length > 0) {
                result1 = result.filter(x => x.ansewer? x.ansewer.search(luachon) > 0: x.feedback? x.feedback.search(luachon) >= 0 : false);;
               
                if(result1 && result1.length > 0) {
                    return true;
               }
               
            }
            return false;

        } catch {
            return false;
        }
        

        
    }
    
        }
    
    });


});