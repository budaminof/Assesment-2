$(document).ready(function (){
console.log('Hi Bud');
    $('option:selected').on('click', function (){
        console.log('clicking');
        console.log($(this).val());
    })

})
