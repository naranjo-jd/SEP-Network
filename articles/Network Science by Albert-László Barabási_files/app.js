var defaultPageTitle = 'Network Science by Albert-László Barabási';

var networkBook = angular.module('networkBook', ['duScroll', 'ngRoute', 'ngPageTitle', 'FBAngular']);
networkBook.constant("baseUrl","//index.html");

//templateUrl is set based on the filepath string in the language array
networkBook.config(function($routeProvider, $locationProvider){
  $routeProvider
    .when("/", {
      templateUrl: ".."+languages[selectedLang].filepath +"partials/home.html",
      controller: "HomeCtrl",
      controllerAs: "home",
      activetab: 'home'
    })
    .when("/chapter/:chapterNumber", {
      templateUrl: function(){return ".."+languages[selectedLang].filepath+"partials/chapter.html";},
      controller: "ChapterCtrl",
      controllerAs: "chapter",
      activetab: 'chapter'
    })
    .when("/chapter", {
      redirectTo: '/chapter/1'
    })
    .when("/bookmarks", {
      templateUrl: ".."+languages[selectedLang].filepath +"partials/bookmarks.html",
      controller: "BookmarksCtrl",
      controllerAs: "bookmarks",
      activetab: 'bookmarks'
    })
    .when("/notes", {
      templateUrl: ".."+languages[selectedLang].filepath +"partials/notes.html",
      controller: "NotesCtrl",
      controllerAs: "notes",
      activetab: 'notes'
    })
    .when("/visualizations", {
      templateUrl: ".."+languages[selectedLang].filepath +"partials/visualizations.html",
      controller: "VisualizationsCtrl",
      controllerAs: "visualizations",
      activetab: 'visualizations'
    })
    .otherwise({
      redirectTo: '/'
    });
  $locationProvider.html5Mode(true);
});

// var newBaseUrl = '';

var initialScroll = false;

networkBook.run(function($rootScope, lastRead) {
  if(!window.history || !history.replaceState) {
    return;
  }
  $rootScope.$on('duScrollspy:becameActive', function($event, $element, $target) {
    //Automaticly update location
    if (!initialScroll) {
      initialScroll = true;
      return;
    }
    //changing URL with app
    var hash = $element.prop('hash');
    if (hash) {
      history.replaceState(null, null, lastRead.getProperty() + hash);
    }
  });
});

// Service: Last read chapter
networkBook.service('lastRead', function() {
  var lastRead = '/chapter/1';

  return {
    getProperty: function() {
        return lastRead;
    },
    setProperty: function(chapter) {
        lastRead = chapter;
    }
  };
});

