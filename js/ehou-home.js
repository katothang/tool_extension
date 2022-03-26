var key_question = "question";
var key_setting_on_off = "key_setting_on_off";
var dataSetting = "off";
var htmlModel = '<div id="dialog-modal" style="display:none; background-color: #b8ecb0;padding: 30px;width: 500px;"><div style=""><table class="table table-striped"><tr><th>Môn học</th></tr>';

$(document).ready(function () {
    chrome.storage.local.get(key_setting_on_off, function (result) {
        dataSetting = result.key_setting_on_off;
        if (dataSetting == 'on') {
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
            $("#page-header").prepend(' <button type="button" class="btn btn-success" id="view-khoahoc">View khóa học</button>');

            $( "#view-khoahoc" ).click(function() {
                $( "#dialog-modal" ).dialog({
                    modal: true
                  });
                 $( "#dialog-modal" ).show();
                
              });
        }
    });
}
);
