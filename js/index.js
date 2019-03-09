
var apiCommunicator;
var viewController;
var timelineController;
var merchListController;

document.addEventListener("DOMContentLoaded", function(ev) {
    apiCommunicator = new ApiCommunicator();
    viewController = new ViewController(document.getElementById("content"));
    timelineController = new TimelineController(apiCommunicator);
    merchListController = new MerchListController(apiCommunicator);

    document.getElementById("button-timeline").onclick = function () {
        viewController.navigateTimeline();
        timelineController.navigatedTo();
    };
    
    document.getElementById("button-merch").onclick = function () {
        viewController.navigateMerch();
    };

    viewController.navigateMerch();
    merchListController.navigatedTo();
});

