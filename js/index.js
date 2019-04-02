
let apiCommunicator;
let viewController;
let timelineController;
let merchListController;
let slotsController;
let notificationManager;

document.addEventListener("DOMContentLoaded", function (ev) {
    apiCommunicator = new ApiCommunicator();
    timelineController = new TimelineController(apiCommunicator);
    merchListController = new MerchListController(apiCommunicator);
    slotsController = new SlotsController(apiCommunicator);

    viewController = new ViewController(
        document.getElementById("content"),
        timelineController,
        merchListController,
        slotsController);

    viewController.navigate(TimelineController);
});

class NotificationManager {
    showSuccess(text) {
        new Noty({
            theme: 'metroui',
            type: 'success',
            text: text,
            timeout: 2000,
            progressBar: true,
            layout: 'bottomRight'
        }).show();
    }

    showError(text) {
        new Noty({
            theme: 'metroui',
            type: 'error',
            text: text,
            timeout: 2000,
            progressBar: true,
            layout: 'bottomRight'
        }).show();
    }

    showWarning(text) {
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
