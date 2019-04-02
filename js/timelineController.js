class TimelineController {

    static tag = "timeline";

    constructor(apiCommunicator) {
        this.tag = TimelineController.tag;
        this.apiCommunicator = apiCommunicator;
        this.timelineControl = null;
        this.initialized = false;
        this.timelineData = null;
        this.selectedItemId = null;
        this.editPaneInitialized = false;
        this.refreshDataOnNextNavigation = false;
        

        this.editPaneContainer = document.getElementById("edit-pane-container");
        this.editPane = document.getElementById("edit-pane");

        this.editPaneEndDateInput = document.getElementById('edit-pane-enddate');
        this.editPaneStartDateInput = document.getElementById('edit-pane-startdate');
    }

    async navigatedTo() {

        if (this.refreshDataOnNextNavigation && this.initialized) {
            this.refreshData();
            this.refreshDataOnNextNavigation = false;
        }

        if (this.initialized)
            return;

        this.container = document.getElementById("nav-timeline-page");

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
                        start: new Date(entry.start).addHours(1),
                        end: entry.end == null ? new Date().addHours(100) : new Date(entry.end),
                        group: slot.name,
                        className: entry.end == null ? "timeline-item-no-end" : ""
                    });
                }
            });
        });

        if (this.timelineControl)
            this.timelineControl.destroy();
        this.timelineControl = null;

        this.timelineControl =
            new vis.Timeline(this.container, new vis.DataSet(entries), groups, {
                height: `${this.container.parentElement.clientHeight.toString()}px`,
                margin: {
                    item: {
                        vertical: 5,
                        horizontal: 0
                    }
                }
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
        this.editedItem = this.timelineData
            .slots.flatMap(x => x.timelineEntries)
            .find(entry => entry.id == this.selectedItemId);

        if (this.editPaneInitialized) {
            this.startDatePicker.destroy();
            this.endDatePicker.destroy();
        }
        else {
            document.getElementById('edit-pane-button-update').onclick = async () => {
                try {
                    await this.apiCommunicator.modifyPeriod(this.editedItem.id, {
                        Start: this.startDatePicker.getDate(),
                        End: this.editPaneEndDateInput.value == "" ? null : this.endDatePicker.getDate(),
                    })
                } catch {
                    return;
                }

                NotificationManager.showSuccess('Successfully edited period.');

                this.closePane();
                this.refreshData();
            }
            document.getElementById('edit-pane-button-remove').onclick = async () => {
                try {
                    await this.apiCommunicator.removePeriod(this.editedItem.id);
                } catch {
                    return;
                }

                NotificationManager.showSuccess('Successfully removed period.');

                this.closePane();
                this.refreshData();
            }
        }

        this.startDatePicker = new Pikaday({
            field: this.editPaneStartDateInput
        });
        this.startDatePicker.setDate(this.editedItem.start);
        this.endDatePicker = new Pikaday({
            field: this.editPaneEndDateInput
        });
        this.endDatePicker.setDate(this.editedItem.end);

        this.editPaneInitialized = true;
    }

    setUpEditPane() {
        window.addEventListener("click", (event) => {
            if (event.target == this.editPaneContainer) {
                this.closePane();
            };
        });
    }

    closePane() {
        this.editPaneContainer.classList.toggle("container-visible");
        this.editPane.classList.toggle("pane-opened");
        this.selectedItemId = null;
    }
}