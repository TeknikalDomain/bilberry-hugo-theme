
// Opt-out: if your localStorage contains the opt-out key, don't continue processing.
// If it doesn't exist, disable opt-out (hence opt-OUT not opt-IN).
var optOut = localStorage.getItem('pingOptOut')
if (optOut === null) {
    localStorage.setItem('pingOptOut', 'false')
    optOut = 'false'
}

// Only check relevant paths.
// For right now, that means /post, /gallery, and /code.
// If it's anything else, then abort.
const path = window.location.pathname
if (
    !(
        path.startsWith('/post/') ||
        path.startsWith('/gallery/') ||
        path.startsWith('/code/')
    )
) {
    optOut = 'true'
}

// Why is this a string? Because localStorage stores strings, not bools.
// If your opt-out key is set, or the path is irelevant, this skips the
// entire script.
if (optOut == 'false') {

    // Client IP check
    // We can use Cloudflare's 'trace' endpoint to get the IP.
    let clientIP = null
    xhr_ip = new XMLHttpRequest()
    xhr_ip.onreadystatechange = function() {
        if (xhr_ip.readyState == 4 && xhr_ip.status == 200) {
            // This turns the newline-separated 'key=value' pairs into a JS object
            // Source: https://stackoverflow.com/a/39284735/452587
            clientIP = xhr_ip.responseText
                .split('\n')
                .reduce(function(obj, pair) {
                    pair = pair.split('=')
                    return (obj[pair[0]] = pair[1]), obj
                }, {})['ip']
            sendPing()
        }
    }

    // Perform IP check
    xhr_ip.open('GET', 'https://teknikaldomain.me/cdn-cgi/trace', true)
    xhr_ip.send(null)

    // Perform actual ping.
    // This is a function to make sure that 'clientIP' is populated,
    // since it only gets called after the XHR above returns.
    xhr_ping = new XMLHttpRequest()
    function sendPing() {

        // btoa() is Base64 encode, just to prevent a raw IP being sent in the URL.
        // TODO: I could use an actual post request body, not query params, but
        // I can't find out how to get that to work well within a Worker for now,
        // so this is what we have. That's going to be changed before public
        // release though.
        xhr_ping.open(
            'POST',
            `https://post-ping.teknikaldomain.workers.dev/leaderboards/ping?article=${path}&client=${btoa(
                clientIP,
            ).replace(/\//g, '_').replace(/\+/g, '-')}`,
            true,
        )
        xhr_ping.send(null)
        return
    }
}
