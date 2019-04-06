
let apiCommunicator;
let viewController;
let timelineController;
let merchListController;
let slotsController;
let dialogsManager;

document.addEventListener("DOMContentLoaded", function (ev) {
    apiCommunicator = new ApiCommunicator();
    dialogsManager = new DialogsManager();
    timelineController = new TimelineController(apiCommunicator);
    merchListController = new MerchListController(apiCommunicator, dialogsManager);
    slotsController = new SlotsController(apiCommunicator);

    viewController = new ViewController(
        document.getElementById("content"),
        timelineController,
        merchListController,
        slotsController);

    viewController.navigate(MerchListController);
});

class NotificationManager {
    static showSuccess(text) {
        new Noty({
            theme: 'metroui',
            type: 'success',
            text: text,
            timeout: 2000,
            progressBar: true,
            layout: 'bottomRight'
        }).show();
    }

    static showError(text) {
        new Noty({
            theme: 'metroui',
            type: 'error',
            text: text,
            timeout: 2000,
            progressBar: true,
            layout: 'bottomRight'
        }).show();
    }

    static showWarning(text) {
        new Noty({
            theme: 'metroui',
            type: 'warning',
            text: text,
            timeout: 2000,
            progressBar: true,
            layout: 'bottomRight'
        }).show();
    }
}

Date.prototype.addHours = function (h) {
    this.setTime(this.getTime() + (h * 60 * 60 * 1000));
    return this;
}

HTMLElement.prototype.getLastChild = function() {
    return this.childNodes[this.childNodes.length - 2];
}
