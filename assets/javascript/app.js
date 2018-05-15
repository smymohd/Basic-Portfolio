// JavaScript  document
// Document Ready
$(document).ready(function () {

    // Declare global variables
    var latlng;

    // Jump to Top Button 
    // When the user scrolls down 20px from the top of the document, show the button
    window.onscroll = function () {
        scrollFunction()
    };

    function scrollFunction() {
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
            document.getElementById("go-to-top").style.display = "block";
        } else {
            document.getElementById("go-to-top").style.display = "none";
        }
    }

    // Social Media icons Plugins
    $("#social").jsSocials({
        url: "https://jealob.github.io/hika-project/",
        showLabel: false,
        showCount: "inside",
        shares: ["email", "twitter", "facebook", "googleplus", "linkedin", "pinterest"]
    });
    
    // When the user clicks on the button, scroll to the top of the document
    function topFunction() {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    } //Jump to the Top ends

    // on click jump to the top button event
    $("#go-to-top").on("click", topFunction);

    // What is this ????
    $("#planning-section").hide();
    $("#planning-button").on("click", function (event) {
        event.preventDefault();
        // console.log("click");
        $("#myCarousel").hide();
        $("#planning-section").show();
    }) //Ends

    // Instagram Feed API
    var feed = new Instafeed({
        get: 'tagged',
        tagName: 'qaalbievents',
        userId: '5583030622',
        accessToken: '5583030622.ba4c844.186ef35d5451485b80e09eff337e69b6',
        limit: '7',
    });
    feed.run(); //Instagram Feed ends

    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyAy99HmVCBqY41HnOx-54HltgcOvykan40",
        authDomain: "hika-d4f28.firebaseapp.com",
        databaseURL: "https://hika-d4f28.firebaseio.com",
        projectId: "hika-d4f28",
        storageBucket: "",
        messagingSenderId: "193526260174"
    };
    firebase.initializeApp(config);

    // Reference firebase database
    var database = firebase.database();

    // On click Submit Button 
    $("#submit").on("click", function (event) {
        event.preventDefault();
        // Grab client information
        var date = moment().format("X");
        var name = $("#name").val().trim();
        var email = $("#email").val().trim();
        var phone = $("#phone").val().trim();
        var preferredContact = $("#preferredContact").val().trim();
        var eventType = $("#eventType").val().trim();
        var eventDate = moment($("#eventDate").val().trim()).format('L');
        var eventLoc = $("#eventLoc").val().trim();
        var serviceType = $("#serviceType").val().trim();
        var message = $("#message").val().trim();
        var timeDiff = moment(eventDate).diff(moment(), "hours");
        if ((name && email && eventDate && eventType) || (name && phone && eventDate && eventType)) {
            if (timeDiff > 23) {
                // Create Object for the values
                var bookingInfo = {
                    date: date,
                    name: name,
                    email: email,
                    phone: phone,
                    eventDate: eventDate,
                    preferredContact: preferredContact,
                    eventType: eventType,
                    eventLoc: eventLoc,
                    serviceType: serviceType,
                    message: message,
                }

                // Ensuring data consistency 
                for (var item in bookingInfo) {
                    if ((bookingInfo[item] === "") || (bookingInfo[item] === "Please Select")) {
                        bookingInfo[item] = "none";
                    }
                }
                // Ensure method of contact matches with available information
                if (bookingInfo.phone === "none") {
                    bookingInfo.preferredContact = "Email";
                }
                else if (bookingInfo.email === "none") {
                    if ((bookingInfo.preferredContact !== "Phone") || (bookingInfo.preferredContact !== "Text Message")) {
                        bookingInfo.preferredContact = "Phone";
                    }

                }
                // Push data to database
                database.ref().push(bookingInfo);

                // Show success notification modal
                $(this).attr("data-target", "#successModal");
                $('#notfiy').html("");
                $('#successModal').on();

                // clear form
                $("#name").val("");
                $("#email").val("");
                $("#phone").val("");
                $("#preferredContact").val("");
                $("#eventType").val("");
                $("#eventDate").val("");
                $("#eventLoc").val("");
                $("#serviceType").val("");
                $("#message").val("");
            }
            else {
                $(this).attr("data-target", "#warningModal");
                $('#notify').html("The Chosen date for your event is less than 24 hours. We are sorry we can only respond  if event is 48 hours or more from the time of inquiry, Changing your event date to a later date will make everyone happy.");
                $('#warningModal').on();
            }
        }
        else {
            $(this).attr("data-target", "#warningModal");
            $('#notify').html("To successfully submit a form required fields must be filled!, Please try filling out name, event date, event type and phone/email.");
            $('#warningModal').on();
        }
    }); // On submit click Ends

    // Firebase watcher
    database.ref().on("child_added", function (childSnapshot, prevChildKey) {
        // 
        var data = childSnapshot.val();
        var submissionDate = moment.unix(data.date).format("MM/DD/YY");

        // Add train Itinerary to table
        $(".table > tbody").append("<tr><td>" + submissionDate + "</td><td>" + data.name + "</td><td>" + data.email + "</td><td>" + data.phone + "</td><td>" + data.eventDate + "</td><td>" + data.preferredContact + "</td><td>" + data.eventType + "</td><td>" + data.eventLoc + "</td><td>" + data.serviceType + "</td><td>" + data.message + "</td></tr>");

    }, function (errorObject) {
        console.log("Errors handled: " + errorObject.code);
    }); //Firebase ends


    // Google Map API
    // Get current position of the device
    function getPos() {
        var map;
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(initMap, positionDenied, geoSettings);
        } else {
            alert("Geolocation is not supported by this browser.");
            initMap();
        }
    }
    // Device Location no found. No GPS on device
    var positionDenied = function () {
        initMap();
    };

    var geoSettings = {
        enableHighAccuracy: false,
        maximumAge: 30000,
        timeout: 20000
    };

    //  Initialize map and plot coordinates on the map
    var initMap = function (position) {
        // if client blocks know your location
        (!position) ? latlng = new google.maps.LatLng(44.0121221, -92.4801989) : latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        var markerTitle = "You are here";
        var myOptions = {
            zoom: 12,
            center: latlng,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        map = new google.maps.Map(document.getElementById('map'), myOptions);
        var $searchBox = $("<input id = 'places-input' class = 'controls' type = 'text'  placeholder = 'Search Box'>");
        $(".map-canvas").prepend($searchBox);
        $("#map").append("<input 'type': 'text' 'id': 'places-input'>");
        var input = /** @type {HTMLInputElement} */(
            document.getElementById('places-input'));

        var autocomplete = new google.maps.places.Autocomplete(input);
        autocomplete.bindTo('bounds', map);

        map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

        var infowindow = new google.maps.InfoWindow();
        var marker = new google.maps.Marker({
            map: map,
            animation: google.maps.Animation.DROP,
        });
        google.maps.event.addListener(marker, 'click', function () {
            infowindow.open(map, marker);
        });

        // Get the full place details when the user selects a place from the
        // list of suggestions.
        google.maps.event.addListener(autocomplete, 'place_changed', function () {
            infowindow.close();
            var place = autocomplete.getPlace();
            if (!place.geometry) {
                return;
            }
            if (place.geometry.viewport) {
                map.fitBounds(place.geometry.viewport);
            } else {
                map.setCenter(place.geometry.location);
                map.setZoom(17);
            }

            // Set the position of the marker using the place ID and location.
            marker.setPlace(/** @type {!google.maps.Place} */({
                placeId: place.place_id,
                location: place.geometry.location
            }));
            marker.setVisible(true);

            infowindow.setContent('<div><strong>' + place.name + '</strong><br>' +
                'Place ID: ' + place.place_id + '<br>' +
                place.formatted_address + '</div>');
            infowindow.open(map, marker);
        });

        // Set marker point on the map
        var marker = new google.maps.Marker({
            position: latlng,
            map: map,
            title: markerTitle
        });
    }//Google map API ends

    // On click search button
    $("#search").on("click", function () {
        var address = $("#eventLoc").val().trim();
        var googleAPIKey = "AIzaSyBf3B6oIwOLvm3DQgH-gsJu8bsON0AT8ao";
        var geoURL = "https://maps.googleapis.com/maps/api/geocode/json?address=" + address +
            "&radius=150&key=" + googleAPIKey;
        $.ajax({
            url: geoURL,
            method: "GET"
        }).then(function (response) {
            (response.results.length === 1) ? address = response.results[0].formatted_address : address;
            // Transfer content to HTML
            $("#eventLoc").val(address);
            $("#places-input").val(address);
            address = "";
        });
    })//on click event ends

    // Initialize map
    getPos();
})