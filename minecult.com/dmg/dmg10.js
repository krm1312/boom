
var NUM_STATUES = 12;

var LC = function (index, capacity, image) {
  this.index = index;
  this.capacity = capacity;
  this.image = image;
};

var Troop = function (name, space, image, rate, dmg, level, max_level ) {
  this.name = name;
  this.space = space;
  this.image = image;
  this.rate = rate;
  this.dmg = JSON.parse(dmg);
  
  this.level = level;
  this.max_level = max_level;
};

var LC_Level = function (level, capacity, image) {
  this.level= level;
  this.capacity= capacity;
  this.image = image;
};

var TroopCount = function (name, count) {
  this.name = name;
  this.count = count;
};

function body_load()
{
   var hd_ht = document.getElementById( "myHeader" ).clientHeight;
   document.getElementById( "content" ).style.marginTop = (parseInt(hd_ht)+12) + "px";
   var ft_ht = document.getElementById( "myFooter" ).clientHeight;
   document.getElementById( "content" ).style.marginBottom = (parseInt(ft_ht)+12) + "px";

   for( j = 1; j <= NUM_STATUES; j++ )
   {      
     var boosted = localStorage.getItem( 'bb_dmg_statue_boosted' + j );
     if( boosted === "true"  )
        document.forms['dmg'].elements['boosted' + j].checked = true;     

     var statue_val = parseFloat( localStorage.getItem( 'bb_dmg_statue' + j ) );

     if( ! isNaN( statue_val ) )
     {
        document.forms['dmg'].elements['statue' + j].value = statue_val;        
     }
   }

  for( var troop in Troops )
   {
      if( troop != '' )
      {
        var troop_lvl = parseInt( localStorage.getItem( 'bb_troop_lvl' + troop ) );
        
        if( ! isNaN( troop_lvl ) )
        {
	    Troops[ troop ].level = troop_lvl;

            if( Troops[ troop ].level === Troops[ troop ].max_level )
            {
                document.getElementById( 'troop_level::' + troop ).innerHTML = "MAX";
            }
            else
            {
                document.getElementById( 'troop_level::' + troop ).innerHTML = Troops[ troop ].level;
            }
         }         
      }
   }
   
   var i; 
   for( i = 0; i <= 8; i++ )
   {
        var lc_lvl = parseInt( localStorage.getItem( 'bb_lc_lvl' + i ) );

        if( ! isNaN( lc_lvl ) )
        {
            LCs[ i ].image = LC_Levels[ lc_lvl ].image;
            LCs[ i ].capacity = LC_Levels[ lc_lvl ].capacity;
            if( LCs[ i ].capacity > 0 )
                document.forms['dmg'].elements['lc_lvl::' + i].value = lc_lvl;
            show_lc_image( i );                       
        }   
   }

   var tm = parseInt( localStorage.getItem( 'bb_dmg_time' ) );
   if( ! isNaN( tm ) )
   {
       document.forms['dmg'].elements['time'].value = tm;
   }
   
   statue_calc();
}
function LC_cost( LC, count )
{
  var rv = 0;
  var i;
  for( i = 0; i < count; i++ )
  {
    rv += LCs[LC].initial_cost + LCs[LC].extra_cost * i;
  }
  return rv;
}

