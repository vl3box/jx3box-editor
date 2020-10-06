import $ from "jquery";
import PhotoSwipe from "photoswipe";
import PhotoSwipeUI_Default from "photoswipe/dist/photoswipe-ui-default";
import "photoswipe/dist/photoswipe.css";
import "photoswipe/dist/default-skin/default-skin.css";
import tpl from "./pswp_template.js";
// https://photoswipe.com/documentation/options.html

class Gallery {
    constructor(options) {
        this._picbox = "";
        this.options = options || {
            bgOpacity: 0.8,
            shareEl: false,
            zoomEl: true,
            closeOnScroll: false,
        };
        this.bucket = [];
        this.items = [];
        this.pswp = "";
    }
    init($root, $selector = "img") {
        // 创建容器
        let isExist = document.querySelectorAll(".pswp").length;
        if (!isExist) $("body").append(tpl);
        this._picbox = document.querySelectorAll(".pswp")[0];

        //fix需要清空,可能替换内容重复渲染
        this.bucket = [];
        this.items = [];

        // 缓存图片序列
        $($root)
            .find($selector + ":visible")
            .each((i, $pic) => {
                this.bucket.push($pic);
                this.items.push({
                    $el: $pic,
                    src: $pic.src,
                    w: $pic.naturalWidth || $pic.width || 0,
                    h: $pic.naturalHeight || $pic.height || 0,
                });
            });

        // 绑定事件
        $($root).on("click", $selector, (e) => {
            this.open(e.target);
        });
    }
    open(target) {
        let i = this.bucket.indexOf(target);
        //可能为0
        if (i > -1) {
            let _options = Object.assign(this.options, {
                index: i,
            });
            // 需要在每次调用时重新初始化，因为关闭按钮会自动销毁实例
            let pswp = new PhotoSwipe(
                this._picbox,
                PhotoSwipeUI_Default,
                this.items,
                _options
            );
            pswp.init(); //为什么打开的api不叫open要叫init太歧义了，我脑壳疼，这组件太高端
            pswp.listen('close', ()=> {
                $('.pswp').eq(0).removeClass('pswp--open')      //不能自己移除，不知道为啥
            });
            // console.log(pswp);
        }
    }
}

export default new Gallery();
