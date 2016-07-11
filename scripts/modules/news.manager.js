/**
 * Created by AGjozev on 6/3/2016.
 */

var newsManager = (function() {
    var me={};
    var allDataSpan = [];


    /*  search with search form in active category*/
    me.search = function(text){
        resetPageCounters();
        ajaxManager.search(text);
    };

    /*  get all items from "ALL" category*/
    me.searchALLStories = function(page) {
        resetPageCounters();
        ajaxManager.getAll(page);

    };

    /*  get all items from "HOT" category*/
    me.searchHotStories = function(page) {
        resetPageCounters();
        ajaxManager.getHotStories(page);

    };

    /*  get all items from "JOBS" category*/
    me.searchAllJobs = function(page) {
        resetPageCounters();
        ajaxManager.getAllJobs(page);

    };

    /*  get all items from "ASK HN" category*/
    me.searchAllAskHN = function(page) {
        resetPageCounters();
        ajaxManager.getAllAskHN(page);

    };

    /*  get all items from "SHOW HN" category*/
    me.searchAllShowHN = function(page) {
        resetPageCounters();
        ajaxManager.getAllShowHN(page);

    };

    /*  get all comments for selected story*/
    me.getComments = function(id){
        ajaxManager.getComments(id)
    };

    me.init = function() {
        resetPageCounters();
        attachEvents();
    };


    return me;


    function resetPageCounters() {
        allDataSpan = [];
    } // empties the array that holds the news stories from the previous request

    function attachEvents () {


        $(document).on(Events.itemsReceived, function (e, data, end) {
            allDataSpan.push(data);
            if(allDataSpan.length === end){
                    render.Stories(allDataSpan);
            }
        }); // received stories from specific category and send them to render

        $(document).on(Events.searchItemReceived, function (e, data) {
                render.search(data);

        }); // received stories from a search in specific category and send them to render

        $(document).on(Events.pageNumbers, function(e, pages, page){
            render.pageNumbers(pages, page);

        }); // received number of pages for the stories and send the information to render

        $(document).on(Events.commentReceived, function (e, data, id) {
            render.newsComments(data, id)

        }); // received comment for a specific story and send it to render


    }

}());