class SlotsController {

    constructor(apiCommunicator) {
        this.apiCommunicator = apiCommunicator;
        this.initialized = false;
    }

    navigatedTo() {

        if (this.initialized)
            return;

        this.slotTextBox = document.getElementById("slot-name-input");
        this.slotAddButton = document.getElementById("slot-add-button");

        this.slotAddButton.onclick = async () => {
            await this.apiCommunicator.addSlot({name: this.slotTextBox.value})
            this.refreshData();
        }

        this.refreshData();

        this.initialized = true;
    }

    async refreshData() {
        let container = document.getElementById("slots-list");
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }

        let template = document.getElementById("slot-item-template");
        let slots = await this.apiCommunicator.getSlots();
        slots.forEach(slot => {
            let node = document.importNode(template.content, true);
            this.itemTemplate(node, slot);
            container.appendChild(node);
        });
    }

    itemTemplate(node, slot) {
        node.querySelector("title").innerText = slot.name;
        node.querySelector("button").onclick = async () => {
            await this.apiCommunicator.removeSlot(slot);
            this.refreshData();
        }
    }
}