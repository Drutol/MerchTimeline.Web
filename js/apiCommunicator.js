class ApiCommunicator {

    constructor() {
        //this.baseAddress = "https://mylovelyvps.ml/api";
        this.baseAddress = "https://localhost:5001/api";
    }

    async getTimeline() {
        let json = await this.httpGetAsync(
            `${this.baseAddress}/timeline`);
        return JSON.parse(json);
    }

    async getMerch() {
        let json = await this.httpGetAsync(
            `${this.baseAddress}/merchItems`);
        return JSON.parse(json);
    }

    async getSlots() {
        let json = await this.httpGetAsync(
            `${this.baseAddress}/slots`);
        return JSON.parse(json);
    }

    async addSlot(slot) {
        let json = await this.httpPostAsync(
            `${this.baseAddress}/slots`, JSON.stringify({ Name: slot.name }));
        return JSON.parse(json);
    }

    async removeSlot(slot) {
        let json = await this.httpDeleteAsync(
            `${this.baseAddress}/slots/${slot.id}`);
        return JSON.parse(json);
    }

    async addUsagePeriod(period) {
        period.Start = period.Start.addHours(1 + 1/60);
        if(period.End != null)
            period.End = period.End.addHours(1 + 1/60);
        let json = await this.httpPostAsync(
            `${this.baseAddress}/timeline`, JSON.stringify(period));
        return JSON.parse(json);
    }

    async modifyPeriod(id, period) {
        period.Start = period.Start.addHours(1 + 1/60);
        if(period.End != null)
            period.End = period.End.addHours(1 + 1/60);
        let json = await this.httpPostAsync(
            `${this.baseAddress}/timeline/${id}/modify`, JSON.stringify(period));
        return JSON.parse(json);
    }

    httpGetAsync(url) {
        return this.httpAsync(url, "GET", null);
    }

    httpPostAsync(url, body) {
        return this.httpAsync(url, "POST", body);
    }

    httpDeleteAsync(url) {
        return this.httpAsync(url, "DELETE", null);
    }

    httpAsync(url, method, body) {

        let token = window.localStorage.getItem("authToken");
        if (token == null) {
            new Noty({
                theme: 'metroui',
                type: 'warning',
                text: 'Access token has not been set.',
                timeout: false,
                layout: 'bottomRight'
            }).show();
            throw "No token is set"
        }

        return new Promise((resolve, reject) => {
            let xmlHttp = new XMLHttpRequest();
            xmlHttp.onreadystatechange = function () {
                if (xmlHttp.readyState == 4) {
                    if (xmlHttp.status == 200) {
                        resolve(xmlHttp.responseText);
                    }
                    else {
                        if (xmlHttp.status == 401) {
                            new Noty({
                                theme: 'metroui',
                                type: 'warning',
                                text: 'Failed to authorize with provided token.',
                                timeout: 2000,
                                progressBar: true,
                                layout: 'bottomRight'
                            }).show();
                        }
                        else {
                            new Noty({
                                theme: 'metroui',
                                type: 'error',
                                text: 'Failed to communicate with the server.',
                                timeout: 2000,
                                progressBar: true,
                                layout: 'bottomRight'
                            }).show();
                        }

                        reject();
                    }
                }
            }
            xmlHttp.con
            xmlHttp.open(method, url, true);
            xmlHttp.setRequestHeader("Authorization", token);
            xmlHttp.setRequestHeader("Content-Type", "application/json");
            xmlHttp.send(body);
        });
    }
}
