
function updateOrder(element){
    var id = $(element).parent().attr("data-id");
    var type =$(element).attr('class');
    $.ajax('/updateOrder', {
        type: 'POST',
        data: {
            id: id,
            type: type
        }
    }).done(function(response) {
        $('input[name="input_quan_' + id + '"]').val(response.quantity);
        if (response.disabled == true) {
            $(element).prop('disabled', true);
        } else {
            $(element).prop('disabled', false);
        }
        if(type =='btn_delete'){
            $('.order_item_'+id).remove();
        }
        updateValueSummary(response.subTotal,response.totalQuantity);
    }).fail(function(response) {
        console.log('fail');
    });
}
function updateValueSummary( subTotal,totalQuantity){
     
        if(subTotal == 0){
            $('.sub_total').text('$0');
            $('.delivery').text('$0');
            $('.tax').text('$0');
            $('.total_incl').text('$0');

        }else{
            console.log('subTotal delete',subTotal);
            var tax =Math.round(subTotal *0.1 * 100) / 100;
            var isCoupon = $('#coupon_reduce').val(); 
            var delivery_type=$('select[name="delivery"] option:selected').val();
            var delivery =0;
            
            if(delivery_type == '0'){
                delivery = 15;
                $('.delivery').text('$15');

            }else{
                $('.delivery').text('$0');
            }     
            var total = subTotal + tax +delivery;
                if(isCoupon =='true'){
                    var couponReduce =couponReducePrice(subTotal);               
                    $('.coupon_reduce').text('-$'+couponReduce);
                    total= total-couponReduce;
                }
            $('.sub_total').text('$'+subTotal);
            $('.total_incl').text('$'+total);
            $('.tax').text('$'+tax);
            
            $('#total').val(total);
            $('#sub_total_val').val(sub);
        }
        $('.total_quan').text(totalQuantity +' item(s)');
        
}
function changeQuantity(element){
    var id = $(element).parent().attr("data-id");
    var quantity = $(element).val();
    console.log('quanityt',quantity)
    $.ajax('/onChange',{
        type: 'POST',
        data: {
            id: id,
            quantity: quantity
        }
    }).done(function(response) {
        updateValueSummary(response.subTotal,response.totalQuantity);
        console.log('success');

    }).fail(function(response) {
        console.log('fail');
    });

}
 function onchangeDelivery(){
    var delivery_type=$('select[name="delivery"] option:selected').val();
    var delivery =0;
    var total =parseInt($('#total').val());
    if(delivery_type == '0'){
        delivery = 15;
        $('.delivery').text('$15');
        total = total+15;
        $('.total_incl').text('$'+(total));
        $('#total').val(total);

    }else{
        console.log('here',total)
        $('.delivery').text('$0');
        total = total - 15;
        $('.total_incl').text('$'+(total));
        $('#total').val(total);

    } 

 }

function applyCoupon(){
    var code = $('input[name=coupon]').val();
    var sub =$('#sub_total_val').val();
    var couponList =['FREESHIP','FATHERSDAY','FAMILYDAY'];
    $('.coupon_status').css('display','flex');
    if(couponList.includes(code)){
        $('.coupon_error').text('');
        var sale= couponReducePrice(sub);
        $('.total_incl').text('$'+(sub-sale));
        $('.coupon_reduce').text('-$'+sale);
        $('#coupon_reduce').val(true);
    }else{
        $('#coupon_reduce').val(false);
        $('.coupon_reduce').text('');
        $('.coupon_error').text('Coupon code not exists!')
    }
}
function couponReducePrice(sub){

    return sub*0.1;
}

function samurayClick(){    
    var card =$('input[name="card"]:checked').val();
    var name =$('input[name="name"]').val();
    var card_num =$('input[name="card_num"]').val();
    var expiation =$('input[name="expiation"]').val();
    var cvv =$('input[name="cvv"]').val();
    var delivery =$('select[name="delivery"] option:selected').val();

    var data ={ card:card,
        name:name,
        card_num:card_num,
        expiation:expiation,
        cvv:cvv,
        delivery:delivery
    };
    summaryValidate(data);
    $.ajax('/summary',{
        type: 'POST',
        data: data
    }).done(function(response) {
        
        console.log('Success');
    }).done(function(response) {
        console.log('Fail');
    })
}
function summaryValidate(data){
    
  if (data.card == "") {
    alert("Card must be selected");
    return false;
  }
  if (data.name == "") {
    alert("Cardholders's Name must be filled out");
    return false;
  }
  if (data.card_num == "") {
    alert("Card Number must be filled out");
    return false;
  }
  if (data.expiation == "") {
    alert("Expiration must be filled out");
    return false;
  }
  if (data.cvv == "") {
    alert("Cvv must be filled out");
    return false;
  }
  if (data.delivery == "") {
    alert("Delivery must be filled out");
    return false;
  }
}