// 添加图片上传功能
function getFile (event){
    var ev = event || window.event;
    var ele = ev.target || ev.srcElement;
    var $form = jQuery(ele).parents('form');

    function updateImageUrl(res) {

        $form.find('.btn_box').hide();
        var url = res.data;
        if (!url) {
            ZCar.log(res);
            // res.responseText = "";
            url = res.responseJSON && res.responseJSON.data;
            url = url || "";
        }
        url = formatPartImgUrl(url) || "";

        if(window.localStorage){
            var userId_num = location.href.split("?")[1];
            var storage = window.localStorage;
            storage["userId_num"] = url;
            alert(userId_num);
            alert(url);
            alert(storage["userId_num"]);
        }
        //window.close();
    }
    $form.ajaxForm({
        dataType:  'json',
        success:updateImageUrl
    }).submit();
};

// 过滤图片域名
function formatPartImgUrl(vendor) {
    if (typeof vendor !== "string") {
        return vendor;
    }
    if(vendor.indexOf('superto.com/') == -1 && vendor.indexOf('/img/') != 0){
        return  'http://images.superto.com' + vendor;
    }else{
        return vendor;
    }
};