
function initialize() {}

var $openbox = false;

function closebox()
{
    if(!$openbox) return;
    var src = $openbox.attr('src');

    $openbox.attr('src',src.replace("_on","_off"));
    $('.popupbox').hide();
    $openbox = false;
}

function openbox()
{
    var src = $openbox.attr('src');
    $openbox.attr('src',src.replace("_off","_on"));
}


// Do the following when the page is ready

$(document).ready(function(){

    if($('body').width() >= 400 && !($('#social').parent().is('#social')))
    {
        $("#header").prepend($('#social'));
        $('#social').css('position', 'absolute')
        .css('top', '8px').css('right', '8px');
    }
    $('.footerbutton img,.button img').mouseover(function()
    {
        var src = $(this).attr('src');
        $(this).attr('src',src.replace("_off","_on"));
    });
    $('.footerbutton img,.button img').mouseout(function()
    {
        var src = $(this).attr('src');
        if(!$openbox || src != $openbox.attr('src'))
        {
            $(this).attr('src',src.replace("_on","_off"));
        }
    });
    $(document).keyup(function(e) {

    if (e.keyCode == 27) { 
        //escape
        closebox();
    
    }
    });
    $('.closebutton').click(function(){
        closebox();

    });


});

function currentMapUrl() {
	var embed_url_response = embedmap_location;
  // + "?lat=" + map.getCenter().lat().toFixed(4) 
  // + "&lon=" + map.getCenter().lng().toFixed(4) 
  // + "&zoom=" + map.getZoom();
	return embed_url_response;
}

function embedBox() {
    var $embedbox = $("#embedbox");
    var $oldopenbox = $openbox;
    var height = "725";
    if (typeof embed_size !== "undefined")
    {
        height = embed_size;
    }
    closebox();
    $openbox = $('#embedlink img');
    if($oldopenbox && $openbox.attr('src') == $oldopenbox.attr('src'))
    {
        $openbox = false;
        return;
    }
    var embed_url = currentMapUrl();
    $('#maplink').html(basemap_location);
    $('#embedcode').html("&lt;iframe src=\""+embed_url+"\" height=\""+height+"\" width=\"100%\" scrolling=\"no\" frameborder=\"0\"&gt;&lt;/iframe&gt;");
    $embedbox.show();
    openbox();
}
    
function creditBox() {
    var $creditbox = $("#creditbox");
    var $oldopenbox = $openbox;
    closebox();
    $openbox = $('#creditlink img');
    if($oldopenbox && $openbox.attr('src') == $oldopenbox.attr('src'))
    {
        $openbox = false;
        return;
    }
    $creditbox.show();
    openbox();

}
function dataBox() {
    var $databox = $("#databox");
    var $oldopenbox = $openbox;
    closebox();
    $openbox = $('#datalink img');
    if($oldopenbox && $openbox.attr('src') == $oldopenbox.attr('src'))
    {
        $openbox = false;
        return;
    }
    $databox.show();
    openbox();

}

function feedbackBox() {
    var $feedback = $("#feedbackbox");
    var $oldopenbox = $openbox;
    closebox();
    $openbox = $('#feedbacklink img');
    if($oldopenbox && $openbox.attr('src') == $oldopenbox.attr('src'))
    {
        $openbox = false;
        return;
    }
    $feedback.show();
    openbox();

}

function expandWindow() {
    window.open( currentMapUrl() );
    return false;
}
