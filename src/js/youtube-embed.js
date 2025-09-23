const youtubeEmbedObserver = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
            if (!(node instanceof HTMLElement)) return;

            const links = node.matches('a[href*="youtube.com/watch"], a[href*="youtu.be"]')
                ? [node]
                : Array.from(node.querySelectorAll('a[href*="youtube.com/watch"], a[href*="youtu.be"]'));

            links.forEach(link => {
                if (link.dataset.embedProcessed) return;
                link.dataset.embedProcessed = "true";

                const url = new URL(link.href);
                let videoId = null;

                if (url.hostname.includes("youtube.com") && url.searchParams.has("v")) {
                    videoId = url.searchParams.get("v");
                } else if (url.hostname.includes("youtu.be")) {
                    videoId = url.pathname.slice(1);
                }

                if (videoId) {
                    const iframe = document.createElement("iframe");
                    iframe.src = "https://www.youtube.com/embed/" + videoId + "?enablejsapi=1";
                    iframe.className = "youtube_embed";
                    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
                    iframe.allowFullscreen = true;

                    link.parentNode.insertAdjacentElement('afterend', iframe);
                }
            });
        });
    });
});

youtubeEmbedObserver.observe(document.body, {
    childList: true,
    subtree: true
});