// MainCtrl
networkBook.controller('MainCtrl', function($rootScope, $scope, $route, $location, $attrs, $element, $window, $timeout, $routeParams, lastRead) {
  $scope.$route = $route;
  $scope.navigationVisible = true;
  $scope.searchVisible = false;
  $scope.search = {};
  $scope.selectedResult = -1;

  $scope.toggleNavigation = function() {
    if($route.current.activetab == 'chapter') {
      $scope.navigationVisible = !$scope.navigationVisible;
    } else {
      $location.path(lastRead.getProperty());
    }
    //if search tab is visible, hide it
    if($scope.searchVisible == true){
      $scope.searchVisible = false;
    }
    //changing active tab in sidebar
    angular.element( document.querySelector( '#search')).removeClass("active");
    angular.element( document.querySelector( '#tab-contents')).addClass("active");
  }

  $scope.toggleSearch = function() {
    //if table of contents is showing, hide it
    // if($scope.navigationVisible == true){
    //   $scope.navigationVisible = false;
    // }
    if($route.current.activetab == 'chapter') {
      $scope.navigationVisible = !$scope.navigationVisible;
    } else {
      $location.path(lastRead.getProperty());
    }
    //toggle search tab
    if($scope.searchVisible == true){
      $scope.searchVisible = false;
      angular.element( document.querySelector( '#search' ) ).removeClass("active");
    }else{
      $scope.searchVisible = true;
      angular.element( document.querySelector( '#search')).addClass("active");
      angular.element( document.querySelector( '#tab-contents')).removeClass("active");
    }
  }

  var _timeout;
  var searchresults;
  //search all partials for string
  $scope.searchText = function() {
    //delay 0.5 seconds (allow user to finish typing)
    if(_timeout) { // if there is already a timeout in process cancel it
        $timeout.cancel(_timeout);
    }
    _timeout = $timeout(function() {
      console.log('filtering');
      _timeout = null;
      searchresults = [];

      for(i=0;i<11;i++){
        searchChapter(i, searchCallback);
      }

      function searchChapter(i, callback){
        var client = new XMLHttpRequest();
        //parse chapter i
        client.open('GET', languages[selectedLang].filepath+"/partials/ch-"+i+".html");
        client.onreadystatechange = function() {
          $scope.$apply();
          if (client.readyState == 4 && client.status == 200){
            callback(client.responseText);
          }
        }
        client.send();
      }
    }, 500);
  }

  function searchCallback(response){
    var chresults = [];
    var index = 0;
    var splitResponse = response.split($scope.search.val);
    var secId;

    for(s=0;s<splitResponse.length-1;s++){
      //140 character text displayed in sidebar, minus markup
      var result = splitResponse[(s+1)].split("<")[0];
      result = result.substr(0,100)+"...";
      result = $scope.search.val + result;
      //isolating section id
      var lastIdIndex;
      getSec(s);
      function getSec(index){
        lastIdIndex = splitResponse[index].lastIndexOf('"section-number">');
        if(lastIdIndex == -1){
          getSec(index-1);
        }else{
          secId = splitResponse[index].substring(lastIdIndex + 17,splitResponse[index].length);
          secId = secId.split('<')[0];
        }
      }
      var chId;
      var ixdot = secId.indexOf(".");
      if(secId.indexOf("Box")>-1){
        chId = secId.substring(4,ixdot);
      }else if(secId.indexOf("Часть")>-1){
        chId = secId.substring(6,ixdot);
      }else{
        chId = secId.substring(8,ixdot);
      }
      chresults.push({text:result, ch:chId, secid:secId, link:"chapter/"+chId});
      index+=splitResponse[s].length;
    }
    //if not add result to search results
    searchresults = searchresults.concat(chresults);
    $scope.results = searchresults;
  }

  $scope.highlight = function (ch, text) {
    chapterNumber = $routeParams.chapterNumber;
    chapterNumber = parseInt(chapterNumber);
    if(ch == chapterNumber){
      highlightMain();
    }else{
      $scope.$on('$viewContentLoaded', function(event){
        highlightMain();
      });
    }

    function highlightMain(){
      $timeout(function() {
          //remove active from other, add to selected
          // var allResults = document.getElementById("search-results-id").children;
          // for(i=0;i<allResults.length;i++){
          //   if(allResults[i].innerHTML.indexOf(text)>-1){
          //     allResults[i].classList.add("active");
          //     console.log(allResults[i].classList);
          //   }
          //   allResults[i].classList.remove("active");
          // }

          //remove elipses
          text = text.substring(0,text.length-3);
          var scrollcont = document.getElementById("scrollcontainer");
          var instance = new Mark(scrollcont);
          //unmark previous search results
          instance.unmark();
          if(window.innerWidth < 781){console.log("toggle");$scope.toggleSearch();}
          //mark selected by entire term, add class highlight
          var options = {"separateWordSearch":false, "className":"highlight"};
          instance.mark(text, options);
          var elmnt = document.getElementsByClassName("highlight")[0];
          if(elmnt != undefined){
            elmnt.scrollIntoView();
            var scrolledY = window.scrollY;
            if(scrolledY){
              window.scroll(0, scrolledY - 100);
            }
          }
      },100);
    }
  }
//supplemental materials, currently only used for japanese page, in future just add captions in other languages?
  $scope.materials = [
    {name:'1.1', caption:'H1N1 大流行の予測', link:'/images/ch-01/video-1-1.m4v'},
    {name:'1.2', caption:'コネクティッド', link:'https://www.youtube.com/watch?time_continue=2&v=zK1Cb9qj3qQ'},
    {name:'2.1', caption:'ケーニヒスベルクの橋', link:'/images/ch-02/video-2-1.m4v'},
    {name:'2.2', caption:'疾病ネットワーク', link: 'https://archive.nytimes.com/www.nytimes.com/interactive/2008/05/05/science/20080506_DISEASE.html?ref=health'},
    {name:'3.1', caption:'N は数」：Pál Erdös の人物像', link:'https://www.youtube.com/watch?v=_3PdSqeMEM4'},
    {name:'3.2', caption:'ランダム・ネットワークの成長', link:'/images/ch-03/video-3-2.m4v'},
    {name:'4.1', caption:'WWW にズームイン', link:'/images/ch-04/video-4-1.webm'},
    {name:'4.2', caption:'Fitting a Power Law', link:'http://tuvalu.santafe.edu/~aaronc/powerlaws/'},
    {name:'5.1', caption:'スケールフリー・ソナタ', link:'https://vimeo.com/85897614'},
    {name:'5.2', caption:'スケールフリー・ネットワークの発現', link:'/images/ch-05/video-5-2.webm'},
    {name:'6.1', caption:'ビアンコーニ・バラバシ・モデル', link:'/images/ch-06/video-6-1.webm'},
    {name:'6.2', caption:'ネットワークにおけるボーズ・アインシュタイン凝縮', link:'/images/ch-06/video-6-2.webm'},
    {name:'8.1', caption:'ノード故障時のスケールフリー・ネットワーク', link:'/images/ch-08/video-8-1.webm'},
    {name:'8.2', caption:'攻撃下のスケールフリー・ネットワーク', link:'/images/ch-08/video-8-2.webm'},
    {name:'9.1', caption:'モジュラリティに基づくアルゴリズム', link:'http://cs.unm.edu/~aaron/research/fastmodularity'},
    {name:'9.2', caption:'Cfinder', link: 'http://www.cfinder.org/'},
    {name:'9.3', caption:'Infomap のマップ方程式', link:'http://www.tp.umu.se/~rosvall/livemod/mapequation/'},
    {name:'10.1', caption:'RFID を介したネットワークの探索', link: 'https://vimeo.com/6590604'},
    {name:'10.2', caption:'院内感染', link:'https://www.scientificamerican.com/article/rfid-tags-track-possible-outbreak-pathways-in-hospital/'},
    {name:'10.3', caption:'社会ネットワーク上での「感染」', link:'https://www.youtube.com/watch?v=udQn3R1zrW8'},
    {name:'10.4', caption:'北米の航空機運航パターン', link:'https://vimeo.com/5368967'},
    {name:'10.5', caption:'GLEAM', link:'http://www.gleamviz.org/'},
    {name:'10.6', caption:'感染症の大流行', link:'http://www.gleamviz.org/'}
  ];

  $rootScope.$on('$routeChangeSuccess', function(event) {
    $window.ga('send', 'pageview', {page: $location.url()});
  });
});


