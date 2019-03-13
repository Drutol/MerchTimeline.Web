class TimelineController {

    constructor(apiCommunicator) {
        this.apiCommunicator = apiCommunicator;
        this.timelineControl = null;
        this.initialized = false;
        this.timelineData = null;
        this.selectedItemId = null;
        this.editPaneInitialized = false;

        this.editPaneContainer = document.getElementById("edit-pane-container");
        this.editPane = document.getElementById("edit-pane");
    }

    async navigatedTo() {

        if (this.initialized)
            return;

        this.container = document.getElementById("timeline-page");

        this.setUpEditPane();
        this.refreshData();

        this.initialized = true;
    }

    async refreshData() {
        try {
            this.timelineData = await apiCommunicator.getTimeline();
        } catch {
            return;
        }

        let groups = [];
        let entries = [];
        this.timelineData.slots.forEach(slot => {
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

        this.timelineControl.on('select', props => this.onItemClicked(props))
    }


    onItemClicked(props) {
        if (this.selectedItemId != null)
            return;

        this.selectedItemId = props.items[0];

        this.editPaneContainer.classList.toggle("container-visible");
        this.editPane.classList.toggle("pane-opened");

        this.onPaneOpened();
    }

    onPaneOpened() {
        this.initializeEditPane();

    }

    initializeEditPane() {
        let editedItem = this.timelineData
            .slots.flatMap(x => x.timelineEntries)
            .find(entry => entry.id == this.selectedItemId);

        if (this.editPaneInitialized) {
            this.startDatePicker.destroy();
            this.endDatePicker.destroy();
        }
        else {
            document.getElementById('edit-pane-button-update').onclick = async () => {
                try {
                    await this.apiCommunicator.modifyPeriod(editedItem.id, {
                        Start: this.startDatePicker.getDate(),
                        End: this.endDatePicker.getDate(),
                    })
                } catch {
                    return;
                }
            }
        }

        this.startDatePicker = new Pikaday({
            field: document.getElementById('edit-pane-startdate'),
        });
        this.startDatePicker.setDate(editedItem.start);
        this.endDatePicker = new Pikaday({
            field: document.getElementById('edit-pane-enddate'),
        });
        this.endDatePicker.setDate(editedItem.end);

        this.editPaneInitialized = true;
    }

    setUpEditPane() {
        window.addEventListener("click", (event) => {
            if (event.target == this.editPaneContainer) {
                this.editPaneContainer.classList.toggle("container-visible");
                this.editPane.classList.toggle("pane-opened");
                this.selectedItemId = null;
            };
        });
    }
}