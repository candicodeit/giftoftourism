var home_open = false;
var deals_open = false;
var section = "";
var lasthash = "";
var deephash = "";
var deeplink = false;


$(document).ready(function () {
	initNav();
	initContent();
	checkHash("init");
	
	//$('#deal_overlay').hide();
	
	$('a.learn').unbind('click').click(function(){
		var dealNum = new Array();
		var dealString = $(this).attr('href');
		
		dealNum = dealString.split('/', 3);
		var dealItem = parseInt(dealNum[2]);
		
		var template = buildDeal(dealItem), target = $('#deal_overlay');
		
		target.empty();
		$(template).appendTo( target );
		
		$('#deal_overlay').fadeIn();
	});
	
	// Switch between deals with modal is open
	$('.prev-deals, .next-deals').unbind('click').live('click',function(){
		var dealNum = new Array();
		var dealString = $(this).attr('href');
		
		dealNum = dealString.split('/', 3);
		var dealItem = parseInt(dealNum[2]);
		
		var template = buildDeal(dealItem), target = $('#deal_overlay');
		
		target.empty();
		$(template).appendTo( target );
	});
	
	// Switch to entry form
	$('.enter_now').unbind('click').live("click",function(){
		var dealNum = new Array();
		var dealString = $(this).attr('href');
		
		dealNum = dealString.split('/', 3);
		var dealItem = parseInt(dealNum[2]);
				
		var target = $('#deal_overlay').empty();
		$('.entry').clone().appendTo( target ).show()
				.find('#contest_type').attr('value', array_deals[dealItem].title).end()
				.find('#email_recipient').attr('value', array_deals[dealItem].recipient);	
	});
	
	// Close modal to view deals again
	$('.deal_close').live("click",function(){
		$('#deal_overlay').fadeOut();
	});
	
	$("#entry_submit").live("click", function(){
		handleEntrySubmit();
	});
});

function checkHash(state){
	var tmpsection = location.hash.substr(2,location.hash.indexOf("/",2)-2);
	var tmphash = location.hash.substr(location.hash.indexOf("/",2)+1);
	if(state=="init"){
		$(window).bind("hashchange", function(){
			checkHash("update");
		});
		if(location.hash!="#/"&&location.hash!=""){
			deephash = tmphash.substr(0,tmphash.indexOf("/"));
			$("#nav_"+tmpsection).parent().addClass("nav_open");
			$("#nav_"+tmpsection).parent().find($(".nav_link")).css("padding-top","15px").css("top","0px").addClass("nav_active");
			if(tmpsection=="lifestyle"){
				changeContent("nav_lifestyle");
				deeplink = true;
			} else if(tmpsection=="numbers"){
				changeContent("nav_numbers");
				deeplink = true;
			} else if(tmpsection=="community"){
				changeContent("nav_community");
				deeplink = true;
			} else if(tmpsection=="future"){
				changeContent("nav_future");
				deeplink = true;
			} else if(tmpsection=="deals"){
				$("#deals").stop(false,false).animate({"top": "0px"}, 600);
				deals_open = true;
				
				changeContent("nav_deals");
				deeplink = true;
				deephash = tmphash.substr(0,tmphash.indexOf("/"));
				
				deephash = parseInt(deephash);
				console.log('deephash: '+deephash+' tmpsection: '+tmpsection+' tmphash: '+tmphash );
								
				var template = buildDeal(deephash), target = $('#deal_overlay');
				$(template).appendTo( target );
				
				$('#deal_overlay').fadeIn();
			} else if(tmpsection=="entry"){
				$("#deals").stop(false,false).animate({"top": "0px"}, 600);
				deals_open = true;
				
				deephash = tmphash.substr(0,tmphash.indexOf("/"));
			
				var dealType = array_deals[deephash].deal_type;
				var target = $('#deal_overlay');
				
				// If entry matches with deal type "contest", display entry. otherwise, redirect to deal
				if(dealType == "contest"){
					changeContent("nav_entry");
					deeplink = true;
				
					$('.entry').clone().appendTo( target ).show()
						.find('#contest_type').attr('value', array_deals[deephash].title);	
				} else {
					changeContent("nav_deals");
					deeplink = true;
					
					var template = buildDeal(deephash);
					$(template).appendTo( target );
				}
				
				$('#deal_overlay').fadeIn();
			} else if(tmpsection=="thanks"){
				$("#deals").stop(false,false).animate({"top": "0px"}, 600);
				deals_open = true;
				
				changeContent("nav_thanks");
				deeplink = false;
				deephash = tmphash.substr(0,tmphash.indexOf("/"));
				
				var target = $('#deal_overlay');
				$('.thank_you').clone().appendTo( target ).fadeIn();
				
				$('#deal_overlay').fadeIn();
			}
		} else {
			handleIntro();
		}
	} else if(state=="update"){
		if(location.hash!="#/"&&location.hash!=""&&tmpsection!="deals"&&tmpsection!="entry"){
			if(deals_open){
				lasthash = location.hash;
				toggleDeals();
				return;
			}
			deephash = tmphash.substr(0,tmphash.indexOf("/"));
			if(slide_curr==deephash&&tmpsection==section){
				return;
			} else {
				if(tmpsection!=section){
					$(".nav_wrap").removeClass("nav_open");
					$(".nav_link").css("padding-top","15px").css("top","0px").removeClass("nav_active");
					$("#nav_"+tmpsection).parent().addClass("nav_open");
					$("#nav_"+tmpsection).css("padding-top","15px").css("top","0px").addClass("nav_active");
					changeContent("nav_"+tmpsection);
				} else {
					moveSlideShow(deephash);
				}
			}
		} else if(location.hash=="#/deals/"&&!deals_open){
			toggleDeals();
		} else {
			section = "";
			if(deals_open&&tmpsection!="deals"&&tmpsection!="entry"&&tmpsection!="thanks"){
				toggleDeals();
			}
			if(location.hash==""||location.hash=="#/"&&!home_open){
				$("#nav_logo").trigger("click");
			}
		}
	}
}

