var months = [ "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December" ];

Handlebars.registerHelper('prettyDate', function(context, options) {
	var date = new Date(context.iso);
	var month = date.getMonth();
	month = months[month];
	var day = date.getDate();
	var year = date.getFullYear();
	return month + ' ' + day + ', ' + year;
});