function dps_calc()
{
//   alert('test');

    var bo = parseInt( document.forms['dmg'].elements['bo_count'].value ); 
    var i;
    var TroopCounts = [];
    for( i = 0; i <= 8; i++ )
    {
        var troop = document.forms['dmg'].elements['troops::'+i].value;
        var troop_space = Troops[ troop ].space;
        var lc_space = LCs[ i ].capacity;

        if( i > 0 )
        {
 
           var troop_count = Math.floor( lc_space / troop_space );
  
           if( troop != '' )
               document.getElementById( 'troop_count::' + i ).innerHTML = troop_count + 'x';
	   else
              document.getElementById( 'troop_count::' + i ).innerHTML = '';
	

           if( TroopCounts[ troop ] != undefined )
           {
               TroopCounts[ troop ].count += troop_count;
           }
           else
           {
               TroopCounts[ troop ] = new TroopCount( troop, troop_count );
           }
        }
        else
        {
           if( TroopCounts[ troop ] == undefined )
           {
               TroopCounts[ troop ] = new TroopCount( troop, 1 );
           }
        }
    }

   var dps = 0;
   var dpt = 0;
   var bo_dpt = 0;
   var dp_shot = 0;

   var dps_bo = 0;
   var bo_dmg = 0;
   var bo_spd = 0;
   var bo_time = bo * 8;
   
   if(bo_time > 7.5) bo_time = 7.5;

   var dpt_no_bo = 0;
   
   var time = parseFloat( document.forms['dmg'].elements['time'].value );
   if( time < 0 )
   {
      time = 0;
      document.forms['dmg'].elements['time'].value = 0;
   }
   localStorage.setItem( 'bb_dmg_time', time );

   var statues = parseInt( document.forms['dmg'].elements['dmg_statue'].value );

   if( bo != 0 ) 
   {
       bo_spd = 0.4;
       bo_dmg = Troops['BO'].dmg[ Troops['BO'].level ];
       
       
       if( Troops['BO'].level == 1 )
       {
         bo_spd = 0.4; 
       }
       else if( Troops['BO'].level == 2 )
       {
         bo_spd = 0.42; 
       }
       else if( Troops['BO'].level == 3 )
       {
         bo_spd = 0.45; 
       }
       else if( Troops['BO'].level == 4 )
       {
        bo_spd = 0.47; 
       }
       else if( Troops['BO'].level == 5 )
       {
         bo_spd = 0.50; 
       }
       else if( Troops['BO'].level == 6 )
       {
         bo_spd = 0.60; 
       }
       
   }
   for( var tc in TroopCounts )
   {
      if( tc != '' )
      {
          var rate_with_bo = Troops[ tc ].rate / ( 1.0 + bo_spd );
    
      	  dps = dps + Troops[ tc ].dmg[ Troops[ tc ].level ] / Troops[ tc ].rate * TroopCounts[ tc ].count;

      	  dps_bo = dps_bo + Troops[ tc ].dmg[ Troops[ tc ].level ] / rate_with_bo * TroopCounts[ tc ].count;

          if( ! isNaN( statues ) )
          {
              var base_dpt = Troops[ tc ].dmg[ Troops[ tc ].level ] * Math.floor( time / Troops[ tc ].rate ) * TroopCounts[ tc ].count;          
              dpt_no_bo = dpt_no_bo + Math.floor( base_dpt * ( 1.0 + statues / 100 ) ); 
              if( bo_time == 0 )
              {              
                dpt = dpt + Math.floor( base_dpt * ( 1.0 + statues / 100 ) );
              } 
              else if( bo_time > time )
              {
                var base_dpt = Troops[ tc ].dmg[ Troops[ tc ].level ] * Math.floor( time / rate_with_bo ) * TroopCounts[ tc ].count;          
                dpt = dpt + Math.floor( base_dpt * ( 1.0 + statues / 100 + bo_dmg / 100 ) );              
              }
              else
              {
                var bo_shots = Math.floor( bo_time / rate_with_bo );
                var base_dpt_bo = Troops[ tc ].dmg[ Troops[ tc ].level ] * bo_shots * TroopCounts[ tc ].count;   
                
                var bo_last_shot_time = bo_shots * rate_with_bo;
                var xtra = bo_time - bo_last_shot_time;
                var percent_xtra = xtra / rate_with_bo; 
                                      
                var base_dpt = Troops[ tc ].dmg[ Troops[ tc ].level ] * Math.floor( (time-bo_time+percent_xtra*Troops[ tc ].rate) / Troops[ tc ].rate ) * TroopCounts[ tc ].count;          
             
                dpt = dpt + Math.floor( base_dpt_bo * ( 1.0 + statues / 100 + bo_dmg / 100 ) );              
                dpt = dpt + Math.floor( base_dpt * ( 1.0 + statues / 100 ) );              
              }
          }

      	  dp_shot = dp_shot + Troops[ tc ].dmg[ Troops[ tc ].level ] * TroopCounts[ tc ].count;
      }
   }
   
   if( ! isNaN( dps ) )
   {
       document.forms['dmg'].elements['dps'].value = numberWithCommas( Math.floor(dps) );
   }
   else
   {
       document.forms['dmg'].elements['dps'].value = '';
   }
   if( ! isNaN( dps_bo ) && ! isNaN( statues ) && ! isNaN( bo_dmg ) )
   {
       document.forms['dmg'].elements['total_dps'].value = numberWithCommas( Math.floor( dps_bo * ( 1.0 + statues / 100 + bo_dmg / 100 ) ) );
   }
   else
   {
       document.forms['dmg'].elements['total_dps'].value ='';
   }
   if( ! isNaN( dp_shot ) && ! isNaN( statues ) && ! isNaN( bo_dmg ) )
   {
       document.forms['dmg'].elements['total_shot'].value = numberWithCommas( Math.floor( dp_shot * ( 1.0 + statues / 100 + bo_dmg / 100 ) ) );
   }
   else
   {
       document.forms['dmg'].elements['total_shot'].value = '';
   }
   if( ! isNaN( dpt ) )
   {
       document.forms['dmg'].elements['total_dpt'].value = numberWithCommas( dpt );
   }
   else
   {
      document.forms['dmg'].elements['total_dpt'].value = '';   
   }
   if( ! isNaN( dpt ) && ! isNaN( dpt_no_bo ) )
   {
       document.forms['dmg'].elements['bo_effect'].value = numberWithCommas( dpt - dpt_no_bo );
   }
   else
   {
      document.forms['dmg'].elements['bo_effect'].value = '';   
   }
   
}
function statue_calc()
{
   var total = 0;
   for( j = 1; j <= NUM_STATUES; j++ )
   {
   	var boosted = document.forms['dmg'].elements['boosted' + j].checked;
   	if( boosted ) 
   	{
   	   document.getElementById('boosted_label' + j).title = 'Statue is boosted.';  
   	}
   	else
   	{
   	   document.getElementById('boosted_label' + j).title = 'Statue is not boosted.';  
   	}   	
   	var val = parseFloat( document.forms['dmg'].elements['statue' + j ].value );
   	if( ! isNaN( val ) )
   	{
   	   if( boosted )
   	   {
   	     val *= 2;
   	   }
   	   total += val;
   	}
   } 
   document.forms['dmg'].elements['dmg_statue'].value = total + "%";
   dps_calc();
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
function show_bo()
{
    document.getElementById('my_orders').style.display = "block";
}
function hide_bo()
{
    document.getElementById('my_orders').style.display = "none";
}
function toggle_bo()
{
    if( document.getElementById('my_orders').style.display === "block" )
    {
         hide_bo();
    }
    else
    {
         show_bo();
    } 
    var hd_ht = document.getElementById( "myHeader" ).clientHeight;
    
    document.getElementById( "content" ).style.marginTop = (parseInt(hd_ht)+12) + "px";
}
function update_bo_count()
{
   var c = parseInt( document.forms['dmg'].elements['bo_count'].value ); 
        
   if( c == 0 )
   {
         document.getElementById("toggle_bo_img").src="bo_off.png";
         document.getElementById("bo_img").src="bo_off.png";
   }
   else
   {
         document.getElementById("toggle_bo_img").src="bo.png";
         document.getElementById("bo_img").src="bo.png";
   }
   dps_calc();
}


function toggle_armory()
{
    if( document.getElementById('my_armory').style.display === "block" )
    {
         hide_armory();
    }
    else
    {
         show_armory();
    } 
    var hd_ht = document.getElementById( "myHeader" ).clientHeight;
    document.getElementById( "content" ).style.marginTop = (parseInt(hd_ht)+12) + "px";
}
function show_armory()
{
    document.getElementById('my_armory').style.display = "block";
}
function hide_armory()
{
    document.getElementById('my_armory').style.display = "none";
}
function save_gb_lvl( val )
{
     localStorage.setItem( 'bb_gb_lvl', val );
}
function statue_boosted( index, checked )
{
  statue_calc();
  localStorage.setItem( "bb_dmg_statue_boosted" + index, checked);  
}
function save_statue( index, val)
{
  localStorage.setItem( 'bb_dmg_statue' + index, val );
}
function calc_total_dmg()
{
   var total = 0;
   var j;
   for( var LC in LCs )
   {      
       var cost = LC_cost( LC, LCs[LC].count );
       if( ! isNaN( cost ) )
       {
           total += cost;
       }
   }
   document.forms['dmg'].elements['total_cost'].value = total;

    var dmg = parseInt( document.forms['dmg'].elements['total_dmg'].value  );    
    if( ! isNaN( dmg) )
    {
    	if( dmg < total )
	    	document.getElementById('dmg_totals').style.background = "#9E2424";
	else
	    	document.getElementById('dmg_totals').style.background = "#336340";
    }
    else
    {
     	document.getElementById('dmg_totals').style.background = "#336340";    
    }    
}


function clear_LC( LC )
{
   document.getElementById('LC_click_top::' + LC).style.backgroundColor = '#9E2424';
   document.getElementById('LC_click_bottom::' + LC).style.backgroundColor = '#9E2424';
   var d = new Date();
   LCs[ LC ].last_click_clear = d.getTime();

   setTimeout( function() { 
       var d = new Date();
       if( LCs[ LC ].last_click_clear < d.getTime() - 450 )
       {
          document.getElementById('LC_click_top::' + LC).style.backgroundColor = 'transparent';
          document.getElementById('LC_click_bottom::' + LC).style.backgroundColor = 'transparent';
       }
   }, 500 );

   LCs[ LC ].count = 0;
   update_LC( LC );
}
function increment_LC( LC )
{
   document.getElementById('LC_click_top::' + LC).style.backgroundColor = '#348248';
   var d = new Date();
   LCs[ LC ].last_click_up = d.getTime();

   setTimeout( function() { 
       var d = new Date();
       if( LCs[ LC ].last_click_up < d.getTime() - 450 )
          document.getElementById('LC_click_top::' + LC).style.backgroundColor = 'transparent';
   }, 500 );

   LCs[ LC ].count++;
   if( LCs[ LC ].count > 99 )
       LCs[ LC ].count = 99;
   update_LC( LC );  
}
function decrement_LC( LC )
{
   document.getElementById('LC_click_bottom::' + LC).style.backgroundColor = '#9E2424';
   var d = new Date();
   LCs[ LC ].last_click_down = d.getTime();

   setTimeout( function() { 
       var d = new Date();
       if( LCs[ LC ].last_click_down < d.getTime() - 450 )
          document.getElementById('LC_click_bottom::' + LC).style.backgroundColor = 'transparent';
   }, 500 );

   LCs[ LC ].count--;
   if( LCs[ LC ].count < 0 )
       LCs[ LC ].count = 0;
   update_LC( LC );
}
function update_LC( LC )
{
    document.getElementById('LC_count::' + LC).innerHTML = 'x' + LCs[ LC ].count;
    document.getElementById('LC_cost::' + LC).innerHTML = LC_cost( LC, LCs[ LC ].count );

    calc_total_dmg();
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

function set_lc_troop( index, troop )
{
    show_troop_image( index, troop );
    dps_calc();
}
function show_troop_image( image_name, troop )
{
    document.getElementById( 'troop_image::' + image_name ).src =  Troops[ troop ].image;
}
function set_lc_level( index, lvl )
{
    localStorage.setItem( 'bb_lc_lvl' + index, lvl );
    LCs[ index ].image = LC_Levels[ lvl ].image;
    LCs[ index ].capacity = LC_Levels[ lvl ].capacity;

    show_lc_image( index );    
    dps_calc();
}

function show_lc_image( index )
{
   if( index != 0 )
    document.getElementById( 'lc_image::' + index ).src =  LCs[ index ].image;
}
function numberWithCommas(x) 
{
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function set_troop_level( troop, level )
{
    if( Troops[ troop ] != undefined )
    {
       Troops[ troop ].level = Troops[ troop ].level + level;
       if( Troops[ troop ].level > Troops[ troop ].max_level )
       {
          Troops[ troop ].level = Troops[ troop ].max_level;
       }
       else if( Troops[ troop ].level <= 0 )
       {
           Troops[ troop ].level = 1;
       }
       localStorage.setItem( 'bb_troop_lvl' + troop, Troops[ troop].level );
       if( Troops[ troop ].level === Troops[ troop ].max_level )
       {
           document.getElementById( 'troop_level::' + troop ).innerHTML = "MAX";
       }
       else
       {
           document.getElementById( 'troop_level::' + troop ).innerHTML = Troops[ troop ].level;
       }
       dps_calc();
    }
}


