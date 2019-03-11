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

        this.refreshButton = document.getElementById("button-refresh")
        this.tokenButton = document.getElementById("button-token")

        this.setUpNavButtons();

        while (contentContainer.firstChild) {
            contentContainer.removeChild(contentContainer.firstChild);
        }
    }

    navigateTimeline() {
        this.setView(this.timelineView, this.timelineButton);
        this.timelineController.navigatedTo();
        this.currentController = this.timelineController;
    }

    navigateMerch() {
        this.setView(this.merchView, this.merchButton);
        this.merchListController.navigatedTo();
        this.currentController = this.merchListController;
    }

    navigateSlots() {
        this.setView(this.slotsView, this.slotsButton);
        this.slotsController.navigatedTo();
        this.currentController = this.slotsController;
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

        this.refreshButton.onclick = () => {
            this.currentController.refreshData();
        }

        this.tokenButton.onclick = () => {
            let token = prompt("Acess token", null);

            if(token == null)
                return;

            window.localStorage.setItem("authToken", token);
        }
    }
}