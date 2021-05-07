$(document).ready(()=>{
    var state = false
    var show = $('.show')
    $(show).click(function (e) { 
        e.preventDefault();
        if(state){
            $('#password').attr('type', 'password')
            $('.show').css('color', '#666')
            state = false
        }
        else{
            $('#password').attr('type', 'text')
            $('.show').css('color', 'rgb(65, 149, 160)')
            state = true
        }
    });
})

$(document).ready(()=>{
    var state = false
    var show2 = $('.show2')
    $(show2).click(function (e) { 
        e.preventDefault();
        if(state){
            $('#password2').attr('type', 'password')
            $('.show2').css('color', '#666')
            state = false
        }
        else{
            $('#password2').attr('type', 'text')
            $('.show2').css('color', 'rgb(65, 149, 160)')
            state = true
        }
    });
})

$(document).ready(function () {
    $("#mobile_btn").click(function () { 
        $("header").toggleClass("menu");
        $("#mobile_btn i").toggleClass("rotate_icon");
    });
});