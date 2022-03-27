var JSZip = require("jszip");

const rawpath = '/raw/';
addEventListener("fetch", event => {
  const url = new URL(event.request.url);
  if (url.pathname.startsWith(rawpath)) {
    const scaladocpath = url.pathname.slice(rawpath.length);
    event.respondWith(loadScaladoc(scaladocpath));
  }
});

async function loadScaladoc(path) {
  var [jar, file] = path.split('!/', 2);
  file || '/index.html'
  const response = await fetch(`https://${jar}`);
  const zip = new JSZip();
  const data = await response.arrayBuffer();
  await zip.loadAsync(data);
  const contents = await zip.file(file || '/index.html').async('string');
  var ct = undefined;
  switch (file.split('.').pop()) {
    case 'html': ct = 'text/html'; break;
    case 'css': ct = 'text/css'; break;
    case 'js': ct = 'text/javascript'; break;
    case 'svg': ct = 'image/svg+xml'; break;
    case 'ttf': ct = 'font/ttf'; break;
    case 'woff': ct = 'font/woff'; break;
  }
  return new Response(contents, {headers: {'Content-Type': ct}});
}
