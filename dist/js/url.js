const o=o=>{const t=decodeURIComponent(window.location.href).split("?")[1],n={};return t&&t.split("&").forEach((o=>{const t=o.split("=");n[t[0]]=t[1]})),o?n[o]:n};export{o as getUrlParams};
