var key_setting_on_off_vms = "key_setting_on_off_vms";
var dataSetting = "off";
var myRows = [];
$(document).ready(function () {
    chrome.storage.local.get(key_setting_on_off_vms, function (result) {
        dataSetting = result.key_setting_on_off_vms;
        if (dataSetting == "on") {
            var checkUrl = window.location.href.includes("action=865&model=vti.attendance&view_type=list&menu_id=486");
            var checkUrlOT = window.location.href.includes("action=672&model=ot.registration&view_type=form&menu_id=511&ot=submit");
            if (checkUrl) {
                $("body").append('<div id="loading" style="display:block; position: fixed;height: 100vh;width: 100%;top: 0;left: 0;background: rgba(0,0,0,0.5);" ><div class="loading-container"><div class="loading"></div><div id="loading-text">loading</div></div><div>');
                waitForElementToDisplay("table", function () {
                    $("#loading").css({ "display": "none" })
                    createButton();
                }, 1000, 9000);
            }

            if (checkUrlOT) {
                alert("kì lạ");
                var dataOT = localStorage.getItem("dataOT");
                if (dataOT && dataOT.length > 0) {

                }
            }
        }


    });

});


$(document).ajaxStop(function () {
    if (window.location.href.includes("id=&action=672&model=ot.registration&view_type=form&menu_id=511")) {


    }
});

function hashchanged() {
    location.reload();

}




window.addEventListener("hashchange", hashchanged, false);

function getTimeOT() {

    var data = $(this).load('https://vms.vti.com.vn/web#action=865&model=vti.attendance&view_type=list&menu_id=486');



}


function waitForElementToDisplay(selector, callback, checkFrequencyInMs, timeoutInMs) {
    var startTimeInMs = Date.now();
    (function loopSearch() {
        if (document.querySelector(selector) != null) {
            callback();
            return;
        }
        else {
            setTimeout(function () {
                if (timeoutInMs && Date.now() - startTimeInMs > timeoutInMs)
                    return;
                loopSearch();
            }, checkFrequencyInMs);
        }
    })();
}

function createButton() {
    var buttonLoadTime = document.createElement("button");
    buttonLoadTime.id = "btnGetTimeOT";
    buttonLoadTime.textContent = "Màn Hình Log OT";
    buttonLoadTime.classList.add("btn");
    buttonLoadTime.classList.add("btn-primary");
    buttonLoadTime.onclick = function () {
        logOT();
    };
    $(".o_control_panel").append(buttonLoadTime);

    var btnAutoCheck = document.createElement("button");
    btnAutoCheck.id = "btnAutoCheck";
    btnAutoCheck.onclick = function () {
        autoCheck();
    };
    btnAutoCheck.textContent = "AuTo Chọn Những Ngày OT";
    btnAutoCheck.classList.add("btn");
    btnAutoCheck.classList.add("btn-info");
    $(".o_control_panel").append(btnAutoCheck);


    var btnShowModelTime = document.createElement("button");
    btnShowModelTime.id = "btnShowModelTime";
    btnShowModelTime.onclick = function () {
        download();
    };
    btnShowModelTime.textContent = "Tải về";
    btnShowModelTime.classList.add("btn");
    btnShowModelTime.classList.add("btn-info");
    $(".o_control_panel").append(btnShowModelTime);

}



function autoCheck() {

    var headersText = [];
    var $headers = $("th");

    // Loop through grabbing everything
    var $rows = $(".o_data_row").each(function (index) {
        $cells = $(this).find("td");
        myRows[index] = {};

        $cells.each(function (cellIndex) {
            // Set the header text
            if (headersText[cellIndex] === undefined) {
                headersText[cellIndex] = $($headers[cellIndex]).text();
            }
            // Update the row object with the header/cell combo
            if (cellIndex == 0 || cellIndex == 6 || cellIndex == 7) {
                if (cellIndex == 0) {
                    myRows[index][cellIndex] = $(this).find("input")[0].id;
                }
                else {
                    if (cellIndex == 6) {
                        var dateFrom = strToDate($(this).text());
                        if (dateFrom.getDay() == 0 || dateFrom.getDay() == 6) {
                            myRows[index][cellIndex] = $(this).text()
                        }
                        else {
                            myRows[index][cellIndex] = $(this).text().substring(0, 11) + "18:30:00";
                        }

                    }
                    else {
                        myRows[index][cellIndex] = $(this).text();
                    }

                }


            }

        });
    });
    checkBoxDayOT();

}

function strToDate(dtStr) {
    let dateParts = dtStr.split("/");
    let timeParts = dateParts[2].split(" ")[1].split(":");
    dateParts[2] = dateParts[2].split(" ")[0];
    // month is 0-based, that's why we need dataParts[1] - 1
    return dateObject = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0], timeParts[0], timeParts[1], timeParts[2]);
}


function checkBoxDayOT() {
    var totalTime = 0;
    for (var i = 0; i < myRows.length; i++) {
        var dateFrom = strToDate(myRows[i]["6"]);
        var dateTo = strToDate(myRows[i]["7"]);
        if (dateFrom.getDay() == 0 || dateFrom.getDay() == 6) {
            document.getElementById(myRows[i]["0"]).checked = true;

            totalTime += (dateTo - dateFrom)
        }
        else {

            if (dateTo.getHours() > 18 || (dateTo.getHours() == 18 && dateTo.getMinutes() > 30)) {
                document.getElementById(myRows[i]["0"]).checked = true;

            }
        }

        myRows[i][8] = dateFrom.getDay();
    }

}


function logOT() {

    var arrSubmit = [];
    for (var i = 0; i < myRows.length; i++) {
        if (document.getElementById(myRows[i]["0"]).checked) {
            arrSubmit.push(myRows[i]);

        }
    }
    localStorage.setItem("dataOT", JSON.stringify(arrSubmit));
    debugger;
    window.location.href = "https://vms.vti.com.vn/web#id=&action=672&model=ot.registration&view_type=form&menu_id=511&ot=submit"
}

function download() {
    if (myRows.length <= 0) {
        alert("vui lòng chọn những ngày OT");
        return;
    }
    var textData = "";
    var dayName = "";
    for (var i = 0; i < myRows.length; i++) {
        if (document.getElementById(myRows[i]["0"]).checked) {
            if (myRows[i][8] == 0) {
                dayName = "Chủ Nhật";
            }
            else if (myRows[i][8] == 6) {
                dayName = "Thứ bảy";
            }
            else {
                dayName = "Ngày Bình Thường";
            }
            textData += Number(i + 1) + ": " + myRows[i][6] + " - " + myRows[i][7] + " -> " + dayName + "\n "


        }
    }
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(textData));
    element.setAttribute('download', "dataOT.txt");

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

