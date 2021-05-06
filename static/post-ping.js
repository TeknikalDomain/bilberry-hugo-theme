/* POST PINGER
 * Intent: Work with /leaderboards/ping to record popularity statistics for posts
 * Collected data: time, IP, path
 * Out-out: localStorage key
 *
 * DESIGN:
 * 1) if opt-out localStorage key, exit.
 * 2) if path does not begin with /post, /gallery, or /code, exit.
 * 3) Get user's IP from /cdn-cgi/trace
 * 4) Submit with a POST to /leaderboards/ping?article=$PATH&client=$IP
 *
 * Note: Client IP hashed server-side, for ease of including external modules.
 */

var optOut = localStorage.getItem('pingOptOut')
if (optOut === null) {
    localStorage.setItem('pingOptOut', 'false')
    optOut = 'false'
}

const path = window.location.pathname

if (
    !(
        path.startsWith('/post/') ||
        path.startsWith('/gallery/') ||
        path.startsWith('/code/')
    )
) {
    optOut = true
}

if (optOut == 'false') {
    let clientIP = null

    xhr_ip = new XMLHttpRequest()
    xhr_ip.onreadystatechange = function() {
        if (xhr_ip.readyState == 4 && xhr_ip.status == 200) {
            clientIP = xhr_ip.responseText
                .split('\n')
                .reduce(function(obj, pair) {
                    pair = pair.split('=')
                    return (obj[pair[0]] = pair[1]), obj
                }, {})['ip']
            sendPing()
        }
    }

    xhr_ip.open('GET', 'https://teknikaldomain.me/cdn-cgi/trace', true)
    xhr_ip.send(null)

    xhr_ping = new XMLHttpRequest()

    function sendPing() {
        // Do ping
        xhr_ping.open(
            'POST',
            `https://post-ping.teknikaldomain.workers.dev/leaderboards/ping?article=${path}&client=${btoa(
                clientIP,
            )}`,
            true,
        )
        xhr_ping.send(null)
        return
    }
}
