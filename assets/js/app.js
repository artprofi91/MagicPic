function predict_click(value, source) {
  // first grab current index
  var index = $("#hidden-counter").val();

  // Div Stuff
  if(index > 1) {
    createNewDisplayDiv(index);
  }
  
  if(source === "url") {
    document.getElementById("img_preview" + index).src = value;
    doPredict({ url: value });
  }
    
  else if(source === "file") {
    var preview = document.querySelector("#img_preview" + index);
    var file    = document.querySelector("input[type=file]").files[0];
    var reader  = new FileReader();

    // load local file picture
    reader.addEventListener("load", function () {
      preview.src = reader.result;
      var localBase64 = reader.result.split("base64,")[1];
      doPredict({ base64: localBase64 });
      
    }, false);

    if (file) {
      reader.readAsDataURL(file);
    }
  } 
}


function doPredict(value) {

  var modelID = getSelectedModel();

  app.models.predict(modelID, value).then(
    
    function(response) {
      
      var tagArray, regionArray;
      var tagCount = 0;
      var modelName = response.rawData.outputs[0].model.name;
      
      // Check for regions models first
      if(response.rawData.outputs[0].data.hasOwnProperty("regions")) {
        regionArray = response.rawData.outputs[0].data.regions;
      	
        // Regions are found, so iterate through all of them
        for(var i = 0; i < regionArray.length; i++) {
      	  conceptNames;  
      		 		
      	   // Celebrity
      	   if(modelName == "celeb-v1.3") {
      	   tagArray = regionArray[i].data.face.identity.concepts;
      			
      	   // Print first result
      	   conceptNames = tagArray[0].name; 
          }     	
        }
      }
      
      // food/celebrity
      else if(response.rawData.outputs[0].data.hasOwnProperty("concepts")) {
        tagArray = response.rawData.outputs[0].data.concepts;
        conceptNames = tagArray[0].name;
      }
      
      // if no face detected do this
      else {
      	if(modelName != "logo" && modelName != "focus") {
          $('#concepts').html("<p>No Faces Detected!</p>");
        }
      	return;
      }
      $('#concepts').html(conceptNames);
      $(".hero-name").html(conceptNames);
    },
  );
}


function getSelectedModel() {
  var model;
  if(model = $("#food").val()) {
    return Clarifai.FOOD_MODEL;
  }
    
  else if(model = $("#celebrity").val()) {
    return "e466caa0619f444ab97497640cefc4dc";
  }
}

function createNewDisplayDiv(index) {
  var mainDiv = $("#predictions");
  var elem = document.createElement('div')
  mainDiv.innerHTML = elem.innerHTML + mainDiv.innerHTML;
}

// =============== end of clarifai functionality=======================



