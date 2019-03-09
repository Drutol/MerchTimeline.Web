class ViewController {
    constructor(frame) {
        this.frame = frame;

        this.timelineView = document.getElementById("timeline-page");
        this.merchView = document.getElementById("merch-page");

        frame.removeChild(this.timelineView);
        frame.removeChild(this.merchView);
    }

    navigateTimeline() {
        this.setView(this.timelineView);
    }

    navigateMerch() {
        this.setView(this.merchView);
    }

    setView(view) {
        if (this.currentChild)
            this.frame.removeChild(this.currentChild);

        this.frame.appendChild(view);
        this.currentChild = view;
    }
}