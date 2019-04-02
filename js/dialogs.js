class DialogsManager {
    constructor() {
        this.dialogs = {};

        this.container = document.getElementById("modal-container")
        this.containerContent = document.getElementById("modal-container-content")

        this.dialogs[AddPeriodDialog.tag] = new AddPeriodDialog(this);

        window.addEventListener("click", (event) => {
            if (event.target == this.container) {
                if (this.currentDialog != null) {
                    this.currentDialog.hide();
                }
            };
        });
    }

    showDialog(dialogTag, argument) {
        this.container.classList.toggle("modal-visible");
        this.currentDialog = this.dialogs[dialogTag.tag];
        this.currentDialog.show(argument);
    }

    hideContainer() {
        this.container.classList.toggle("modal-visible");
        this.currentDialog = null;
    }
}

class Dialog {
    constructor(tag) {
        this.tag = tag;
        this.template = document.getElementById(`modal-${this.tag}-template`);
    }

    show(argument) {
        let templateInstance = document.importNode(this.template.content, true);
        this.parent.containerContent.appendChild(templateInstance);
        this.view = this.parent.containerContent.getLastChild();

        this.onShow(argument);
    }

    hide() {
        this.parent.containerContent.removeChild(this.view);
        this.parent.hideContainer();
        this.onHide();
    }
}

class AddPeriodDialog extends Dialog {
    static tag = "add-period";

    constructor(parentManager) {
        super(AddPeriodDialog.tag);

        this.parent = parentManager;
    }

    async onShow(item) {
        this.startDatePicker = new Pikaday({
            field: document.getElementById('add-period-modal-startdate'),
            defaultDate: new Date(),
            setDefaultDate: true
        });
        this.endDatePicker = new Pikaday({ field: document.getElementById('add-period-modal-enddate') });
        this.slotPicker = document.getElementById('add-period-modal-slots');
        this.addPeriodButton = document.getElementById('add-period-modal-button');

        let slots;
        try {
            slots = await apiCommunicator.getSlots();
        }
        catch {
            return;
        }

        slots.forEach(slot => {
            var option = document.createElement("option");
            option.value = slot.id;
            option.text = slot.name;
            this.slotPicker.add(option);
        });

        this.addPeriodButton.onclick = async () => {
            try {
                await apiCommunicator.addUsagePeriod({
                    SlotId: this.slotPicker.options[this.slotPicker.selectedIndex].value,
                    MerchItemId: item.id,
                    Start: this.startDatePicker.getDate(),
                    End: this.endDatePicker.getDate(),
                });

                this.hide();

                NotificationManager.showSuccess('Successfully added period.');

                timelineController.refreshDataOnNextNavigation = true;
            } catch (error) {
                NotificationManager.showError('Failed to add period.');
            }
        }
    }

    onHide() {

    }
}