/* NAV */

function initNav(){
	
	$("#nav_logo").bind("click", function(){
		changeContent("nav_logo");
		$(".nav_wrap").removeClass("nav_open");
		$(".nav_link").css("padding-top","15px").css("top","0px").removeClass("nav_active");
	});
	
	$(".nav_wrap").bind("mouseenter", function(){
		if(!$(this).hasClass("nav_open")){
			$(this).find(".nav_link").css("padding-top","0px").css("top","2px").animate({"padding-top": "15px","top": "0px"}, 100).addClass("nav_active");
		}
	}).bind("mouseleave", function(){
		if(!$(this).hasClass("nav_open")){
			$(this).find(".nav_link").stop(false,false).css("padding-top","15px").css("top","0px").animate({"padding-top": "0px"}, 50, function(){
				$(this).css("padding-top","15px").removeClass("nav_active");
			});
		}
	}).bind("click", function(){
		if(!$(this).hasClass("nav_open")){
			deephash = "";
			$(".nav_wrap").removeClass("nav_open");
			$(".nav_link").css("padding-top","15px").css("top","0px").removeClass("nav_active");
			$(this).addClass("nav_open");
			$(this).find($(".nav_link")).css("padding-top","15px").css("top","0px").addClass("nav_active");
			changeContent($(this).find(".nav_link").attr("id"));
		} else {
			if(deals_open){
				toggleDeals();
			}
		}
	});	
	$("#deals_tab").click(function(){
		toggleDeals();
	});
}

/* INTRO */

