var AnimationPlayer = (function () {
    var instance;
    var isPlaying = false;
    var tl = createNewTimeline();
    var stepCount = 1;

    function updateSeekBar() {
        $('#seek-bar').val(this.progress() * 100);
    }

    function animationComplete() {
        tl.pause();
        isPlaying = false;
        updatePlayIcon();
    }

    function createNewTimeline() {
        var timeline = new TimelineMax({ onUpdate: updateSeekBar, onUpdateScope: timeline, onComplete: animationComplete, paused: true });
        return timeline;
    }

    return {
        setPlayState: function (value) {
            isPlaying = value;
        },
        getPlayState: function () {
            return isPlaying;
        },
        togglePlayState: function () {
            isPlaying = !isPlaying;
            if (isPlaying)
                tl.resume();
            else
                tl.pause();
        },
        tl: function () {
            return tl;
        },
        getStepCount: function () {
            return stepCount;
        },
        incrementCounter: function () {
            stepCount++;
        },
        updateProgress: function () {
            updateSeekBar.call(tl);
        },
        clearTimeline: function () {
            tl = createNewTimeline();
        }
    };
})();

function appendCodeLines(lines, codeDisplayManager) {
    var frames = codeDisplayManager.getMultiHighlightInfo(lines);
    for (var i = 0; i < frames.length; i++) {
        AnimationPlayer.tl().to(frames[i].e, 1, frames[i].p);
        if (i % 2 == 0) { //Add step only when the code is being shown
            AnimationPlayer.tl().addLabel("Step" + AnimationPlayer.getStepCount());
            AnimationPlayer.incrementCounter();
        }
    }
}

function appendAnimation(line, animations, codeDisplayManager) {
    var lineHL;

    if(line && codeDisplayManager) {
        lineHL = codeDisplayManager.getHighlightInfo(line);
        AnimationPlayer.tl().to(lineHL[0].e, 1, lineHL[0].p);
    }

    AnimationPlayer.tl().addLabel("Step" + AnimationPlayer.getStepCount());
    AnimationPlayer.incrementCounter();

    for (var i = 0; i < animations.length; i++) {
        var info = animations[i];
        if (Array.isArray(info.p)) {
            AnimationPlayer.tl().fromTo(info.e, info.o.duration, info.p[0], info.p[1], info.o.position ? info.o.position : "+=0");
        }
        else {
            AnimationPlayer.tl().to(info.e, info.o.duration, info.p, info.o.position ? info.o.position : "+=0");
        }      
    }

    if(line) {
        AnimationPlayer.tl().to(lineHL[1].e, 1, lineHL[1].p);
    }
}

function togglePlayState() {
    AnimationPlayer.togglePlayState();
    updatePlayIcon();
}

function updatePlayIcon() {
    if (AnimationPlayer.getPlayState())
        $('#play-button').html('pause');
    else
        $('#play-button').html('play_arrow');
}

$('#play-button').click(function () {
    togglePlayState();
});

$('#step-prev').click(function () {
    AnimationPlayer.setPlayState(false);
    updatePlayIcon();
    var timeLine = AnimationPlayer.tl();
    timeLine.pause();
    timeLine.seek(timeLine.getLabelBefore(), false);
    timeLine.pause();
    AnimationPlayer.updateProgress();
});

$('#step-next').click(function () {
    AnimationPlayer.setPlayState(false);
    updatePlayIcon();
    var timeLine = AnimationPlayer.tl();
    timeLine.pause();
    timeLine.seek(timeLine.getLabelAfter(), false);
    timeLine.pause();
    AnimationPlayer.updateProgress();
});

$('#seek-bar').change(function () {
    AnimationPlayer.tl().progress($(this).val() / 100);
    $('.thumb').width(0).height(0);
});

$('#seek-bar').on('input', function () {
    AnimationPlayer.tl().progress($(this).val() / 100);
});

$('#speed-bar').change(function () {
    TweenMax.to(AnimationPlayer.tl(), 2, { timeScale: $(this).val() });
    $('.thumb').width(0).height(0);
});