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

    httpGetAsync(url) {
        //TODO Handle failure
        return new Promise((resolve, reject) => {
            var xmlHttp = new XMLHttpRequest();
            xmlHttp.onreadystatechange = function () {
                if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
                    resolve(xmlHttp.responseText);
            }
            xmlHttp.open("GET", url, true);
            xmlHttp.setRequestHeader("Authorization", "lollol");
            xmlHttp.send(null);
        });
    }
}
