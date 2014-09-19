$(function() {
	
	var corpId = $.getLoc('id');
	if (!corpId) {
		alert('Illegal id')
		return;
	}
	function render(data) {
		var tmpl = $('#table-rows').text();
		$('#pl-items').html($.render(tmpl, data));
	}
	
	function createProductline() {
		$.confirm({
			content: $.render($('#create-productline').text(), {}),
			title: 'Add production line',
			confirmText: 'Sure',
			showCallback: function() {
				$(this).find('input[type=text]').focus();
			},
			confirmClicked: function() {
				var inputer = $(this).find('input[type=text]');
				if (inputer.val().trim() == '') {
					inputer.addClass('shake');
					inputer.focus();
					setTimeout(function() {
						inputer && inputer.removeClass('shake');
					}, 1000);
					return;
				}
				var modal = $(this);
				var value = inputer.val().trim();
				$.post($.route('org.productline.create'), {
					corpId: corpId,
					name: value
				}, function(data) {
					var tmpl = $('#table-rows').text();
					data.count = 0;
					$('#pl-items').append($.render(tmpl, data));
					modal.modal('hide');
				}, "JSON")
			}
		});
	}
	
	function updateProductline() {
		var jqThis = $(this);
		var id = jqThis.data('id');
		var name = jqThis.parents('.pl-item').find('.name').text();
		$.confirm({
			content: $.render($('#create-productline').text(), {value: name}),
			title: 'update production line',
			confirmText: 'confirm',
			showCallback: function() {
				$(this).find('input[type=text]').focus();
			},
			confirmClicked: function() {
				var modal = $(this);
				var inputer = $(this).find('input[type=text]');
				if (inputer.val().trim() == '') {
					inputer.addClass('shake');
					inputer.focus();
					setTimeout(function() {
						inputer && inputer.removeClass('shake');
					}, 1000);
					return;
				}
				var value = inputer.val().trim();
				$.post($.route('org.productline.update'), {
					id: id,
					name: value
				}, function(data) {
					$('.pl-' + id).find('.name').html(value);
					modal.modal('hide');
				}, "JSON")
			}
		});
	}
	
	function deleteProductline() {
		var jqThis = $(this);
		var id = jqThis.data('id');
		var name = jqThis.parents('.pl-item').find('.name').text();
		$.confirm({
			content: 'deleted items can not be recovered, are you sure?',
			title: 'Are you sure to delete ' + name + ' ?',
			confirmText: 'confirm',
			confirmClicked: function() {
				var modal = $(this);
				$.post($.route('org.productline.delete'), {
					id: id
				}, function(data) {
					if (data.code == 200) {
						var node = $('.pl-' + id);
						node.remove();
					} else {
						alert(data.msg);
					}
					modal.modal('hide');
				}, "JSON")
			}
		});
	}
	
	function bindEvents() {
		$('body')
			.delegate('.create-btn', 'click', createProductline)
			.delegate('.update-btn', 'click', updateProductline)
			.delegate('.delete-btn', 'click', deleteProductline);
	}
	
	function init() {
		$.get($.route('org.productline.all'), {corpId: corpId}, function(data) {
			render(data);
			bindEvents();
		}, 'JSON');
	}
	
	init();
});
