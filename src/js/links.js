const links = [
    { name: "last.fm", url: "https://www.last.fm/user/Diramix" },
    { name: "Pinterest", url: "https://pinterest.com/diram1x/" },
    { name: "Twitter", url: "https://x.com/Diram1x" },
    { name: "Discord", url: "https://discord.gg/ky6bcdy7KA" },
    { name: "Boosty", url: "https://boosty.to/diramix" },
    { name: "GitHub", url: "https://github.com/diramix/" },
    { name: "Spotify", url: "https://open.spotify.com/user/31aorysoanwbjcrfk2ikjfcl6pd4" }
];

const linksContainer = document.getElementById("topbarLinks");
const mobileContainer = document.getElementById("mobileLinks");

links.forEach((link, index) => {
    const a = document.createElement("a");
    a.href = link.url;
    a.target = "_blank";
    a.className = "topbar-link";
    a.textContent = link.name;
    linksContainer.appendChild(a);

    const aMobile = document.createElement("a");
    aMobile.href = link.url;
    aMobile.target = "_blank";
    aMobile.className = "mobile-link";
    aMobile.textContent = link.name;
    mobileContainer.appendChild(aMobile);

    if (index < links.length - 1) {
        const sep = document.createElement("div");
        sep.className = "separator";
        mobileContainer.appendChild(sep);
    }
});