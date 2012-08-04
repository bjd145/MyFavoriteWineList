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
	var d = new Date();
	
	var wine = { 
		"name" : $('#name').val() ,
		"year" : $('#year').val() ,
		"variety" : $('#variety').val(), 
		"rating" :$("#stars-wrapper1").data("stars").options.value,
		"thoughts" : $('#thoughts').val() ,
		"created" : d,
		"modified" : d,
		"deleted" : 0
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
		console.log(obj.deleted);
		if( obj != null && parseInt(obj.deleted) != 1 )
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
		wineList.wines[index].deleted = 1;
		wineList.wines[index].modified = new Date();
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
