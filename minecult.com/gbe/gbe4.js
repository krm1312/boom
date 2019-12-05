var Weapon = function (name, initial_cost, extra_cost) {
  this.name = name;
  this.count = 0;
  this.initial_cost = initial_cost;
  this.extra_cost = extra_cost;
  this.last_click_up = 0;
  this.last_click_down = 0;
  this.last_click_clear = 0;
};

function body_load()
{
   var hd_ht = document.getElementById( "myHeader" ).clientHeight;
   document.getElementById( "content" ).style.marginTop = (parseInt(hd_ht)+12) + "px";
   var ft_ht = document.getElementById( "myFooter" ).clientHeight;
   document.getElementById( "content" ).style.marginBottom = (parseInt(ft_ht)+12) + "px";

   var gb_lvl = parseInt(localStorage.getItem( 'bb_gb_lvl' ));

   if( ! isNaN( gb_lvl ) )
   {   
   	document.forms['gbe'].elements['gb_lvl'].value = gb_lvl;
   }

   for( j = 1; j <= 10; j++ )
   {      
     var boosted = localStorage.getItem( 'bb_gbe_statue_boosted' + j );
     if( boosted === "true"  )
        document.forms['gbe'].elements['boosted' + j].checked = true;     

     var statue_val = parseFloat( localStorage.getItem( 'bb_gbe_statue' + j ) );

     if( ! isNaN( statue_val ) )
     {
        document.forms['gbe'].elements['statue' + j].value = statue_val;        
     }
   }
   
   bldg_calc();
   statue_calc();
}
function weapon_cost( weapon, count )
{
  var rv = 0;
  var i;
  for( i = 0; i < count; i++ )
  {
    rv += weapons[weapon].initial_cost + weapons[weapon].extra_cost * i;
  }
  return rv;
}
function gbe_calc()
{
    gbe = parseInt(document.forms['gbe'].elements['gb_lvl'].value);
    
    if( isNaN( gbe ) )
    {
        document.forms['gbe'].elements['total_gbe'].value = '';       
        document.getElementById('gbe_totals').style.background = "#336340";    
        return;
    }
    if( gbe <= 20 )
       gbe = 10+gbe*2;
    else
       gbe = 50+(gbe-20);
    
    gbe_statue = parseFloat(document.forms['gbe'].elements['gbe_statue'].value);

    gbe_bldg = parseInt(document.forms['gbe'].elements['bldg_gbe'].value);
 

      
    total = gbe + Math.ceil( gbe * gbe_statue / 100.0 );

    total = total + gbe_bldg;

    if( ! isNaN( total ) )
        document.forms['gbe'].elements['total_gbe'].value = Math.round(total);   
    else
        document.forms['gbe'].elements['total_gbe'].value = gbe;       
        


    cost = parseInt( document.forms['gbe'].elements['total_cost'].value  );    
    if( ! isNaN( cost ) )
    {
    	if( cost > total )
	    	document.getElementById('gbe_totals').style.background = "#9E2424";
	else
	    	document.getElementById('gbe_totals').style.background = "#336340";
    }
    else
    {
     	document.getElementById('gbe_totals').style.background = "#336340";    
    }    
}
function statue_calc()
{
   var total = 0;
   for( j = 1; j <= 10; j++ )
   {
   	var boosted = document.forms['gbe'].elements['boosted' + j].checked;
   	if( boosted ) 
   	{
   	   document.getElementById('boosted_label' + j).title = 'Statue is boosted.';  
   	}
   	else
   	{
   	   document.getElementById('boosted_label' + j).title = 'Statue is not boosted.';  
   	}   	
   	var val = parseFloat( document.forms['gbe'].elements['statue' + j ].value );
   	if( ! isNaN( val ) )
   	{
   	   if( boosted )
   	   {
   	     val *= 2;
   	   }
   	   total += val;
   	}
   } 
   document.forms['gbe'].elements['gbe_statue'].value = total + "%";
   gbe_calc();
}
function bldg_calc()
{
    count = parseInt(document.forms['gbe'].elements['bldg_count'].value);
    
    if( isNaN( count ) )
    {
        document.forms['gbe'].elements['bldg_gbe'].value = '0';       
    }
    else
    {
        document.forms['gbe'].elements['bldg_gbe'].value = count*3;       
    }
    gbe_calc();
}
function show_statues()
{
    document.getElementById('my_statues').style.display = "block";
}
function hide_statues()
{
    document.getElementById('my_statues').style.display = "none";
}
function toggle_statues()
{
    if( document.getElementById('my_statues').style.display === "block" )
    {
         hide_statues();
    }
    else
    {
         show_statues();
    } 
    var hd_ht = document.getElementById( "myHeader" ).clientHeight;
    document.getElementById( "content" ).style.marginTop = (parseInt(hd_ht)+12) + "px";
}
function show_destruction()
{
    document.getElementById('my_destruction').style.display = "block";
}
function hide_destruction()
{
    document.getElementById('my_destruction').style.display = "none";
}
function toggle_destruction()
{
    if( document.getElementById('my_destruction').style.display === "block" )
    {
         hide_destruction();
    }
    else
    {
         show_destruction();
    } 
    var hd_ht = document.getElementById( "myHeader" ).clientHeight;
    document.getElementById( "content" ).style.marginTop = (parseInt(hd_ht)+12) + "px";
}
function save_gb_lvl( val )
{
     localStorage.setItem( 'bb_gb_lvl', val );
}
function statue_boosted( index, checked )
{
  statue_calc();
  localStorage.setItem( "bb_gbe_statue_boosted" + index, checked);  
}
function save_statue( index, val)
{
  localStorage.setItem( 'bb_gbe_statue' + index, val );
}
function calc_total_gbe()
{
   var total = 0;
   var j;
   for( var weapon in weapons )
   {      
       var cost = weapon_cost( weapon, weapons[weapon].count );
       if( ! isNaN( cost ) )
       {
           total += cost;
       }
   }
   document.forms['gbe'].elements['total_cost'].value = total;

    var gbe = parseInt( document.forms['gbe'].elements['total_gbe'].value  );    
    if( ! isNaN( gbe) )
    {
    	if( gbe < total )
	    	document.getElementById('gbe_totals').style.background = "#9E2424";
	else
	    	document.getElementById('gbe_totals').style.background = "#336340";
    }
    else
    {
     	document.getElementById('gbe_totals').style.background = "#336340";    
    }    
}


