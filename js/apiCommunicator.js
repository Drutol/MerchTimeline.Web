class ApiCommunicator {
    async getTimeline() {
        let json = await this.httpGetAsync(
            "http://localhost:5000/api/timeline");
        return JSON.parse(json);
    }

    async getMerch() {
        let json = await this.httpGetAsync(
            "http://localhost:5000/api/merchItems");
        return JSON.parse(json);
    }

    async getSlots() {
        let json = await this.httpGetAsync(
            "http://localhost:5000/api/slots");
        return JSON.parse(json);
    }

    async addSlot(slot) {
        let json = await this.httpPostAsync(
            "http://localhost:5000/api/slots", JSON.stringify({ Name: slot.name }));
        return JSON.parse(json);
    }

    async removeSlot(slot) {
        let json = await this.httpDeleteAsync(
            `http://localhost:5000/api/slots/${slot.id}`);
        return JSON.parse(json);
    }

    async addUsagePeriod(period) {
        let json = await this.httpPostAsync(
            `http://localhost:5000/api/timeline`, JSON.stringify(period));
        return JSON.parse(json);
    }

    httpGetAsync(url) {
        //TODO Handle failure
        return new Promise((resolve, reject) => {
            let xmlHttp = new XMLHttpRequest();
            xmlHttp.onreadystatechange = function () {
                if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
                    resolve(xmlHttp.responseText);
            }
            xmlHttp.open("GET", url, true);
            xmlHttp.setRequestHeader("Authorization", "lollol");
            xmlHttp.send(null);
        });
    }

    httpPostAsync(url, body) {
        //TODO Handle failure
        return new Promise((resolve, reject) => {
            let xmlHttp = new XMLHttpRequest();
            xmlHttp.onreadystatechange = function () {
                if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
                    resolve(xmlHttp.responseText);
            }
            xmlHttp.con
            xmlHttp.open("POST", url, true);
            xmlHttp.setRequestHeader("Authorization", "lollol");
            xmlHttp.setRequestHeader("Content-Type", "application/json");
            xmlHttp.send(body);
        });
    }

    httpDeleteAsync(url) {
        //TODO Handle failure
        return new Promise((resolve, reject) => {
            let xmlHttp = new XMLHttpRequest();
            xmlHttp.onreadystatechange = function () {
                if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
                    resolve(xmlHttp.responseText);
            }
            xmlHttp.open("DELETE", url, true);
            xmlHttp.setRequestHeader("Authorization", "lollol");
            xmlHttp.send(null);
        });
    }
}
