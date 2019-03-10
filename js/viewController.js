class ViewController {
    constructor(
        contentContainer,
        timelineController,
        merchListController,
        slotsController) {
            
        this.contentContainer = contentContainer;
        this.timelineController = timelineController;
        this.merchListController = merchListController;
        this.slotsController = slotsController;

        this.timelineView = document.getElementById("timeline-page");
        this.merchView = document.getElementById("merch-page");
        this.slotsView = document.getElementById("slots-page");

        this.timelineButton = document.getElementById("button-timeline");
        this.merchButton = document.getElementById("button-merch");
        this.slotsButton = document.getElementById("button-slots")

        this.setUpNavButtons();

        while (contentContainer.firstChild) {
            contentContainer.removeChild(contentContainer.firstChild);
        }
    }

    navigateTimeline() {
        this.setView(this.timelineView, this.timelineButton);
        this.timelineController.navigatedTo();
    }

    navigateMerch() {
        this.setView(this.merchView, this.merchButton);
        this.merchListController.navigatedTo();
    }

    navigateSlots() {
        this.setView(this.slotsView, this.slotsButton);
        this.slotsController.navigatedTo();
    }

    setView(view, button) {
        if (this.currentButton)
            this.currentButton.classList.toggle("selected")

        this.currentButton = button;
        button.classList.toggle("selected");

        if (this.currentChild)
            this.contentContainer.removeChild(this.currentChild);

        this.contentContainer.appendChild(view);
        this.currentChild = view;
    }

    setUpNavButtons() {
        this.timelineButton.onclick = () => {
            this.navigateTimeline();
        };

        this.merchButton.onclick = () => {
            this.navigateMerch();
        };

        this.slotsButton.onclick = () => {
            this.navigateSlots();
        };
    }
}