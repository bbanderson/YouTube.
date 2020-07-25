const desc = document.querySelector(".video__description__text");

const init = () => {
    var str = desc.innerHTML;
    desc.innerHTML = str.replace(/(?:\r\n|\r|\n)/g, '<br />');
};

if (desc) {
    init();
}