class TimelineController {

    constructor(apiCommunicator) {
        this.apiCommunicator = apiCommunicator;
        this.timelineControl = null;
        this.initialized = false;
    }

    async navigatedTo() {

        if (this.initialized)
            return;

        this.container = document.getElementById("timeline-page");
        let forEach = Array.prototype.forEach;

        var timelineData = await apiCommunicator.getTimeline();

        var groups = [];
        var entries = [];
        forEach.call(timelineData.slots, slot => {
            groups.push({ id: slot.name, content: slot.name });

            forEach.call(slot.timelineEntries, entry => {
                entries.push({
                    id: slot.name,
                    content: `<img src=\"${entry.imageUrl}\" class=\"timeline-picture\"/>`,
                    start: Date.parse(entry.start),
                    end: Date.parse(entry.end),
                    group: slot.name
                });
            });
        });

        if (this.timelineControl)
            this.timelineControl.destroy();           
        this.timelineControl = null;

        this.timelineControl =
            new vis.Timeline(this.container, new vis.DataSet(entries), groups, {
                height: `${this.container.parentElement.clientHeight.toString()}px`
            });


        this.initialized = true;
    }
}