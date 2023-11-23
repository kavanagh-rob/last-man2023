var BASEURL, ORIGIN = location.protocol + "//" + location.hostname;

function getBaseUrl() {
    for (var e = document.getElementsByTagName("script"), t = 0; t < e.length; t++)
        if (e[t].src.indexOf("footballwebpages.co.uk") >= 0 && e[t].src.indexOf("/embed.js") >= 0) return e[t].src.substring(0, e[t].src.indexOf("/embed.js") + 1);
    return null
}

function getUuid() {
    var e = new Date().getTime();
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(t) {
        var a = (e + 16 * Math.random()) % 16 | 0;
        return e = Math.floor(e / 16), ("x" == t ? a : 3 & a | 8).toString(16)
    })
}

function createEmbed(e, t) {
    var a = [].filter.call(e.attributes, function(e) {
            return /^data-/.test(e.name)
        }),
        n = BASEURL + "embed/",
        r = "";
    a.forEach(function(e) {
        "data-url" == e.name ? n += e.value : r += e.name.substring(5) + "=" + encodeURIComponent(e.value) + "&"
    });
    var i = document.createElement("iframe");
    i.id = "fwp-" + e.getAttribute("data-id"), i.src = n + "?" + r + "origin=" + encodeURIComponent(ORIGIN) + "&width=" + e.offsetWidth, void 0 == t && (i.style.background = "#418a41 url('" + BASEURL + "graphics/embed-loading.png') center no-repeat", i.style.backgroundSize = "contain", i.style.minHeight = "320px"), i.style.border = "none", i.style.display = "block", i.width = "100%", e.appendChild(i), window.addEventListener("message", receiveMessage, !1)
}

function receiveMessage(e) {
    if (BASEURL.startsWith(e.origin)) {
        var t = e.data.split("/"),
            a = document.getElementById("fwp-" + t[1]);
        if (null != a) {
            if ("change-date" == t[0] || "change-page" == t[0]) {
                var n = a.parentNode;
                n.innerHTML = "", "change-date" == t[0] ? n.setAttribute("data-date", t[2]) : n.setAttribute("data-page", t[2]), createEmbed(n, !0)
            } else "loaded" == t[0] && (a.style.background = "none", a.style.minHeight = "0", a.style.height = t[2])
        }
    }
}
if (document.readyState !== 'loading') {
    null != (BASEURL = getBaseUrl()) && null != ORIGIN && [].slice.call(document.querySelectorAll("div.fwp-embed")).forEach(function(e) {
        void 0 == e.dataset.id && (e.dataset.id = getUuid(), createEmbed(e))
    })

} else {
    document.addEventListener("DOMContentLoaded", function() {
    null != (BASEURL = getBaseUrl()) && null != ORIGIN && [].slice.call(document.querySelectorAll("div.fwp-embed")).forEach(function(e) {
        void 0 == e.dataset.id && (e.dataset.id = getUuid(), createEmbed(e))
    })
});
}
