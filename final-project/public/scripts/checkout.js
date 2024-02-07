
  function clickBtnDelivery(){
    var data ={      
      firstName :$('#first_name').val(),  
      mail :$('#mail_name').val(),  
      street :$('#address_number').val(),  
      city :$('#city').val(),  
      state :$('#state').val(),  
      zip :$('#zip_code').val(),  
      phone :$('#phone').val(),       
      total :$('#total').val(),  
    }
    if(summaryValidate(data)){
      $.ajax('/sendMail',{
        type:'POST',
        data: data
      }).done(function(response) {
        
        openDelivery();
      }).fail(function(response){
        console.log('fail')
      })
    }

  }

  
function summaryValidate(data){
  
if (data.firstName == '') {
  $('.invali_first_name').css('display','block');
  return false;
}else{
  $('.invali_first_name').css('display','none');
}

if (data.mail == '') {
  $('.invali_email').css('display','block');
  return false;
}else{
  $('.invali_email').css('display','none');
}

if (data.street == '') {
  $('.invali_street').css('display','block');
  return false;
}else{
  $('.invali_street').css('display','none');
}

if (data.city == '') {
  $('.invali_city').css('display','block');
  return false;
}else{
  $('.invali_city').css('display','none');
}

if (data.state == '') {
  $('.invali_state').css('display','block');
  return false;
}else{
  $('.invali_state').css('display','none');
}

if (data.zip == '') {
  $('.invali_zip_code').css('display','block');
  return false;
}else{
  $('.invali_zip_code').css('display','none');
}

if (data.phone == '') {
  $('.invali_phone').css('display','block');
  return false;
}else{
  $('.invali_phone').css('display','none');
}
return true;

}

function openDelivery() {
  $('.delivery_popup').css("display", "block");
}