var ctx = document.getElementById("activityTriangle").getContext("2d");
var gradesCtx = document.getElementById("gradesGraph").getContext("2d");
var sleepCtx = document.getElementById("sleepGraph").getContext("2d");
var socialCtx = document.getElementById("leisureGraph").getContext("2d");

var days = 1;
var allResponses = [];
//TODO: for loop to push all response clusters into allResponses[]
var rawIndices = [];
var avgIndices = [];

var data = {
    labels: ["Good Grades", "Enough Sleep", "Social Life"],
    datasets: []
};

var gradesData = {
    labels: [],
    datasets: [{
        data: [],
        backgroundColor: [],
        label: "Grades"
    }]
};

var sleepData = {
    labels: [],
    datasets: [{
        data: [],
        backgroundColor: [],
        label: "Sleep"
    }]
};

var socialData = {
    labels: [],
    datasets: [{
        data: [],
        backgroundColor: [],
        label: "Sleep"
    }]
};

var gradesIndex = 50;
var sleepIndex = 50;
var leisureIndex = 50;

var triangle = new Chart(ctx, {
    type: 'radar',
    data: data,
    options: {
        responsive: false,
        scale: {
            ticks: {
                beginAtZero: true,
                min: 0,
                max: 100
            }
        }
    }
});

var gradesPolar = new Chart(gradesCtx, {
    type: 'polarArea',
    data: gradesData,
    options: {
        responsive: false,
        scale: {
            ticks: {
                beginAtZero: true,
                min: 0,
                max: 100
            }
        }
    }
});


var sleepPolar = new Chart(sleepCtx, {
    data: sleepData,
    type: 'polarArea',
    options: {
        responsive: false,
        scale: {
            ticks: {
                beginAtZero: true,
                min: 0,
                max: 100
            }
        }
    }
});

var socialPolar = new Chart(socialCtx, {
    type: 'polarArea',
    data: socialData,
    options: {
        responsive: false,
        scale: {
            ticks: {
                beginAtZero: true,
                min: 0,
                max: 100
            }
        }
    }
});