function handleIntro(){
	var cookies = document.cookie.split(";");
	var cookie_found = false;
	for(var c=0;c<cookies.length;c++){
		var x = cookies[c].substr(0,cookies[c].indexOf("="));
		if(x.replace(/^\s+|\s+$/g,"")=="got_intro"){
			cookie_found = true;
		}
	};
	if(cookie_found){
		$("#home").css("margin-top","0px").fadeIn();
		home_open = true;
	} else {
		var cdate = new Date();
		cdate.setDate(cdate.getDate() + 1);
		document.cookie = "got_intro=true; expires="+cdate.toUTCString()+"; path=/";
		$("a#intro_launch").fancybox({
			'padding': 0,
			'margin': 0,
			'showCloseButton': false,
			'hideOnContentClick': true,
			'hideOnOverlayClick': true,
			'transitionIn'	:	'fade',
			'transitionOut'	:	'fade',
			'easingOut': 'swing',
			'speedIn'		:	400, 
			'speedOut'		:	600, 
			'overlayShow'	:	true,
			'overlayOpacity': 0.6,
			'overlayColor': '#000',
			'titleShow': false,
			'type': 'inline',
			'onCleanup': function(){
				$("#fancybox-overlay").fadeOut();
				$("#home").css("margin-top","0px").fadeIn();
				home_open = true;
				location.hash = "#/";
				lasthash = location.hash;
			}
		});
		$("#content_main").hide();
		$("#intro_overlay").bind("mouseenter", function(){
			$("#btn_begin_on").fadeIn(300);
			$("#btn_begin").hide();
		}).bind("mouseleave", function(){
			$("#btn_begin_on").hide();
			$("#btn_begin").fadeIn(30);
		});
		$("a#intro_launch").click();
	}
}

/* CONTENT */

var slides_lifestyle = [];
var slides_numbers = [];
var slides_community = [];
var slides_future = [];

var content_home = {src:""};
var content_lifestyle = {src:"",index:[]};
var content_numbers = {src:"",index:[]};
var content_community = {src:"",index:[]};
var content_future = {src:"",index:[]};

