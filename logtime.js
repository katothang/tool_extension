var key_setting_on_off = "key_setting_on_off";
var dataSetting = "off";
var idProject = 0
var urlTableTask = "https://redmine.vti.com.vn/issues?utf8=%E2%9C%93&set_filter=1&sort=id%3Adesc&f%5B%5D=assigned_to_id&op%5Bassigned_to_id%5D=%3D&v%5Bassigned_to_id%5D%5B%5D=me&f%5B%5D=&c%5B%5D=tracker&c%5B%5D=status&c%5B%5D=due_date&c%5B%5D=subject&c%5B%5D=assigned_to&c%5B%5D=done_ratio&c%5B%5D=estimated_hours&c%5B%5D=spent_hours&c%5B%5D=start_date&c%5B%5D=updated_on&group_by=&t%5B%5D=estimated_hours&t%5B%5D=spent_hours&t%5B%5D=";
var urlTableTaskByProject =

  $(document).ready(function () {

    chrome.storage.local.get(key_setting_on_off, function (result) {
      dataSetting = result.key_setting_on_off;
      if (dataSetting == "on") {
        $("body").append('<div id="loading" style="display:block; position: fixed;height: 100vh;width: 100%;top: 0;left: 0;background: rgba(0,0,0,0.5);" ><div class="loading-container"><div class="loading"></div><div id="loading-text">loading</div></div><div>');

        $("form").find("p")[3].remove();

        $("form").find("div").prepend('<p><label for="time_entry_spent_end">Tới ngày:<span class="required"> *</span></label><input size="10"  type="date" name="time_entry[spent_end]" id="time_entry_spent_end" class="date"></p>');
        $("form").find("div").prepend('<p><label for="time_entry_spent_on">Từ Ngày:<span class="required"> *</span></label><input size="10" type="date" name="time_entry[spent_on]" id="time_entry_spent_on" class="date">');
        $("form").find("div").prepend('<p><label for="time_entry_spent_on">Log cả T7 và CN:<span class="required"> *</span></label><input type="checkbox" id="logallday" name="logall" value="1"> <b>log task với Issue tự điền</b>  <input type="checkbox" id="findtask" name="findtask" value="1"><b style="margin-left: 20px;"><tr>');
        $("form").append('<input type="button" class="logall" value="Log Time"/>')
        $("form").find(":submit").remove();

        $(".logall").click(function () {
          var dateTo = $("#time_entry_spent_on").val();
          var dateEnd = $("#time_entry_spent_end").val();
          var comment = $("#time_entry_comments").val();
          var activity = $("#time_entry_activity_id").val();
          var projectName = $("#time_entry_project_id").val();
          var atLeastOneIsChecked = $('input[name="ids[]"]:checked');

          if ("" == projectName) {
            alert("Vui lòng chọn project");
            return;
          }
          if ("" == dateTo) {
            alert("Nhập ngày bắt đầu");
            return;
          }
          if ("" == dateEnd) {
            alert("Nhập ngày kết thúc..!");
            return;
          }
          if ("" == comment) {
            alert("Nhập comment..!");
            return;
          }
          if ("" == activity) {
            alert("Nhập Activity..!");
            return;
          }
          if (date_diff_indays(dateTo, dateEnd) < 0) {
            alert("Ngày bắt đầu lớn hơn ngày kết thúc kiểm tra lại ..!");
            return;
          }
          if (atLeastOneIsChecked.length <= 0 && !$('#findtask')[0].checked) {
            alert("Bạn chưa chọn task để log time..!");
            return;
          }

          if ($('#time_entry_issue').find('a').length <= 0 && $('#findtask')[0].checked) {
            alert("vui lòng nhập task để log time!");
            return;
          }

          var countTime = 0;

          var lstTaskandTime = [];
          var lstDate = [];
          var lstTask = [];
          var fromDate = new Date($("#time_entry_spent_on").val());
          var toDate = new Date($("#time_entry_spent_end").val());
          for (var d = fromDate; d <= toDate; d.setDate(d.getDate() + 1)) {
            if ($('#logallday').is(":checked")) {
              var dateString = d.toString();
              lstDate.push(formatDate(dateString));
              countTime += 8;
            }
            else {
              if (d.getDay() != 0 && d.getDay() != 6) {
                var dateString = d.toString();
                lstDate.push(formatDate(dateString));
                countTime += 8;
              }
            }


          }

          if (lstDate.length <= 0) {
            alert("số ngày logtime phải lớn hơn 0 ngày trừ thứ 7 chủ nhật..!");
            return;
          }
          $("#loading").css({ "display": "block" })

          var countTask = atLeastOneIsChecked.length;
          var timeOfTask = countTime / countTask;

          var i;
          for (i = 0; i < atLeastOneIsChecked.length; i++) {
            var keyTime = atLeastOneIsChecked[i].value;
            lstTaskandTime.push({ keyTime: timeOfTask });
            lstTask.push(keyTime);
          }

          if ($('#findtask')[0].checked) {
            lstTask = [];
            lstTask.push($('#time_entry_issue_id')[0].value);
          }


          lstTask = lstTask.reverse();

          var lstLogTime = [];
          var timeDate = 8;
          if (lstTask.length < lstDate.length) {
            for (var i = lstTask.length; i <= lstDate.length; i++) {
              lstTask.unshift(lstTask[0]);
            }
          }

          while (lstDate.length > 0 && lstTask.length > 0) {
            lstLogTime.push({ projectName: projectName, date: lstDate[0], issue: lstTask[0], time: timeDate, activity: activity, comment: comment })
            lstDate.splice(0, 1);
            lstTask.splice(0, 1);
          }
          logTime(lstLogTime, 0);

        });
        var idProject = localStorage.getItem('idProject');
        if (idProject > 0) {
          $("#time_entry_project_id").val(idProject).change();
        }
        else {
          $("form").find("div").append($("form").find("div").append('<div id="table-wrapper">Vui lòng chọn project cần log time</div>'));
          $("#loading").css({ "display": "none" });
        }

      }
    });



  })

