/**
 * Created by AGjozev on 5/31/2016.
 */

var ajaxManager = (function(){
    var me = {};
    var counter = 0;
    var idArray = [];
    var searchArr = [];
    var ajaxArr = [];


    var searchUrl = {
        all: 'https://hacker-news.firebaseio.com/v0/newstories.json?print=pretty',
        hot: 'https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty',
        show: 'https://hacker-news.firebaseio.com/v0/showstories.json?print=pretty',
        ask: 'https://hacker-news.firebaseio.com/v0/askstories.json?print=pretty',
        jobs: 'https://hacker-news.firebaseio.com/v0/jobstories.json?print=pretty',
        maxId: "https://hacker-news.firebaseio.com/v0/maxitem.json?print=pretty"
    };

    var storageId = {
        all: "newStories",
        hot: "hotStories",
        show: "showStories",
        ask: "askStories",
        jobs: "jobStories"
    };

    /* ajax request for all the stories ids in the category the search is performed*/
    me.search = function(text){
        startLoadAnimation();

        counter = 0;
        searchArr = [];
        var activeTab = getActive();
        var url = activeTab[0];
        var storageName = activeTab[1];
        $.ajax({
            type: 'GET',
            url: url,
            success:function (response) {

                searchItemReceived(response, text);
            },
            error: function () {
                var response = localStorage.getItem(storageName);
                var data = JSON.parse(response);
                searchItemReceived(data, text);
            }
        });
    };

    /* ajax request for the stories ids in the category "ALL" */
    me.getAll = function(page) {
        startLoadAnimation();
        counter = 0;
        $.ajax({
            type: 'GET',
            url: searchUrl.all,
            success:function (response) {
                var dataString = JSON.stringify(response);
                localStorage.setItem(storageId.all, dataString);
                newItemReceived(response, page);
                idArray = response;
            },
            error: function () {
                var response = localStorage.getItem(storageId.all);
                var data = JSON.parse(response);
                newItemReceived(data, page);
                idArray = data;
            }
        });
    };

    /* ajax request for the stories ids in the category "HOT" */
    me.getHotStories = function(page) {
        startLoadAnimation();
        counter = 0;
        $.ajax({
            type: 'GET',
            url: searchUrl.hot,
            success:function (response) {
                var dataString = JSON.stringify(response);
                localStorage.setItem(storageId.hot, dataString);
                idArray = response;
                newItemReceived(response, page);
            },
            error: function () {
                var response = localStorage.getItem(storageId.hot);
                var data = JSON.parse(response);
                newItemReceived(data, page);
                idArray = data;
            }
        });
    };

    /* ajax request for the stories ids in the category "JOBS" */
    me.getAllJobs = function(page) {
        startLoadAnimation();
        counter = 0;
        $.ajax({
            type: 'GET',
            url: searchUrl.jobs,

            success:  function (response) {
                var dataString = JSON.stringify(response);
                localStorage.setItem(storageId.jobs, dataString);
                idArray = response;
                newItemReceived(response, page);
            },
            error: function () {
                var response = localStorage.getItem(storageId.jobs);
                var data = JSON.parse(response);
                newItemReceived(data, page);
                idArray = data;
            }
        });

    };

    /* ajax request for the stories ids in the category "ASK" */
    me.getAllAskHN = function(page) {
        startLoadAnimation();
        counter = 0;
        $.ajax({
            type: 'GET',
            url: searchUrl.ask,
            success:  function (response) {
                var dataString = JSON.stringify(response);
                localStorage.setItem(storageId.ask, dataString);
                idArray = response;
                newItemReceived(response, page);
            },
            error: function() {
                var response = localStorage.getItem(storageId.ask);
                var data = JSON.parse(response);
                newItemReceived(data, page);
                idArray = data;
            }
        });


    };

    /* ajax request for the stories ids in the category "SHOW" */
    me.getAllShowHN = function(page) {
        startLoadAnimation();
        counter = 0;
        $.ajax({
            type: 'GET',
            url: searchUrl.show,
            success: function(response) {
                var dataString = JSON.stringify(response);
                localStorage.setItem(storageId.show, dataString);
                idArray = response;
                newItemReceived(response, page);
            },
            error: function(){
                var response = localStorage.getItem(storageId.show);
                var data = JSON.parse(response);
                newItemReceived(data, page);
                idArray = data;
            }
        });
    };

    /* ajax request for the comments for a specific story */
    me.getComments = function(id) {
        startLoadAnimation();
        $.ajax({
            type: 'GET',
            url: 'https://hacker-news.firebaseio.com/v0/item/'+ id +'.json?print=pretty',
            success:function (response) {
                var comments = response.kids;
                for(var i=0; i<comments.length; i++) {
                    var commentId=comments[i];
                    $.ajax({
                        type: 'GET',
                        url: 'https://hacker-news.firebaseio.com/v0/item/' + commentId + '.json?print=pretty',
                        success:function (data) {
                            if(!data.deleted) {
                                $(document).trigger(Events.commentReceived, [data, id]);
                                var subComment = data.kids;

                                if (subComment) {
                                    var itemId = data.id;
                                    subComments(itemId);
                                }
                            }
                        },
                        error: function () {
                        }
                    });
                }
            },
            error: function (response) {
                // var response = storage.getAllItem(id);
                //  $(document).trigger("itemReceived", response);
            }
        });
    };

    /* ajax request for the last item id*/
    me.getMaxItemId = function () {
        var result;
        $.ajax({
            type: 'GET',
            url: searchUrl.maxId,
            async: false,
            success:function(data) {
                result = data;
            }

        });
        return result;
    };

    me.init = function(){
        attachEvents();
    };


    return me;

    function attachEvents(){
        $( document ).ajaxStop(function() {
           stopLoadAnimation();
        });
    }

    function abortAjaxRequests() {
        for(var i=0; i<ajaxArr.length; i++){
            ajaxArr[i].abort();
        }
    } //abort all pending ajax requests after receiving a certain number of search results

    function startLoadAnimation() {
        render.loadAnimation();
            Loading.on = true;


    } // loading circle activated

    function stopLoadAnimation(){

            Loading.on = false;
            render.stopLoadAnimation();

    } // loading circle deactivated

    function searchResults () {

        if (searchArr.length == 0){
            $(document).trigger(Events.searchItemReceived, false);
        }else {
            for (var i = 0; i < searchArr.length; i++) {
                var data = searchArr[i];
                $(document).trigger(Events.searchItemReceived, data);
            }
        }
        stopLoadAnimation();
        render.sortSearchResults();
    } // send search items to news manager

    function searchItemReceived(response, text) {
        $(document).trigger(Events.pageNumbers, [1, 1]);
        var textArr = text.split(" ");
        startLoadAnimation();
        idArray = response;
        ajaxArr = [];

            for (var i = 0; i < response.length; i++) {
               var id = response[i];
                $.ajax({
                    type: 'GET',
                    url: 'https://hacker-news.firebaseio.com/v0/item/' + id + '.json?print=pretty',
                    beforeSend: function(request){
                        ajaxArr.push(request);
                    },
                    success: function (data) {
                        counter++;
                        if (!data.deleted) {
                            var matchNumber = 0;
                            var title = data.title.toLowerCase();
                            var name = data.by.toLowerCase();
                            var url =  data.url;
                            if(url !== undefined && url !== null){
                                url=data.url.toLowerCase();
                            }else{
                                url = "";
                            }
                            for (var j=0; j<textArr.length; j++) {
                                var myText = textArr[j].toLowerCase();
                                if (title.indexOf(myText) != -1 || name.indexOf(myText) != -1 || url.indexOf(myText) != -1) {
                                    matchNumber++;
                                }
                            }

                            if(matchNumber > 0){
                                data.position =matchNumber;
                                searchArr.push(data);
                            }

                            if (counter == response.length ) {
                                    searchResults();
                                    abortAjaxRequests();

                                }

                        }

                    },
                    error: function () {
                        counter++;
                        var matchNumber = 0;
                        var id = idArray[counter];
                        var itemId = JSON.stringify(id);
                        var item = localStorage.getItem(itemId);
                        var data = JSON.parse(item);

                        if (data !== null && data !== undefined) {


                            var title = data.title.toLowerCase();
                            var name = data.by.toLowerCase();
                            var url = data.url;
                            if (url !== undefined && url !== null) {
                                url = data.url.toLowerCase();
                            } else {
                                url = "";
                            }
                            for (var j = 0; j < textArr.length; j++) {
                                var myText = textArr[j].toLowerCase();
                                if (title.indexOf(myText) != -1 || name.indexOf(myText) != -1 || url.indexOf(myText) != -1) {
                                    searchArr.push(data);
                                    matchNumber++;
                                }
                            }

                            if (matchNumber > 0) {
                                searchArr.push(data);
                            }


                            if (counter == idArray.length) {
                                searchResults();
                            }

                        }




                    }
                });


            }

    } // perform ajax requests for each story by its id in the specific category and compare it with the search input text

    function newItemReceived(response, page) {
        var listEnd = 20;
        var end = page*20;
        var start = end -20;

        var pages = Math.ceil(response.length / 20);
        $(document).trigger(Events.pageNumbers, [pages, page]);

        if(end > response.length){
            end = response.length;
            listEnd = response.length - ((pages - 1)*20);
        }
        for(var i=start; i<end; i++) {
            var id=response[i];
           $.ajax({
                type: 'GET',
                url: 'https://hacker-news.firebaseio.com/v0/item/' + id + '.json?print=pretty',
                success:function (data) {
                    if(data!== null && data !== undefined && !data.deleted) {
                        var thisId = data.id;
                        var itemId = JSON.stringify(thisId);
                        var dataString = JSON.stringify(data);

                        $(document).trigger(Events.itemsReceived, [data, listEnd]);
                        localStorage.setItem(itemId, dataString);
                        counter++;
                        if (counter == listEnd) {
                            stopLoadAnimation()
                        }
                    }

                },
                error: function () {
                    var j = start + counter;
                    var id = idArray[j];
                    var itemId = JSON.stringify(id);
                    var storageItem = localStorage.getItem(itemId);
                    var item = JSON.parse(storageItem);

                        $(document).trigger(Events.itemsReceived, [item, listEnd]);
                        counter++;
                        if (counter == listEnd) {
                            stopLoadAnimation()
                        }


                }
            });
        }
    } // perform ajax requests for each story by its id in the specific category

    function subComments(id){
        $.ajax({
            type: 'GET',
            url: 'https://hacker-news.firebaseio.com/v0/item/'+ id +'.json?print=pretty',
            success:function (response) {
                var comments = response.kids;
                for(var i=0; i<comments.length; i++) {
                    var commentId=comments[i];
                    $.ajax({
                        type: 'GET',
                        url: 'https://hacker-news.firebaseio.com/v0/item/' + commentId + '.json?print=pretty',
                        success:function (data) {
                            if(!data.deleted) {
                                $(document).trigger(Events.commentReceived, [data, id]);
                                var subComment = data.kids;

                                if (subComment) {
                                    var itemId = data.id;
                                    subComments(itemId);
                                }
                            }
                        },
                        error: function () {
                        }
                    });
                }
            },
            error: function () {
            }
        });

    } // check for sub comments and perform ajax requests for each

    function getActive() {
        var activeTab = $('.active').attr("id");
        switch (activeTab){
            case "all":
                return [searchUrl.all, storageId.all];
                break;
            case "hot":
                return [searchUrl.hot, storageId.hot];
                break;
            case "show_hn":
                return [searchUrl.show, storageId.show];
                break;
            case "ask_hn":
                return [searchUrl.ask, storageId.ask];
                break;
            case "polls":

                break;
            case "jobs":
                return [searchUrl.jobs, storageId.jobs];
                break;
            case "starred":
                break;
        }
    } // get the active category for the search




}());