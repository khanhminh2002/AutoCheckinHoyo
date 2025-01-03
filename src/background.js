if (typeof browser === "undefined") {
    browser = chrome;
    browser.browserAction = chrome.action;
}

const HOSTS = [
    {
        apiHost: "sg-public-api.hoyolab.com",
        page: "act.hoyolab.com/bbs/event/signin/zzz/index.html"
    },
    {
        apiHost: "sg-hk4e-api.hoyolab.com",
        page: "event/sol/sign",
        act_id: "e202102251931481"
    },
    {
        apiHost: "sg-public-api.hoyolab.com",
        page: "event/mani/sign",
        act_id: "e202110291205111"
    },
    {
        apiHost: "sg-public-api.hoyolab.com",
        page: "event/luna/os/sign",
        act_id: "e202303301540311"
    }
];

function getCurrDay() {
    let now = new Date();
    now.setMinutes(now.getMinutes() + now.getTimezoneOffset());
    now.setHours(now.getHours() + 8);
    return Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
}

function setActionIcon(type) {
    browser.browserAction.setIcon({
        path: {
            16: "icons/" + type + "/icon16.png",
            32: "icons/" + type + "/icon32.png",
            64: "icons/" + type + "/icon64.png"
        }
    });
}

async function request(i, currDay) {
    let host = HOSTS[i];
    if (typeof host === "undefined") {
        console.log("All hosts checked.");
        return;
    }

    try {
        let response = await fetch(`https://${host.apiHost}/event/luna/zzz/os/sign`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-RPC-Signgame": "zzz"
            },
            credentials: "include",
            body: JSON.stringify({ act_id: host.act_id })
        });
        let data = await response.json();

        if (data.retcode === 0 || data.retcode === -5003) {
            browser.storage.local.set({ lastChecked: currDay });
            setActionIcon("success");
        } else {
            console.log("Request failed:", data);
            setActionIcon("error");
        }
    } catch (error) {
        console.log("Error during request:", error);
        setActionIcon("error");
    }
}

function check() {
    browser.storage.local.get({ lastChecked: null }).then(storage => {
        let currDay = getCurrDay();
        if (storage.lastChecked !== currDay) {
            request(0, currDay);
        }
    });
}

browser.alarms.onAlarm.addListener(alarm => {
    if (alarm.name === "daily_checkin") {
        check();
    }
});

browser.alarms.create("daily_checkin", { when: Date.now(), periodInMinutes: 1440 });

browser.browserAction.onClicked.addListener(() => {
    browser.tabs.create({ active: true, url: `https://${HOSTS[0].page}?act_id=${HOSTS[0].act_id}` });
});