// networkBook.directive('highlight', function($compile, $scope) {
//   return {
//     scope:{ index : '@'},
//     link: function(scope, element, attrs) {
//        element.bind('click', function() {
//         changehtml();
//         function changehtml(){
//           var svLength = document.getElementsByName("search-input-class")[0].value.length;
//           var scrollcont = document.getElementById("scrollcontainer");
//           var innerHTML = scrollcont.innerHTML;
//           innerHTML = innerHTML.substring(0,scope.index) + "<span id='scrollhere' class='highlight'>" + innerHTML.substring(scope.index,scope.index + svLength) + "</span>" + innerHTML.substring(scope.index + svLength);
//           scrollcont.innerHTML = innerHTML;
//           $compile(scrollcont)($scope);
//           var elmnt = document.getElementById("scrollhere");
//           elmnt.scrollIntoView();
//           console.log(scope.index, svLength, innerHTML);
//         }
//       });
//     }
//   };
// });


// ChapterCtrl
networkBook.controller('ChapterCtrl', function($scope, $routeParams, $route, $location, $rootScope, $pageTitle, $anchorScroll, $document, lastRead, Fullscreen, $timeout) {
  chapterNumber = $routeParams.chapterNumber;
  chapterNumber = parseInt(chapterNumber);
  $scope.chapterNumber = chapterNumber;
  console.log("CHAPTER CONTROLLER",chapterNumber);

  var pageTitle;
  if(selectedLang == 0){
    pageTitle = 'Chapter ' + chapterNumber + ' – ' + defaultPageTitle;
  }else if(selectedLang == 1){
    pageTitle = 'Глава '+chapterNumber+' - '+ 'Наука о Сетях, Aльберто Лазло Барабаси';
  }

  $pageTitle.set(pageTitle);
  $scope.currentChapterNumber = chapterNumber;

  if((!isNaN(chapterNumber)) && (chapterNumber <= 11)  && (chapterNumber >= 0)) {
    this.url = ".."+languages[selectedLang].filepath +'partials/ch-' + chapterNumber + '.html';
    // this.path = languages[selectedLang].filepath +'partials/ch-' + chapterNumber + '.html';
    //this.url = '/partials/ch-'+chapterNumber+'.html';
    lastRead.setProperty('chapter/'+chapterNumber);
  } else {
    $location.path('/chapter/1');
    lastRead.setProperty('/chapter/1');
  };

  if($location.hash()) {
    $scope.$on('$includeContentLoaded', function(event) {
      var chapterSection = $location.hash();
      initialScroll = false;
      //$anchorScroll(chapterSection);

      $timeout(function(){
        //$anchorScroll(chapterSection);
      }, 500);
    });
  };

  $scope.machSchoeneGraphen = function() {
    MathJax.Hub.Queue(["Reprocess", MathJax.Hub, document.getElementById('scrollcontainer')]);
  };

  if((chapterNumber <= 11) && (chapterNumber >= 0)) {
    $scope.nextChapterNumber = parseInt(chapterNumber) + 1;
    $scope.nextChapter = '/chapter/' + $scope.nextChapterNumber;
  } else if(chapterNumber === 9) {
    $scope.nextChapter = '/chapter/' + 1;
    $scope.nextChapterNumber = 1;
  } else if(chapterNumber > 9) {
    $scope.nextChapter = false;
  };

  $rootScope.nightMode = 'off';
  $scope.toggleNightMode = function(mode) {
    if(mode === 'on') {
      $rootScope.nightMode = 'on';
    } else if(mode === 'off') {
      $rootScope.nightMode = 'off';
    }
  };

  var defaultFontSize = 14;
  $scope.newFontSize = defaultFontSize;
  $scope.changeFontSize = function(operator) {
    if(operator === 'plus') {
      higherFontSize = parseInt($scope.newFontSize, 10) + 1 + 'px';
      $scope.newFontSize = higherFontSize;
    } else if(operator === 'minus') {
      lowerFontSize = parseInt($scope.newFontSize, 10) - 1 + 'px';
      $scope.newFontSize = lowerFontSize;
    } else if(operator === 'normal') {
      $scope.newFontSize = defaultFontSize + 'px';
    }
  };

  var isFullscreen = false;
  $scope.toggleFullScreen = function() {
    if(isFullscreen) {
      Fullscreen.cancel();
      isFullscreen = !isFullscreen;
    } else {
      Fullscreen.all();
      isFullscreen = !isFullscreen;
    }
  };

  $scope.includeinclude = "helloo";

  $scope.showSelectedText = function() {
    $scope.selectedText =  $scope.getSelectionText();
  };

  $scope.getSelectionText = function() {
    var text = "";
    if (window.getSelection) {
      text = window.getSelection().toString();
    } else if (document.selection && document.selection.type != "Control") {
      text = document.selection.createRange().text;
    }
    return text;
  };
  $rootScope.homeSweetHome = false;
});

