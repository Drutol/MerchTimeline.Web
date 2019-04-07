class MerchListController {

    static tag = "merch";

    constructor(apiCommunicator, dialogsManager) {
        this.tag = MerchListController.tag;
        this.apiCommunicator = apiCommunicator;
        this.initialized = false;
        this.dialogInitialized = false;
        this.dialogsManager = dialogsManager;
        this.merch = null;

        this.searchInput = document.getElementById("search-merch-input");
        this.addMerchButton = document.getElementById("merch-page-add-button");
        this.grid = document.getElementById("merch-grid");
    }

    async navigatedTo() {
        if (this.initialized)
            return;

        this.addMerchButton.onclick = () => {
            this.dialogsManager.showDialog(AddMerchItemDialog);
        }

        this.searchInput.onkeyup = () => {
            this.refreshSearch();
        }

        await this.refreshData();

        this.initialized = true;
    }

    async refreshData() {

        while (this.grid.firstChild) {
            this.grid.removeChild(this.grid.firstChild);
        }

        let template = document.getElementById("merch-item-template");

        try {
            this.merch = await this.apiCommunicator.getMerch();
        }
        catch {
            return;
        }

        this.merch.sort((a, b) => b.kind - a.kind).forEach(merchItem => {
            let node = document.importNode(template.content, true);
            this.grid.appendChild(node);
            this.itemTemplate(this.grid.getLastChild(), merchItem);
        });

        this.refreshSearch();
    }

    refreshSearch() {
        this.grid.querySelectorAll(".merch-item").forEach(gridItem => {
            let merchItem = this.merch.find(i => i.id == gridItem.dataset.id);
            if (merchItem.name.toLowerCase().includes(this.searchInput.value.toLowerCase())) {
                gridItem.style.display = "inline-block";
            } else {
                gridItem.style.display = "none";
            }
        });
    }

    itemTemplate(node, item) {
        let img = node.getElementsByTagName("img")[0];
        img.setAttribute("src", item.imageUrl);
        node.dataset.id = item.id;
        node.onclick = () => this.itemClicked(item);
    }

    async itemClicked(item) {
        this.dialogsManager.showDialog(AddPeriodDialog, item);
    }
}