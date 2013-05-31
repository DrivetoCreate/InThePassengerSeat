var Episode = Parse.Object.extend("Episode");
var Sponsor = Parse.Object.extend("Sponsor");
var Mention = Parse.Object.extend("Mention");
var Guest = Parse.Object.extend("Guest");

var episodes = [];
var currentIndex = 0;

function setupPlayer() {
	if (player) {
		player.pause();
		player = null;
	}
	player = new MediaElementPlayer('#player', {
		audioWidth: '100%',
		features: ['playpause', 'progress', 'current', 'duration'],
		iPadUseNativeControls: true,
	  iPhoneUseNativeControls: true, 
	  AndroidUseNativeControls: true
	});

	var src = $("#player").attr("src");
	player.setSrc(src);
}

function getAllEpisodes() {
	var episodeQuery = new Parse.Query(Episode);
	episodeQuery.ascending("recordingDate");

	episodeQuery.find({
	  success: function(results) {
	  	episodes = results;
	    populateEpisodeList();
	    updateEpisodeView();
	  },
	  error: function(error) {
	  	console.log(error);
	  }
	});
}

function populateEpisodeList() {
	$("#episode-picker").html('');
	var template = Handlebars.compile($("#episode-picker-template").html());
	$.each(episodes, function (i, e) {
		var d = e.toJSON();
		$("#episode-picker").append(template(d));
	})
	
}

function getSponsors (episode) {
	var sponsors = episode.relation('sponsors');
	sponsors.query().find({
		success: function (list) {
			console.log("Got Sponsors: %o", list);
		}
	})
}

function getRelation (key, $container, template) {
	var relation = episodes[currentIndex].relation(key);
	relation.query().find({
		success: function (list) {
			$container.html('');
			$.each(list, function (i, e) {
				var data = e.toJSON();
				$container.append(template(data));
			});
		},
		error: function (error) {
			console.log(error);
		}
	});
}

function getGuests () {
	var key = 'guests';
	var $container = $("#specialGuest");
	var template = Handlebars.compile($("#guest-view-template").html());
	getRelation(key, $container, template);
}

function getSponsors () {
	var key = 'sponsors';
	var $container = $(".episode-sponsors");
	var template = Handlebars.compile($("#episode-sponsors-template").html());
	getRelation(key, $container, template);
}

function getMentions (episode) {
	var key = 'mentions';
	var $container = $(".episode-mentions");
	var template = Handlebars.compile($("#episode-mentions-template").html());
	getRelation(key, $container, template);
}

function updateEpisodeView() {
	var episode = episodes[currentIndex].toJSON();
	var template = Handlebars.compile($("#episode-view-template").html());
	$("#episodeDetails").html(template(episode));
	setupPlayer();
	getGuests();
	getSponsors();
	getMentions();
}

function nextEpisode() {
	var newIndex = currentIndex++;
	if (newIndex > (episodes.length - 1)) {
		console.log("MAXXED OUT, CAPTAIN");
	} else {
		currentIndex = newIndex;
		updateEpisodeView();
	}
}

function previousEpisode() {
	var newIndex = currentIndex--;
	if (newIndex < 0) {
		console.log("MINNED(?) OUT, CAPTAIN");
	} else {
		currentIndex = newIndex;
		updateEpisodeView();
	}
}

getAllEpisodes();