// BookmarksCtrl
networkBook.controller('BookmarksCtrl', function($routeParams, $location, $pageTitle) {
  $pageTitle.set('Bookmarks – ' + defaultPageTitle);
  $rootScope.homeSweetHome = false;
});

// NotesCtrl
networkBook.controller('NotesCtrl', function($routeParams, $location, $pageTitle) {
  $pageTitle.set('Notes – ' + defaultPageTitle);
  $rootScope.homeSweetHome = false;
});

// HomeCtrl
networkBook.controller('HomeCtrl', function($routeParams, $location, $rootScope, $pageTitle, $scope) {
  $pageTitle.set(defaultPageTitle);
  $rootScope.homeSweetHome = true;
});

// VisualizationCtrl
networkBook.controller('VisualizationsCtrl', function($routeParams, $location, $pageTitle) {
  $pageTitle.set(defaultPageTitle);
  $rootScope.homeSweetHome = false;
});

//TranslationCtrl
networkBook.controller('TranslationCtrl',function($window, $scope, $rootScope, $route, $location, $routeParams){
  this.languages = languages;
  $scope.updateLang = function(lang, url){
    console.log(lang, url);
    if(url == null || url == undefined){
      selectedLang = lang;
      $route.current.$$route.templateUrl = ".."+languages[selectedLang].filepath+"partials/home.html";
      // $route.next.templateUrl = ".."+languages[selectedLang].filepath+"partials/chapter.html";
      //$window.location(languages[selectedLang]+'chapter/1');
      $route.reload();
      console.log($location , $route);
    }else{
       $window.open(url, '_blank');
    }
  };
});

