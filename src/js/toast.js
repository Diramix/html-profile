function showToast(title, message, icon, url) {
  const container = document.getElementById("toastContainer");

  let toast;
  if (url) {
    toast = document.createElement("a");
    toast.href = url;
    toast.target = "_blank";
    toast.className = "toast toast_link";
  } else {
    toast = document.createElement("div");
    toast.className = "toast";
  }

  toast.innerHTML = `
      <img src="${icon}" alt="">
      <div class="toast_content">
        <div class="toast_title">${title}</div>
        <div class="toast-message">${message}</div>
      </div>
    `;

  container.appendChild(toast);

  setTimeout(() => toast.classList.add("show"), 50);

  setTimeout(() => {
    toast.classList.add("hide");
    setTimeout(() => toast.remove(), 500);
  }, 5000);
}