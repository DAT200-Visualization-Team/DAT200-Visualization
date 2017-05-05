var AnimationPlayer = (function () {
    var instance;
    var isPlaying = false;
    var tl = new TimelineMax();
    var stepCount = 1;

    return {
        setPlayState: function (value) {
            isPlaying = true;
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
        }
    };
})();

function StepSequence(steps) {

}

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
    var lineHL = codeDisplayManager.getHighlightInfo(line);
    
    AnimationPlayer.tl().to(lineHL[0].e, 1, lineHL[0].p);
    AnimationPlayer.tl().addLabel("Step" + AnimationPlayer.getStepCount());
    AnimationPlayer.incrementCounter();

    for (var i = 0; i < animations.length; i++) {
        var info = animations[i];
        AnimationPlayer.tl().to(info.e, info.o.duration, info.p, info.o.position ? info.o.position : "+=0");
    }

    AnimationPlayer.tl().to(lineHL[1].e, 1, lineHL[1].p);
}

function togglePlayState(element) {
    AnimationPlayer.togglePlayState();
    if (AnimationPlayer.getPlayState())
        element.innerHTML = 'pause';
    else
        element.innerHTML = 'play_arrow';
}

$('#play-button').click(function () {
    togglePlayState(this);
});

$('#step-back').click(function () {
    
});

$('#step-forward').click(function () {
    
});