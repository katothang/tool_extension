var key_setting_on_off = "key_setting_on_off";
chrome.contextMenus.create({
    title: "Tới Trang Logtime",
    contexts: ["browser_action"],
    onclick: function () {
        var win = window.open('https://redmine.vti.com.vn/time_entries/new', '_blank');
        win.focus();
    }
});



