/**
 * Created by AGjozev on 6/1/2016.
 */


var render = (function() {
    var me = {};
    var $newsHolder = $('#news_holder');

    /* set alternative image */
    me.image = function () {
      $(this).css("src","assets/images/logo-hn-search.png")
    };

    /* remove all previously rendered stories */
    me.emptyContainer = function(){
        $("#news_holder").empty();
    };

    /* render loading circle */
    me.loadAnimation = function(){
        $("#load_circle").addClass("rotate");
    };

    /* remove loading circle */
    me.stopLoadAnimation = function(){
        $("#load_circle").removeClass("rotate");
    };

    /* fade out of the news container while rendering the news stories */
    me.fadeOutNewsContainer = function(){

        $("#news_container").fadeOut(0);
    };

    /* fade in of the news container after all the news stories have been rendered */
    me.fadeInNewsContainer = function(){
        $("#news_container").fadeIn(200);
    };

    /* send to render all the search results from a category*/
    me.search = function(data) {
        if(data == false){
            renderNoSearchResults();
        }else{

        renderStory(data);
        }

    };

    /* sort the search results from a category*/
    me.sortSearchResults = function(){
        var $stories = $(".news_tab");

        $stories.detach().sort(function (a, b) {
            return $(b).attr('data-position') - $(a).attr('data-position');

        });



        $('#news_holder').append($stories);
    };

    /* send to render all the stories from a category*/
    me.Stories = function(dataSpan) {

        me.fadeOutNewsContainer();



        for(var i = 0; i<dataSpan.length; i++){
            var data = dataSpan[i];
            if(data !== null){
            renderStory(data);
            }else{
                renderEmptyItem();
            }
        }

        me.fadeInNewsContainer();
        $('.page_numbers').css("visibility","visible");

    };

    /* send to render comment from a story*/
    me.newsComments = function(data, id) {
        renderNewsComments(data, id);
    };

    /* send to render sub comment from a story*/
    me.newsSubComments = function(data, id) {
        renderNewsSubComments(data, id);
    };

    /* send to render page numbers for a category*/
    me.pageNumbers = function(pages, page) {
        if(pages < 8) {
            renderSimplePageNumbers(pages, page);
        }else{
            renderPageNumbers(pages, page);
        }
    };

    return me;

    function renderNoSearchResults() {
        var message = $('<h2 class="news_message">SORRY, NO RESULTS FOUND.</h2>');
        $newsHolder.append(message);

    } // message for no items found with a search

    function renderEmptyItem() {
        var $newsTab = $('<div class="row news_tab"/>');
        var $imageHolder = $('<div class="col-md-1 col-sm-0 col-xs-0"/>');
        var $image = $('<img src="assets/images/logo-hn-search.png" class="news_image" >');

        $imageHolder.append($image);

        var $contentHolder = $('<div class="col-md-9 col-sm-9 col-xs-12 content_holder"/>');
        var $newsTitle = $('<h4 class="news_title">THIS ITEM IS NOT AVAILABLE AT THIS MOMENT.</h4>');

        $contentHolder.append($newsTitle);
        $newsTab.append($imageHolder, $contentHolder);
        $newsHolder.append($newsTab)
    } // render not available items message while offline

    function renderStory(item){
        var person = item.by;
        var points = item.score;
        var url = item.url;
        var urlOrigin;
        var position = 0;

        if(item.position != null && item.position !== undefined){
            position = item.position;
        }

        if(url == undefined){
            url ="";
            urlOrigin = "";
        }else{
            var urlSpliter = url.split('/');
            urlOrigin = urlSpliter[0]+ "/"+urlSpliter[1]+ "/" +urlSpliter[2];
        }

        var title = item.title;
        var time = item.time;
        var text = item.text;
        var itemId = item.id;
        var commentsNumber = item.descendants;
        var imageUrl= "";
        var timeMoment = moment.unix(time).fromNow();

     //   if(online) {
            imageUrl = "https://drcs9k8uelb9s.cloudfront.net/" + itemId + ".png";
     //   }else{
     //       imageUrl = "assets/images/logo-hn-search.png"
     //   }

        if(!item.descendants){
            commentsNumber = 0 ;
        }

        if(!item.url){
            url = 'https://news.ycombinator.com/item?id=' + itemId + '';
        }

        var $newsTab = $('<div class="row news_tab" data-position="'+ position +'"/>');
        var $imageHolder = $('<div class="col-md-1 col-sm-0"/>');
        var $image = $('<img src="'+ imageUrl +'" class="news_image" data-url="'+ url +'" onerror="this.src='+'"assets/images/logo-hn-search.png"'+'/>');
        var $imageLink = $('<a href="'+ url +'"/>');

        $image.off('error')
            .on('error' , function(){
            $(this).attr("src", "assets/images/logo-hn-search.png");
        });

        $imageLink.append($image);
        $imageHolder.append($imageLink);

        var $contentHolder = $('<div class="col-md-9 col-sm-9 col-xs-12 content_holder"/>');
        var $newsTitle = $('<a class="title_link" href="'+ url +'"><h4 class="news_title">'+ title +'</h4></a>');

        var $pointsLink = $('<div class="link_holder form-inline"/>');
        var $pointsIcon = $('<img src="assets/icons/Hearts-50.png" class="link_icons form-inline"/>');
        var $pointsNumber = $('<h6 class="link form-inline" id="points_link"/>').text(points);

            $pointsLink.append($pointsIcon, $pointsNumber);

        var $personLink = $('<div class="link_holder form-inline"/>');
        var $personIcon = $('<img src="assets/icons/Contacts_2.png" class="link_icons "/>');
        var $personName = $('<h6 class="link" id="person_link"/>').text(person);

            $personLink.append($personIcon, $personName);

        var $timeLink = $('<div class="link_holder form-inline"/>');
        var $timeIcon = $('<img src="assets/icons/Watch.png" class="link_icons"/>');
        var $timeShow = $('<h6 class="link" id="time_link">').text(timeMoment) ;

            $timeLink.append($timeIcon, $timeShow);

        var $urlLink = $('<a class="source_site" href="'+ urlOrigin +'"/>').text(urlOrigin);

        var $thisText = $('<div class="comment_text"/>').html(text);
        var $commentsContainer = $('<div class="comments_container"/>').attr('data-id', itemId);

        $contentHolder.append($newsTitle, $pointsLink, $personLink, $timeLink, $urlLink, $thisText, $commentsContainer);

        var $newsOptions = $('<div class="col-md-2 col-sm-3 col-xs-12 form-inline news_options"/>').attr('data-id', itemId);
        var $shareIcon = $('<img src="assets/icons/Share.png" class="share_icon form-inline" data-url="'+ url +'"/>');
        var $commentCounterBackground = $('<div class="comments_counter_background form-inline">').attr('data-id', itemId).attr('data-comments',commentsNumber);
        var $commentCounter = $('<p class="comment_counter">').text(commentsNumber);

            $commentCounterBackground.append($commentCounter);

        $newsOptions.append( $shareIcon, $commentCounterBackground);

        $newsTab.append($imageHolder, $contentHolder, $newsOptions);
        $newsHolder.append($newsTab)
    } // render news story

    function renderNewsComments(data, id) {
        var itemId = data.id;
        var url = 'https://news.ycombinator.com/item?id=' + itemId + '';
        var $contentHolder = $('.comments_container[data-id="'+ id +'"]');

        var $commentLink =  $('<a href="'+ url +'"/>');
        var $commentHolder = $('<div class="comment_holder" data-id="'+ itemId +'"/>');
        var comment = data.text;
        var person = data.by;
        var $personLink = $('<div class="link_holder form-inline"/>');
        var $personIcon = $('<img src="assets/icons/Contacts_2.png" class="link_icons "/>');
        var $personName = $('<h5 class="link" id="person_link"/>').text(person+": ");
        $personLink.append($personIcon, $personName);

        var $commentItem = $('<div class="comment_part"/>').html(comment);

        if($contentHolder.length == 0){
            $contentHolder = $('.comment_holder[data-id="'+ id +'"]');
            $commentHolder.css("border-left","solid 1px #e4e4e6");
        }

        $commentHolder.append($personLink, $commentItem);
        $commentLink.append($commentHolder);
        $contentHolder.append($commentLink);
    } // render comment

    function renderNewsSubComments(data, id) {
        var itemId = data.id;
        var url = 'https://news.ycombinator.com/item?id=' + itemId + '';
        var $contentHolder = $('.comment_holder[data-id="'+ id +'"]');
        var $commentHolder = $('<a href="'+ url +'"><div class="sub_comment_holder"/></a>');
        var comment = data.text;
        var person = data.by;
        var $personLink = $('<div class="link_holder form-inline"/>');
        var $personIcon = $('<img src="assets/icons/Contacts_2.png" class="link_icons "/>');
        var $personName = $('<h5 class="link" id="person_link"/>').text(person+": ");
       $personLink.append($personIcon, $personName);

        var $commentItem = $('<div class="comment_part"/>').html(comment);
        $commentHolder.append($personLink, $commentItem);
        $contentHolder.append($commentHolder);
    } // render sub comment

    function renderSimplePageNumbers(pages, page) {
        $('.number').remove();
        $('.arrow').remove();
        var $footer = $('.page_numbers');
        for(var i=1; i<=pages; i++){
            var $button = $('<p class="number" id="'+ i +'">'+ i +'</p>');
            if(i === page){
                $button.addClass('active_page');
            }
            $footer.append($button);
        }

    } // render page numbers for specific category if they are less then 8

    function renderPageNumbers(pages, page) {
        $('.number').remove();
        $('.arrow').remove();
        var $footer = $('.page_numbers');
        var $next = $('<p class="arrow" id="next">  >>  </p>');
        var $previous = $('<p class="arrow" id="previous">  <<  </p>');
        var $first = $('<p class="number" id="1">1</p>');
        var $last = $('<p class="number" id="'+ pages +'">'+ pages +'</p>');
        var $spacer = $('<p class="number spacer" >...</p>');
        var $spacer1 = $('<p class="number spacer" >...</p>');
        var start = page-3;
        if(page == 1){
            $first.addClass('active_page')
        }
        if(start < 2){
            start = 2;
        }
        var end = start + 6;
        if(end > pages){
        end = pages;
        }
        if(start > 2){
            $footer.append($previous, $first, $spacer1);
        }else{
        $footer.append($first);
        }

        for(var i=start; i<end; i++){
            var $button = $('<p class="number" id="'+ i +'">'+ i +'</p>');
            if(i === page){
            $button.addClass('active_page');
            }
            $footer.append($button);
        }

        if(end == pages){
            if(page == pages){
                $last.addClass("active_page")
            }
            $footer.append($last);
        }else {
            $footer.append($spacer, $last, $next);
        }
    } // render page numbers for specific category


}());