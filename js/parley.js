/*global List:true */
/*jshint devel:true*/

var timesMessedUp = 0;


// Typeahead
const COUNTRIES = ["Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua & Deps", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina", "Burundi", "Cambodia", "Cameroon", "Canada", "Cape Verde", "Central African Rep", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Congo {Democratic Rep}", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "East Timor", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland {Republic}", "Israel", "Italy", "Ivory Coast", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Korea North", "Korea South", "Kosovo", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Macedonia", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar, {Burma}", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "Norway", "Oman", "Pakistan", "Palau", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russian Federation", "Rwanda", "St Kitts & Nevis", "St Lucia", "Saint Vincent & the Grenadines", "Samoa", "San Marino", "Sao Tome & Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Swaziland", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Togo", "Tonga", "Trinidad & Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"]
$(document).ready(function () {
    $('#namebox').typeahead({
        name: 'countries',
        local: COUNTRIES
    });
});


// Speaker's List
var values = [];
var list_options = {
    valueNames: ['id', 'name', 'id2'],
    item: '<div><hr class="separator" /><li><p class="id"></p><h4 class="name"></h4><p class="remove" onclick="removeSpeaker(this)">❌</p></li></div>'
};
var speakersList = new List('speakers-list', list_options, values);
var lastID = 0;

function addSpeaker() {
    var input = $("#namebox").val();
    speakersList.add({id: ++lastID, name: input});
    document.getElementById('namebox').value = "";
    $('.typeahead').typeahead('setQuery', '');
}

function removeSpeaker(button) {
    idToRemove = parseInt(button.parentElement.children[0].innerHTML);
    // Decrement the ID's of all elements after this one
    var items = speakersList.items;
    speakersList.remove("id", idToRemove);
    for(var i = idToRemove - 1; i < items.length; i++) {
        var item = items[i];
        item.values({
            id: item._values.id - 1,
        });
    }
    lastID -= 1;
}


// Timer
class Timer {
    // Timer can be set with either minutes or seconds
    // id is the unique integer id of the timer
    // setType should be 'minutes' or 'seconds'
    constructor(id, setType) {
        this.id = id;
        this.lastSetTime = 0;
        this.type = setType;
        this.currentTime = 0;
        this.ticking = false;
        this.ticker = null;

        // Create listener for input field
        $("#timebox" + this.id).on("keydown", this, function(e) {
            // Enter is pressed
            if (e.keyCode === 13) { e.data.set(); }
        });
    }
    // Reset to last time
    reset() {
        this.currentTime = this.lastSetTime;
        this.endTicker();
        // Update visual timer
        $("#time" + this.id).html(formatSeconds(this.currentTime));
    }
    // Set the timer according to its type
    set() {
        this.endTicker();
        this.currentTime = 0;
        var input = $("#timebox" + this.id).val();
        // Use regex to ensure input is only an integer
        if(input.match(/^[0-9]+$/) != null) {
            this.currentTime = parseInt(input);
            this.currentTime = this.currentTime * (this.type === 'minutes' ? 60 : 1);
        } else {
            if(timesMessedUp === 0) {
                alert("The time entered should be an integer.");
                timesMessedUp ++;
            }
            else if(timesMessedUp === 1) {
                alert("You did it wrong again. The time should be an integer value.");
                timesMessedUp ++;
            } else {
                alert("Seriously?");
            }
        }
        this.lastSetTime = this.currentTime;
        // Clear input field
        $("#timebox" + this.id).val('');
        // Update visual timer
        $("#time" + this.id).html(formatSeconds(this.currentTime));
    }
    // When the button is clicked
    toggle() {
        // If the time is 0:00, reset the time when the button is clicked
        if(this.currentTime === 0) {
            this.currentTime = this.lastSetTime;
            $("#time" + this.id).html(formatSeconds(this.currentTime));
        }
        // If the timer isn't already ticking, create an interval to decrease it
        if(this.ticking == false) {
            this.ticking = true;
            this.ticker = window.setInterval(function (timer) {
                if(timer.currentTime > 0) {
                    timer.currentTime -= 1;
                    // Update the visual timer
                    $("#time" + timer.id).html(formatSeconds(timer.currentTime));
                }
                else {
                    timer.endTicker();
                }
            }, 1000, this);
        }
        // If the timer is already ticking, pause it
        else {
            this.endTicker();
        }
    }
    // Stop the ticker
    endTicker() {
        if(this.ticking) {
            clearInterval(this.ticker);
            this.ticking = false;
        }
    }
}

function formatSeconds(bigger){
    var minsecs = bigger%3600;
    var hours = checkTime((bigger-minsecs)/3600);
    var secs = checkTime(minsecs%60);
    var mins = checkTime((minsecs-secs)/60);
    return hours+":"+mins+":"+secs;
}

function checkTime(i)
{
    if (i<10) {i="0" + i;}
    return i;
}


//Event Listeners
$("#namebox").on("keydown", function(event) {
    // Enter is pressed
    if (event.keyCode === 13) { addSpeaker(); }
});


// Create timer instances

var timer1 = new Timer(1, 'seconds');
var timer2 = new Timer(2, 'minutes');


function togglePopup() {
    var popup = document.getElementById("popup");
    popup.classList.toggle("show");
}