/**
 * Plugin Template admin js.
 *
 *  @package REW Bulk Editor/JS
 */

;(function($){
    
	$.fn.serializeObject = function(){

        var self = this,
            jsonData = {},
            push_counters = {},
            patterns = {
                "validate": /^[a-zA-Z][a-zA-Z0-9_]*(?:\[(?:\d*|[a-zA-Z0-9_]+)\])*$/,
                "key":      /[a-zA-Z0-9_]+|(?=\[\])/g,
                "push":     /^$/,
                "fixed":    /^\d+$/,
                "named":    /^[a-zA-Z0-9_]+$/
            };


        this.build = function(base, key, value){
            base[key] = value;
            return base;
        };

        this.push_counter = function(key){
            if(push_counters[key] === undefined){
                push_counters[key] = 0;
            }
            return push_counters[key]++;
        };

        $.each($(this).serializeArray(), function(){

            // Skip invalid keys
            if(!patterns.validate.test(this.name)){
                return;
            }

            var k,
                keys = this.name.match(patterns.key),
                merge = this.value,
                reverse_key = this.name;

            while((k = keys.pop()) !== undefined){

                // Adjust reverse_key
                reverse_key = reverse_key.replace(new RegExp("\\[" + k + "\\]$"), '');

                // Push
                if(k.match(patterns.push)){
                    merge = self.build([], self.push_counter(reverse_key), merge);
                }

                // Fixed
                else if(k.match(patterns.fixed)){
                    merge = self.build([], k, merge);
                }

                // Named
                else if(k.match(patterns.named)){
                    merge = self.build({}, k, merge);
                }
            }

            jsonData = $.extend(true,jsonData,merge);
        });

        return jsonData;
    };
	
	$(document).ready(function(){

		// requests handler
		
		var ajaxQueue = $({});

		$.ajaxQueue = function( ajaxOpts ) {
			
			var jqXHR,
				dfd = $.Deferred(),
				promise = dfd.promise();

			// queue our ajax request
			ajaxQueue.queue( doRequest );

			// add the abort method
			promise.abort = function( statusText ) {

				// proxy abort to the jqXHR if it is active
				if ( jqXHR ) {
					return jqXHR.abort( statusText );
				}

				// if there wasnt already a jqXHR we need to remove from queue
				var queue = ajaxQueue.queue(),
					index = $.inArray( doRequest, queue );

				if ( index > -1 ) {
					queue.splice( index, 1 );
				}

				// and then reject the deferred
				dfd.rejectWith( ajaxOpts.context || ajaxOpts,
					[ promise, statusText, "" ] );

				return promise;
			};

			// run the actual query
			function doRequest( next ) {
				jqXHR = $.ajax( ajaxOpts )
					.done( dfd.resolve )
					.fail( dfd.reject )
					.then( next, next );
			}

			return promise;
		};
		
		// array input

		function set_array_field(id){
			
			$(id + " .add-input-group").on('click', function(e){
				
				e.preventDefault();
				
				var target 	= "#" + $(this).data("target");
				
				if( typeof $(this).data("html") != typeof undefined ){
					
					var html = $(this).data("html");
			
					var $block = $($.parseHTML(html));
				
					$(target + " .arr-input-group").append($block);				
				}
				else{
						
					var $clone 	= $(target + " .input-group-row").eq(0).clone().removeClass('ui-state-disabled');
					
					$clone.find('input,textarea,select,radio').val('');
					
					var $rands	= $clone.find('input[data-value="random"]');
					
					if( $rands.length > 0 ){
						
						$rands.val(Math.floor(Math.random()*1000000000));
					}
					
					if( $clone.find('a.remove-input-group').length < 1 ){
					
						$clone.append('<a class="remove-input-group" href="#">x</a>');
					}
					
					$(this).next(".arr-input-group").append($clone);
				}
			});
			
			$(id + " .arr-input-group").on('click', ".remove-input-group", function(e){

				e.preventDefault();
				
				$(this).closest('.input-group-row').remove();
				
				load_task_items();
			});	
		}
		
		$(".arr-input").each(function(e){
			
			var id = "#" + $(this).attr('id');
			
			set_array_field(id);
		});
		
		// meta input
		
		function set_meta_field(id){
			
			$(id + " .add-input-group").on('click', function(e){
				
				e.preventDefault();
				
				var target 	= "#" + $(this).data("target");
				
				if( typeof $(this).data("html") != typeof undefined ){
					
					var html = $(this).data("html");
			
					var $block = $($.parseHTML(html));
				
					$(target + " .meta-input-group").append($block);				
				}
				else{
						
					var $clone 	= $(target + " .input-group-row").eq(0).clone().removeClass('ui-state-disabled');
					
					$clone.find('input,textarea,select,radio').val('');
					
					var $rands	= $clone.find('input[data-value="random"]');
					
					if( $rands.length > 0 ){
						
						$rands.val(Math.floor(Math.random()*1000000000));
					}
					
					if( $clone.find('a.remove-input-group').length < 1 ){
					
						$clone.append('<a class="remove-input-group" href="#">x</a>');
					}
					
					$(this).next(".meta-input-group").append($clone);
				}
			});
			
			$(id + " .meta-input-group").on('click', ".remove-input-group", function(e){

				e.preventDefault();
				
				$(this).closest('.input-group-row').remove();
				
				load_task_items();
			});	
		}
		
		$(".meta-input").each(function(e){
			
			var id = "#" + $(this).attr('id');
			
			set_meta_field(id);
		});
		
		// date input

		function set_date_field(id){
			
			$(id + " .add-date-group").on('click', function(e){
				
				e.preventDefault();
				
				var target 	= "#" + $(this).data("target");
				
				if( typeof $(this).data("html") != typeof undefined ){
					
					var html = $(this).data("html");
			
					var $block = $($.parseHTML(html));
				
					$(target + " .date-input-group").append($block);				
				}
			});
			
			$(id + " .date-input-group").on('click', ".remove-input-group", function(e){

				e.preventDefault();
				
				$(this).closest('.input-group-row').remove();
				
				load_task_items();
			});	
		}
		
		$(".date-input").each(function(e){
			
			var id = "#" + $(this).attr('id');
			
			set_date_field(id);
		});
		
		// taxonomy fields
		
		function set_taxonomy_field(id){
			
			// handle the click of close button on the tags

			$(document).on("click", id + " .data .item .close", function() {
				
				$(this).parent().remove();
				
				load_task_items();
			});

			// Handle the click of one suggestion

			$(document).on("click", id + " .autocomplete-items div", function() {
				
				let index=$(this).index()
				let data=_tag_input_suggestions_data[index];
				let data_holder = $(this).parents().eq(4).find(id + " .data")
				let name = $(id + " .data input:first").attr("name");

				$(data_holder).parents().eq(2).find(id + " .data").append(data.html);
				$(data_holder).val("");
				
				$(id + " .autocomplete-items").html("");
			});

			// detect enter on the input
			 
			$(id + " input").on( "keydown", function(e) {
				
				if(e.which == 13){
				
					e.preventDefault();
					
					return false;
				}
			});

			$(id + " input").on( "focusout", function(event) {
				
				$(this).val("")
				var that = this;
				setTimeout(function(){ $(that).parents().eq(2).find(".autocomplete .autocomplete-items").html(""); }, 500);
			
			});
			
			var typing;
			
			$(id + " input").on( "keyup", function(event) {
				
				clearTimeout(typing);

				var query = $(this).val()

				if(event.which == 8) {
					
					if(query==""){
						
						// clear suggestions
					
						$(id + " .autocomplete-items").html("");
						
						return;
					
					}
				
				}
				
				if( query.length < 3 ){
					
					return false;
				}
				
				$(id + " .autocomplete-items").html("");

				var element = $(this);
				
				let sug_area = element.parent().find(".autocomplete-items");
				
				let taxonomy = $(id).attr("data-taxonomy");
				
				let hierarchical = $(id).attr("data-hierarchical");
				
				let operator = $(id).attr("data-operator"); 
				
				let context = $(id).attr("data-context");
				
				typing = setTimeout(function() {

					// using ajax to populate suggestions
					
					element.addClass('loading');
					
					$.ajax({
						url : ajaxurl,
						type: "GET",
						dataType : "json",
						data : {
							
							action 		: "render_taxonomy_terms",
							taxonomy 	: taxonomy,
							h			: hierarchical,
							o			: operator,
							s 			: query,
							c			: context,
						},
					}).done(function( data ) {
						
						let val = element.val();
						
						if( query == val ){
							
							element.removeClass('loading');
							
							_tag_input_suggestions_data = data;
							
							$.each(data,function (key,value) {
								
								let template = $("<div>"+value.name+"</div>").hide()
								sug_area.append(template)
								template.show()

							});
						}
						else if( val.length < 3 ){
							
							element.removeClass('loading');
						}
					});

				},500);
				
			});
		}
		
		let _tag_input_suggestions_data = null;
		
		$(".tags-input").each(function(e){
			
			var id = "#" + $(this).attr('id');
			
			set_taxonomy_field(id);
		});
		
		// authors

		function set_author_field(id){
			
			let multi = $(id).attr("data-multi");
			
			if( $(id + " .item").length > 0 && multi == 'false' ){
				
				$(id + " .autocomplete").hide();
			}
			
			// handle the click of close button on the tags

			$(document).on("click", id + " .data .item .close", function() {

				if( multi == 'false' ){
					
					$(id + " .autocomplete").show();
				}
				
				$(this).parent().remove();
				
				load_task_items();
			});

			// Handle the click of one suggestion

			$(document).on("click", id + " .autocomplete-items div", function() {
				
				let index=$(this).index()
				let data=_authors_input_suggestions_data[index];
				let data_holder = $(this).parents().eq(4).find(id + " .data")
				let name = $(id + " .data input:first").attr("name");

				$(data_holder).parents().eq(2).find(id + " .data").append(data.html);
				$(data_holder).val("");
				
				$(id + " .autocomplete-items").html("");
				
				if( multi == 'false' ){
					
					$(id + " .autocomplete").hide();
				}
			});

			// detect enter on the input
			 
			$(id + " input").on( "keydown", function(e) {
				
				if(e.which == 13){
				
					e.preventDefault();
					
					return false;
				}
			});

			$(id + " input").on( "focusout", function(event) {
				
				$(this).val("")
				var that = this;
				setTimeout(function(){ $(that).parents().eq(2).find(".autocomplete .autocomplete-items").html(""); }, 500);
			
			});
			
			var typing;
			
			$(id + " input").on( "keyup", function(event) {
				
				clearTimeout(typing);

				var query = $(this).val();

				if(event.which == 8) {
					
					if(query==""){
						
						// clear suggestions
					
						$(id + " .autocomplete-items").html("");
						
						return;
					
					}
				}
				
				if( query.length < 3 ){
					
					return false;
				}
				
				$(id + " .autocomplete-items").html("");

				var element = $(this);
				
				let sug_area = element.parent().find(".autocomplete-items");
				
				typing = setTimeout(function() {

					// using ajax to populate suggestions
					
					element.addClass('loading');
					
					$.ajax({
						url : ajaxurl,
						type: "GET",
						dataType : "json",
						data : {
							
							action 	: "render_authors",
							id		: id,
							s 		: query,
						},
					}).done(function( data ) {
						
						let val = element.val();
						
						if( query == val ){
							
							element.removeClass('loading');
						
							_authors_input_suggestions_data = data;
							
							$.each(data,function (key,value) {
								
								let template = $("<div>"+value.name+"</div>").hide()
								sug_area.append(template)
								template.show()
							});
						}
						else if( val.length < 3 ){
							
							element.removeClass('loading');
						}
					});

				},500);
				
			});
		}
		
		let _authors_input_suggestions_data = null;
		
		$(".authors-input").each(function(e){
			
			var id = "#" + $(this).attr('id');
			
			set_author_field(id);
		});
		
		// task process
		
		function load_task_items(){
			
			$("#rewbe_task_items").empty().addClass("loading");
				
			if( $('#rew_preview_items').length > 0 ){
			
				$('#rew_preview_items table').empty();
	
				$('#rew_preview_items').addClass('loading');
			}
			
			clearTimeout(processing);
			
			processing = setTimeout(function() {
				
				$.ajax({
					url : ajaxurl,
					type: "GET",
					dataType : "html",
					data : {
						action 	: "render_task_process",
						task 	: $("#post").serializeObject(),
					},
				}).done(function( data ) {
					
					$("#rewbe_task_items").empty().removeClass("loading").html(data);
					
					set_preview_button();
				});

			},100);
		}
		
		var processing;
		
		load_task_items();
		
		$('#bulk-editor-filters').on('change', 'input, select, textarea', function() {
			
			load_task_items();
		});
		
		function load_task_schedule(){
			
			if( $('#rewbe_task_scheduled').length > 0 ){
				
				var steps 	= $('#rewbe_task_scheduled').data('steps');
				
				if( steps > 0 ){
					
					$("#rewbe_task_scheduled").addClass("loading loading-right");
					
					var post_id = $("#post_ID").val();
					
					for(var step = 1; step <= steps; step++){
						
						$.ajaxQueue({
							
							url : ajaxurl,
							type: 'GET',
							data: {
								action 	: "render_task_schedule",
								pid 	: post_id,
								step	: step
							},
							success: function(prog){
								
								$('#rewbe_task_scheduled').empty().html( prog + '%' );
							
								if( prog == 100 ){
									
									$("#rewbe_task_scheduled").removeClass("loading loading-right");
									
									load_task_progess();
								}
							},
							error: function(xhr, status, error){
								
								console.error('Error loading step ' + step + ': ' + error);
							}
						});
					}
				}
			}
			else{
			
				load_task_progess();
			}
		}
		
		function load_task_progess(){
			
			if( $('#rewbe_task_processed').length > 0 ){
				
				$("#rewbe_task_processed").addClass("loading loading-right");
				
				var post_id = $("#post_ID").val();
				
				$.ajaxQueue({
					
					url : ajaxurl,
					type: 'GET',
					data: {
						action 	: "render_task_progress",
						pid 	: post_id,
					},
					success: function(prog){
						
						var response = prog;
						
						if( !isNaN(prog) && !isNaN(parseFloat(prog)) ){
							
							$('#rewbe_task_processed').empty().html(prog+'%');
							
							if( prog < 100 ){
								
								load_task_progess();
							}
							else{
								
								$("#rewbe_task_processed").removeClass("loading loading-right");
							}
						}
						else{
							
							$('#rewbe_task_processed').empty().html('<i>Check the console log</i>').removeClass("loading loading-right");
							
							console.log(prog);
						}
					},
					error: function(xhr, status, error){
						
						if( xhr.status === 500 || xhr.status === 504 ) {
							 
							console.log('Retrying after 10 seconds...');
							
							setTimeout(function(){
								
								$.ajaxQueue(this);
								
							}.bind(this),10000);
						}
						else{
							
							console.error('Error processing task: ' + error);
							
							$("#rewbe_task_processed").removeClass("loading loading-right");
						}
					}
				});
			}
		}		
		
		load_task_schedule();
		
		// action fields
		
		function load_action_fields(){
			
			clearTimeout(selecting);
			
			var post_id 	= $("#post_ID").val();
			var bulk_action = $("#rewbe_action").val();
			
			selecting = setTimeout(function() {

				if( $("#rewbe_action_fields").length == 0 ){
					
					$('#bulk-editor-task .form-field').not(':first').remove();
					
					$('#bulk-editor-task .form-field:first').after('<div id="rewbe_action_fields"></div>')
				}
				
				$("#rewbe_action_fields").empty().addClass("loading");
				
				$.ajax({
					url : ajaxurl,
					type: "GET",
					dataType : "html",
					data : {
						action 	: "render_task_action",
						pid 	: post_id,
						ba 		: bulk_action,
					},
				}).done(function( data ) {
					
					$("#rewbe_action_fields").empty().removeClass("loading").html(data);
					
					$("#rewbe_action_fields").find('.authors-input').each(function(e){
						
						var id = "#" + $(this).attr('id');
						
						set_author_field(id);
					});	
					
					$("#rewbe_action_fields").find('.arr-input').each(function(e){
						
						var id = "#" + $(this).attr('id');
						
						set_array_field(id);
					});
					
					$("#rewbe_action_fields").find('.meta-input').each(function(e){
						
						var id = "#" + $(this).attr('id');
						
						set_meta_field(id);
					});
					
					$("#rewbe_action_fields").find('.date-input').each(function(e){
						
						var id = "#" + $(this).attr('id');
						
						set_date_field(id);
					});
					
					$("#rewbe_action_fields").find('.tags-input').each(function(e){
						
						var id = "#" + $(this).attr('id');
						
						set_taxonomy_field(id);
					});
				});

			},100);
		}
		
		var selecting;

		$("#rewbe_action").on('change', function(e){
			
			load_action_fields();
		});
		
		// set action buttons
		
		$('.postbox').each(function() {
			
			var id = $(this).attr('id');
			
			var actionBtns = '';
			
			if( id == 'bulk-editor-task' ){
				
				actionBtns = $('<button/>', {
					html: '<span class="dashicons dashicons-update" aria-hidden="true"></span>',
					class: 'handle-order-higher',
					click: function(e) {
						
						e.preventDefault();
						e.stopPropagation();
						
						load_action_fields();
					}
				});
			}
			else if( id == 'bulk-editor-process' ){
				
				actionBtns = $('<button/>', {
					html: '<span class="dashicons dashicons-update" aria-hidden="true"></span>',
					class: 'handle-order-higher',
					click: function(e) {
						
						e.preventDefault();
						e.stopPropagation();
						
						load_task_items();
					}
				});
			}
			else if ( id == 'bulk-editor-progress' && $('#rewbe_task_processed').length > 0 ) {
				
				actionBtns = $('<button/>', {
					html: '<span class="dashicons dashicons-update" aria-hidden="true"></span>',
					class: 'handle-order-higher',
					click: function(e) {
						
						e.preventDefault();
						e.stopPropagation();
						
						load_task_progess();
					}
				});
			}
			
			$(this).find('h2').append(actionBtns);
		});
		
		// set preview button
		
		function set_preview_button(){
			
			var page = 1;
						
			if( $("#rew_preview_dialog").length == 0 ){
				
				$('body').append('<div id="rew_preview_dialog" title="Content Manager"><div id="rew_preview_items" class="loading"><table></table></div></div>');
				
				$("#rew_preview_dialog").dialog({
				
					autoOpen	: false,
					
					width		: Math.round($(window).width() * 0.5),  // 50% of current window width
					height		: Math.round($(window).height() * 0.5), // 50% of current window height
					minWidth	: 250,
					minHeight	: 250,
					resizable	: true,
					position: {
						my: "center",
						at: "center",
						of: window
					},
					create : function (event) {
						
						$(event.target).parent().css({ 
						
							'position'	: 'fixed', 
							'left'		: 50, 
							'top'		: 150,
						});
						
						load_task_preview(page);
					},
					close : function (event) {
						
						// do something
					},
				});
			}
			else{
				
				load_task_preview(page);
			}
			
			$("#rew_preview_button").on('click', function(e){
				
				e.preventDefault();

				$("#rew_preview_dialog").dialog('open');
			});
		}
		
		function load_task_preview(page){
			
			$.ajaxQueue({
				
				url : ajaxurl,
				type: 'GET',
				data: {
					action 	: "render_task_preview",
					task 	: $("#post").serializeObject(),
					page	: page,
				},
				success: function(data){
					
					if( page == 1 ){
						
						$('#rew_preview_items table').empty().html(data);
					}
					else{
						
						$('#rew_preview_items table').append(data);
					}
				
					$('#rew_preview_items').removeClass('loading');
				},
				error: function(xhr, status, error){
					
					console.error('Error loading preview ' + page + ': ' + error);
				}
			});
		}
	});
	
})(jQuery);