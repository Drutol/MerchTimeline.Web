class ViewController {
    constructor(frame) {
        this.frame = frame;

        this.timelineView = document.getElementById("timeline-page");
        this.merchView = document.getElementById("merch-page");
        this.slotsView = document.getElementById("slots-page");

        while (frame.firstChild) {
            frame.removeChild(frame.firstChild);
        }
    }

    navigateTimeline() {
        this.setView(this.timelineView);
    }

    navigateMerch() {
        this.setView(this.merchView);
    }

    navigateSlots() {
        this.setView(this.slotsView);
    }

    setView(view) {
        if (this.currentChild)
            this.frame.removeChild(this.currentChild);

        this.frame.appendChild(view);
        this.currentChild = view;
    }
}