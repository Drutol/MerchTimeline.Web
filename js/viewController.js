class ViewController {
    constructor(
        contentContainer,
        timelineController,
        merchListController,
        slotsController) {

        this.contentContainer = contentContainer;
        this.timelineController = timelineController;
        this.merchListController = merchListController;
        this.slotsController = slotsController;

        this.pages = {};

        this.pages[TimelineController.tag] = new Page(this, timelineController);
        this.pages[MerchListController.tag] = new Page(this, merchListController);
        this.pages[SlotsController.tag] = new Page(this, slotsController);

        this.refreshButton = document.getElementById("button-refresh")
        this.tokenButton = document.getElementById("button-token")

        this.setUpNavButtons();

        while (contentContainer.firstChild) {
            contentContainer.removeChild(contentContainer.firstChild);
        }
    }

    navigate(pageTag) {
        let page = this.pages[pageTag.tag];

        this.setView(page);
        page.controller.navigatedTo();
        this.currentPage = page;
    }

    setView(page) {
        if (this.currentButton)
            this.currentButton.classList.toggle("selected")

        this.currentButton = page.button;
        this.currentButton.classList.toggle("selected");

        if (this.currentChild)
            this.contentContainer.removeChild(this.currentChild);

        this.contentContainer.appendChild(page.view);
        this.currentChild = page.view;
    }

    setUpNavButtons() {
        this.refreshButton.onclick = () => {
            this.currentPage.controller.refreshData();
        }

        this.tokenButton.onclick = () => {
            let token = prompt("Acess token", null);

            if(token == null)
                return;

            window.localStorage.setItem("authToken", token);
        }
    }
}

class Page {
    constructor(viewController, pageController) {
        this.view = document.getElementById(`nav-${pageController.tag}-page`);
        this.button = document.getElementById(`nav-${pageController.tag}-button`);
        this.controller = pageController;
        this.parent = viewController;

        this.button.onclick = () => {
            this.parent.navigate(pageController);
        };
    }
}