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
var HamburgerMenu = $n2.Class('HamburgerMenu',{

	dispatchService: null,
	navigationService: null,
	showService: null,
	menuTitle: null,
	moduleName: null,
	menuWidth: null,
	drawer_id: null,
	mask_id: null,
	buttonContainerClass: null,
	buttonPrepend: null,

	initialize: function(opts_){
		var opts = $n2.extend({
			menuTitle: null
			,menuWidth: null
			,moduleName: null
			,dispatchService: null
			,navigationService: null
			,showService: null
			,drawerContainerClass: null
			,buttonContainerClass: null
			,buttonPrepend: false
		},opts_);

		this.dispatchService = opts.dispatchService;
		this.navigationService = opts.navigationService;
		this.showService = opts.showService;
		this.drawerContainerClass = opts.drawerContainerClass;
		this.buttonContainerClass = opts.buttonContainerClass;
		this.buttonPrepend = opts.buttonPrepend;
		
		// Set Menu Title
		if( opts.menuTitle ){
			this.menuTitle = opts.menuTitle;

		} else {
			this.menuTitle = undefined;
		};

		// Set Module Title
		if( opts.moduleName ){
			this.moduleName = opts.moduleName;
		} else {
			this.moduleName = undefined;
		};

		// Set Menu Width
		if( Number.isInteger(parseInt(opts.menuWidth)) ){
			//menu Width is ensured that it's in pixel format
			this.menuWidth = parseInt(opts.menuWidth)+'px';
		} else {
			this.menuWidth = '250px';
		};

		this.drawer_id = $n2.getUniqueId();

		// Add Hamburger Menu
		this._addHamburgerButton();
		this._addMask();
		this._addMenu();
		
		$n2.log(this._classname,this);
	},

	_addHamburgerButton: function(){
		var _this = this;

		var drawerId = this.drawer_id;

		$('.'+this.buttonContainerClass).each(function(){
			var $container = $(this);

			var $button = $('<span>')
	    		.addClass('hamburger_button')
	    		.text('\u2261')
	    		.click(function(){
	    			$('#'+drawerId).css('transform','translateX(0px)');
		    		var $hamburger_menu_content_mask = $('#'+_this.mask_id);
		    		$hamburger_menu_content_mask.css('visibility','visible');
	    		});

			if( _this.buttonPrepend ){
				$button.prependTo($container);
			} else {
				$button.appendTo($container);
			};
		});
	},

	_addMask: function(){
		var _this = this;
		
		var drawerId = this.drawer_id;
		
		var $drawerContainer = $('body');
		if( typeof this.drawerContainerClass === 'string' ){
			$drawerContainer = $('.'+this.drawerContainerClass);
		};

		// Add an atlas content mask
		// Used to hide content not related to drawer navigation menu
		this.mask_id = $n2.getUniqueId();
		$('<div>')
			.attr('id',this.mask_id)
			.appendTo($drawerContainer)
			.addClass('hamburger_menu_content_mask')
			.click(function(){
	    		$('#'+drawerId).css('transform','translateX(-' + _this.menuWidth + ')');
	    		var $hamburger_menu_content_mask = $('#'+_this.mask_id);
	    		$hamburger_menu_content_mask.css('visibility','hidden');
			});
	},
	_addMenu: function(){
		var _this = this;

		var drawerId = this.drawer_id;

		var $drawerContainer = $('body');
		if( typeof this.drawerContainerClass === 'string' ){
			$drawerContainer = $('.'+this.drawerContainerClass);
		};

		// Create a Hamburger Menu if it doesn't currently exist
		// This creates a template of a drawer nav menu with a title, module title and close button.
		var hamburger_menu;
		if (!$('#'+drawerId).length){
	    	hamburger_menu = $('<div>')
	    		.appendTo($drawerContainer)
	    		.addClass('drawer_nav')
	    		.attr('id', drawerId)
	    		.css('width', this.menuWidth)
	    		.css('transform', 'translateX(-' + this.menuWidth + ')');
	    	
	    	var $menuHeader = $('<div>')
	    		.addClass('drawer_menu_header')
	    		.appendTo(hamburger_menu);
	    	
	    	var $menuCloseButton = $('<a>')
	    		.addClass('hamburger_menu_close_button')
	    		.attr('href','javascript:void(0)')
	    		.appendTo($menuHeader)
		    	.text('\u2716')
		    	.click(function(){
		    		$('#'+drawerId).css('transform','translateX(-' + _this.menuWidth + ')');
		    		var $hamburger_menu_content_mask = $('#'+_this.mask_id);
		    		$hamburger_menu_content_mask.css('visibility','hidden');
		    	});
	    	
	    	var $menuTitle = $('<div>')
	    		.addClass('drawer_menu_header_title')
	    		.appendTo($menuHeader);
	    	
	    	var $titleSpan = $('<span>')
	    		.addClass('hamburger_menu_title')
	    		.appendTo($menuTitle);
	    	
	    	if( this.menuTitle ){
	    		$titleSpan.text( _loc(this.menuTitle) )
	    	} else if( this.navigationService ) {
	    		this.navigationService.printTitle({
	    			elem: $titleSpan
	    		});
	    	};

	    	var $menuModuleName = $('<div>')
	    		.addClass('drawer_menu_header_modulename nunaliit_module_title')
	    		.appendTo($menuHeader);

	    	var $moduleNameSpan = $('<span>')
	    		.addClass('hamburger_menu_modulename')
	    		.appendTo($menuModuleName);
	    	
	    	if( this.moduleName ){
	    		$moduleNameSpan.text( _loc(this.moduleName) );
	    	} else if( this.showService && this.dispatchService ){
	    		var currentModuleMsg = {
	    			type: 'moduleGetCurrent'
	    		};
	    		this.dispatchService.synchronousCall(DH,currentModuleMsg);
	    		var moduleId = currentModuleMsg.moduleId;
	    		if( moduleId ){
		    		$moduleNameSpan.addClass('n2s_insertModuleName');
		    		$moduleNameSpan.attr('nunaliit-document',moduleId);
	    		};
	    	};

	    	// Insert navigation items to hamburger drawer menu
			if( this.navigationService ){
				var $menuContent = $('<div>')
					.addClass('drawer_menu_content')
					.appendTo(hamburger_menu);
				this.navigationService.printMenu({
					elem: $menuContent
				});
			};
			
			if( this.showService ){
	    		this.showService.fixElementAndChildren(hamburger_menu, {});
	    	};
		};
	}
});

//--------------------------------------------------------------------------
$n2.hamburgerMenu = {
	HamburgerMenu: HamburgerMenu
};

})(jQuery,nunaliit2);

