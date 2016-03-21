var express = require('express');
var bodyParser = require('body-parser')

var app = express();

app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.redirect('/index.html');
});

app.post('/api/assistance-requests', function (req, res) {
    var possibleResponses = {
        201: "Your assistance request has been successfully submitted.",
        401: "Sorry, you are not authorized to make this request.",
        500: "Oh no! Something completely unexpected happened!",
        503: "We're down!!!!!! Come back later.....(please)"
    };
    var randomStatus = Object.keys(possibleResponses)[Math.floor(Math.random()*4)];

    res.status(randomStatus);
    res.json({message: possibleResponses[randomStatus], echo: req.body});
});
app.get('/api/service-types', function (req, res) {
    res.json({
        "data": [
            {
                "display_name": "Benefits",
                "id": "benefits"
            },
            {
                "display_name": "Employment",
                "id": "employment"
            },
            {
                "display_name": "Healthcare",
                "id": "healthcare"
            },
            {
                "display_name": "Housing",
                "id": "housing"
            },
            {
                "display_name": "Legal",
                "id": "legal"
            }
        ]
    });
});

app.listen(5000, function () {
  console.log('Listening on port 5000!');
});

app.use(express.static('static'));
