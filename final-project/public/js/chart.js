$( document ).ready(function() {
   cart.run();
});  

var cart = {
    updateQuantity: function(type,id) {
        console.log('hrehehe',type,id);
    },
    run: function() {
        this.updateQuantity();
    }
};

function updateOrder(element){
    var id = $(element).attr("data-id");
    var type =$(element).attr('class');
    $.ajax('/updateOrder', {
        type: 'POST',
        data: {
            id: id,
            type: type
        }
    }).done(function(response) {
        $('input[name="input_quan_' + id + '"]').val(response.quantity);
        console.log('quantity', response.quantity);
        if (response.disabled == true) {
            $(element).prop('disabled', true);
        } else {
            $(element).prop('disabled', false);
        }
    }).fail(function(response) {
        console.log('fail');
    });
    // $.ajax('/updateQuantity',{
    //     'type':'POST',
    //     'data':{
    //         'id': id,
    //         'type':type
    //     }
    // }).done(function(response){
    //     // console.log('success',response.headers['set-cookie']);
    //     var input ='input_quan_'+id;
    //     $('input[name="input_quan_'+id+'"]').val(response.quantity);
    //     console.log('quantity',response.quantity);
    //     if(response.disabled == true){
    //         $(element).prop('disabled', true); 
    //     }else{
    //         $(element).prop('disabled', false); 
    //     }
    // }).fail(function(response){
    //     console.log('fail');
    // })
}