function clear_weapon( weapon )
{
   document.getElementById('weapon_click_top::' + weapon).style.backgroundColor = '#9E2424';
   document.getElementById('weapon_click_bottom::' + weapon).style.backgroundColor = '#9E2424';
   var d = new Date();
   weapons[ weapon ].last_click_clear = d.getTime();

   setTimeout( function() { 
       var d = new Date();
       if( weapons[ weapon ].last_click_clear < d.getTime() - 450 )
       {
          document.getElementById('weapon_click_top::' + weapon).style.backgroundColor = 'transparent';
          document.getElementById('weapon_click_bottom::' + weapon).style.backgroundColor = 'transparent';
       }
   }, 500 );

   weapons[ weapon ].count = 0;
   update_weapon( weapon );
}
function increment_weapon( weapon )
{
   document.getElementById('weapon_click_top::' + weapon).style.backgroundColor = '#348248';
   var d = new Date();
   weapons[ weapon ].last_click_up = d.getTime();

   setTimeout( function() { 
       var d = new Date();
       if( weapons[ weapon ].last_click_up < d.getTime() - 450 )
          document.getElementById('weapon_click_top::' + weapon).style.backgroundColor = 'transparent';
   }, 500 );

   weapons[ weapon ].count++;
   if( weapons[ weapon ].count > 99 )
       weapons[ weapon ].count = 99;
   update_weapon( weapon );  
}
function decrement_weapon( weapon )
{
   document.getElementById('weapon_click_bottom::' + weapon).style.backgroundColor = '#9E2424';
   var d = new Date();
   weapons[ weapon ].last_click_down = d.getTime();

   setTimeout( function() { 
       var d = new Date();
       if( weapons[ weapon ].last_click_down < d.getTime() - 450 )
          document.getElementById('weapon_click_bottom::' + weapon).style.backgroundColor = 'transparent';
   }, 500 );

   weapons[ weapon ].count--;
   if( weapons[ weapon ].count < 0 )
       weapons[ weapon ].count = 0;
   update_weapon( weapon );
}
function update_weapon( weapon )
{
    document.getElementById('weapon_count::' + weapon).innerHTML = 'x' + weapons[ weapon ].count;
    document.getElementById('weapon_cost::' + weapon).innerHTML = weapon_cost( weapon, weapons[ weapon ].count );

    calc_total_gbe();
}
function toggle_legal_info()
{
   if( document.getElementById('legal_toggle').innerHTML.indexOf( 'hide' ) != -1 )
   {
       document.getElementById('legal_toggle').innerHTML = "Click for legal information";  
       document.getElementById('legal_contents').style.display = 'none';
   }
   else
   {
       document.getElementById('legal_toggle').innerHTML = "Click to hide legal information";   
       document.getElementById('legal_contents').style.display = 'block';
   }
   var ft_ht = document.getElementById( "myFooter" ).clientHeight;
   document.getElementById( "content" ).style.marginBottom = (parseInt(ft_ht)+12) + "px";

}
function hide_hint()
{
  document.getElementById( 'hints' ).style.display = 'none';
}
function show_hint()
{
  document.getElementById( 'hints' ).style.display = 'block';
}