function initContent(){
	$(".home_thumb").bind("mouseenter mouseleave click", function(event){
		$("#"+$(this).attr("target")).trigger(event.type);
	});
	
	content_lifestyle = {src:buildContent(slides_lifestyle,[
		{src:"lifestyle_00.jpg",alt:"What would we be without tourism &amp; conventions?"},
		{src:"lifestyle_01.jpg",alt:"Sharing our beach life with out-of-town guests is not always easy"},
		{src:"lifestyle_02.jpg",alt:"The reality is, without them, we wouldn&rsquo;t be the amazing destination we are today"},
		{src:"lifestyle_03.jpg",alt:"City and state tax revenue from tourism &amp; convention dollars to the tune of $94.9 million in 2010"},
		{src:"lifestyle_04.jpg",alt:"Help contribute to the very things that make Virginia Beach so great, like awesome local restaurants, shopping, free concerts, great events"},
		{src:"lifestyle_05.jpg",alt:"The Beach"},
		{src:"lifestyle_06.jpg",alt:"Plus easy access to the boardwalk and resort area",link:{url:"http://www.visitvirginiabeach.com/maps/",title:"link title",x:180,y:220,w:356,h:52}},
		{src:"lifestyle_07.jpg",alt:"Sure, there are going to be a few bumps in the sand that come with living in a resort city"},
		{src:"lifestyle_08.jpg",alt:"But what we get in return is a destination funded in large part by tourism &amp; conventions that we, the locals, get to groove on year-round"},
		{src:"lifestyle_09.jpg",alt:"It&rsquo;s a great time to be a local tourist"},
		{src:"lifestyle_10.jpg",alt:"Start here",link:{url:"http://www.visitvirginiabeach.com/",title:"link title",x:304,y:142,w:210,h:80}}
	]),index:slides_lifestyle};
	
	content_numbers.src = buildContent(slides_numbers,[
		{src:"numbers_00.jpg",alt:"How can tourism help your bottom line?"},
		{src:"numbers_01.jpg",alt:"The tourism &amp; convention industry is one of our largest and most dependable economic engines"},
		{src:"numbers_02.jpg",alt:"In fact, starting in 2006, visitors have spent over $1 billion each year in the city."},
		{src:"numbers_03.jpg",alt:"In 2010 alone, visitors spent $1.13 billion in Virginia Beach"},
		{src:"numbers_04.jpg",alt:"Additionally, tourism &amp; conventions created tousands of jobs for local residents"},
		{src:"numbers_05.jpg",alt:"Earning them more than $211,302,000"},
		{src:"numbers_06.jpg",alt:"Tourism also deposited $94.9 million in city and state tax revenue"},
		{src:"numbers_07.jpg",alt:"Money used for things like police, fire departments, and building roads"},
		{src:"numbers_08.jpg",alt:"These expenses would otherwise fall on residents in the form of higher real estate taxes"},
		{src:"numbers_09.jpg",alt:"We can increase tax revenue and reduce the financial responsibility of individual taxpayers by adding to the travel and tourism industry tax base"},
		{src:"numbers_10.jpg",alt:"Facilities like the convention center also play a big role in the tourism and conventions realm"},
		{src:"numbers_11.jpg",alt:"Host to nearly 350 events in 2011, the convention center has become an impressive community asset"},
		{src:"numbers_12.jpg",alt:"Through a special fund derived from 2.5 cents of the hotel room tax, 1 cent on a cigarette pack, an 8 cent admission tax and .56 cents of meal tax"},
		{src:"numbers_13.jpg",alt:"Visitors pay a large share of the cost to run the facility, not real estate or personal property taxes"},
		{src:"numbers_14.jpg",alt:"The revenue from events and related visitor spending exceeds the center&rsquo;s expenses, putting excess revenue right into the city&rsquo;s budget"},
		{src:"numbers_15.jpg",alt:"Tourists help pay to run our city - That&rsquo;s the Gift of Tourism"}
	]);
	content_numbers.index = slides_numbers;
	
	content_community.src = buildContent(slides_community,[
		{src:"community_00.jpg",alt:"Can tourism and conventions actually improve your quality of life?"},
		{src:"community_01.jpg",alt:"The tourism &amp; convention industry pumps more than a billion dollars into the city annually"},
		{src:"community_02.jpg",alt:"Continuously building our economy"},
		{src:"community_03.jpg",alt:"Last year, tourism employed thousands of residents and deposited $94.9 million in city and state tax revenue into city and state budgets"},
		{src:"community_04.jpg",alt:"Money that supports everything the city does"},
		{src:"community_05.jpg",alt:"Things like better schools, fire and police departments, libraries, social services,"},
		{src:"community_06.jpg",alt:"Parks and recreation, maintaining our beaches, the Virginia Aquarium, MOCA, &amp; the Sandler Center to name a few"},
		{src:"community_07.jpg",alt:"Without tourism &amp; conventions, more of a financial burden for running the city"},
		{src:"community_08.jpg",alt:"Would fall on residents in the form of higher real estate, or other, taxes"},
		{src:"community_09.jpg",alt:"The tourism &amp; convention industry helps us sustain our quality of life"},
		{src:"community_10.jpg",alt:"And make Virginia Beach such a great place to live"},
		{src:"community_11.jpg",alt:"That&rsquo;s the Gift of Tourism"}
	]);
	content_community.index = slides_community;
	
	content_future.src = buildContent(slides_future,[
		{src:"future_00.jpg",alt:"Where do we go from here?"},
		{src:"future_01.jpg",alt:"Because the tourism &amp; convention industry is clean, lucrative, reliable and sustainable"},
		{src:"future_02.jpg",alt:"Just about every community is trying to get in on the act"},
		{src:"future_03.jpg",alt:"Other destinations that have been involved for a while are upgrading with fantastic new amenities"},
		{src:"future_04.jpg",alt:"And entertainment offerings, many being backed by public financial support"},
		{src:"future_05.jpg",alt:"Fierce competition is growing in places like Louisville, Washington D.C., Raleigh, Myrtle Beach, and many other destinations"},
		{src:"future_06.jpg",alt:"In the current economic climate, the only certainty is that we must continue to build on our successes, by reinvesting in the tourism &amp; convention industry"},
		{src:"future_07.jpg",alt:"Future city improvement initiatives like the expansion of the Virginia Beach Convention Center to include additional parking &amp; meeting space,"},
		{src:"future_08.jpg",alt:"The construction of a Convention Center Headquarters Hotel, the development of the 31st Street gateway and 19th Street corridor"},
		{src:"future_09.jpg",alt:"And many other city improvement initiatives found here help position virginia beach as a top-tier tourism &amp; convention destination and keeps us competitive in a challenging arena",link:{url:"http://www.vbcvb.com/new-development-projects.aspx",title:"link title",x:278,y:105,w:70,h:30}},
		{src:"future_10.jpg",alt:"The best part is, it&rsquo;s controllable in terms of the city&rsquo;s economic future"},
		{src:"future_11.jpg",alt:"We as a community have a say in what the tourism industry can become in Virginia Beach"},
		{src:"future_12.jpg",alt:"It&rsquo;s a great time to be a local tourist"}
	]);
	content_future.index = slides_future;
	
	initContact();
}

