
let apiCommunicator;
let viewController;
let timelineController;
let merchListController;
let slotsController;

document.addEventListener("DOMContentLoaded", function(ev) {
    apiCommunicator = new ApiCommunicator();
    viewController = new ViewController(document.getElementById("content"));
    timelineController = new TimelineController(apiCommunicator);
    merchListController = new MerchListController(apiCommunicator);
    slotsController = new SlotsController(apiCommunicator);

    document.getElementById("button-timeline").onclick = function () {
        viewController.navigateTimeline();
        timelineController.navigatedTo();
    };
    
    document.getElementById("button-merch").onclick = function () {
        viewController.navigateMerch();
        merchListController.navigatedTo();
    };

    document.getElementById("button-slots").onclick = function () {
        viewController.navigateSlots();
        slotsController.navigatedTo();
    };

    viewController.navigateSlots();
    slotsController.navigatedTo();
});

