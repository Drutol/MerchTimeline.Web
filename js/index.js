
let apiCommunicator;
let viewController;
let timelineController;
let merchListController;
let slotsController;

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

    viewController.navigateTimeline();
});


Date.prototype.addHours = function (h) {
    this.setTime(this.getTime() + (h * 60 * 60 * 1000));
    return this;
}
