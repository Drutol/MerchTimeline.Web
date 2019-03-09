class MerchListController {

    constructor(apiCommunicator) {
        this.apiCommunicator = apiCommunicator;
        this.initialized = false;
    }

    async navigatedTo() {
        if (this.initialized)
            return;

        var container = document.getElementById("merch-page");
        var template = document.getElementById("merch-item-template");
        var merch = await this.apiCommunicator.getMerch();
        merch.forEach(merchItem => {
            var node = document.importNode(template.content, true);
            this.itemTemplate(node, merchItem);
            container.appendChild(node);
        });

        this.initialized = true;

    }

    itemTemplate(node, item) {
        node.getElementById("item-img").setAttribute("src", item.imageUrl);
    }
}