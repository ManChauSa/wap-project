
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('myForm').addEventListener('submit', function(event) {
        event.preventDefault();
        if(summaryValidate()){
            document.getElementById('myForm').submit();

        }
    })
})
function summaryValidate(){
    var card =$('input[name="card"]:checked').val();
    var name =$('input[name="name"]').val();
    var card_num =$('input[name="card_num"]').val();
    var expiation =$('input[name="expiation"]').val();
    var cvv =$('input[name="cvv"]').val();
    var delivery =$('select[name="delivery"] option:selected').val();    
    
  if (card == undefined) {
    $('.invalid-card').css('display','block');
    return false;
  }else{
    $('.invalid-card').css('display','none');
  }
  if (name == "") {
    $('.invali-name').css('display','block');
    return false;
  }else{
    $('.invali-name').css('display','none');
  }
  if (card_num == "") {
    $('.invali-num').css('display','block');
    return false;
  }else {
    $('.invali-num').css('display','none');
  }
  if (expiation == "") {
    $('.invali-expiation').css('display','block');
    return false;
  }else{
    $('.invali-expiation').css('display','none');
  }
  if (cvv == "") {
    $('.invali-cvv').css('display','block');
    return false;
  }else{
    $('.invali-cvv').css('display','none');
  }
  if (delivery == "") {
    $('.invali-delivery').css('display','block');
    return false;
  }else {
    $('.invali-delivery').css('display','none');
  }
  return true;

}


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
        setValueDetailSamuray(response.subTotal);
        if(response.totalQuantity == 0){
          $('#submitBtn').css("pointer-events","none");
        }else{
          $('#submitBtn').css("pointer-events","unset");
        }
        $('.total_quan').text(response.totalQuantity +' item(s)');
    }).fail(function(response) {
        console.log('fail');
    });
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
        setValueDetailSamuray(response.subTotal)
        $('.total_quan').text(response.totalQuantity +' item(s)');
        console.log('success');

    }).fail(function(response) {
        console.log('fail');
    });

}
 function onchangeDelivery(){
    var subTotal =parseInt($('#sub_total_val').val());
    setValueDetailSamuray(subTotal);

 }

 function setValueDetailSamuray(subTotal){
    if(subTotal == 0){
        $('.sub_total').text('$0');
        $('.delivery').text('$0');
        $('.tax').text('$0');
        $('.total_incl').text('$0');
        
    $('#total').val(0);
    $('#sub_total_val').val(0);

    }else{
        var delivery =$('select[name="delivery"] option:selected').val();
        var tax = parseFloat((subTotal*0.1).toFixed(2));
        var total = parseFloat(subTotal) + tax;
        console.log('subTotal here ',subTotal);
        console.log('tax',tax);
        console.log('total',total);

        var coupon = $('#coupon_reduce').val();
        if(coupon =='true'){
            var sale = parseFloat((subTotal*0.1).toFixed(2));
            total = total - sale;
            $('.coupon_reduce').text('-$'+sale);
            $('.btn_coupon').css('pointer-events','none');
            $('.btn_coupon').css('color','#a89494');
            $('.btn_coupon').css('background-color','#e1d8d8');
        }
        if(delivery == '0'){
            total = total + 15;
            $('.delivery').text('$15');
        }else{
            $('.delivery').text('$0');
        }
        console.log('subTotal',subTotal)
        $('.sub_total').text('$'+(subTotal.toFixed(2)));
        $('.total_incl').text('$'+(total.toFixed(2)));
        $('.tax').text('$'+tax);
        
        $('#total').val(total);
        $('#sub_total_val').val(subTotal);
    
        
    }

 }

function applyCoupon(){
    var code = $('input[name=coupon]').val();
    var sub = parseFloat($('#sub_total_val').val());
    var couponList =['FREESHIP','FATHERSDAY','FAMILYDAY'];
    $('.coupon_status').css('display','flex');
    if(couponList.includes(code)){
        $('.coupon_error').text('');
        $('#coupon_reduce').val(true);
        setValueDetailSamuray(sub);
    }else{
        $('#coupon_reduce').val(false);
        $('.coupon_reduce').text('');
        $('.coupon_error').text('Coupon code not exists!')
    }
}

