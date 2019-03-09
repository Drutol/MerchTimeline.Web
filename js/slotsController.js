class SlotsController {

    constructor(apiCommunicator) {
        this.apiCommunicator = apiCommunicator;
        this.initialized = false;
    }

    async navigatedTo() {

        if (this.initialized)
            return;
        let container = document.getElementById("slots-page");
        let template = document.getElementById("slot-item-template");
        let merch = await this.apiCommunicator.getSlots();
        merch.forEach(merchItem => {
            let node = document.importNode(template.content, true);
            this.itemTemplate(node, merchItem);
            container.appendChild(node);
        });

        this.initialized = true;

    }

    itemTemplate(node, item) {
        node.getElementById("slot-name").innerText = item.name;
    }

}