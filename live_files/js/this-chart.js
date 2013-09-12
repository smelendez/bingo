var ds;
var FREE = 12;
var FREEROW = 2;
var FREECOL = 2;
var CARDSIZE = 5;
var key;
var card_template;
var share_template;
var bingo=false;

function validate_bingo() {
    if(!bingo)
    {
        alert("Hang on -- you need to get five in a row first!");
        event.preventDefault();
        return false;
    }
    return true;

}
function key_to_link()
{
    return basemap_location + '?key=' +  _.reduce(key, function (a,b) {return a + b;});

}
function check_bingo_diag_top()
{
    for(var i = 0; i < CARDSIZE; i++)
    {
        if(!(has_chip(i, i)))
        {
            if(i != FREEROW)
            {
                return false;
            }
        }
    }
    return true;
}
function check_bingo_diag_bottom()
{
    for(var i = 0; i < CARDSIZE; i++)
    {
        row = i;
        col = CARDSIZE - i -1;
        if(!(has_chip(row, col)))
        {
            if(row != FREEROW || col != FREECOL)
            {
                return false;
            }
        }
    }
    return true;

}
function check_bingo_row(row)
{
    for(var col = 0; col < CARDSIZE; col++)
    {
        if(!(has_chip(row, col)))
        {
            if(row != FREEROW || col != FREECOL)
            {
                return false;
            }
        }
    }
    return true;
}
function check_bingo_col(col)
{
    for(var row = 0; row < CARDSIZE; row++)
    {
        if(!(has_chip(row, col)))
        {
            if(row != FREEROW || col != FREECOL)
            {
                return false;
            }
        }

    }
    return true;

}

function check_bingo()
{
    for(var i =0; i < CARDSIZE; i++)
    {
        if(check_bingo_row(i) || check_bingo_col(i) || check_bingo_diag_bottom() || check_bingo_diag_top())
        {
            return true;
        }
    }
        return false;
}
function add_chip(row, col)
{
    var cardid = '#card-' + row + '-' + col;

    var $card = $(cardid);
    var $cardtext = $(cardid + " .card-text");
    var index = parseInt(row * CARDSIZE, 10);
    index += parseInt(col, 10);
    key[index] = key[index].toUpperCase();
    if(row == FREEROW && col == FREECOL)
    {
        $card.css('background-image', 'url("img/piece_free_chip.png")');

    }
    else
    {
        $card.css('background-image', 'url("img/piece_chip.png")');
    }
    //$cardtext.hide();

}
function remove_chip(row, col)
{
    var cardid = '#card-' + row + '-' + col;

    var $card = $(cardid);
    var $cardtext = $(cardid + " .card-text");
    var index = parseInt(row * CARDSIZE, 10);
    index += parseInt(col, 10);
    key[index] = key[index].toLowerCase();
    if($card.hasClass('free'))
    {
        $card.css('background-image', 'url("img/piece_free.png")');

    }
    else
    {
        $card.css('background-image', 'url("img/piece_bg.png")');
    }
    $cardtext.show();

}
function update_bingo()
{
    bingo = check_bingo();

    if(bingo)
    {
     $('#yell-link').attr('href', 'https://twitter.com/intent/tweet?hashtags=debatebingo&url='+encodeURI(key_to_link())+"&text="+encodeURIComponent("BINGO!!! Check out my bingo card and make your own"));
        $('#yell-button').attr('src', 'img/yellbingo_active.png');

    }
    else
    {
        $('#yell-button').attr('src', 'img/yellbingo_disabled.png');
        $('#yell-link').attr("href", "#");

    }
    $('#sharestuff').html(share_template({permalink : key_to_link() }));
    $('#printurl').attr("href",key_to_link().replace("newcard","printcard"));

}
function shareBox()
{
    $.getScript("http://platform.twitter.com/widgets.js");
    dataBox();

}
function setup_tweets(){
!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src="https://platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");
}
function toggle_chip(row, col)
{
    if(has_chip(row, col))
    {
        remove_chip(row,col);
    }
    else
    {
        add_chip(row, col);
    }
    update_bingo();
}
    
