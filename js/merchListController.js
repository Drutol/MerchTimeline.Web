class MerchListController {

    constructor(apiCommunicator) {
        this.apiCommunicator = apiCommunicator;
        this.initialized = false;
        this.dialogInitialized = false;
    }

    async navigatedTo() {
        if (this.initialized)
            return;

        this.addPeriodDialog = document.getElementById("add-period-modal");
        this.setUpDialog();

        await this.refreshData();

        this.initialized = true;
    }

    async refreshData() {
        let container = document.getElementById("merch-grid");
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }

        let template = document.getElementById("merch-item-template");

        let merch;
        try {
            merch = await this.apiCommunicator.getMerch();
        }
        catch {
            return;
        }

        merch.sort((a, b) => a.kind - b.kind).reverse().forEach(merchItem => {
            let node = document.importNode(template.content, true);
            container.appendChild(node);
            this.itemTemplate(container.childNodes[container.childNodes.length - 2], merchItem);
        });
    }

    itemTemplate(node, item) {
        node.getElementsByTagName("img")[0].setAttribute("src", item.imageUrl);
        node.onclick = () => this.itemClicked(item);
    }

    async itemClicked(item) {
        this.addPeriodDialog.classList.toggle("modal-visible")

        if (!this.dialogInitialized) {
            this.startDatePicker = new Pikaday({
                field: document.getElementById('add-period-modal-startdate'),
                defaultDate: new Date(),
                setDefaultDate: true
            });
            this.endDatePicker = new Pikaday({ field: document.getElementById('add-period-modal-enddate') });
            this.slotPicker = document.getElementById('add-period-modal-slots');
            this.addPeriodButton = document.getElementById('add-period-modal-button');

            this.dialogInitialized = true;
        }

        while (this.slotPicker.firstChild) {
            this.slotPicker.removeChild(this.slotPicker.firstChild);
        }

        let slots;
        try {
            slots = await this.apiCommunicator.getSlots();
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
                await this.apiCommunicator.addUsagePeriod({
                    SlotId: this.slotPicker.options[this.slotPicker.selectedIndex].value,
                    MerchItemId: item.id,
                    Start: this.startDatePicker.getDate(),
                    End: this.endDatePicker.getDate(),
                });
                this.addPeriodDialog.style.display = "none";

                new Noty({
                    theme: 'metroui',
                    type: 'success',
                    text: 'Successfully added period.',
                    timeout: 2000,
                    progressBar: true,
                    layout: 'bottomRight'
                }).show();

                timelineController.refreshDataOnNextNavigation = true;
            } catch (error) {
                new Noty({
                    theme: 'metroui',
                    type: 'error',
                    text: 'Failed to add period.',
                    timeout: 2000,
                    progressBar: true,
                    layout: 'bottomRight'
                }).show();
            }
        }
    }

    setUpDialog() {
        window.addEventListener("click", (event) => {
            if (event.target == this.addPeriodDialog) {
                this.addPeriodDialog.classList.toggle("modal-visible")
            };
        });
    }
}