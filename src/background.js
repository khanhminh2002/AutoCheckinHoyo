'use strict';
chrome.runtime.onStartup.addListener(function () {
    setTimeout(onload, 5000);
});
async function onload() {
    try {
        let res = await fetch(
            "https://sg-hk4e-api.hoyolab.com/event/sol/sign",
            {method: "POST", body: JSON.stringify({act_id: "e202102251931481"})});
        console.log(await res.text());

        let res_hi3 = await fetch(
            "https://sg-public-api.hoyolab.com/event/mani/sign",
            {method: "POST", body: JSON.stringify({act_id: "e202110291205111"})});
        console.log(await res_hi3.text());

        let res_hsr = await fetch(
            "https://sg-public-api.hoyolab.com/event/luna/os/sign",
            {method: "POST", body: JSON.stringify({act_id: "e202303301540311"})});
        console.log(await res_hsr.text());

        let res_zzz = await fetch(
            "https://sg-public-api.hoyolab.com/event/luna/zzz/os/sign",
            {method: "POST", body: JSON.stringify({act_id: "e202406031448091"})});
        console.log(await res_hsr.text());
    }
    catch (e) {
        console.log(e);
        setTimeout(onload, 5000);
    }
}
