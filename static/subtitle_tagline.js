var taglines = [];
var rawsub = "";
var subtitle = document.getElementsByClassName("subtitle")[0];

function setTagline() {
    var thisTagline = taglines[Math.floor(Math.random()*taglines.length)];

    if (rawsub == "") {
        rawsub = subtitle.innerHTML;
    }

    subtitle.innerHTML = rawsub;

    // Legit just a workaround for an Atom feature: auto newline at EOF
    // Yeah, just not display anything. It's not a bug, it's a feature, I swear!
    if (thisTagline == "") {
        return;
    }

    if (thisTagline == "<COUNT>") {
        thisTagline = taglines.length + " taglines and counting...";
    }

    if (thisTagline == "<PERCENT>") {
        thisTagline = "Did you know that if you're looking for a specific tagline in here, there's only a " + (1/taglines.length)*100 + "% chance of getting it each load?";
    }

    subtitle.innerHTML = rawsub + " | " + thisTagline;
}

var xmlHttp = new XMLHttpRequest();
xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
        taglines = xmlHttp.responseText.split("\n");
        setTagline();
    }
}

xmlHttp.open("GET", "/taglines.txt", true);
xmlHttp.send(null);
