/*global List:true */
/*jshint devel:true*/

//TODO kill this
var options = {
    item: '<li><hr class="separator" /></h4><p class="id"><h4 class="name"></p></li>'
};

var values = [];

var speakersList = new List('speakers-list', options, values);
var currentID = 1;
var timerPosition=0; //number of seconds the timer should display
var timeLeft=0; //number of seconds the timer should run, resets to this value after timeout
var timereg=/^(([0-5])?\d:)?\d\d\s*$/; //i had a problem, so I used a regex. now it's the next guy's problem

$(document).ready(function () {
    $('#namebox').typeahead({
        name: 'countries',
        local: ["Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua & Deps", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina", "Burundi", "Cambodia", "Cameroon", "Canada", "Cape Verde", "Central African Rep", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Congo {Democratic Rep}", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "East Timor", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland {Republic}", "Israel", "Italy", "Ivory Coast", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Korea North", "Korea South", "Kosovo", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Macedonia", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar, {Burma}", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "Norway", "Oman", "Pakistan", "Palau", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russian Federation", "Rwanda", "St Kitts & Nevis", "St Lucia", "Saint Vincent & the Grenadines", "Samoa", "San Marino", "Sao Tome & Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Swaziland", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Togo", "Tonga", "Trinidad & Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"]
    });
});

function nextId() {
    currentID += 1;
    return currentID - 1;
}

function addSpeaker() {
    var sent = $("#namebox").val();
    //I needed an array, so I hacked one in
    speakersList.add({id: nextId(), name: sent});
    document.getElementById('namebox').value = "";
    $('.typeahead').typeahead('setQuery', '');
    console.log("Should have cleared.");
}

function removeNextSpeaker() {
    //list shouldn't get big enough that this becomes a problem
    //TODO make this into final MAX_COUNTRIES for readability / NK's expulsion
    //from U.N.
    var lowest=200;
    var items=speakersList.visibleItems;
    for(var x in items) {
       if(x<lowest) {lowest=x;}
    }
    speakersList.remove("id", lowest);
}

function checkTime(i)
{
    if (i<10) {i="0" + i;}
    return i;
}

//format is hh:mm:ss
function textToSeconds(textString){
    var arr=textString.split(":");
    var hours = arr[0];
    var mins = arr[1];
    var secs = arr[2];
    return parseInt((hours*60*60)+(mins*60)+secs,10);
}

//TODO refactor this into something sane
function formatSeconds(bigger){
    var minsecs = bigger%3600;
    var hours = checkTime((bigger-minsecs)/3600);
    var secs = checkTime(minsecs%60);
    var mins = checkTime((minsecs-secs)/60);
    return hours+":"+mins+":"+secs;
}

var start = new Date().getTime();
var elapsed = '0.0';
var ticking = false;
var ticker;

function endTimer() {
    clearInterval(ticker);
    //flash the button
    //set the button to zero
    removeNextSpeaker();
    $("#time").html("00:00:00");
}

function startTimer() {
    if(timeLeft === 0) {return;}
    timerPosition = timeLeft;
    ticker = window.setInterval(function () {
        if(timerPosition > 0) {
            timerPosition = timerPosition - 1;
            console.log(timerPosition);
            //decrement the visual timer
            $("#time").html(formatSeconds(timerPosition));
        }
        else {
            endTimer();
        }
    },1000);
}

function stopTimer() {
}

function toggleTimer() {
   if(ticking) {
       stopTimer();
   }
   else {
       startTimer();
   }
}

//Has to be able to accept "30" as 30 seconds and "1:30" as 90 seconds
function setTimer() {
    stopTimer();
    var input = $("#timebox").val();
    if(timereg.test(input)) {
        timeLeft = input;
    }
    else {
        alert("stahp"); //add a visual bell
    }
    $("#timebox").val('');
    console.log("timeLeft: " + timeLeft);
    //change timer text here
    $("#time").html(formatSeconds(timeLeft));
}

//Event Listener
$("#namebox").on("keydown", function(event) {
    // Enter is pressed
    if (event.keyCode === 13) { addSpeaker(); }
});

$("#timebox").on("keydown", function(e) {
    // Enter is pressed
    if (e.keyCode === 13) { setTimer(); }
});