function buildContent(index,slides){
	var ss_pre = "<div id='ss_pre' class='ss_arrow'><img src='img/ss_pre.png' alt='Previous' title='Previous' /></div>";
	var ss_next = "<div id='ss_next' class='ss_arrow'><img src='img/ss_next.png' alt='Next' title='Next' /></div>";
	var result = "<div class='content_container'>"+ss_pre+ss_next+"<div class='ss_wrap'><div id='ss_content'>";
	for(var s=0;s<slides.length;s++){
		index.push(-625*s);
		if(slides[s].link){
			result += "<a href='"+slides[s].link.url+"' title='"+slides[s].link.title+"' target='_blank'><img src='img/blank.png' class='ss_link' style='margin:"+slides[s].link.y+"px 0 0 "+slides[s].link.x+"px; width:"+slides[s].link.w+"px; height:"+slides[s].link.h+"px' /></a>";
		}
		result += "<img class='ss_slide' src='img/"+slides[s].src+"' alt='"+slides[s].alt+"' title='"+slides[s].alt+"' />";
	}
	result += "</div></div><div class='ss_nav_wrap'><div class='ss_nav'>";
	for(var t=0;t<slides.length;t++){
		result += "<img class='ss_nav_tmb' src='img/"+slides[t].src+"' target='"+t+"' />";
	}
	result += "</div></div></div>";
	return result;
}

// Deals Data 
var array_deals = [
	{},
	{
			deal_type:"coupon", 
			title:"THE VIRGINIA AQUARIUM &amp; MARINE SCIENCE CENTER", 
			description:"Escape the cold shoulder of winter with a trip to the hottest destination at the beach, the Virginia Aquarium. Enjoy smaller crowds along with your favorite aquatic friends as you dive into a world of underwater adventure, rub elbows with Komodo dragons, play with seals, go under the water with the Red Sea exhibit, and so much more!", 
			link:"pdf/aquarium.pdf"
	}, 
	{
			deal_type:"coupon", 
			title:"Old Coast Guard Station", 
			description:"Must present valid ID with Virginia Beach address to receive deal. Does not apply to special programs or group tours. Offer expires December 31, 2012.", 
			link:"pdf/coastguard.pdf"
	}, 
	{
			deal_type:"coupon", 
			title:"Edgar Kayce A.R.E.", 
			description:"Download and present this coupon at the Edgar Kayce A.R.E. VisitorÍs Center and receive a free gift just for showing up!", 
			link:"pdf/edgar.pdf"
	},
	{
			deal_type:"contest", 
			title:"Virginia Beach Convention Center", 
			description:"Fill out the entry form for a chance to win a pair of tickets to a designated consumer show at the Virginia Beach Convention Center.",
			recipient: "candilanddesign@gmail.com"
	},
	{
			deal_type:"coupon", 
			title:"MOCA", 
			description:"Purchase an Associate Membership at the Museum of Contemporary Art and save $25 just for being a Virginia Beach resident! Now for just $100 (regular price $125), youÍll get access to some great Associate Level Member Benefits.", 
			link:"pdf/moca.pdf"
	}, 
	{
			deal_type:"coupon", 
			title:"Sandler Center", 
			description:"Use promocode VBGIFT to receive 10% off of tickets to see DanceBrazil on April 10th at 7:30 at the Sandler Center! <a href=\"http://ev8.evenue.net/cgi-bin/ncommerce3/EVExecMacro?linkID=global-sandler&evm=prmo&RSRC=&RDAT=&caller=PR\" target=\"blank\">Click here</a> to redeem your gift today!",
			link:"pdf/sandler.pdf"
	}
];

