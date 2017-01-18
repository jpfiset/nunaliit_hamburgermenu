/*
Copyright (c) 2016, Geomatics and Cartographic Research Centre, Carleton 
University
All rights reserved.
Redistribution and use in source and binary forms, with or without 
modification, are permitted provided that the following conditions are met:
 - Redistributions of source code must retain the above copyright notice, 
   this list of conditions and the following disclaimer.
 - Redistributions in binary form must reproduce the above copyright notice,
   this list of conditions and the following disclaimer in the documentation
   and/or other materials provided with the distribution.
 - Neither the name of the Geomatics and Cartographic Research Centre, 
   Carleton University nor the names of its contributors may be used to 
   endorse or promote products derived from this software without specific 
   prior written permission.
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE 
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE 
ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE 
LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR 
CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF 
SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS 
INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN 
CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) 
ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE 
POSSIBILITY OF SUCH DAMAGE.
*/

;(function($,$n2) {
"use strict";

var 
 _loc = function(str,args){ return $n2.loc(str,'nunaliit2',args); }
 ,DH = 'n2.hamburgerMenu'
 ;

//--------------------------------------------------------------------------
var CreateHamburgerMenu = $n2.Class('CreateHamburgerMenu',{

	navigationService: null,
	menuTitle: null,
	moduleTitle: null,
	menuWidth: null,
	atlas: null,
	header: null,
	drawer_id: null,
	hamburger_menu_content_mask_id: null,

	initialize: function(opts_){
		var opts = $n2.extend({
			menuTitle: null
			,menuWidth: null
			,moduleTitle: null
			,navigationService: null
		},opts_);

		this.navigationService = opts.navigationService;
		
		// Set Menu Title
		if( opts.menuTitle ){
			this.menuTitle = opts.menuTitle;
		} else {
			this.menuTitle = 'Menu Title';
		};

		// Set Menu Width
		if( Number.isInteger(parseInt(opts.menuWidth)) ){
			//menu Width is ensured that it's in pixel format
			this.menuWidth = parseInt(opts.menuWidth)+'px';
		} else {
			this.menuWidth = '250px';
		};

		// Set Module Title
		if( opts.moduleTitle ){
			this.moduleTitle = opts.moduleTitle;
		} else {
			this.moduleTitle = 'Module Title';
		};

		if ($('.nunaliit_atlas').length){
			this.atlas = $('.nunaliit_atlas');
		} else {
			$n2.log(".nunaliit_atlas class not found, can't add hamburger menu");
		};

		if ($('.nunaliit_header').length){
			this.header = $('.nunaliit_header');
		} else {
			$n2.log(".nunaliit_header class not found, can't add hamburger menu");
		};
		
		this.drawer_id = $n2.getUniqueId();

		// Add Hamburger Menu
		this._addMenu();
		
		$n2.log(this._classname,this);
	},
	_addHamburgerButton: function(){
		var _this = this;

		var drawerId = this.drawer_id;
		
		// Creates a hamburger button if it doesn't currently exist
		if (!$('.hamburger_button').length) {
	    	var hamburgerButton = $('<span>')
	    		.addClass('hamburger_button')
	    		.prependTo(this.header)
	    		.text('\u2261')
	    		.click(function(){
	    			$('#'+drawerId).css('transform','translateX(0px)');
		    		var $hamburger_menu_content_mask = $('#'+_this.hamburger_menu_content_mask_id);
		    		$hamburger_menu_content_mask.css('visibility','visible');
	    		});
		};
		
	},
	_addMask: function(){
		var _this = this;
		
		var drawerId = this.drawer_id;

		// Add an atlas content mask
		// Used to hide content not related to drawer navigation menu
		this.hamburger_menu_content_mask_id = $n2.getUniqueId();
		$('<div>')
			.attr('id',this.hamburger_menu_content_mask_id)
			.appendTo(this.atlas)
			.addClass('hamburger_menu_content_mask')
			.click(function(){
	    		$('#'+drawerId).css('transform','translateX(-' + _this.menuWidth + ')');
	    		var $hamburger_menu_content_mask = $('#'+_this.hamburger_menu_content_mask_id);
	    		$hamburger_menu_content_mask.css('visibility','hidden');
			});
	},
	_addMenu: function(){
		var _this = this;

		var drawerId = this.drawer_id;

		// Add Hamburger Menu
		this._addHamburgerButton();
		// Add Mask
		this._addMask();

		// Create a Hamburger Menu if it doesn't currently exist
		// This creates a template of a drawer nav menu with a title, module title and close button.
		var hamburger_menu;
		if (!$('#'+drawerId).length){
	    	hamburger_menu = $('<div>')
	    		.prependTo(this.atlas)
	    		.addClass('drawer_nav')
	    		.attr('id', drawerId) // ID is included for overwriting default css styling
	    		.css('width', this.menuWidth)
	    		.css('transform', 'translateX(-' + this.menuWidth + ')')
	    		.html(
	    			'<div class="drawer_menu_header">'+
	    				'<div class="drawer_menu_header_title">'+
	    					'<a href="javascript:void(0)" class="hamburger_menu_close_button"></a>'+
	    					'<span class="hamburger_menu_title">'+ _loc(this.menuTitle) +'</span>'+
	    				'</div>'+
	    				'<div class="drawer_menu_header_moduletitle nunaliit_module_title">'+
	    					'<span class="n2s_insertModuleTitle hamburger_menu_moduletitle">'+ _loc(this.moduleTitle) +'</span>'+
	    				'</div>'+
	    			'</div>'
	    		);
		};

		// Set hamburger icon and close click functionality 
		$('.drawer_menu_header_title a.hamburger_menu_close_button')
	    	.text('\u2716')
	    	.click(function(){
	    		$('#'+drawerId).css('transform','translateX(-' + _this.menuWidth + ')');
	    		var $hamburger_menu_content_mask = $('#'+_this.hamburger_menu_content_mask_id);
	    		$hamburger_menu_content_mask.css('visibility','hidden');
	    	});

		// Add a clone of navigation items to hamburger drawer menu
		if( this.navigationService ){
			var $menuContent = $('<div>')
				.addClass('drawer_menu_content')
				.appendTo(hamburger_menu);
			this.navigationService.printMenu({
				elem: $menuContent
			});
		};
	}
});

//--------------------------------------------------------------------------
$n2.hamburgerMenu = {
	CreateHamburgerMenu: CreateHamburgerMenu
};

})(jQuery,nunaliit2);

