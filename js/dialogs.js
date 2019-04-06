class DialogsManager {
    constructor() {
        this.dialogs = {};

        this.container = document.getElementById("modal-container")
        this.containerContent = document.getElementById("modal-container-content")

        this.dialogs[AddPeriodDialog.tag] = new AddPeriodDialog(this);
        this.dialogs[AddMerchItemDialog.tag] = new AddMerchItemDialog(this);

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
        if (typeof this.onHide === "function") {
            this.onHide();
        }
    }
}

class AddPeriodDialog extends Dialog {
    static tag = "add-period";

    constructor(parentManager) {
        super(AddPeriodDialog.tag);

        this.parent = parentManager;
    }

    async onShow(item) {
        let startDatePicker = new Pikaday({
            field: document.getElementById('add-period-modal-startdate'),
            defaultDate: new Date(),
            setDefaultDate: true
        });
        let endDatePicker = new Pikaday({ field: document.getElementById('add-period-modal-enddate') });
        let slotPicker = document.getElementById('add-period-modal-slots');
        let addPeriodButton = document.getElementById('add-period-modal-button');
        let editButton = document.getElementById('add-period-modal-edit-button');

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
            slotPicker.add(option);
        });

        editButton.onclick = async () => {
            this.hide();

            dialogsManager.showDialog(AddMerchItemDialog, item);
        }

        addPeriodButton.onclick = async () => {
            try {
                await apiCommunicator.addUsagePeriod({
                    SlotId: slotPicker.options[slotPicker.selectedIndex].value,
                    MerchItemId: item.id,
                    Start: startDatePicker.getDate(),
                    End: endDatePicker.getDate(),
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

class AddMerchItemDialog extends Dialog {
    static tag = "add-merch-item";

    constructor(parentManager) {
        super(AddMerchItemDialog.tag);

        this.parent = parentManager;
    }

    async onShow(item) {

        let nameTextBox = document.getElementById("add-merch-item-name");
        let imageTextBox = document.getElementById("add-merch-item-image");
        let kindComboBox = document.getElementById("add-merch-item-kind");
        let button = document.getElementById("add-merch-item-button");
        let removeButton = document.getElementById("add-merch-item-remove");

        if (item) {
            nameTextBox.value = item.name;
            imageTextBox.value = item.imageUrl;
            kindComboBox.selectedIndex = item.kind;
            removeButton.style.display = "block";
        }
        else {
            removeButton.style.display = "none";
        }

        removeButton.onclick = async () => {
            try {
                await apiCommunicator.removeMerchItem({
                    Id: item.id
                });
                NotificationManager.showSuccess('Successfully removed merch item.');
            
                this.hide();
            } catch (error) {
                NotificationManager.showError('Failed to remove merch item.');
            }
        };

        button.onclick = async () => {
            try {
                if (item) {
                    await apiCommunicator.editMerchItem({
                        MerchItem: {
                            Id: item.id,
                            Kind: kindComboBox.options[kindComboBox.selectedIndex].value,
                            Name: nameTextBox.value,
                            ImageUrl: imageTextBox.value
                        }
                    });
                    NotificationManager.showSuccess('Successfully edited merch item.');
                }
                else {
                    await apiCommunicator.addMerchItem({
                        MerchItem: {
                            Kind: kindComboBox.options[kindComboBox.selectedIndex].value,
                            Name: nameTextBox.value,
                            ImageUrl: imageTextBox.value
                        }
                    });
                    NotificationManager.showSuccess('Successfully added merch item.');
                }

                this.hide();
            } catch (error) {
                NotificationManager.showError('Failed to process merch item.');
            }
        };
    }
}