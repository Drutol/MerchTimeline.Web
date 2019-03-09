class MerchListController {

    constructor(apiCommunicator) {
        this.apiCommunicator = apiCommunicator;
        this.initialized = false;
    }

    async navigatedTo() {
        if (this.initialized)
            return;

        let container = document.getElementById("merch-page");
        let template = document.getElementById("merch-item-template");
        let merch = await this.apiCommunicator.getMerch();
        merch.sort((a,b) => a.kind - b.kind).reverse().forEach(merchItem => {
            let node = document.importNode(template.content, true);
            this.itemTemplate(node, merchItem);
            container.appendChild(node);
        });

        this.initialized = true;

    }

    itemTemplate(node, item) {
        node.getElementById("item-img").setAttribute("src", item.imageUrl);
    }
}