$(document).ready(function() {
  // predict url function
  $('#url').click(function() {
    if (!validFile(imgurl.value)) {
        $("#error1Modal").modal({
          backdrop: "static",
          keyboard: false});
        return;
      }
    
      predict_click($('#imgurl').val(), 'url');
      $("#predictions").show();
  });

  // upload and predict url function
  $('#upload').click(function() {
    if (!validFile(filename.value)) {
        $("#error1Modal").modal({
          backdrop: "static",
          keyboard: false});
        return;
      }
      predict_click($('#filename').val(), 'file');
      $("#predictions").show();
  });
  // need for correct search celebrity or food
  $('#celebrity, #food').click(function () {
    if (this.id == 'food') {
        $("#food").val("food");
    }
    else if (this.id == 'celebrity') {
        $("#celebrity").val("celebrity");
    }
  });
  // restart button
  $('#restart').click(function () {
    $("#food").val("");
    $("#celebrity").val("");
    $("#imgurl").val("");
    $("#filename").val("");
    $("#predictions").hide();
    $("#food").removeClass("hide");
    $("#celebrity").removeClass("hide");
    $(".hero").addClass("hide");
    $("#filename").addClass("hide");
    $("#imgurl").addClass("hide");
    $(".h3-URL").addClass("hide");
    $(".star").addClass("hide");
    $("#url").addClass("hide");
    $("#upload").addClass("hide");
    $(".hero-name").addClass("hide");
    $(".food").addClass("hide");
    $('.displayBox').empty();
    $(".celFood h2").empty();
    $(".searching").removeClass("hide");
    // important for spoonacular 
    $('.displayBox').css('display', '');
    $('.displayBox').css('flex-flow', '');
    $('.displayBox').css('justify-content', '');
    $("#restart").addClass("hide");
    
  });


  // when you clicl celebrity do something
  $('#celebrity').click(function () {
    $(".searching").addClass("hide");
    $(".h3-URL").removeClass("hide");
    $("#imgurl").removeClass("hide");
    $("#filename").removeClass("hide");
    $(".star").removeClass("hide");
    $('<h2>You are searching for celebrity</h2>').appendTo('.celFood')
  });

   // when you clicl food do something
  $('#food').click(function () {
    $(".searching").addClass("hide");
    $(".h3-URL").removeClass("hide");
    $("#imgurl").removeClass("hide");
    $("#filename").removeClass("hide");
    $(".food").removeClass("hide");
    $('<h2>You are searching for food</h2>').appendTo('.celFood')
  });

  // check do you paste something or not
  $("#imgurl").on('paste', function(e) {
      $("#url").removeClass("hide");
      $("#upload").addClass("hide");
      $("#filename").addClass("hide");
  });


  // when you click file do something
  $('.custom-file-input').click(function () {
      $("#imgurl").addClass("hide");
      $("#upload").removeClass("hide");
  });
  // when on hero btn show name
  $('.hero').click(function () {
      $("#hero-name").removeClass("hide");
  });

  // picture and name upload and button shows
  $('#upload').click(function () {
    if (filename.value == '' || !validFile(filename.value)) {
        $(".hero").addClass("hide");
    }
    else {
        $(".hero").removeClass("hide");
    }

  });
  $('#url').click(function () {
    if (!validFile(imgurl.value) || imgurl.value == '') {
        $(".hero").addClass("hide");
    }
    else {
        $(".hero").removeClass("hide");
    }

  });
  // open wikipedia
  $('#wikipedia, #wikipedia2').click(function () {
    searchWiki();
  });

  

  // show restart button
  $('#youtube, #vimeo, #spotify, #wikipedia, #yelp, #google, #wikipedia2').click(function () {
    $('.displayBox').css('display', '');
    $('.displayBox').css('flex-flow', '');
    $('.displayBox').css('justify-content', '');
    $('.displayBox').css('text-align', '');
    
  });

  $('#google').click(function () {
    $('.displayBox').html('');
    $('.displayBox').css('text-align', 'center');
    $('.displayBox').append('<iframe class="google" src="https://www.google.com/maps/embed/v1/search?key=AIzaSyCHu8fs_k01UlmlvSSmV7h_10E7vlJkhUc&language=en&q=record+restaurants+near+77042+' + conceptNames + '" allowfullscreen></iframe>');

  });
  $('#youtube').click(function () {
    $('.displayBox').html('');
    $('.displayBox').css('text-align', 'center');
    $('.displayBox').append('<iframe class="google" src="https://www.youtube.com/embed?listType=search;list=' + conceptNames + '" frameborder="0" width="480" height="360"></iframe>');

  });

  // show restart button
  $('#youtube, #vimeo, #spotify, #wikipedia, #yelp, #spoon, #google, #wikipedia2').click(function () {
    $("#restart").removeClass("hide");
  });

 
}); // end of document ready function

// =====================firebase============================
// firebase reference
var database = firebase.database();
// Setting initial value of our click counter variable to 0
    var clickCounter = 0;
    // FUNCTIONS + EVENTS
    // --------------------------------------------------------------------------------
    // On Click of Button
    $("#celebrity, #food").on("click", function() {
      // Add to clickCounter
      clickCounter++;
      //  Store Click Data to Firebase in a JSON property called clickCount
      // Note how we are using the Firebase .set() method
      database.ref().set({
        clickCount: clickCounter
      });
    });
    // MAIN PROCESS + INITIAL CODE
    // --------------------------------------------------------------------------------
    // Using .on("value", function(snapshot)) syntax will retrieve the data
    // from the database (both initially and every time something changes)
    // This will then store the data inside the variable "snapshot". We could rename "snapshot" to anything.
    database.ref().on("value", function(snapshot) {
      // Then we change the html associated with the number.
      $("#click-value").html(snapshot.val().clickCount);
      // Then update the clickCounter variable with data from the database.
      clickCounter = snapshot.val().clickCount;
      // If there is an error that Firebase runs into -- it will be stored in the "errorObject"
      // Again we could have named errorObject anything we wanted.
    }, function(errorObject) {
      // In case of error this will print the error
      console.log("The read failed: " + errorObject.code);
    });

// ===============end of firebase========================

// =========================wikiAPI============================

// Make Wikipedia searches and post results
// Using the Wikipedia API using JQuery

function searchWiki(){
  var txt = conceptNames;
  var searchUrl = 'https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&generator=search&exsentences=1&exlimit=10&exintro=1&explaintext=1&gsrsearch=' + txt;
  queryWikiApi(searchUrl);
};


