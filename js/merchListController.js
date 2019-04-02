class MerchListController {

    static tag = "merch";

    constructor(apiCommunicator, dialogsManager) {
        this.tag = MerchListController.tag;
        this.apiCommunicator = apiCommunicator;
        this.initialized = false;
        this.dialogInitialized = false;
        this.dialogsManager = dialogsManager;
    }

    async navigatedTo() {
        if (this.initialized)
            return;

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
            this.itemTemplate(container.getLastChild(), merchItem);
        });
    }

    itemTemplate(node, item) {
        node.getElementsByTagName("img")[0].setAttribute("src", item.imageUrl);
        node.onclick = () => this.itemClicked(item);
    }

    async itemClicked(item) {
        this.dialogsManager.showDialog(AddPeriodDialog, item);    
    }
}