var JSONData = [{id: 1,type: "norm",content: "block 1"},{id: 2,type: "tall",content: "block 2"},{id: 3,type: "norm",content: "block 3"},{id: 4,type: "wide",content: "block 4"},{id: 5,type: "norm",content: "block 5"},{id: 6,type: "norm",content: "block 6"},{id: 7,type: "norm",content: "block 7"},{id: 8,type: "norm",content: "block 8"},{id: 9,type: "tall",content: "block 9"},{id: 10,type: "norm",content: "block 10"},{id: 11,type: "wide",content: "block 11"},{id: 12,type: "wide",content: "block 12"},{id: 13,type: "wide",content: "block 13"},{id: 14,type: "tall",content: "block 14"}];

(function () {
    var options = {
        baseSize: 100,
        columns: 3,
        body: document.getElementsByClassName('c-body')[0]
    };



    var createHTML = function () {
        var boxWidth = options.baseSize + 'px';
        var boxHeight = options.baseSize + 'px';
        var boxTop = '';
        var boxleft = '';

        if (this.class === 'wide') boxWidth = '200px';
        if (this.class === 'tall') boxHeight = '200px';
        
        var DIV = '<div class="' + this.class + '" ' + 
            'style="width:' + boxWidth + ';' +
                'height:' + boxHeight + ';' +
                'top:' + this.topPosition + ';' +
                'left:' + this.leftPosition + ';">' +
            '<p>' + this.content + '</p>' +
            '</div>';
        return DIV;
    };

    var Box = function (element, places) {
        this.class = element.type;
        this.tall = element.type === 'tall';
        this.wide = element.type === 'wide';
        this.norm = element.type === 'norm';
        this.id = 0;
        this.topPosition = Math.floor(places.indexOf(element.id) / 3) * options.baseSize + 'px';
        this.leftPosition = places.indexOf(element.id) % 3 * options.baseSize + 'px';
        this.content = element.content ? element.content : "";
    };

    Box.prototype = {
        createHTML: createHTML
    };

    // build HTML
    var HTMLPage = "";
    var buildHTML = function (data, places) {
        data.forEach(function (element) {
            var box = new Box(element, places);
            HTMLPage = HTMLPage + box.createHTML();
        });
    };

    //add to the page builtd HTML
    var addToPage = function (HTML) {
        options.body.innerHTML = HTML;
    };

    //location
    var places = [];



    //check place for norm
    //return index of free place for normal block
    var getPlaceForNorm = function(places){
        if (places.length > 0) {
            if (places.indexOf(null) < 0) {
                for (var i=0; i < places.length ;i++) {
                    if (places[i] === undefined) {
                        places[i] = null;
                        return places.indexOf(null);
                    }
                }
                places[places.length] = null;
            } else {
                return places.indexOf(null);
            }
        } else {
            places[0] = null;
        }         
        return places.indexOf(null);
    };



    //check place for wide
    var checkPlaceForWide = function(places, emptyIndex){
        return places[emptyIndex] === null && (places[emptyIndex + 1] === null || places[emptyIndex + 1] === undefined) && emptyIndex % 3 != 2;
    };

    //check place for tall
    var checkPlaceForTall = function(places, emptyIndex){
        return places[emptyIndex] === null && (places[emptyIndex + 3] === null || places[emptyIndex + 3] === undefined);
    };



    // insert norm
    var insertNorm = function(places, firstEmptyIndex, id){
        places[firstEmptyIndex] = id;
    };



    // insert wide and Tall
    // return index of free place for wide or tall
    var findFreePlaceForWideOrTall = function(places, firstEmptyIndex, check){
        var flag = false;
        var freePlace;
        for (var i = firstEmptyIndex; i < places.length; i++) {
            if (check(places, i)) {
                freePlace = i;
                flag = true;
                return freePlace;
            }
        }

        if (!flag) {
            var add = function(){
                if (check(places, places.length - 1)) {
                    freePlace = places.length - 1;
                    return freePlace;
                } else {
                    places[places.length] = null;
                    add(places);
                }
            };
            add(places);
        }
        return freePlace;
    };



    //insert new box
    var insertToPlaces = function(places, type, id){
        var firstEmptyIndex = getPlaceForNorm(places);
        var freePlace;
        if (type === 'wide') {
            freePlace = findFreePlaceForWideOrTall(places, firstEmptyIndex, checkPlaceForWide);
            places[freePlace] = id;
            places[freePlace + 1] = 0;
        } else if (type === 'tall') {
            freePlace = findFreePlaceForWideOrTall(places, firstEmptyIndex, checkPlaceForTall);
            places[freePlace] = id;
            places[freePlace + 3] = 0;
        } else {
            insertNorm(places, firstEmptyIndex, id);
        }
    };



    //update places array
    var updatePlaces = function(places, blocks){
        places = [];
        blocks.forEach(function(block){
            insertToPlaces(places, block.type, block.id);
        });

        buildHTML(JSONData, places);
        addToPage(HTMLPage);
    };

    updatePlaces(places, JSONData);

    

})();
