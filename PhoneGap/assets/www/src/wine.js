/*
 * To Do:
 * 
 * 1. Refresh list after entry  - DONE
 * 2. Details View - DONE
 * 5. Transitions - DONE
 * 4. Fix Welcome to Message to refresh - DEFERRED
 * 7. Fix Bug on Refresh List does not work on first entry - DONE
 * 11. Phone Gap - DONE
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
		"rating" :$("#stars-wrapper1").data("stars").options.value,
		"thoughts" : $('#thoughts').val() 
	};

	wineList.wines.push( wine );
	localStorage.wineList = JSON.stringify( wineList );
		
	window.location = "index.html";
}

function ClearList()
{
	localStorage.wineList = JSON.stringify(  { wines : [] } );
}

function refresh_list()
{

	console.log("Inside refresh");

	if( !localStorage.wineList )
	{
		ClearList();
	}
	
	$('#connoisseur').val(localStorage.connoisseur);

	wineList = JSON.parse(localStorage.wineList);
	
	var wine;
	for( wine in wineList.wines)
	{
		var obj = wineList.wines[wine];
		if( obj != null )
		{
			var link = '<li><a data-rel="dialog" data-wine="' + wine + '" data-transition="pop" href="#details">' + obj.name + ' (' + obj.year + ')</a>';
			link += '<a data-rel="dialog" data-wine="' + wine + '" data-transition="pop" onClick="delete_wine(' + wine + ')" href="#main"></a></li>';
			$('#winelist').append(link);	
		}
	}
	
	$('#winelist').listview('refresh');
}

function delete_wine(index)
{
		
	console.log("inside delete");
	console.log("index = " + index);

	if(confirm("Are you sure you wish to delete"))
	{
		delete wineList.wines[index];
		localStorage.wineList = JSON.stringify( wineList );
	}

	window.location.reload();
}

function show_details(index)
{
	console.log("show details");

	var obj = wineList.wines[index];
	
	if( obj != null )
	{	
		$("#wine_name").val(obj.name + " - Year: " + obj.year);
		$("#wine_type").val(obj.variety);
		
		$("#wine_stars").stars({
			disabled: true
		});
		$("#wine_stars").stars("select", obj.rating);
		$("#wine_thoughts").val(obj.thoughts);
	}
}

$( '#main' ).live( 'pageinit', function(event){
	refresh_list();
});

$( '#main' ).live( 'pagechange', function(event){
	refresh_list();
});

$(function(){

	$('#winelist li a').click(function() {
		show_details( $(this).data('wine') );
	});
	$("#stars-wrapper1").stars();
	$('#settings form').submit(save_settings);
	$('#create form').submit(add_wine);
});
