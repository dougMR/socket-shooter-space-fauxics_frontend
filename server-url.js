console.log("server-url.js");

let serverURL;
if (
    window.location.href.includes("localhost") ||
    window.location.href.includes("127.0.0.1:")
) {
    serverURL = "http://localhost:3000";
} else {
    // serverURL = "https://mega-space-shooter.fly.dev";
}
console.log("serverURL:", serverURL);
export default serverURL;