// fillter task by project 
$('#time_entry_project_id').on('change', function () {
  idProject = this.value;
  try {
    $("#loading").css({ "display": "block" });
    initTask(idProject);
    localStorage.setItem('idProject', idProject);

  }
  catch {
    $("#loading").css({ "display": "none" });
  }

});


function logTime(lstLogTime, loop) {
  //ajax
  // load token
  var back_url = "https://redmine.vti.com.vn/issues/" + lstLogTime[loop].issue;
  var issue_id = lstLogTime[loop].issue;
  var spent_on = lstLogTime[loop].date;
  var comments = lstLogTime[loop].comment;
  var projectNames = lstLogTime[loop].projectName;
  var activity_id = lstLogTime[loop].activity;;
  var hours = lstLogTime[loop].time
  $.ajax({
    type: 'GET',
    url: "https://redmine.vti.com.vn/issues/" + issue_id + "/time_entries/new",
    success: function (resultData) {
      var token = $($.parseHTML(resultData)).find('input[name=authenticity_token]')[0].value;
      var myKeyVals = { 'authenticity_token': token, 'back_url': back_url, 'project_id': projectNames, 'issue_id': issue_id, 'time_entry[issue_id]': issue_id, 'time_entry[spent_on]': spent_on, 'time_entry[hours]': hours, 'time_entry[comments]': comments, 'time_entry[activity_id]': activity_id, 'commit': 'Create' }
      $.ajax({
        type: 'POST',
        async: false,
        url: "https://redmine.vti.com.vn/time_entries",
        data: myKeyVals,
        dataType: "text",
        error: function (request, error) {
          console.log(arguments);
          alert(" Can't do because: " + error);
        },
        success: function (resultData) {
          loop++;
          if (loop < lstLogTime.length) {
            logTime(lstLogTime, loop);
          }
          else {
            $("#loading").css({ "display": "none" })
            location.reload();
          }

        }
      });
    }
  });
}

function formatDate(date) {
  var d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2)
    month = '0' + month;
  if (day.length < 2)
    day = '0' + day;

  return [year, month, day].join('-');
}

$(document).ajaxStop(function () {
  $("#loading").css({ "display": "none" })
});

var date_diff_indays = function (date1, date2) {
  dt1 = new Date(date1);
  dt2 = new Date(date2);
  return Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate())) / (1000 * 60 * 60 * 24));
}

function getData(key) {
  return localStorage[key];
}

function saveData(key, data) {
  localStorage[key] = data;
}

function initTask(idProject) {

  $("#table-wrapper").remove();
  if (idProject > 0) {
    urlTableTask = "https://redmine.vti.com.vn/issues?utf8=%E2%9C%93&set_filter=1&sort=id%3Adesc&f%5B%5D=assigned_to_id&op%5Bassigned_to_id%5D=%3D&v%5Bassigned_to_id%5D%5B%5D=me&f%5B%5D=project_id&op%5Bproject_id%5D=%3D&v%5Bproject_id%5D%5B%5D=" + idProject + "&f%5B%5D=&c%5B%5D=tracker&c%5B%5D=status&c%5B%5D=due_date&c%5B%5D=subject&c%5B%5D=assigned_to&c%5B%5D=done_ratio&c%5B%5D=estimated_hours&c%5B%5D=spent_hours&c%5B%5D=start_date&c%5B%5D=updated_on&group_by=&t%5B%5D=estimated_hours&t%5B%5D=spent_hours&t%5B%5D=";
  }
  console.log(urlTableTask);
  var dataTask = "";
  var dataTime = "";


  $.ajax
    ({
      type: "GET",
      url: urlTableTask,
      success: function (html) {

        $.ajax
          ({
            type: "GET",
            url: "https://redmine.vti.com.vn/issues?per_page=100&skip_issues_tree_redirect=true",
            success: function (html) {
              try {
                dataTask = $($.parseHTML(html)).find(".autoscroll")[0].outerHTML
                $.ajax
                  ({
                    type: "GET",
                    url: "https://redmine.vti.com.vn/time_entries?utf8=%E2%9C%93&set_filter=1&sort=spent_on%3Adesc&f%5B%5D=spent_on&op%5Bspent_on%5D=*&f%5B%5D=user_id&op%5Buser_id%5D=%3D&v%5Buser_id%5D%5B%5D=me&f%5B%5D=&c%5B%5D=spent_on&c%5B%5D=user&c%5B%5D=activity&c%5B%5D=issue&c%5B%5D=comments&c%5B%5D=hours&group_by=&t%5B%5D=hours&t%5B%5D=",
                    success: function (html) {
                      try {
                        dataTime = $($.parseHTML(html)).find(".autoscroll")[0].outerHTML
                      }
                      catch {
                        dataTime = "Chưa log time lần nào ở project này";
                      }

                      $("form").find("div").append('<div id="table-wrapper"><div id="table-scroll"><table><tr><td>' + dataTask + '</td><td class="dataTime">' + dataTime + '</td></tr></table></div></div>');
                      $("#loading").css({ "display": "none" });
                    }
                  });
              }
              catch {
                $("#loading").css({ "display": "none" });
              }

            }
          });



      }
    });
}