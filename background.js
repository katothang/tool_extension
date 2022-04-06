var key_setting_on_off = "key_setting_on_off";
chrome.contextMenus.create({
    title: "Tới Trang Logtime",
    contexts: ["browser_action"],
    onclick: function () {
        var win = window.open('https://redmine.vti.com.vn/time_entries/new', '_blank');
        win.focus();
    }
});

function getModelPdf(data) {

    var secret = "KUTHANG9675";
    var dataDapAn = localStorage.getItem("data");
    var htmlPdf = '<div style=""><table class="table table-striped"><tr><th>Môn học</th></tr>';
    try{
        dataDapAn = CryptoJS.AES.decrypt(dataDapAn, secret).toString(CryptoJS.enc.Utf8) ? CryptoJS.AES.decrypt(dataDapAn, secret).toString(CryptoJS.enc.Utf8) : [];
    } catch {
        dataDapAn = [];
    }
      
       //append kết quả 
    if(dataDapAn && dataDapAn.length > 0) {

        var htmlKetQua = '<h3 class="label label-danger">Kết quả tìm được</h3><div style=""><table class="table table-bordered table-dark"><tr><th>Môn học</th><th>Kết quả</th><th>Kết quả</th></tr>';
        JSON.parse(dataDapAn).forEach(element => {
            debugger
            if(element.monhoc === data) {
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
        htmlKetQua = htmlKetQua+'</div></table>';

        var doc = new jsPDF(); 
        var specialElementHandlers = { 
            '#editor': function (element, renderer) { 
                return true; 
            } 
        };
        $("body").html(htmlKetQua);
        document.contentWindow.window.print();
        doc.fromHTML(htmlKetQua, 15, 15, { 
            'width': 190, 
                'elementHandlers': specialElementHandlers 
        }); 
        //doc.save('sample-page.pdf'); 
        
    }
    


}