function has_chip(row, col)
{
    var index = parseInt(row * CARDSIZE, 10);
    index += parseInt(col, 10);

    if(key[index] == key[index].toUpperCase())
    {
        return true;
    }
    return false;
}
function make_random_key()
{
    var columnNames = ds.columnNames();
    var key = [];
    var lowercase = "a".charCodeAt(0);
    for (var col = 0; col < CARDSIZE; col++)
    {
        var indices = _.first(_.shuffle(_.range(ds.column(columnNames[col]).data.length)), CARDSIZE);

        for(var row = 0; row < CARDSIZE; row++)
        {
            key[row * CARDSIZE + col] = String.fromCharCode(indices[row] + lowercase);
            
        }

    }
    return key;

}
function make_card()
{
    key = $.url.param("key");
    var lowercase = "a".charCodeAt(0);
    var uppercase = "A".charCodeAt(0);
    var cards = [[],[],[],[],[]];
    var columnNames = ds.columnNames();

    if(!key)
    {
        key = make_random_key();
    }
        // index of each cell in appropriate column as a letter
        // capitalized if there's a chip on it

    key = _.map(key);
    for (var i = 0; i < key.length; i++)
    {
        var row = Math.floor (i / CARDSIZE);
        var col = i % CARDSIZE;
        var ascii = key[i].toLowerCase().charCodeAt(0);
        var chip = (key[i] == key[i].toUpperCase()) ? 'chip' : '';

        var index = ascii - lowercase;

        if(row == FREEROW && col == FREECOL)
        {
            cards[row][col] = {text: '',
            chip: 'free' + chip,
            row: row,
            col: col};
        }


            

        else {
            cards[row][col] = {text: ds.column(columnNames[col]).data[index], 
            chip: chip,
            row: row,
            col: col};
        }

    }
    for (var r = 0; r < CARDSIZE; r++)
    {
        for (var c = 0; c < CARDSIZE; c++)
        {
            $('#chart-container').append(card_template(cards[r][c]));
        
        }
    }
    $('.chip .card-text').hide();
    update_bingo();


    $('.card').mouseover(function(){
        if(printable)
        {
            return;
        }
        if($(this).hasClass('free'))
        {
            $(this).css('background-image', 'url("img/piece_free_hover.png")');

        }
        else
        {
            $(this).css('background-image', 'url("img/piece_hover.png")');
        }
        var cardid =$(this).attr('id');
        $('#' + cardid + ' .card-text').show();


    });
    $('.card').mouseout(function(){
        if(printable)
        {
            return;
        }
        var cardid = $(this).attr('id');
        var splitid = cardid.split("-");
        if(has_chip(splitid[1],splitid[2]))
        {
            if($(this).hasClass('free'))
            {
                $(this).css('background-image', 'url("img/piece_free_chip.png")');

            }

            else {
                $(this).css('background-image', 'url("img/piece_chip.png")');
            }
            //$('#' + cardid + ' .card-text').hide();
        }
        else if($(this).hasClass('free'))
        {
            $(this).css('background-image', 'url("img/piece_free.png")');

        }
        else {
            $(this).css('background-image', 'url("img/piece_bg.png")');
        }

            


    });
    $('.free').mouseout();
    if(printable)
    {
        $('.free').html('<img src="img/print_piece_free.png"></img>');
    }
    $('.card').click(function(){
        if(printable)
        {
            return;
        }
        var cardid = $(this).attr('id');
        var splitid = cardid.split("-");
        toggle_chip(splitid[1], splitid[2]);

    });
    $('#yell-button').mouseover(function(){
        if(printable)
        {
            return;
        }

        if(!bingo)
        {
            return;
        }

        $('#yell-button').attr('src', 'img/yellbingo_hover.gif');

    });
    $('#yell-button').mouseout(function(){
        if(printable)
        {
            return;
        }
        if(!bingo)
        {
            return;
        }
        $('#yell-button').attr('src', 'img/yellbingo_active.png');

    });

}


                
                
            
        


$.ready()
{
    ds = new Miso.Dataset({
    url : "data/bingo.csv",
    worksheet : "1",
    delimiter: ","
    });
    card_template = Handlebars.compile($('#card-template').html());
    share_template = Handlebars.compile($('#share-template').html());
ds.fetch({
success : function() {
    make_card();
    
    
},
error : function() {
// your error callback here!
}
});

}
