/*
 * scripts.js
 *
 * Corinne Konoza
 * June 12, 2015
 *
 */


// The callback function will wait until the page is fully loaded and ready
// before executing
$(function() {

    // Hide the comment form by default & display only when user clicks link
    $('#post-comment').hide();
    $('#btn-comment').on('click', function(event) {
        event.preventDefault();

        $('#post-comment').show();
    });

    // Handle the Like button functionality
    $('#btn-like').on('click', function(event) {
        event.preventDefault();

        var imgId = $(this).data('id');

        $.post('/images/' + imgId + '/like').done(function(data) {
            $('.likes-count').text(data.likes);
        });
    });

    // Delete comment-- popup asks you if you are sure
    $('#btn-delete').on('click', function(event) {
        event.preventDefault();
        var $this = $(this);

        var remove = confirm('Are you sure you want to delete this image?');
        if (remove){
            var imgId = $(this).data('id');
            $.ajax({
                url: '/images/' + imgId,
                type: 'DELETE'
            }).done(function(result) {
                if(result){
                    $this.removeClass('btn-danger').addClass('btn-success');
                    $this.find('i').removeClass('fa-times').addClass('fa-check');
                    $this.append('<span> Deleted!</span>');
                }
            });
        }
    });

});


