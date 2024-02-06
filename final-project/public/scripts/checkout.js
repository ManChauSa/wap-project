function openDelivery() {

    $('.delivery_popup').css("display", "block");
  }

  function clickBtnDelivery(){
    if(summaryValidate()){
      openDelivery();
    }

  }

  
function summaryValidate(){
  var firstName =$('#first_name').val();  
  var lastName =$('#last_name').val();  
  var street =$('#address_number').val();  
  var city =$('#city').val();  
  var state =$('#state').val();  
  var zip =$('#zip_code').val();  
  var phone =$('#phone').val();  
  
if (firstName == '') {
  $('.invali_first_name').css('display','block');
  return false;
}else{
  $('.invali_first_name').css('display','none');
}

if (lastName == '') {
  $('.invali_last_name').css('display','block');
  return false;
}else{
  $('.invali_last_name').css('display','none');
}

if (street == '') {
  $('.invali_street').css('display','block');
  return false;
}else{
  $('.invali_street').css('display','none');
}

if (city == '') {
  $('.invali_city').css('display','block');
  return false;
}else{
  $('.invali_city').css('display','none');
}

if (state == '') {
  $('.invali_state').css('display','block');
  return false;
}else{
  $('.invali_state').css('display','none');
}

if (zip == '') {
  $('.invali_zip_code').css('display','block');
  return false;
}else{
  $('.invali_zip_code').css('display','none');
}

if (phone == '') {
  $('.invali_phone').css('display','block');
  return false;
}else{
  $('.invali_phone').css('display','none');
}
return true;

}