// Build Deals Template

function buildDeal(index){
	//var data = array_deals[index];
	var numDeals = array_deals.length - 1;
	var prev ='', next ='';
	
	//console.log('numDeals: '+numDeals+', prev: '+prev+', next: '+next );
	
	// Check if there's a previous deal
	if(index != 1){
		prev = index - 1;
	} 

	// Check if there's a next deal	
	if(index != numDeals){
		next = index + 1;
	} 
	
	/*
template =  "<div class=\""+ array_deals[index].deal_type +"\">";
	template += "<h1>"+ array_deals[index].title +"</h1>";
	template += "<p class=\"description\">"+ array_deals[index].description +"</p>";
	if(array_deals[index].link) {
		template += "<a href=\""+ array_deals[index].link +"\" class=\"download\">Download PDF</a>";
	} else {
		template += "<a href=\"#\" class=\"enter_now\">Enter Now</a>";
	}
	template +=  "</div><!-- ."+ array_deals[index].deal_type +" -->";
*/
	var template =  "<div class=\"modal\">";
	template += "<img src=\"img/close.png\" class=\"deal_close\" alt=\"Close Modal\" />";
	template += "<div class=\""+ array_deals[index].deal_type +"\">";
	template += "<h1>"+ array_deals[index].title +"</h1>";
	template += "<p class=\"description\">"+ array_deals[index].description +"</p>";
	if(array_deals[index].link) {
		template += "<a href=\""+ array_deals[index].link +"\" class=\"download\" target=\"_blank\">Download PDF</a>";
	} else {
		template += "<a href=\"#/entry/"+ index +"/\" class=\"enter_now\">Enter Now</a>";
	}
	template +=  "</div><!-- ."+ array_deals[index].deal_type +" -->";
	

	if(prev != ''){
		template +=  "<a href=\"#/deals/"+prev+"/\" class=\"prev-deals\"><img src=\"img/left.png\" alt=\"Previous Deal\"/></a>";
	}
	
	if(next != ''){
		template +=  "<a href=\"#/deals/"+next+"/\" class=\"next-deals\"><img src=\"img/right.png\" alt=\"Next Deal\"/></a>";	
	}

	
	template +=  "</div><!-- .modal -->";
	
	return(template);
	
}

function changeContent(caller){
	var tmphash = location.hash;
	
	console.log(tmphash);
	/*
if(deals_open){
		toggleDeals();
		
	}
*/
	slide_curr = "";
	if(caller=="nav_logo"){
		if(!home_open){
			$("#home").stop(false,false).css("margin-top","-570px").css("display","block").animate({"margin-top": "0px"}, 800);
			$("#content_main").fadeOut(900, function(){
				$("#content_main").html("");
			});
			home_open = true;
			tmphash = "#/";
			deephash = "";
			section = "";
		}
	} else {
		
		if(home_open){
			$("#home").stop(false,false).animate({"margin-top": "-570px"}, 700);
			home_open = false;
		}
		if(caller=="nav_lifestyle"){
			$("#content_main").fadeOut(200, function(){
				$("#content_main").fadeIn(800).html(content_lifestyle.src);
				initSlideShow(content_lifestyle.index);
			})
			section = "lifestyle";
		} else if(caller=="nav_numbers"){
			$("#content_main").fadeOut(200, function(){
				$("#content_main").fadeIn(800).html(content_numbers.src);
				initSlideShow(content_numbers.index);
			});
			section = "numbers";
		} else if(caller=="nav_community"){
			$("#content_main").fadeOut(200, function(){
				$("#content_main").fadeIn(800).html(content_community.src);
				initSlideShow(content_community.index);
			});
			section = "community";
		} else if(caller=="nav_future"){
			console.log('else');
			$("#content_main").fadeOut(200, function(){
				$("#content_main").fadeIn(800).html(content_future.src);
				initSlideShow(content_future.index);
			});	
			section = "future";
		} else if(caller=="nav_deals"){
			section = "deals";
			console.log('Deals');
		} else if(caller=="nav_entry"){
			section = "entry";
		} else if(caller=="nav_thanks"){
			section = "thanks";
		}
		tmphash = "#/"+section+"/";
		if(deephash){
			tmphash += deephash+"/";
		}
		
	}
	location.hash = tmphash;
}