networkBook.directive('translationMenu',function(){
  return{
    restrict: 'E',
    templateUrl:'../translations/en/partials/translation-menu.html'
  };
});

// Directive: Toggle subchapter accordion section
networkBook.directive('toggleClass', function() {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      element.bind('click', function() {
        element.parent().toggleClass(attrs.toggleClass);
      });
    }
  };
});

// Directive: Toggle reading options bottom right
networkBook.directive('toggleReadingOptions', function() {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      element.bind('click', function() {
        element.toggleClass('active');
        element.parent().parent().toggleClass('expanded');
      });
    }
  };
});



// Directive: d3 viz on front-page ============ needs clean up!
networkBook.directive('homeVisualization', function($rootScope) {
  return {
    link: function(scope, element, attrs) {
      var diameter = 900;

      var tree = d3.layout.tree()
          //length of spokes
          .size([90, diameter / 2])
          //angle increments between spokes
          .separation(function(a, b) { return (a.parent == b.parent ? 1 : 2) / a.depth; });

      var diagonal = d3.svg.diagonal.radial()
          //direction of bezier fan
          .projection(function(d) { return [d.y, d.x / 180 * Math.PI]; });

      var svg = d3.select(element[0]).append("svg")
          .attr("width", diameter)
          .attr("height", diameter)
          .append("g")
          //sets x and y position of bezier "fan"
          .attr("transform", "translate(" + diameter / 3 + "," + diameter / 2.5 + ")");

      (function(root) {

        var nodes = tree.nodes(root),
            links = tree.links(nodes);

        var link = svg.selectAll(".link")
            .data(links);


        var lineFunction = d3.svg.line()
          .x(function(d) { return d.x; })
          .y(function(d) { return d.y; })
          .interpolate('basis');

        var node = svg.selectAll(".node")
          .data(nodes);

        var g = node
          .enter()
          .append("g")
          .attr("id", function(d) { return d.id; });
          // .attr("transform", function(d) { return "rotate(" + (d.x - 45) + ")translate(" + (d.y) + ")"});

        //formats the html for the bezier fan menu
        g.append("a")
          .attr("xlink:href", function(d) { return d.href; })
          .append("text")
          .style("opacity", 0)
          .attr("id", function(d) { return d.id; })
          .attr("class", function(d) { return d.class; })
          .attr("dy", function(d,i){ if(i<7){return 50+i * 20}else{return i*20-70}})
          .attr("dx", function(d,i) { if(i<7){return -180;}else{return 75;}})
          .attr("text-anchor", "start")
          .transition()
            .duration(300)
            .delay(function(d,i) { return 24*i; })
            .style("opacity", 1)
            .style("fill", function (d) {
              if (d.class == "not-active" || d[selectedLang] == null) {
                return "#999";
              }else{
                //return "#fff"
                return "#fff"
              }
            })
            .text(function(d) {
              if(d[selectedLang]== null){
                return d[0];
              }else{
                return d[selectedLang];
              }
            });

      })(d3_data);
    }
  };
});