function init() {
    var currentResponse = [];
    for (var i = 1; i <= 7; i++) {
        for (var j = 0; j < document.getElementsByClassName(i).length; j++) {
            console.log(document.getElementsByClassName(i)[j]);
            if (document.getElementsByClassName(i)[j].selected) {
                currentResponse.push(questionGenerator(document.getElementsByClassName(i)[j].getAttribute("gradesChange"), document.getElementsByClassName(i)[j].getAttribute("sleepChange"), document.getElementsByClassName(i)[j].getAttribute("leisureChange")));
            }
        };
    };
    allResponses.push(currentResponse);
    console.log(currentResponse);
    currentResponse.forEach(function(question) {
        gradesIndex += question.dgrades;
        sleepIndex += question.dsleep;
        leisureIndex += question.dleisure;
    }); //end one day
    rawIndices.push(createIndexCluster(gradesIndex, sleepIndex, leisureIndex));
    //reset grades index
    gradesIndex = 50;
    sleepIndex = 50;
    leisureIndex = 50;
    //reset average calculation
    avgIndices = [];
    var avgGrades = 0;
    var avgSleep = 0;
    var avgLeisure = 0;
    rawIndices.forEach(function(indices) {
        avgGrades += indices.grades;
        avgSleep += indices.sleep;
        avgLeisure += indices.leisure;
    });
    avgIndices.push(Math.round(avgGrades / allResponses.length));
    avgIndices.push(Math.round(avgSleep / allResponses.length));
    avgIndices.push(Math.round(avgLeisure / allResponses.length));

    mainSetGenerator();
    triangle.update();

    polarSetGenerator("grades");
    gradesPolar.update();

    polarSetGenerator("sleep");
    sleepPolar.update();

    polarSetGenerator("leisure");
    socialPolar.update();

    function createIndexCluster(grades, sleep, leisure) {
        return {
            grades: grades,
            sleep: sleep,
            leisure: leisure
        }
    };

    function questionGenerator(grades, sleep, leisure) {
        return {
            dgrades: parseInt(grades),
            dsleep: parseInt(sleep),
            dleisure: parseInt(leisure)
        }
    };

    function randomIntGenerator(max) {
        return Math.round(255 * Math.random());
    };


    function randomColorGenerator(alpha) {
        var red = randomIntGenerator(255);
        var green = randomIntGenerator(255);
        var blue = randomIntGenerator(255);

        return {
            alpha: "rgba(" + red + "," + green + "," + blue + ",0.6)",
            solid: "rgb(" + red + "," + green + "," + blue + ")"
        };

    };

    function setGenerator(tag, data) {
        var randomColor = randomColorGenerator();
        return {
            label: tag,
            data: data,
            backgroundColor: randomColor.alpha,
            borderColor: randomColor.solid,
            borderWidth: 5,
            pointBorderColor: randomColor.solid,
            pointBackgroundColor: randomColor.alpha,
            pointBorderWidth: 3,
            pointRadius: 5
        }
    };

    function mainSetGenerator() {
        var currentIndices = rawIndices[rawIndices.length - 1];
        var set = [];
        set[0] = currentIndices.grades;
        set[1] = currentIndices.sleep;
        set[2] = currentIndices.leisure;
        var tag = "Person " + rawIndices.length;
        var setObject = setGenerator(tag, set);
        data.datasets.push(setObject);
    };

    function polarSetGenerator(type) {
        if (type == "grades") {
            var currentIndices = rawIndices[rawIndices.length - 1];
            gradesData.datasets[0].data.push(currentIndices.grades);
            gradesData.datasets[0].backgroundColor.push(randomColorGenerator().solid);
            var label = "Person " + rawIndices.length;
            gradesData.labels.push(label);
        } else if (type == "sleep") {
            var currentIndices = rawIndices[rawIndices.length - 1];
            sleepData.datasets[0].data.push(currentIndices.sleep);
            sleepData.datasets[0].backgroundColor.push(randomColorGenerator().solid);
            var label = "Person " + rawIndices.length;
            sleepData.labels.push(label);
        } else if (type == "leisure") {
            var currentIndices = rawIndices[rawIndices.length - 1];
            socialData.datasets[0].data.push(currentIndices.leisure);
            socialData.datasets[0].backgroundColor.push(randomColorGenerator().solid);
            var label = "Person " + rawIndices.length;
            socialData.labels.push(label);
        }
    };

    function setRandomColor(id) {
        document.getElementById(id).style.color = randomColorGenerator().solid;
    };

    document.getElementById("grades").textContent = avgIndices[0];
    setRandomColor("grades");
    document.getElementById("sleep").textContent = avgIndices[1];
    setRandomColor("sleep");
    document.getElementById("social").textContent = avgIndices[2];
    setRandomColor("social");

    function updateGrades() {
        var gradesIndex = avgIndices[0];
        if (gradesIndex >= 0 && gradesIndex < 20) {
            document.getElementById("gradesInfo").textContent =
                gradesIndex + "!??? You're in college!" +
                " By now you should be a responsible adult!";
        }
        if (gradesIndex >= 20 && gradesIndex < 40) {
            document.getElementById("gradesInfo").textContent =
                "Your Academic Index is in the lower-medium range." +
                " If you wish to prioritize schoolwork, we would suggest " +
                "utilizing your leisure time more wisely or cutting back on" +
                " sleep if your Sleep Index is above 50.";
        }
        if (gradesIndex >= 40 && gradesIndex < 60) {
            document.getElementById("gradesInfo").textContent =
                "Perfect! Your Academic Index is in the medium range and" +
                " suggests a well-balanced student life.";
        }
        if (gradesIndex >= 60 && gradesIndex < 80) {
            document.getElementById("gradesInfo").textContent =
                "Your Academic Index is in the upper-medium range." +
                " You must be a student taking his/her schoolwork quite seriously." +
                "Well done, but we suggest taking it a little easy and allowing yourself leisure time.";
        }
        if (gradesIndex >= 80 && gradesIndex <= 100) {
            document.getElementById("gradesInfo").textContent =
                gradesIndex + "!??? How are you doing this? We implore you to rest and allow yourself free time.";
        }
    };

    function updateSleep() {
        var sleepIndex = avgIndices[1];
        if (sleepIndex >= 0 && sleepIndex < 20) {
            document.getElementById("sleepInfo").textContent =
                "Dude, you need to get some sleep. It's taking a toll on your health." +
                " We can see it in your eyes."
        }
        if (sleepIndex >= 20 && sleepIndex < 40) {
            document.getElementById("sleepInfo").textContent =
                "Your Sleep Index is in the lower-medium range. You are sacrificing vital" +
                " sleep for schoolwork and leisure time. If you wish to wake up in the morning" +
                " feeling more refreshed then we suggest sleeping earlier to lead a balanced lifestyle.";
        }
        if (sleepIndex >= 40 && sleepIndex < 60) {
            document.getElementById("sleepInfo").textContent =
                "Nice work! Your Sleep Index is in the medium 7-9 hour range.";
        }
        if (sleepIndex >= 60 && sleepIndex < 80) {
            document.getElementById("sleepInfo").textContent =
                "Your Sleep Index is in the upper-medium range. Rest is always needed but if you feel you are" +
                " lacking in other areas you may want to cut back on sleep.";
        }
        if (sleepIndex >= 80 && sleepIndex <= 100) {
            document.getElementById("sleepInfo").textContent =
                sleepIndex + "? Dude, you only need 8 hours of sleep. There's a large portion of your day " +
                "that you're missing out on.";
        }
    };

    function updateSocial() {
        var leisureIndex = avgIndices[2];
        if (leisureIndex >= 0 && leisureIndex < 20) {
            document.getElementById("leisureInfo").textContent =
                "Life isn't only meant for sleeping and studying." +
                " Please consider alotting more time to let yourself enjoy" +
                " your surroundings.";
        }
        if (leisureIndex >= 20 && leisureIndex < 40) {
            document.getElementById("leisureInfo").textContent =
                "Your Leisure Index is in the lower-medium range. This is alright" +
                ", but we suggest taking more free time out of your day.";
        }
        if (leisureIndex >= 40 && leisureIndex < 60) {
            document.getElementById("leisureInfo").textContent =
                "Amazing! You have managed to balance leisure time in your no doubt busy schedule.";
        }
        if (leisureIndex >= 60 && leisureIndex < 80) {
            document.getElementById("leisureInfo").textContent =
                "Your Leisure Index is in the upper-medium range. You may wish to allocate more free time" +
                " towards schoolwork or sleeping if you feel you are lacking in either of these areas.";
        }
        if (leisureIndex >= 80 && leisureIndex <= 100) {
            document.getElementById("gradesInfo").textContent =
                leisureIndex + "? You are having way too much fun. Have you seen your transcript?";
        }
    };

    updateGrades();
    updateSocial();
    updateSleep();
};

function toggleGraph() {
    var style = document.getElementById("graphs").style.display;
    if (style == "" || style == "none") {
        document.getElementById("graphs").style.display = "block";
    }
    if (style == "block") {
        document.getElementById("graphs").style.display = "none";
    }
};

function toggleInfo(id) {
    var style = document.getElementById(id).style.display;
    if (style == "" || style == "none") {
        document.getElementById(id).style.display = "block";
    }
    if (style == "block") {
        document.getElementById(id).style.display = "none";
    }
}; //end init

function displaySchool() {
    toggleInfo("gradesGraph");
    toggleInfo("gradesInfo");
};

function displaySleep() {
    toggleInfo("sleepGraph");
    toggleInfo("sleepInfo");
};

function displaySocial() {
    toggleInfo("leisureGraph");
    toggleInfo("leisureInfo");
};
