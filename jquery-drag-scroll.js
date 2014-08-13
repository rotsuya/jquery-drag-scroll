;(function($) {
    $.easing.easeOut = function(x, t, b, c, d) {
        return 1 - (x - 1) * (x - 1);
    }
    $.fn.dragScroll = function(options) {
        var defaults = {
            dragDistance: 20,
            dropVelocity: 200,
            scrollDuration: 0.5
        };
        options = $.extend(true, {}, defaults, options);
        $('<style>').attr('id', 'dragScrollStyle').text('body.dragging { cursor: move !important; }').appendTo('head');
        return this.filter(function() {
            var $bodyAndBody = $('html, body');
            var $body = $('body');
            var originalClientX = -1;
            var originalClientY = -1;
            var originalScrollX = -1;
            var originalScrollY = -1;
            var currentScrollX = -1;
            var currentScrollY = -1;
            var last1ClientX = -1;
            var last1ClientY = -1;
            var last2ClientX = -1;
            var last2ClientY = -1;
            var last1Time = -1;
            var last2Time = -1;
            var isMouseDown = false;
            var isDragging = false;
            $('html')
                .on('mousedown', function(event) {
                    isMouseDown = true;
                    last2ClientX = last1ClientX;
                    last2ClientY = last1ClientY;
                    originalClientX = last1ClientX = event.clientX;
                    originalClientY = last1ClientY = event.clientY;
                    last2Time = last1Time;
                    last1Time = Date.now();
                    originalScrollX = window.scrollX;
                    originalScrollY = window.scrollY;
                }).on('mousemove', function(event) {
                    if (!isMouseDown) {
                        return;
                    }
                    var clientX = event.clientX;
                    var clientY = event.clientY;
                    last2ClientX = last1ClientX;
                    last2ClientY = last1ClientY;
                    last1ClientX = clientX;
                    last1ClientY = clientY;
                    last2Time = last1Time;
                    last1Time = Date.now();
                    var dX = clientX - originalClientX;
                    var dY = clientY - originalClientY;
                    if (!isDragging) {
                        var distance = Math.sqrt(dX * dX + dY * dY);
                        if (distance < options.dragDistance) {
                            return;
                        }
                        $body.addClass('dragging');
                        isDragging = true;
                    }
                    currentScrollX = originalScrollX - dX;
                    currentScrollY = originalScrollY - dY;
                    window.scrollTo(currentScrollX, currentScrollY);
                }).on('mouseup', function(event) {
                    if (!isMouseDown) {
                        return;
                    }
                    isMouseDown = false;
                    if (!isDragging) {
                        return;
                    }
                    isDragging = false;
                    $body.removeClass('dragging');
                    var clientX = event.clientX;
                    var clientY = event.clientY;
                    var time = Date.now();
                    var dX = clientX - last2ClientX;
                    var dY = clientY - last2ClientY;
                    var vX = dX / (time - last2Time) * 1000;
                    var vY = dY / (time - last2Time) * 1000;
                    var velocity = Math.sqrt(vX * vX + vY * vY);
                    if (velocity > options.dropVelocity) {
                        var targetScrollX = currentScrollX - vX * options.scrollDuration * 0.5;
                        var targetScrollY = currentScrollY - vY * options.scrollDuration * 0.5;
                        $bodyAndBody.animate({
                            scrollLeft: targetScrollX,
                            scrollTop: targetScrollY
                        }, {
                            duration: options.scrollDuration * 1000,
                            easing: 'easeOut'
                        });
                    }
                }).on('mouseout', function() {
                    if (!isMouseDown) {
                        return;
                    }
                    isMouseDown = false;
                    if (!isDragging) {
                        return;
                    }
                    isDragging = false;
                    $body.removeClass('dragging');
                });
            return true;
        });
    };
})(jQuery);
