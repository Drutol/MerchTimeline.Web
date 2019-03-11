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

        this.refreshData();

        this.initialized = true;
    }

    async refreshData() {
        let timelineData;
        try {
            timelineData = await apiCommunicator.getTimeline();
        } catch {
            return;
        }

        let groups = [];
        let entries = [];
        timelineData.slots.forEach(slot => {
            groups.push({ id: slot.name, content: slot.name });

            slot.timelineEntries.forEach(entry => {
                if (entry.imageUrl != null && entry.imageUrl != "") {
                    entries.push({
                        id: entry.id,
                        content: `<img src=\"${entry.imageUrl}\" class=\"timeline-picture\"/>`,
                        start: Date.parse(entry.start),
                        end: Date.parse(entry.end),
                        group: slot.name
                    });
                }
            });
        });

        if (this.timelineControl)
            this.timelineControl.destroy();
        this.timelineControl = null;

        this.timelineControl =
            new vis.Timeline(this.container, new vis.DataSet(entries), groups, {
                height: `${this.container.parentElement.clientHeight.toString()}px`
            });
    }
}