//========================Array of Translationss================================

var selectedLang = 0;
var languages =[
  {name:'English', filepath:'/translations/en/', abr: 'en'},
  {name:'Русский', filepath:'/translations/ru/', abr: 'ru'},
  {name:'Magyar', filepath:'/translations/hu/', abr: 'hu', link: 'true', linkurl: 'https://www.libri.hu/konyv/barabasi_albert-laszlo.a-halozatok-tudomanya.html'},
  {name:'فارسی', filepath:'/translations/pe/', abr: 'pe'},
  {name:'日本語', filepath:'/translations/jp/', abr:'jp'}//,
  //{name:'中文', filepath:'/translations/ch/'},
  //{name:'Português', filepath:'/translations/po/'},
  //{name:'italiano', filepath:'/translations/it/'}
];

//========================links and titles for front page visualization=========
//indices correlate to language array above
var d3_data = {
"id":"level1",
  "children": [
    {
      "0": "Personal Introduction",//English
      //"1":"Личное введение",//Russian
      "3":"دست اندرکاران",
      "id":"level2",
      "href":"/chapter/0"
      //languages[selectedLang].abr+"/chapter/0"
    },
    {
      "0":"1. Introduction",
      //"1":"1. Введение",
      "3":"1. آسیب پذیری ناشی از ارتباط",
      "id":"level2",
      "href":"chapter/1"
    },
    {
      "0":"2. Graph Theory",
      "1":"2. Теория графов",
      "3":"2. نظریه گراف",
      "id":"level2",
      "href":"chapter/2"
    },
    {
      "0":"3. Random Networks",
      "3":"3. مدل تصادفی شبکه",
      //"1":"3. Случайные сети",
      "id":"level2",
      "href":"chapter/3"
    },
    {
      "0":"4. The Scale-Free Property",
      "3":"4. ویژگی مقیاس آزاد شده",
      //"1":"4. Масштабируемое имущество",
      "id":"level2",
      "href":"chapter/4"
    },
    {
      "0":"5. The Barabási-Albert Model",
      //"1":"5. Модель Барабаси-Альберта",
      "3":"5. مدل باراباشی-آلبرت",
      "id":"level2",
      "href":"chapter/5"
    },
    {
      "0":"6. Evolving Networks",
      //"1":"6. Развивающиеся сети",
      "3":"6. شبکه‌های تکاملی",
      "id":"level2",
      "href":"chapter/6"
    },
    {
      "0":"7. Degree Correlations",
      "3":"7. همبستگی درجه",
      //"1":"7. Степень корреляции",
      "id":"level2",
      "href":"chapter/7"
    },
    {
      "0":"8. Network Robustness",
      "3":"8. انعطاف پذیری شبکه",
      //"1":"8. Надежность сети",
      "id":"level2",
      "href":"chapter/8"
    },
    {
      "0":"9. Communities",
      //"1":"9. Сообщества",
      "3":"9. جوامع",
      "id":"level2",
      "href":"chapter/9"
    },
    {
      "0":"10. Spreading Phenomena",
      //"1":"10. Распространяющиеся явления",
      "3":"10. گسترش پدیده ها",
      "id":"level2",
      "href":"chapter/10"
    },
    {
      "0":"Preface",
      //"1":"Предисловие",
      "3":"پیشگفتار",
      "id":"level2",
      "href":"chapter/11"
    }
  ]
};