function toggleDeals(){
	if(deals_open){ // close
		$("#deals").stop(false,false).animate({"top": "-600px"}, 600);
		deals_open = false;
		var tmpsection = location.hash.substr(2,location.hash.indexOf("/",2)-2);
		
		if(tmpsection=="deals"||tmpsection=="entry"||tmpsection=="thanks"&&!home_open){
			changeContent("nav_logo");
		} else {
			location.hash = lasthash;
		}
		$('#deal_overlay').hide();

	} else { //open
		$("#deals").stop(false,false).animate({"top": "0px"}, 600);
		deals_open = true;
		lasthash = location.hash;
		location.hash = "#/deals/";
	}
}

function initContact(){
	$("a#contact_launch").fancybox({
		'padding': 0,
		'margin': 0,
		'showCloseButton': false,
		'hideOnContentClick': false,
		'hideOnOverlayClick': true,
		'transitionIn'	:	'fade',
		'transitionOut'	:	'fade',
		'easingOut': 'swing',
		'speedIn'		:	400, 
		'speedOut'		:	600, 
		'overlayShow'	:	true,
		'overlayOpacity': 0.6,
		'overlayColor': '#000',
		'titleShow': false,
		'type': 'inline',
		'onStart': function(){
			$("#contact_table").fadeIn(800);
			$("#contact_sent").css("display","none");
		},
		'onCleanup': function(){
			$("#fancybox-overlay").fadeOut();
		}
	});
	
	$(".fb_close").bind("click", function(){
		$.fancybox.close();
	});
	
	$("#contact_submit").bind("click", function(){
		handleContactSubmit();
	});
}

function handleContactSubmit(){
	if($("#txt_name").val()!=""){
		$.post("contact.asp", {txt_name:$("#txt_name").val(),txt_zip:$("#txt_zip").val(),txt_email:$("#txt_email").val(),txt_subject:$("#txt_subject").val(),txt_body:$("#txt_body").val()}, function(data) {
			if(data=="sent"){
				$("#contact_table").fadeOut(400,function(){
					$("#contact_sent").fadeIn(500);
				});
			}
		});
	}
}

// Submit entry form
function handleEntrySubmit(){
	if($("#deal_overlay #txt_fname").val()!=""&&$("#deal_overlay #txt_email_addr").val()&&$("#deal_overlay #check_age").attr("checked")=="checked"&&$("#deal_overlay #check_terms").attr("checked")=="checked")	{
		$.post("entry.asp", {
			txt_fname:$("#txt_fname").val(), 
			txt_lname:$("#txt_lname").val(),
			txt_address:$("#txt_address").val(), 
			txt_city:$("#txt_city").val(),
			select_state:$("#select_state").val(), 
			txt_zip_code:$("#txt_zip_code").val(),
			txt_phone: $("#txt_phone").val(), 
			txt_email_addr: $("#txt_email_addr").val(), 
			check_age: $("#check_age").getAttribute("checked"), 
			check_terms: $("#check_terms").getAttribute("checked"),
		
		txt_subject: "Gift of Tourism Entry Form"}, function(data) {
			if(data=="sent"){
				var target = $('#deal_overlay');
				target.empty();
				$('.thank_you').appendTo( target ).show();
			}
		});
	} else {
		$('#deal_overlay .required').show();
	}
}

