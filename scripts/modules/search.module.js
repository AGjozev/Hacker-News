/**
 * Created by AGjozev on 6/8/2016.
 */

var search = (function(){
    var me = {};
    var $searchTitle = $('#category_search');

    me.init =function() {
        attachEvents();
    };

    return me;

    function attachEvents () {

      $(document).on("keydown", "#search", function(e){
          var searchForm = $("#search");
          var text = searchForm.val();
          if (e.which == 13) {
              if (!text)
                  return;
              if(Loading.on){
                  e.preventDefault();
                  return;
              }
              $searchTitle.text('Searched for "'+ text +'" in: ');
              render.emptyContainer();
              newsManager.search(text);
          } else {
              if (e.which == 27) {
                  searchForm.val("");
              }
          }

        }); // search on pressing enter


      $(document).on("click", "#search_icon", function(e){
            var searchForm = $("#search");
            var text = searchForm.val();
                if (!text)
                    return;
                if(Loading.on){
                    e.preventDefault();
                    return;
                }
          $searchTitle.text("Searched in: ");
                render.emptyContainer();
                newsManager.search(text);
        });  // search on clicking search icon


    }

}());