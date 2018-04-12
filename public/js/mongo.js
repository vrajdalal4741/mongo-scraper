$(document).ready(function() {

    $('.archive-btn').on('click', function() {

        let id = $(this).data('id');
        let title = $(this).data('title');
        let link = $(this).data('link');
        let description = $(this).data('description');

        let archivedArticle = {
            title: title,
            link: link,
            description: description
        }

        $.post('/api/saved/' + id, archivedArticle)
            .then(function() {})
        location.reload();
    });

    $('.delete-btn').on('click', function() {

        let id = $(this).data('id');

        $.post('/api/deleted/' + id)
            .then(function() {})
        location.reload();
    });

    $('.delete-comment-btn').on('click', function() {

    	let id = $(this).data('id');

    	$.post('/api/remove/' + id)
    		.then(function() {})
    	location.reload();
    });
})