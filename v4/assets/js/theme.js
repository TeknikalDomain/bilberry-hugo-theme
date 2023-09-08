/*
 * theme.js
 */

// Add copy button functionality
new ClipboardJS('.copy-button', {
    target: function(trigger) {
        return trigger.previousElementSibling;
    }
}).on('success', function(e) {
    e.clearSelection()
});

// Subtitle taglines
let taglines = []
let subtitle = $('.subtitle')[0]

function setTagline() {
    let thisTagline = taglines[Math.floor(Math.random() * taglines.length)]

    if (thisTagline == '') {
        // Just try again
	// There's no way someone will get unlucky enough for this to recurse to the point of
	// a browser complaining, right?
	//
	// ...right?
	setTagLine()
    }

    if (thisTagline == '<COUNT>') {
        thisTagline = taglines.length + ' taglines and counting...'
    }

    if (thisTagline == '<PERCENT>') {
        thisTagline =
            "Did you know what if you're looking for a specific tagline in here, there's only a " +
            (1 / taglines.length) * 100 +
            '% chance of getting it each load?'
    }

    subtitle.innerHTML = thisTagline
}

// Custom temperature display
function changeTempUnit() {
    var tempInF = localStorage.getItem('temp_in_f') === 'false'
    localStorage.setItem('temp_in_f', tempInF) // Toggle F <-> C and store
    updateTemps()
}

function updateTemps() {
    var tempInF = localStorage.getItem('temp_in_f') === 'true'

    // Default to displaying in C if unspecificed (aka never ran before)
    if (tempInF === null) {
        localStorage.setItem('temp_in_f', false)
        tempInF = false
    }

    // Process each figure
    $('.temperature-reading').each(function () {
        var tempC = parseFloat(this.getAttribute('data-temp')) // ALWAYS in C
        if (tempInF === true) {
            // Only run conversion math if requested
            this.innerHTML =
                (Math.round((tempC * 1.8 + 32) * 100) / 100).toString() +
                '°' +
                'F'
        } else {
            this.innerHTML =
                (Math.round(tempC * 100) / 100).toString() + '°' + 'C'
        }
    })
}

