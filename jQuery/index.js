$("button").click(function(){
    $("h1").fadeToggle().animate({opacity: 0.5});
});

$(document).keypress(function(event){
    $("h1").text(event.key);
});

$("h1").before("<button>New</button>")
$("h1").after("<button>New</button>")
$("h1").append("<button>New</button>")
$("h1").prepend("<button>New</button>")
