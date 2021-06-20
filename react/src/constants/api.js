/* From React starter serviceWorker */
const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === '[::1]' ||
    // 127.0.0.0/8 are considered localhost for IPv4.
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
);

export let API_ROOT

if (isLocalhost) {
    API_ROOT = "http://localhost:8000/django";
} else {
    API_ROOT = "https://gallery.dailybruin.com/django";
}

// https://gallery.dailybruin.com/django

