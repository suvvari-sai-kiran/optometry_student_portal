
const formatEmbedUrl = (url) => {
    if (!url) return "";
    let videoId = "";
    if (url.includes("youtube.com/watch?v=")) {
      videoId = url.split("v=")[1].split("&")[0];
      return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`;
    } else if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1].split("?")[0];
      return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`;
    }
    return url;
  };

const urls = [
    "https://www.youtube.com/watch?v=w-XgXADoBeU&pp=ygUpaG93IHRvIGRvIExlbnMgUG93ZXIgRm9ybXVsYSBpbiBvcHRvbWV0cnk%3D",
    "https://www.youtube.com/watch?v=LAx3w6WM-g0&pp=ygUmaG93IHRvIGRvIFByZW50aWNlJ3MgUnVsZSBpbiBvcHRvbWV0cnk%3D",
    "https://www.youtube.com/watch?v=w-XgXADoBeU&pp=ygUmaG93IHRvIGRvIFZlcnRleCBEaXN0YW5jZSBpbiBvcHRvbWV0cnk%3D",
    "https://www.youtube.com/watch?v=dfwcu944LVc&pp=ygUqaG93IHRvIGRvIE5lYXIgQWRkaXRpb24gKEFkZCkgaW4gb3B0b21ldHJ5",
    "https://www.youtube.com/watch?v=5CrgALxvzUE&pp=ygUmaG93IHRvIGRvIElPTCBQb3dlciAoU1JLKSBpbiBvcHRvbWV0cnk%3D",
    "https://www.youtube.com/watch?v=x5TekSxNaJs&pp=ygUpaG93IHRvIGRvIFZlcnRpY2FsIEltYmFsYW5jZSBpbiBvcHRvbWV0cnk%3D"
];

urls.forEach(u => console.log(formatEmbedUrl(u)));
