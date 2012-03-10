/*
* GMenu jQuery Plugin
*
* Copyright (c) 2012 Benjamin Kroll
* Dual licensed under the MIT and GPL licenses.
* Uses the same license as jQuery, see:
* http://docs.jquery.com/License
*
* @version 0.4
* 
* @param from		(integer)				position _after_ which to cut off to create the sub menu			default 4
* @param filter		(integer)				filter for the child element you wish to select						default ''
* @param wrapper	(string|object|boolean)	the wrapper selector string/object to place the submenu in			default object
* @param menu		(string|object|boolean)	the submenu selector string/object to place the cut-off items into	default object
* @param target		(string|object)			the target selector string/object to place the output into			default $(this)
* @param placement	(string)				placement method; jQuery method names apply							default 'append'
* 
* returns original target element(s)
*/
(function($)
{
	$.fn.gmenu = function(options)
	{		
		var settings = 
		{
			from		: 4,
			filter		: '',
			wrapper		: $('<li><a href="#" class="more">more</a></li>'),
			menu		: $('<ul class="sub"></ul>'),
			target		: $(this),
			placement	: 'inside'
		}

		options = $.extend({}, settings, options);

		return this.each(function(index) 
		{			
			var $this		= $(this);
			var $children	= $this.children(options.filter);
			var child_count = $children.length;
			var $slice		= $children.slice( options.from );
			var $output;
		
			var objs = 
			{
				'wrapper'	: { type: typeof options.wrapper, $el: options.wrapper },
				'menu'		: { type: typeof options.menu, $el: options.menu },
				'target'	: { type: typeof options.target, $el: options.target }
			};

			$this.prepElements = function ()
			{
				$.each( objs, function(key, obj)
				{
					if ( obj.type == 'string' )
					{
						objs[key].$el = $(options[key]);
					}
					else if ( obj.type == 'object' && (key !== 'target' ) )
					{
						objs[key].$el = options[key].clone();
					}
					else if ( obj.type == 'object' && (key == 'target' ) && obj.$el.is($this) )
					{
						objs[key].$el = $this;
					}	
				});
			}
			
			$this.prepOutput = function ()
			{
				// handle the output
				if ( objs.wrapper.$el && objs.menu.$el )
				{
					$output = objs.wrapper.$el.append( objs.menu.$el.append( $slice ) ); // feed chopped off elements to menu; then menu to wrapper
				}
				else if ( objs.wrapper.$el && !objs.menu.$el )
				{ 
					$output = objs.wrapper.$el.append( $slice ); // no menu
				}
				else if ( !objs.wrapper.$el && objs.menu.$el )
				{ 
					$output = objs.menu.$el.append( $slice ); // no wrapper
				}
				else
				{ 
					$output = $slice; // no wrapper or menu
				}
			}

			$this.moveOutput = function ()
			{
				var $t = objs.target.$el;
				
				// attach the output to target
				switch ( options.placement )
				{
					case 'prepend':
						$t.prepend( $output );
					break;
					
					case 'after':
						$t.after( $output );
					break;
					
					case 'before':
						$t.before( $output );
					break;
					
					default:						
						$t.append( $output );
					break;
				}
			}

			if ( child_count > options.from )
			{				
				$this.prepElements();	// prep the element(s)
				$this.prepOutput();		// prep the output
				$this.moveOutput();		// move the output
			}
		});
	};
})(jQuery);