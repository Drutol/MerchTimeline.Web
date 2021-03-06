class ApiCommunicator {

    constructor() {
        this.baseAddress = "https://mylovelyvps.ml/api";
        //this.baseAddress = "https://localhost:5001/api";
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
        let offset = new Date().getTimezoneOffset();
        period.End =period.End == null ? null : period.End.addMinutes(-offset);
        period.Start = period.Start.addMinutes(-offset);
        let json = await this.httpPostAsync(
            `${this.baseAddress}/timeline`, JSON.stringify(period));
        return JSON.parse(json);
    }

    async modifyPeriod(id, period) {
        let offset = new Date().getTimezoneOffset();
        period.End = period.End == null ? null : period.End.addMinutes(-offset);
        period.Start = period.Start.addMinutes(-offset);
        let json = await this.httpPostAsync(
            `${this.baseAddress}/timeline/${id}/modify`, JSON.stringify(period));
        return JSON.parse(json);
    }

    async removePeriod(id) {
        let json = await this.httpDeleteAsync(`${this.baseAddress}/timeline/${id}`);
        return JSON.parse(json);
    }

    async addMerchItem(item) {
        let json = await this.httpPostAsync(
            `${this.baseAddress}/merchItems`, JSON.stringify(item));
        return JSON.parse(json);
    }

    async editMerchItem(item) {
        let json = await this.httpPatchAsync(
            `${this.baseAddress}/merchItems`, JSON.stringify(item));
        return JSON.parse(json);
    }

    async removeMerchItem(item) {
        let json = await this.httpDeleteAsync(
            `${this.baseAddress}/merchItems/${item.Id}`);
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

    httpPatchAsync(url) {
        return this.httpAsync(url, "PATCH", null);
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
                            NotificationManager.showWarning('Failed to authorize with provided token.');
                        }
                        else {
                            NotificationManager.showError('Failed to communicate with the server.');
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