function queryWikiApi(searchUrl){
$.ajax({
  url: searchUrl,
  dataType: 'jsonp',
  type: 'GET',
  success: displayResults
});
};
function displayResults(data){
  var wikiObj = data.query.pages;
  $('.displayBox').html('');
  for(var prop in wikiObj){
  $('.displayBox').append('<div class="wiki"><a href="https://en.wikipedia.org/?curid=' + wikiObj[prop].pageid + '" target="_blank"><h4 class="title">' + wikiObj[prop].title + '</h4><p class="extract">' + wikiObj[prop].extract  + '</p></a></div>');
  }
  $('.wiki').fadeIn();
};

// ====================end of work with wikiAPI========================



// ===================SPOONACULAR=========================
//Search Recipes by Ingredient Endpoint
var SPOONACULAR_SEARCH_URL = 'https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/findByIngredients?mashape-key=UpJfS3A3qYmsh0NUiMRjpeYL21Cbp1VPxEgjsnAG81P2m5DHAR'
//Search Recipe Summary by Recipe ID Endpoint
var SPOONACULAR_DESCRIPTIONS_URL = 'https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/{id}/summary?mashape-key=UpJfS3A3qYmsh0NUiMRjpeYL21Cbp1VPxEgjsnAG81P2m5DHAR'

//getting the recipes based on the user's ingredients
function getDataFromApi (searchTerm, callback) {
  var query = {
    fillIngredients: false,
    ingredients: searchTerm,
    limitLicense: true,
    number: 6,
    ranking: 1
  }
  $.getJSON(SPOONACULAR_SEARCH_URL, query, callback);
}

//getting the summaries based on the recipe ID
function getSummaryFromApi (searchTerm) {
  var query = SPOONACULAR_DESCRIPTIONS_URL.replace('{id}', searchTerm)
  $.getJSON(query, function(data){
    var rawSummary = data.summary
    var newSummary = rawSummary.slice(0, 200);
    $('#' + data.id + ' .recipe-desc').html(newSummary + '...');
  });
}
//getJSON callback function
function testCallback (data) {
  for (var i = 0; i < data.length; i++) {
    //defining variables for ease of use
    var RECIPE_JSON_ID = data[i].id;
    var RECIPE_JSON_IMAGE = data[i].image;
    var RECIPE_JSON_TITLE = data[i].title;
    var RECIPE_JSON_MISSED = data[i].missedIngredientCount;
    var RECIPE_JSON_USED = data[i].usedIngredientCount;
    //the template for recipe cards, with the data variables included.
    var RESULT_RECIPE_TEMPLATE = (
       '<figure class="recipe-card" id="'+RECIPE_JSON_ID+'" role="recipe card">' + //added id to tile
        '<a href='+changeRecipeLink(RECIPE_JSON_ID, RECIPE_JSON_IMAGE)+' class="recipe-link" target="_blank">'+
          '<img src='+RECIPE_JSON_IMAGE+' alt="Recipe image" class="recipe-image img-responsive"/>' + 
          '<h2 class="recipe-title">'+RECIPE_JSON_TITLE+'</h2>' +
          '<figcaption class="recipe-description">' +
            '<p class="recipe-supplies">'+changeRecipeSupplies(RECIPE_JSON_USED, RECIPE_JSON_MISSED)+'</p>' +
            '<p class="recipe-desc"></p>' +
          '</figcaption>'+
            '</a>'+
        '</figure>'
       );
    //display the recipe tiles using the template
    displayRecipeTiles(RESULT_RECIPE_TEMPLATE);
    //display the summaries based off the recipe ID's within the loop.
    getSummaryFromApi(data[i].id);
  };
}

//removes all of the image parts out of the image url so that it can be a link to the recipe
function replaceLinkTitle (data) {
  var newData = data.replace(/Images/g, '');
  return newData.replace(/.jpg/g, '');
}

//returns the new link to the recipe from the image url
function changeRecipeLink (data, data2) {
  var linkTitle = replaceLinkTitle(data2);
  return linkTitle
}

//shows the number of supplies you have against the number of supplies you need.
function changeRecipeSupplies (data1, data2) {
  var missingIngredients =data1 + ' of ' + (data1+data2) + ' ingredients!';
  return missingIngredients;
}

//adds the recipe tiles to the empty div on the main page
function displayRecipeTiles (template) {
  $('.displayBox').append(template);
}

//takes the user's search and uses it to call the API
function submitUserData () {
  $('#spoon').on('click', function(event){
    $('.displayBox').html('');
    $('.displayBox').css('display', 'flex');
    $('.displayBox').css('flex-flow', 'row wrap');
    $('.displayBox').css('justify-content', 'center');
    event.preventDefault();
    var $userData = conceptNames;
    //this replaces spaces with , so that each ingredient the user searches will become a separate item in an array.
    var $newUserData = $userData.replace(' ', ',');
    getDataFromApi($newUserData, testCallback);
  })
}

submitUserData();
// =================== END SPOONACULAR=========================
