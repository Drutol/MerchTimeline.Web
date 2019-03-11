
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