$(document).ready(function () {

    // Add copy button and tooltip to each code-block
    $('pre').each(function () {
        $(this).append('<button class="copy-button tooltip" title="Copied!"><i class="far fa-fw fa-copy"></i></button>')
    });

    $('.tooltip').tooltipster({
        animationDuration: 1,
        theme: 'tooltipster-light',
        side: 'bottom',
        delay: [200, 0],
        distance: 0,
        trigger: 'custom',
        triggerOpen: {
            click: true,
            tap: true
        },
        triggerClose: {
            click: true,
            tap: true,
            mouseleave: true
        }
    });

    // Nav-Toggle
    $(".toggler").click(function () {
        $("nav:not(#TableOfContents)").slideToggle();
        $("#search").autocomplete("val", "");
    });

    // Keyboard-Support
    $(document).keyup(function (e) {
        // Clear and/or close search on ESC
        if (e.code === 'Escape' && $("#search")[0] == $(e.target)[0]) {
            if (!$("nav").hasClass('permanentTopNav')) {
                $("nav").slideUp();
            }
            $("#search").autocomplete("val", "").blur();
            return;
        }

        // Ignore event if we're inside a input field
        let targetType = (e.target.tagName ?? "").toLowerCase();
        if (targetType == "textarea" || targetType == "input") {
            return;
        }

        // Else we listen for "s" to active out search box
        if (e.code === 'KeyS') {
            if (!$("nav").hasClass('permanentTopNav')) {
                $("nav").slideDown();
            }
            $("#search").focus();
        } else if (e.code == 'KeyP') {
            // Toggle narration with P.
            // Note: jQuery doesn't play nice with this at all,
            // just returning a jQuery.fn.init,
            // So this can't be done with it for some reason.
            if (document.getElementById('narration-player')) {
                player = document.getElementById('narration-player')
                if (player.paused) {
                    player.play()
                } else {
                    player.pause()
                }
            }
	}
    });

    // Flexslider
    $('.flexslider').flexslider({
        animation: "slide",
        prevText: "",
        nextText: "",
        pauseOnHover: true,
    });

    // Actually have color when using checkbox lists
    // For explanation: by default, Goldmark will add the 'disabled'
    // attribute to all checkboxes in a '- [x] checkbox list', which
    // makes them not clickable, but also greyed out.
    //
    // By replacing that with 'onclick="return false"', we can retain
    // the non-user-editable aspect while allowing them to actually
    // be colored in. Why does returning false prevent the state toggle?
    // Apparently someone thought that onclick() should have the ability
    // to be used to decide if a(n) (un)check action should actually be
    // valid or not. I was today years old when I learned this.
    $('.content ul li input[type=checkbox]').each(function () {
        $(this).attr('onclick', 'return false')
        $(this).prop('disabled', null)
    })

    class Accordion {
        constructor(el) {
            // Store the <details> element
            this.el = el
            // Store the <summary> element
            this.summary = el.querySelector('summary')
            // Store the <div class="content"> element
            this.content = el.querySelector('div')

            // Store the animation object (so we can cancel it if needed)
            this.animation = null
            // Store if the element is closing
            this.isClosing = false
            // Store if the element is expanding
            this.isExpanding = false
            // Detect user clicks on the summary element
            this.summary.addEventListener('click', (e) => this.onClick(e))
        }

        onClick(e) {
            // Stop default behaviour from the browser
            e.preventDefault()
            // Add an overflow on the <details> to avoid content overflowing
            this.el.style.overflow = 'hidden'
            // Check if the element is being closed or is already closed
            if (this.isClosing || !this.el.open) {
                this.open()
                // Check if the element is being openned or is already open
            } else if (this.isExpanding || this.el.open) {
                this.shrink()
            }
        }

        shrink() {
            // Set the element as "being closed"
            this.isClosing = true

            // Store the current height of the element
            const startHeight = `${this.el.offsetHeight}px`
            // Calculate the height of the summary
            const endHeight = `${this.summary.offsetHeight}px`

            // If there is already an animation running
            if (this.animation) {
                // Cancel the current animation
                this.animation.cancel()
            }

            // Start a WAAPI animation
            this.animation = this.el.animate(
                {
                    // Set the keyframes from the startHeight to endHeight
                    height: [startHeight, endHeight],
                },
                {
                    duration: 300,
                    easing: 'ease-out',
                },
            )

            // When the animation is complete, call onAnimationFinish()
            this.animation.onfinish = () => this.onAnimationFinish(false)
            // If the animation is cancelled, isClosing variable is set to false
            this.animation.oncancel = () => (this.isClosing = false)
        }

        open() {
            // Apply a fixed height on the element
            this.el.style.height = `${this.el.offsetHeight}px`
            // Force the [open] attribute on the details element
            this.el.open = true
            // Wait for the next frame to call the expand function
            window.requestAnimationFrame(() => this.expand())
        }

        expand() {
            // Set the element as "being expanding"
            this.isExpanding = true
            // Get the current fixed height of the element
            const startHeight = `${this.el.offsetHeight}px`
            // Calculate the open height of the element (summary height + content height)
            const endHeight = `${
                this.summary.offsetHeight + this.content.offsetHeight
            }px`

            // If there is already an animation running
            if (this.animation) {
                // Cancel the current animation
                this.animation.cancel()
            }

            // Start a WAAPI animation
            this.animation = this.el.animate(
                {
                    // Set the keyframes from the startHeight to endHeight
                    height: [startHeight, endHeight],
                },
                {
                    duration: 300,
                    easing: 'ease-out',
                },
            )
            // When the animation is complete, call onAnimationFinish()
            this.animation.onfinish = () => this.onAnimationFinish(true)
            // If the animation is cancelled, isExpanding variable is set to false
            this.animation.oncancel = () => (this.isExpanding = false)
        }

        onAnimationFinish(open) {
            // Set the open attribute based on the parameter
            this.el.open = open
            // Clear the stored animation
            this.animation = null
            // Reset isClosing & isExpanding
            this.isClosing = false
            this.isExpanding = false
            // Remove the overflow hidden and the fixed height
            this.el.style.height = this.el.style.overflow = ''
        }
    }

    document.querySelectorAll('details').forEach((el) => {
        new Accordion(el)
    })

    dimbox.setConfig({
        showDownloadButton: false
    });
    dimbox.init();

    // Back to top button
    $(window).scroll(function() {
        if ($(window).scrollTop() > 300) {
            $('#back-to-top-button').addClass('show');
        } else {
            $('#back-to-top-button').removeClass('show');
        }
    });

    $('#back-to-top-button').on('click', function(e) {
        e.preventDefault();
        $('html, body').animate({scrollTop:0}, '300');
    });

    // Mathjax No-JS
    $('.math-container').each(function () {
        this.innerHTML = this.getAttribute('data-mathjax')
    })

    // Subtitle tagline refresh on click
    $('.subtitle').click(setTagline)

    // Toggle temps
    updateTemps()
    $('.temperature-reading').click(changeTempUnit)
});

// Do tagline fetch
let xmlHttp = new XMLHttpRequest()
xmlHttp.onreadystatechange = function () {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
        taglines = xmlHttp.responseText.split('\n')
        setTagline()
    }
}

xmlHttp.open('GET', '/taglines.txt', true)
xmlHttp.send(null)

