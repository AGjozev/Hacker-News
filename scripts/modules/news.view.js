/**
 * Created by AGjozev on 6/3/2016.
 */

var newsView = (function(){
    var me = {};


    me.init =function() {
        attachEvents();
    };

    return me;

    function sendCommentsToRender(counter){
        var itemId = counter.attr('data-id');
        newsManager.getComments(itemId);
    }

    function attachEvents () {

        $(document).on("click", ".share_icon", function(){
            var url = $(this).attr("data-url");
            FB.ui({
                method: 'share_open_graph',
                action_type: 'og.likes',
                action_properties: JSON.stringify({
                    object: url
                })
            }, function(response){
            });

        }); //share story on facebook

        $(document).on('click',".comments_counter_background", function(e){
            if(Loading.on){
                e.preventDefault();
                return;
            }
            var counter = $(this);
            var id = counter.attr('data-id');
            var number = counter.attr('data-comments');
            if(counter.hasClass('open')){
                $('.comments_container[data-id="'+ id +'"]').empty();
                counter.removeClass('open');
            }else {
                if (number == 0)
                    return;

                counter.addClass('open');
                sendCommentsToRender(counter);
            }
        });  // send request for comments for selected story


        $(document).on('mouseover', ".share_icon", function(){
            $(this).attr('src', 'assets/icons/Share_orn.png');
        });

        $(document).on('mouseout', ".share_icon", function(){
            $(this).attr('src', 'assets/icons/Share.png');
        });


    }

}());