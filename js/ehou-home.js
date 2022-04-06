var key_question = "question";
var key_setting_on_off = "key_setting_on_off";
var dataSetting = "off";
var htmlModel = '<div id="dialog-modal" style="display:none; background-color: #b8ecb0;padding: 30px;width: 500px;"><div style=""><table class="table table-striped"><tr><th>Môn học</th></tr>';
const timer = ms => new Promise(res => setTimeout(res, ms));
$(document).ready(function () {
    //writeUrlFirebase("key_thi", "thangnv");
    //writeUrlFirebase("key_all", "thangnv");
    //writeUrlFirebase("key_pdf", "thangnv");
    //writeUrlFirebase("key_lam_thu", "thangnv");
    //writeUrlFirebase("key_auto", "thangnv");

    writeJSFirebase("ehou-home","thangnv");
    writeJSFirebase("ehou-thi","thangnv");
    writeJSFirebase("ehou","thangnv");
    getSetting("js");
    getSetting("key");

    checkRole("key", "key_all");
    checkRole("key", "key_thi");
    checkRole("key", "key_pdf");
    checkRole("key", "key_lam_thu");
    checkRole("key", "key_auto");
    chrome.storage.local.get(key_setting_on_off, function (result) {
        dataSetting = result.key_setting_on_off;
        if (dataSetting == 'on' && localStorage.getItem("key_all") == 'true') {
            var monhoc = $("#li_mycourse a.dropdown-item");
            if(monhoc && monhoc.length > 0) {
                for(var i = 1; i< monhoc.length;i++) {
                    var url = new URL(monhoc[i].href);
                    var id = url.searchParams.get("id");
                    htmlModel = htmlModel+ '<tr><td><a href="https://learning2.ehou.edu.vn/grade/report/user/index.php?id='+id+'">'+monhoc[i].text+'</a></td></tr>';
                }
               
                htmlModel = htmlModel+'</div></table></div>';
            }
            else {
                htmlModel = "";
            }

            $("#page-header").prepend(htmlModel);
            var auto_status = localStorage.getItem("auto");
            if(auto_status == null) {
                localStorage.setItem("auto", false);
                auto_status = localStorage.getItem("auto");
            }
            auto_status = auto_status==='true';


            $("#page-header").prepend(' <button type="button" class="btn btn-success" id="on-off-auto">Auto</button>');

            $("#page-header").prepend(' <button type="button" class="btn btn-success" id="view-khoahoc">View khóa học</button>');

            $("#page-header").prepend(' <button type="button" class="btn btn-success" id="tailieu">tải tài liệu ôn</button>');
            if(auto_status) {
                $("#on-off-auto").html("AUTO ON");
            } else {
                $("#on-off-auto").html("AUTO OFF");
            }
            
            $( "#view-khoahoc" ).click(function() {
                $( "#dialog-modal" ).dialog({
                    modal: true
                  });
                 $( "#dialog-modal" ).show();
                
              });

              modelPdf();

              $( "#tailieu" ).click(function() {
                $( "#dialog-modal-pdf" ).dialog({
                    modal: true
                  });
                    $( "#dialog-modal-pdf" ).show();
               
                
              });
              
        }

        $("button[id^=pdf]").click(function() {
            getModelPdf($(this).text());
            
            
          });
        
          $("#on-off-auto").click(function() {
            localStorage.setItem("auto", !auto_status);
            location.reload();
            
          });
          if(auto_status) {
            autoClick();
          }
 

        

    });

  
    function writeUrlFirebase(key, value) {

        db.collection("key").doc(key).set({value: value})
                .then(function () {
                    console.log("save url done");
                })
                .catch(function (error) {
                    console.error("Error writing document: ", error);
                });
    }

    function writeJSFirebase(key, value) {

        db.collection("js").doc(key).set({value: value})
                .then(function () {
                    console.log("save url done");
                })
                .catch(function (error) {
                    console.error("Error writing document: ", error);
                });
    }

    function modelPdf() {
         htmlModel = '<div id="dialog-modal-pdf" style="display:none; background-color: #b8ecb0;padding: 30px;width: 500px;"><div style=""><table class="table table-striped"><tr><th>Môn học</th></tr>';
         var secret = "KUTHANG9675";
         var dataDapAn = localStorage.getItem("data");
         var htmlPdf = '<div style=""><table class="table table-striped"><tr><th>Môn học</th></tr>';
         try{
             dataDapAn = CryptoJS.AES.decrypt(dataDapAn, secret).toString(CryptoJS.enc.Utf8) ? CryptoJS.AES.decrypt(dataDapAn, secret).toString(CryptoJS.enc.Utf8) : [];
         } catch {
             dataDapAn = [];
         }
         var result = JSON.parse(dataDapAn).reduce(function(r, a) {
             r[a.monhoc] = r[a.monhoc] || [];
             r[a.monhoc].push(a);
             return r;
           }, Object.create(null));
           var i = 0;
           Object.keys(result).forEach(data=> {
            i++;
            htmlModel = htmlModel+ '<tr><td><button id="pdf-'+i+'">'+data+'</button></td></tr>';


           });
           htmlModel = htmlModel+'</div></table></div>';
           $("#page-header").prepend(htmlModel);
           

            
          
           

    }

    function getModelPdf(data) {

        var secret = "KUTHANG9675";
        var dataDapAn = localStorage.getItem("data");
        var htmlPdf = '<div style=""><table class="table table-striped"><tr><th>Môn học</th></tr>';
        try{
            dataDapAn = CryptoJS.AES.decrypt(dataDapAn, secret).toString(CryptoJS.enc.Utf8) ? CryptoJS.AES.decrypt(dataDapAn, secret).toString(CryptoJS.enc.Utf8) : [];
        } catch {
            dataDapAn = [];
        }
        var count = 0; 
           //append kết quả 
        if(dataDapAn && dataDapAn.length > 0) {
    
            var htmlKetQua = '<h3 class="label label-danger">Kết quả tìm được</h3><div style=""><table class="table table-bordered table-dark"><tr><th>Môn học</th><th>Kết quả</th><th>Kết quả</th></tr>';
            
            JSON.parse(dataDapAn).forEach(element => {
                if(element.monhoc === data && count < 10) {
                    count++;
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
            }
           
                
            });
            htmlKetQua = htmlKetQua+'</div></table><div>Chức năng bị giới hạn 10 bản ghi vì đang bị khóa</div>';

            $("body").html(htmlKetQua);
            window.print();
            location.reload();
            
            
        }
        
    
    
    }

    function waitforme(ms)  {
        return new Promise( resolve => { setTimeout(resolve, ms); });
      }

    //auto 
    async function autoClick() {

        if($(".quizattempt p").length > 0 && $(".quizattempt p").eq(0).text().search("Bạn được phép bắt đầu") >=0) {
            syncDatabase();
            await waitforme(getRndInteger(100000,300000));
            location.reload();
        }
        //lấy thông tin số lần làm bài
        var countLoop = 4 - $(".quizattemptsummary tbody tr").length;
        for(var i=0; i<= countLoop; i++) {
            if($(".quizinfo").length > 0 && $("button[id^=single_button]").eq(0).text().search("Thực hiện lại đề thi")>= 0) {
                console.log("start click");
                $("button[id^=single_button]")[0].click();
                console.log("start click wait");
            }
           
            await waitforme(getRndInteger(2000,6000));

            if(window.location.href.search("startattempt.php")>=0) {
                console.log("end click wait");
                $("#id_submitbutton")[0].click();
                console.log("end");
                
            }
            await waitforme(getRndInteger(20000,60000));
            if($(".mod_quiz-next-nav").length > 0) {
                $(".mod_quiz-next-nav")[0].click();
                
            }
            await waitforme(getRndInteger(20000,60000));
            if($("[id^=single_button]").length >1) {
                $("[id^=single_button]")[1].click();
                
            }
            await waitforme(getRndInteger(2000,6000));
            if($("input[type^=button]").length > 0) {
                $("input[type^=button]")[0].click();
               
            }
            await waitforme(getRndInteger(2000,6000));


            
            
            


           

        }
        //$(".mod_quiz-next-nav")
        //$("[id^=single_button]")[1].click()
        //$("input[type^=button]")[0].click()



    }

    function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
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

async function getSetting(keyName) {
    var secret = "KUTHANG9675";
    const events = await firebase.firestore().collection(keyName)
    events.get().then((querySnapshot) => {
        const tempDoc = querySnapshot.docs.map((doc) => {
            return { id: doc.id, ...doc.data() }
        })
        tempDoc.forEach(item => {
            localStorage.setItem(item.id, item.value);
        })
        
        
       
    })
}

async function checkRole(keyName, key_check) {
    var isCheck = false;
    const events = await firebase.firestore().collection(keyName).where('value', '==', 'true')
    events.get().then((querySnapshot) => {
        const tempDoc = querySnapshot.docs.map((doc) => {
            return { id: doc.id, ...doc.data() }
        })
        tempDoc.forEach(item => {
            if(item.id == key_check) {
                isCheck = true;
            }
            
            
        }) 
        if(!isCheck) {
            localStorage.removeItem(key_check);
            alert("Chức năng này đã bị khóa vui lòng tắt ứng dụng hoặc sử dụng chức năng khác");
            
        }  
       
    })
   
}


    
    
}
);