/* SLIDESHOW */

var ss_index;
var slide_curr;

function initSlideShow(index){
	ss_index = index;
	$("#ss_content").css("width",(ss_index.length*625)+"px");
	$(".ss_nav").css("width",(ss_index.length*115)+"px");
	$(".ss_arrow").bind("mouseenter", function(){
		if($(this).attr("id")=="ss_pre"){
			if(slide_curr>0){
				$(this).stop(false,false).css("opacity","1").css("cursor","pointer").animate({"left": "120px"}, 120);
			} else {
				$(this).css("opacity","0.2").css("cursor","default");
			}
		} else {
			if(slide_curr<ss_index.length-1){
				$(this).stop(false,false).css("opacity","1").css("cursor","pointer").animate({"left": "765px"}, 120);
			} else {
				$(this).css("opacity","0.2").css("cursor","default");
			}
		}
	}).bind("mouseleave", function(){
		if($(this).attr("id")=="ss_pre"){
			$(this).stop(false,false).animate({"left": "130px"}, 60);
		} else {
			$(this).stop(false,false).animate({"left": "755px"}, 60);
		}
	}).bind("click", function(){
		progSlideShow($(this).attr("id"));
	});
	$(".ss_nav_tmb").bind("click", function(){
		moveSlideShow($(this).attr("target"));
	});
	$(".ss_link").bind("mouseenter mouseleave", function(){
		$(this).toggleClass("ss_link_active");
	});
	
	moveSlideShow(deephash,0);
}

function progSlideShow(btn_id){
	if(btn_id=="ss_pre"){
		if(slide_curr>0){
			slide_curr--;
		} else {
			return;
		}
	} else if(btn_id=="ss_next"){
		if(slide_curr<ss_index.length-1){
			slide_curr++;
		} else {
			return;
		}
	}
	moveSlideShow(slide_curr);
}

function moveSlideShow(target,atime){
	if(target=="") {
		target = 0;
	}
	if(atime==null){
		atime = 600;
	}
	slide_curr = target;
	if(target==ss_index.length-1){
		$("#ss_pre").css("opacity","1").css("cursor","pointer");
		$("#ss_next").css("opacity","0.2").css("cursor","default").css("left","755px");
		if(ss_index.length>3){
			$(".ss_nav").stop(false,false).animate({"left": ((ss_index.length-5)*-115)+"px"}, atime);
		}
	} else if(target==0) {
		$("#ss_pre").css("opacity","0.2").css("cursor","default").css("left","130px");
		$("#ss_next").css("opacity","1").css("cursor","pointer");
		$(".ss_nav").stop(false,false).animate({"left": "0px"}, atime);
	} else {
		$("#ss_pre").css("opacity","1").css("cursor","pointer");
		$("#ss_next").css("opacity","1").css("cursor","pointer");
		if(target<3){
			$(".ss_nav").stop(false,false).animate({"left": "0px"}, atime);
		} else if(target>ss_index.length-3){
			$(".ss_nav").stop(false,false).animate({"left": ((ss_index.length-5)*-115)+"px"}, atime);
		} else if(target>2&&target<ss_index.length-2){
			$(".ss_nav").stop(false,false).animate({"left": ((target-2)*-115)+"px"}, atime);
		} 
	}
	$(".ss_nav_tmb").each(function(){
		if($(this).attr("target")==target){
			$(this).addClass("ss_nav_active");
		} else {
			$(this).removeClass("ss_nav_active");
		}
	});
	$("#ss_content").stop(false,false).animate({"left": ss_index[target]+"px"}, atime);
	var tmphash = location.hash.substr(0,location.hash.indexOf("/",2)+1);
	if(slide_curr!=0){
		tmphash += slide_curr+"/";
	}
	if(tmphash=="#"||tmphash==""){
		tmphash = "#/";
	}
	location.hash = tmphash;
}