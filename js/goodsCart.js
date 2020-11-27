define(["jquery","jquery-cookie"], function ($) {
    
    // 加载已经加入购物车的商品
    function loadCartData() {
        // 清除上一次的加载结果
        $("#J_cartListBody .J_cartGoods").html("");
        // 通过promis取得，goodsList.json和goodsCarList.json中的数据
        new Promise(function (resolve, reject) {
            $.ajax({
                url: "../data/goodsCarList.json",
                success: function (obj) {
                    // 如果下载成功，把下载到的数据中的data返回
                    resolve(obj.data);
                },
                error: function (msg) {
                    console.log(msg);
                }
            })
        }).then(function (arr1) {
            return new Promise(function (resolve, reject) {
                $.ajax({
                    url: "../data/goodsList2.json",
                    success: function (arr2) {
                        // 将两份数据合并
                        var newArr = arr1.concat(arr2);
                        resolve(newArr);
                    },
                    error: function (msg) {
                        console.log(msg);
                    }
                })
            })
        }).then(function (arr) {
            // 拿到服务器上所有商品的数据，然后找出cookie中有的数据
            var cookieStr = $.cookie("goods");
            if (cookieStr) {
                var cookieArr = JSON.parse(cookieStr);
                var newArr = [];
                for (var i = 0, len = cookieArr.length; i < len; i++){ // 遍历所有的cookie中的商品
                    for (var j = 0, lenj = arr.length; j < lenj; j++){ // 遍历所有的商品 找出于cookie id值一样的商品 并保存在新数组中
                        if(cookieArr[i].id == arr[j].product_id || cookieArr[i].id == arr[j].goodsid){
                            arr[j].num = cookieArr[i].num;

                            //设置商品id一致
                            arr[j].id = arr[j].product_id ? arr[j].product_id : arr[j].goodsid;
                            newArr.push(arr[j]);
                        }
                    }
                }

                // 拿到所有购物车的商品数据加载到页面上
                for (var i = 0, len = newArr.length; i < len; i++){
                    var node = $(` <div class="item-row clearfix" id = ${newArr[i].id}> 
                    <div class="col col-check">  
                        <i class="iconfont icon-checkbox icon-checkbox-selected J_itemCheckbox" data-itemid="2192300031_0_buy" data-status="1">√</i>  
                    </div> 
                    <div class="col col-img">  
                        <a href="//item.mi.com/${newArr[i].id}.html" target="_blank"> 
                            <img alt="" src="${newArr[i].image}" width="80" height="80"> 
                        </a>  
                    </div> 
                    <div class="col col-name">  
                        <div class="tags">   
                        </div>     
                        <div class="tags">  
                        </div>   
                        <h3 class="name">  
                            <a href="//item.mi.com/${newArr[i].id}.html" target="_blank"> 
                                ${newArr[i].name}
                            </a>  
                        </h3>        
                    </div> 
                    <div class="col col-price"> 
                        ${newArr[i].price}元 
                        <p class="pre-info">  </p> 
                    </div> 
                    <div class="col col-num">  
                        <div class="change-goods-num clearfix J_changeGoodsNum"> 
                            <a href="javascript:void(0)" class="J_minus">
                                <i class="iconfont"></i>
                            </a> 
                            <input tyep="text" name="2192300031_0_buy" value="${newArr[i].num}" data-num="1" data-buylimit="20" autocomplete="off" class="goods-num J_goodsNum" "=""> 
                            <a href="javascript:void(0)" class="J_plus"><i class="iconfont"></i></a>   
                        </div>  
                    </div> 
                    <div class="col col-total"> 
                        ${(newArr[i].price * newArr[i].num).toFixed(1)}元 
                        <p class="pre-info">  </p> 
                    </div> 
                    <div class="col col-action"> 
                        <a id="2192300031_0_buy" data-msg="确定删除吗？" href="javascript:void(0);" title="删除" class="del J_delGoods"><i class="iconfont"></i></a> 
                    </div> 
                </div> `);
                node.appendTo($("#J_cartListBody .J_cartGoods"));
                }
                
                // 数据加载成功
                isCheckAll(); // 计算总数
            }
        }).catch(function (error) {
            console.log(error);
        })
    }

    // 加载职能推荐商品
    function download(){
        $.ajax({
            url: "../data/goodsCarList.json",
            success: function(obj){
                var arr = obj.data;
                for(var i = 0; i < arr.length; i++){
                    $(`<li class="J_xm-recommend-list span4">    
                    <dl> 
                        <dt> 
                            <a href="#"> 
                                <img src="${arr[i].image}" srcset="//i1.mifile.cn/a1/pms_1551867177.2478190!280x280.jpg  2x" alt="小米净水器1A（厨下式）"> 
                            </a> 
                        </dt> 
                        <dd class="xm-recommend-name"> 
                            <a href="#"> 
                                ${arr[i].name}
                            </a> 
                        </dd> 
                        <dd class="xm-recommend-price">${arr[i].price}元</dd> 
                        <dd class="xm-recommend-tips">   ${arr[i].comments}人好评    
                            <a class="btn btn-small btn-line-primary J_xm-recommend-btn" href="#" style="display: none;" id = "${arr[i].goodsid}">加入购物车</a>  
                        </dd> 
                        <dd class="xm-recommend-notice">

                        </dd> 
                    </dl>  
                </li>`).appendTo($("#J_miRecommendBox .xm-recommend ul.row"))
                }
            },
            error: function(msg){
                console.log(msg);
            }
        })
    }


    // 智能推荐商品加入购物车操作
    function cartHover() {
        $("#J_miRecommendBox .xm-recommend ul.row").on("mouseenter", ".J_xm-recommend-list", function(){
            $(this).find(".xm-recommend-tips a").css("display", "block");
        })
        $("#J_miRecommendBox .xm-recommend ul.row").on("mouseleave", ".J_xm-recommend-list", function(){
            $(this).find(".xm-recommend-tips a").css("display", "none");
        })

         //添加加入购物车操作
         $("#J_miRecommendBox .xm-recommend ul.row").on("click", ".J_xm-recommend-list a.btn", function(){
            //获取当前的商品列表
            var id = this.id;
            //进行购物车操作   goods键，json格式字符串为值
            //1、先去判断cookie中是否存在商品信息
            var first = $.cookie("goods") == null ? true : false;

            //2、如果是第一次添加
            if(first){
                //直接创建cookie
                var cookieStr = `[{"id":${id},"num":1}]`;
                $.cookie("goods", cookieStr, {
                    expires: 7
                })
            }else{
                var same = false; //假设没有添加过
                //3、如果不是第一次添加，判断之前是否添加过
                var cookieStr = $.cookie("goods");
                var cookieArr = JSON.parse(cookieStr);
                for(var i = 0; i < cookieArr.length; i++){
                    if(cookieArr[i].id == id){
                        //如果之前添加过，数量+1
                        cookieArr[i].num++;
                        same = true;
                        break;
                    }
                }

                if(!same){
                    //如果没有添加过，新增商品数据
                    var obj = {id:id, num:1};
                    cookieArr.push(obj);
                }

                //最后，存回cookie中
                $.cookie("goods", JSON.stringify(cookieArr), {
                    expires: 7
                })
            }

            // alert($.cookie("goods"));
            loadCartData();
            return false;
        })
    }


    // 全选按钮和单选按钮的点击实现
    function checkFunc() {
        $(".list-head .col-check").find("i").click(function () {
            var allChecks = $(".list-body").find(".item-row").find(".col-check i");
            if ($(this).hasClass("icon-checkbox-selected")) {
                $(this).add(allChecks).removeClass("icon-checkbox-selected");
            } else {
                $(this).add(allChecks).addClass("icon-checkbox-selected");
            }
            isCheckAll();
            return false;
        })

        // 给每个商品的复选框设置 
        $("#J_cartListBody .J_cartGoods").on("click", ".col-check i", function(){
            if($(this).hasClass("icon-checkbox-selected")){
                $(this).removeClass("icon-checkbox-selected");
            }else{
                $(this).addClass("icon-checkbox-selected");
            }
            isCheckAll();
            return false;
        })

    }



    // 判断是否全选中
    function isCheckAll() {
        var allchecks = $(".list-body").find(".item-row");

        var isAll = true; // 默认全选
        var total = 0; // 记录选中的价格
        var count = 0; // 记录被选中的条数
        var totalCount = 0; // 记录总条数

        allchecks.each(function (index, item) {
            if (!$(item).find(".col-check i").hasClass("icon-checkbox-selected")) {
                isAll = false;
            } else {
                total += parseFloat($(item).find(".col-price").html().trim()) * parseFloat($(item).find(".col-num input").val());
                count += parseInt($(item).find(".col-num input").val());
            }
            totalCount += parseInt($(item).find(".col-num input").val());
        });

        $("#J_cartTotalPrice").html(total);
        $("#J_selTotalNum").html(count);
        $("#J_cartTotalNum").html(totalCount);

        // 判断是否全选
        if (isAll) {
            $(".list-head .col-check").find("i").addClass("icon-checkbox-selected");
        } else {
            $(".list-head .col-check").find("i").removeClass("icon-checkbox-selected");
        }

    }


    // 给页面上的商品添加增加减少和删除操作
    function changeCars() {
        // 给每一个删除按钮添加事件
        $("#J_cartListBody .J_cartGoods").on("click", ".col-action .J_delGoods", function(){
            //删除页面上的数据，并且在cookie中删除数据
            var id = $(this).closest(".item-row").remove().attr("id");
            var cookieStr = $.cookie("goods");
            var cookieArr = JSON.parse(cookieStr);
            for(var i = 0; i < cookieArr.length; i++){
                if(id == cookieArr[i].id){
                    //删除数据
                    cookieArr.splice(i, 1);
                    break;
                }
            }

            cookieArr.length == 0 ? $.cookie("goods", null) : $.cookie("goods", JSON.stringify(cookieArr), {
                expires: 7
            })
            isCheckAll();

            return false;
            
        })

        //给每一个+和-添加事件
        $("#J_cartListBody .J_cartGoods").on("click", ".J_minus,.J_plus", function(){
            //1、先找出当前+和-按钮所在商品的id
            var id = $(this).closest(".item-row").attr("id");
            //找出cookie
            var cookieStr = $.cookie("goods");
            var cookieArr = JSON.parse(cookieStr);
            for(var i = 0; i < cookieArr.length; i++){
                if(cookieArr[i].id == id){
                    //说明该用户找到了
                    if(this.className == "J_minus"){
                        //数量-1
                        cookieArr[i].num == 1 ? alert("数量已经为1，不能再减少！") : cookieArr[i].num--;
                    }else{
                        cookieArr[i].num++;
                    }
                    break;
                }
            }
            //更新页面上的数量
            $(this).siblings("input").val(cookieArr[i].num);
            //更新页面上的单个商品价格
            var price = parseFloat($(this).closest(".col-num").siblings(".col-price").html().trim());
            $(this).closest(".col-num").siblings(".col-total").html((price * cookieArr[i].num).toFixed(1) + "元");

            //最后将更改后的数据存储到cookie中
            $.cookie("goods", JSON.stringify(cookieArr), {
                expires: 7
            })

            //每次更改一次数据，重新计算一次总价
            isCheckAll();

            return false;
        })

    }



    return {
        loadCartData: loadCartData,
        download: download,
        checkFunc: checkFunc,
        cartHover: cartHover,
        changeCars: changeCars
    }

})