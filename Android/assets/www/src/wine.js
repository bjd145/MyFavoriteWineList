/*
 * To Do:
 * 
 * 1. Refresh list after entry  - DONE
 * 2. Details View - DONE
 * 5. Transitions - DONE
 * 4. Fix Welcome to Message to refresh - DEFERRED
 * 7. Fix Bug on Refresh List does not work on first entry - CRITICAL
 * 11. Phone Gap - IP
 * 10. Add loading bubble
 * 8. Delete Wine
 * 9. Edit Wine
 * 6. Deploy to AppHarbor
 * 3. Sync with web database using persistence.js / node.js
 */
var wineList;

function save_settings() 
{
	localStorage.connoisseur = $('#connoisseur').val();
	
	if( $('form #clear_list').is(':checked') )
	{
		ClearList();
		$('form #clear_list').removeAttr('checked');
	}

	window.location = "index.html";
}

function add_wine(event)
{		
	var wine = { 
		"name" : $('#name').val() ,
		"year" : $('#year').val() ,
		"variety" : $('#variety').val(), 
		"recommend" : $('#recommend').val(), 
		"thoughts" : $('#thoughts').val() 
	};

	wineList.wines.push( wine );
	localStorage.wineList = JSON.stringify( wineList );
		
	console.log("Inside add function");

	window.location = "index.html";
}

function ClearList()
{
	localStorage.wineList = JSON.stringify(  { wines : [] } );
}

function refresh_list()
{
	if( !localStorage.wineList )
	{
		ClearList();
	}
	
	console.log("Inside refresh");
	$('#connoisseur').val(localStorage.connoisseur);

	wineList = JSON.parse(localStorage.wineList);
	
	var wine;
	for( wine in wineList.wines)
	{
		var obj = wineList.wines[wine];
		$('#winelist').append('<li><a data-rel="dialog" data-wine="' + wine + '" data-transition="pop" href="#details">' + obj.name + ' (' + obj.year + ')</a></li>');
	}
	
	//this is not refreshing the first time its called!
	console.log("going to refresh");	
	$('#winelist').listview('refresh');
	console.log($('#winelist').html());
	console.log("Should be refresh");
}

function show_details(index)
{
	var obj = wineList.wines[index];
	
	console.log("inside details");
	console.log("index = " + index);

	$("#wine_name").val(obj.name + " - Year: " + obj.year);
	$("#wine_type").val(obj.variety);
	$("#wine_recommend").val(obj.recommend);
	$("#wine_thoughts").val(obj.thoughts);
}

$( '#main' ).live( 'pageinit', function(event){
	console.log("Inside pageinit");
	refresh_list();
});

$( '#main' ).live( 'pagechange', function(event){
	console.log("Inside pagechange");
	refresh_list();
});

$(function(){

	console.log("Inside doc ready");
	
	$('#winelist li a').click(function() {
		show_details( $(this).data('wine') );
	});
	$('#settings form').submit(save_settings);
	$('#create form').submit(add_wine);
});
