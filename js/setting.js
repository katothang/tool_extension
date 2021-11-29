var key_setting_on_off = "key_setting_on_off";
var key_setting_on_off_vms = "key_setting_on_off_vms";
var dataSetting = "off";
var dataSettingVms = "off";

$(document).ready(function () {

    dataSetting = getData(key_setting_on_off);
    dataSettingVms = getData(key_setting_on_off_vms);
    if (dataSetting == "on") {
        chrome.storage.local.set({ key_setting_on_off: dataSetting });
        document.getElementById("on").checked = true;
        document.getElementById("off").checked = false;
    }
    else {
        chrome.storage.local.set({ key_setting_on_off: "off" });
        document.getElementById("on").checked = false;
        document.getElementById("off").checked = true;

    }

    if (dataSettingVms == "on") {
        chrome.storage.local.set({ key_setting_on_off_vms: "on" });
        document.getElementById("on_vms").checked = true;
        document.getElementById("off_vms").checked = false;

    }
    else {
        chrome.storage.local.set({ key_setting_on_off_vms: "off" });
        document.getElementById("on_vms").checked = false;
        document.getElementById("off_vms").checked = true;

    }



});

function getData(key) {
    return localStorage[key];
}

function saveData(key, data) {
    chrome.storage.local.set({ key: data });
    localStorage[key] = data;
}

function settingApp() {

    if (document.getElementById("on").checked) {
        saveData(key_setting_on_off, "on");
    } else {
        saveData(key_setting_on_off, "off");

    }

    if (document.getElementById("on_vms").checked) {
        saveData(key_setting_on_off_vms, "on");

    }
    else {
        saveData(key_setting_on_off_vms, "off");

    }
}

document.getElementById("on").addEventListener("click", settingApp);
document.getElementById("off").addEventListener("click", settingApp);
document.getElementById("on_vms").addEventListener("click", settingApp);
document.getElementById("off_vms").addEventListener("click", settingApp);

